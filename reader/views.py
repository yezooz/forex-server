# The MIT License (MIT)
#
# Copyright (c) 2013 Marek Mikuliszyn
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

from django.http import HttpResponse
import redis
import simplejson as json

from fserver.models import *

log = logging.getLogger(__name__)


class Reader(object):
    def __init__(self, broker, account_no, pair):
        self.account = Account.objects.get_by_broker_and_account(broker, account_no)

        if self.account is None: return

        self.account_tz = self.account.broker.timezone
        self.pair = pair

        self.signals = []

    def is_correct_input(self):
        if self.account is None: return False
        return True

    def get_signals(self):
        self.systems = []
        for acc_sys in AccountSystem.objects.filter(account=self.account, is_active=True):
            self.systems.append(acc_sys.system)

        self.signals = SignalAccount.objects.get_signals(self.account)
        if self.pair is not None:
            self.signals = [sa for sa in self.signals if str(sa.signal.pair) == self.pair]


class SignalFactory(object):
    def __init__(self, account, signal, local_tz):
        self.account = account
        self.signal = signal
        self.local_tz = local_tz

        self.valid_until = self.get_valid_until_date()

    def is_valid(self):
        if (self.signal.server_time + datetime.timedelta(
                minutes=self.tf_to_int(self.signal.tf)) * 5) < datetime.datetime.now(): return False
        if SystemPair.objects.can_trade(self.signal.system, self.signal.pair, self.signal.tf) is False: return False
        return True

    def use_default(self):
        self.risk = self.account.base_risk * self.signal.relative_risk
        self.rr = self.signal.rr
        self.tp_sl_mode = 'signal_bar'
        self.valid_until = self.get_valid_until_date(3)

        self.entry_margin = abs((self.signal.high - self.signal.low) * Decimal('0.1'))
        self.exit_margin = abs((self.signal.high - self.signal.low) * Decimal('0.1'))

        # TP + SL
        if self.signal.bullish:
            self.tp = self.signal.high + ((self.signal.high - self.signal.low) * self.rr)
            self.sl = self.signal.low - self.exit_margin

            self.activation_point = self.signal.high + self.entry_margin
            self.entry_point = self.signal.high + self.entry_margin
        else:
            self.tp = self.signal.low - ((self.signal.high - self.signal.low) * self.rr)
            self.sl = self.signal.high + self.exit_margin

            self.activation_point = self.signal.low - self.entry_margin
            self.entry_point = self.signal.low - self.entry_margin

    def get_valid_until_date(self, candles=5):
        return str(datetime.datetime.now() + datetime.timedelta(
            minutes=self.tf_to_int(self.signal.tf)) * candles + datetime.timedelta(
            hours=(int(self.local_tz) - int(self.signal.get_timezone()))))[:16]

    def tf_to_int(self, tf):
        if tf.startswith('M'):
            return int(tf.replace('M', ''))
        if tf.startswith('H'):
            return int(tf.replace('H', '')) * 60
        if tf.startswith('D'):
            return int(tf.replace('D', '')) * 24 * 60
        if tf.startswith('W'):
            return int(tf.replace('W', '')) * 7 * 24 * 60
        if tf == 'MN1':
            return 30 * 24 * 60
        if tf.endswith('P'):
            return 60
        return None

    def to_dict(self, account):
        obj = {
            'signal_id': self.signal.id,
            'pair': str(self.signal.pair),
            'direction': self.signal.direction.upper(),
            'entry': self.entry_point,
            'tp': self.tp,
            'sl': self.sl,
            'size': abs(self.tp - self.sl),
            'expiration': self.valid_until,
            'comment': '',
            'lot_size': self.signal.pair.lot_size(self.account.highest_balance, self.risk,
                                                  (abs(self.entry_point - self.sl) / self.signal.pair.pip_value))
        }

        log.info(obj)

        min_lot = self.account.broker.min_lot
        max_lot = self.account.broker.max_lot

        if min_lot == 0.1:
            obj['lot_size'] = float('%.1f' % obj['lot_size'])
        else:
            obj['lot_size'] = float('%.2f' % obj['lot_size'])

        if obj['lot_size'] < min_lot:
            obj['lot_size'] = min_lot
        elif obj['lot_size'] > max_lot:
            obj['lot_size'] = max_lot

        log.info(obj)

        return obj

    def to_json(self):
        return json.dumps(self.to_dict())

    def to_csv(self):
        obj = self.to_dict()
        return "%s;%s;%s;%s;%s;%s;%s;%s;%s;%s\n" % (
            obj['signal_id'], obj['pair'], obj['direction'], obj['risk'], obj['entry'], obj['entry'], obj['tp'],
            obj['sl'],
            obj['expiration'], obj['comment'])


def index(request):
    if request.method != 'GET' or request.GET.get('broker') is None or request.GET.get('account') is None:
        return HttpResponse('NO DATA');

    r = Reader(request.GET['broker'], request.GET['account'], request.GET.get('pair'))

    if r.is_correct_input() is False:
        return HttpResponse('INCORRECT INPUT')

    r.get_signals()

    sfs = []
    for sa in r.signals:
        if len(sfs) > 0:
            break

        sf = SignalFactory(r.account, sa.signal, r.account_tz)

        # if not sf.is_valid(): continue

        sf.use_default()

        SystemLog.objects.add_log(broker=request.GET['broker'], account=request.GET['account'], action='signal_sent',
                                  signal_id=sa.signal.id)

        sa.delete()

        sfs.append(sf)

    acc = Account.objects.get_by_broker_and_account(request.GET['broker'], request.GET['account'])
    acc.ping()

    if request.GET.get('type') == 'json':
        objs = []
        for obj in sfs:
            objs.append(obj.to_dict(acc))
        return HttpResponse(json.dumps(objs[0] if objs else {}), content_type="application/json")

    csv = []
    for obj in sfs:
        csv.append(obj.to_csv())
    return HttpResponse("\n".join(csv))


def sr(request, pair):
    if request.method != 'GET' or request.GET.get('broker') is None or request.GET.get('account') is None:
        return HttpResponse('NO DATA');

    pool = redis.ConnectionPool(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)
    r = redis.Redis(connection_pool=pool)

    return HttpResponse(json.dumps(r.get('sr_grid_%s' % pair) or []))
