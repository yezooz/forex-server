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

import time

from django.http import HttpResponse
import redis

from fserver.models import *

log = logging.getLogger(__name__)


class Writer(object):
    def __init__(self, input):
        self.input = input
        self.csv = input.split(',')

    def is_correct_input(self):

        if System.objects.get_by_name_and_version(self.csv[0], self.csv[1]) is None:
            log.critical('Cannot find System (%s, %s)' % (self.csv[0], self.csv[1]))
            return False
        if Account.objects.get_by_broker_and_account(self.csv[10], self.csv[11]) is None:
            log.critical('Cannot find Account (%s, %s)' % (self.csv[10], self.csv[11]))
            return False

        if self.csv[4].lower() not in ('buy', 'sell'):
            log.critical('Invalid trade direction: %s' % self.csv[4].lower())
            return False

        if len(self.csv[9]) != 16:
            log.critical('Invalid date: %s' % self.csv[9])
            return False

        self.csv[9] = "%s:00" % self.csv[9]

        return True


def index(request):
    if request.method != 'GET' or request.GET.get('csv') is None:
        return HttpResponse('NO DATA')

        # w = Writer('Pin+EMA;1;EURUSD;M15;BUY;1.20000;1.20010;1.20000;1.20005;2012-05-16 12:15:00;FxPro;3492358;')
    w = Writer(request.GET['csv'])

    if w.is_correct_input() is False:
        return HttpResponse('INCORRECT INPUT')

    s = Signal()
    s.system = System.objects.get_by_name_and_version(w.csv[0], w.csv[1])
    s.account = Account.objects.get_by_broker_and_account(w.csv[10], w.csv[11])
    s.mode = 'NEW'
    s.pair = Pair.objects.get_by_name(w.csv[2].upper())
    s.tf = w.csv[3].upper()
    s.direction = w.csv[4].lower()
    s.open = w.csv[5]
    s.high = w.csv[6]
    s.low = w.csv[7]
    s.close = w.csv[8]
    s.subscribed_accounts = ','.join(settings.LIVE_ACCOUNTS)
    s.client_time = datetime.datetime.fromtimestamp(time.mktime(time.strptime(w.csv[9], '%Y-%m-%d %H:%M:%S')))
    s.comment = w.csv[12]

    # if   s.account.broker.timezone != '' and s.account.broker.timezone.startswith('+'):
    # 	s.client_time = s.client_time + datetime.timedelta(hours=int(s.account.broker.timezone[1:]))
    # elif s.account.broker.timezone != '' and s.account.broker.timezone.startswith('-'):
    # 	s.client_time = s.client_time - datetime.timedelta(hours=int(s.account.broker.timezone[1:]))

    try:
        s.save()
    except Exception, e:
        print e
        return HttpResponse('ERROR')

    SystemLog.objects.add_log(broker=w.csv[10], account=w.csv[11], action='signal_stored', signal_id=s.id)

    return HttpResponse('OK,%d' % s.id)


def bar(request):
    # BROKER;ACCOUNT;PAIR;TF;TIME;O;H;L;C

    try:
        bar = Bar()
        bar.broker_account = Account.objects.get_by_broker_and_account(request.GET['broker'], request.GET['account'])
        bar.pair = Pair.objects.get_by_name(request.GET['pair'])
        bar.tf = request.GET['tf'].upper()
        bar.open = Decimal(request.GET['open'])
        bar.high = Decimal(request.GET['high'])
        bar.low = Decimal(request.GET['low'])
        bar.close = Decimal(request.GET['close'])
        try:
            bar.time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(request.GET['time'])))
        except ValueError:
            bar.time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(request.GET['time']) / 1000))

        if bar.open == bar.high and bar.open == bar.low and bar.open == bar.close:
            return HttpResponse('FLAT BAR')

        bar.save()
        return HttpResponse('OK')
    except Exception, e:
        print e
        return HttpResponse('FAILED')


def update(request):
    trade_id = int(request.GET['trade_id'])
    profit = Decimal(request.GET['profit'])

    key = "trade_%s" % (trade_id)

    pool = redis.ConnectionPool(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)
    r = redis.Redis(connection_pool=pool)
    r.rpush(key, str(profit))

    trade = Trade.objects.get(id=trade_id)
    trade.last_profit = profit
    trade.save()

    Account.objects.get_by_broker_and_account(request.GET['broker'], request.GET['account']).ping()

    return HttpResponse('OK')


def ping(request):
    Account.objects.get_by_broker_and_account(request.GET['broker'], request.GET['account']).ping()

    return HttpResponse('OK')


def pair(request):
    pair = Pair.objects.get_by_name(request.GET['pair'])
    pair.pip_value = Decimal(request.GET['pip_value'])
    pair.point = int(request.GET['digits'])
    pair.pip_worth_usd = Decimal(request.GET['pip_worth_usd'])
    pair.pip_worth_gbp = Decimal(request.GET['pip_worth_gbp'])
    pair.save()

    Account.objects.get_by_broker_and_account(request.GET['broker'], request.GET['account']).ping()

    return HttpResponse('OK')
