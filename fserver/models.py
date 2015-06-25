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

import uuid
import datetime
from decimal import *
import logging

from django.conf import settings
from django.db import models
from django.template.loader import render_to_string

from helpers import datetime_to_string
from mail import sendMail
from chat import sendMsg

log = logging.getLogger(__name__)


class PairManager(models.Manager):
    def get_by_name(self, name, create_if_not_expist=True):
        try:
            return self.filter(name__iexact=name).get()
        except Pair.DoesNotExist:
            if not create_if_not_expist:
                return None
            p = Pair()
            p.name = name.upper()
            p.save()
            return p


class Pair(models.Model):
    name = models.CharField(max_length=6, unique=True)
    pip_value = models.DecimalField(max_digits=9, decimal_places=5, default='0.0')
    point = models.IntegerField(default=5)
    spread = models.DecimalField(max_digits=6, decimal_places=5, default='0.0')
    pip_worth_usd = models.DecimalField(max_digits=9, decimal_places=5, default='0.0')
    pip_worth_gbp = models.DecimalField(max_digits=9, decimal_places=5, default='0.0')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PairManager()

    class Meta:
        db_table = 'pair'

    def __unicode__(self):
        return self.name

    def lot_size(self, account_size, risk, pips):
        result = (Decimal(account_size) * Decimal(risk) * self.pip_value) / (Decimal(pips) * self.pip_worth_usd)

        if self.point == 2:
            return float(result / 1000)
        return float(result / 10)


class SystemPairManager(models.Manager):
    def can_trade(self, system, pair, tf):
        # not in use right now
        try:
            return self.filter(system=system, pair=pair, tf=tf).get().is_active
        except Exception, e:
            sp = SystemPair()
            sp.system = system
            sp.pair = pair
            sp.tf = tf
            sp.is_active = False
            sp.save()
            return False


class SystemPair(models.Model):
    system = models.ForeignKey('System')
    pair = models.ForeignKey(Pair)
    tf = models.CharField(max_length=3, choices=settings.TFS)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SystemPairManager()

    class Meta:
        unique_together = ('system', 'pair', 'tf')
        db_table = 'system_pair'

    def __unicode__(self):
        return 'System %s for %s (%s)' % (str(self.system), str(self.pair), self.tf)


class SignalManager(models.Manager):
    def get_by_id(self, id):
        try:
            return self.filter(id=int(id)).get()
        except Exception, e:
            log.error('Cannot find signal with id %s' % id)
            return None

    def get_signals_to_confirm(self):
        return self.filter(status='NEW')

    def get_signals_to_confirm_count(self):
        return self.filter(status='NEW').count()


class Signal(models.Model):
    account = models.ForeignKey("Account")
    system = models.ForeignKey("System")
    pair = models.ForeignKey("Pair")
    status = models.CharField(max_length=10, choices=(
        ('NEW', 'New'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected'), ('PROFIT', 'Profit'), ('LOSS', 'Loss'),
        ('BE', 'BE'), ('PENDING', 'Pending'), ('LIVE', 'Live'), ('CANCELLED', 'Cancelled'), ('DELETED', 'Deleted')),
                              default='NEW')
    account_name = models.CharField(max_length=20, null=True, blank=True)
    pair_name = models.CharField(max_length=20, null=True, blank=True)
    tf = models.CharField(max_length=3, choices=settings.TFS)
    direction = models.CharField(max_length=4, choices=(('buy', 'Buy'), ('sell', 'Sell')))
    open = models.DecimalField(max_digits=10, decimal_places=5)
    close = models.DecimalField(max_digits=10, decimal_places=5)
    high = models.DecimalField(max_digits=10, decimal_places=5)
    low = models.DecimalField(max_digits=10, decimal_places=5)
    relative_risk = models.DecimalField(max_digits=3, decimal_places=2, default=1.0, null=True, blank=True)
    rr = models.DecimalField(max_digits=3, decimal_places=2, default=1.0, null=True, blank=True)
    subscribed_accounts = models.CharField(max_length=255)
    client_time = models.DateTimeField()
    comment = models.CharField(max_length=255, null=True, blank=True)
    server_time = models.DateTimeField(auto_now_add=True)

    objects = SignalManager()

    class Meta:
        db_table = 'signal'
        verbose_name = u'Signal'

    def __unicode__(self):
        return "Signal (%s) / %s, %s, %s, %s" % (self.id, self.system, self.pair, self.tf, self.direction)

    def to_dict(self):
        return {
            'signal_id': self.id,
            'account': str(self.account),
            'system': str(self.system),
            'pair': str(self.pair),
            'tf': self.tf,
            'status': self.status,
            'direction': self.direction,
            'high': self.high,
            'low': self.low,
            'comment': self.comment,
            'base_risk': self.account.base_risk,
            'relative_risk': self.relative_risk,
            'risk': self.account.base_risk * self.relative_risk,
            'size_in_pips': self.size_in_pips(),
            'last_spread': self.pair.spread,
            'size_to_spread': self.size_to_spread,
            'client_time': settings.DATETIME_FORMAT.format(self.client_time),
            'server_time': settings.DATETIME_FORMAT.format(self.server_time)
        }

    def save(self, *args, **kwargs):
        is_new = False
        if (self.id is None): is_new = True

        self.account_name = self.account.broker.name
        self.pair_name = self.pair.name

        super(Signal, self).save(*args, **kwargs)

        if not is_new: return

        if self.system.name in ['double_cm', 'triple_cm'] and self.tf not in ['H12', 'D1', 'W1']:
            self.auto_reject()
            return

        self.notify()

    def accept(self):
        self.status = 'ACCEPTED'
        self.save()

        for account_id in self.get_subscribed_accounts():
            account = Account.objects.get(id=account_id)
            SignalAccount.objects.add_signal(account, self)
            log.debug('Signal %s added to subscribed account %s' % (self.id, account))

        log.debug('Signal %s accepted' % self.id)

    def auto_reject(self):
        msg = '%s %s [%s] automatically rejected' % (self.pair.name, self.system.name.upper(), self.tf)
        logging.info(msg)
        sendMsg('logs', msg)

        self.reject()

    def reject(self):
        self.status = 'REJECTED'
        self.save()

        log.debug('Signal %s rejected' % self.id)

    def cancel(self):
        self.status = 'CANCELLED'
        self.save()

        log.debug('Signal %s cancelled' % self.id)

    def to_delete(self):
        self.status = 'DELETED'
        self.save()

        log.debug('Signal %s deleted' % self.id)

    def profit(self):
        self.status = 'PROFIT'
        self.save()

        total = 0
        total_net = 0
        for trade in Trade.objects.filter(signal__id=self.id):
            total += trade.gross_profit
            total_net += trade.net_profit

            log.info('Trade %s (Signal %s) closed with profit (+$%.2f)' % (trade.id, self.id, trade.net_profit))

        log.info('Signal %s closed with profit (+$%.2f NET $%.2f)' % (self.id, total, total_net))
        obj = {
            'pair': self.pair.name,
            'tf': self.tf,
            'system': self.system.name.upper(),
            'total': total,
            'total_net': total_net,
        }
        sendMail('PROFIT', render_to_string('mail/trade_close.html', obj))
        sendMsg('trades', render_to_string('chat/trade_close.txt', obj))

    def loss(self):
        self.status = 'LOSS'
        self.save()

        total = 0
        total_net = 0
        for trade in Trade.objects.filter(signal__id=self.id):
            total += trade.gross_profit
            total_net += trade.net_profit

            log.info('Trade %s (Signal %s) closed with profit (+$%.2f)' % (trade.id, self.id, trade.net_profit))

        log.info('Signal %s closed with loss (-$%.2f NET -$%.2f)' % (self.id, abs(total), abs(total_net)))
        obj = {
            'pair': self.pair.name,
            'tf': self.tf,
            'system': self.system.name.upper(),
            'total': total,
            'total_net': total_net,
        }
        sendMail('LOSS', render_to_string('mail/trade_close.html', obj))
        sendMsg('trades', render_to_string('chat/trade_close.txt', obj))

    def be(self):
        self.status = 'BE'
        self.save()

        total = 0
        for trade in Trade.objects.filter(signal=self):
            total += trade.profit

        sendMail('PROFIT', 'BE | $%.2f' % total)
        sendMsg('trades', 'PROFIT')

    def get_timezone(self):
        return self.account.broker.timezone

    def get_last_bars(self):
        return Bar.objects.filter(pair=self.pair, tf=self.tf, broker_account=self.account).order_by('-time')[:100]

    def get_chart(self, system_name='', load_latest=False, force_tf=None, force_pair=None):
        tf = force_tf or self.tf
        pair = force_pair or self.pair_name

        if load_latest:
            p = Pair.objects.get_by_name(pair)
            try:
                b = Bar.objects.get_bar_for(p, tf)[0]
                t = b.time
            except IndexError:
                log.info('Did not find any bars')
                return ''
        else:
            t = self.client_time

        broker_name = self.account.broker.name
        if broker_name == 'JForex':
            broker_name = 'AAAFx'

        path = '/static/mt4/%s/%d/%02d/%02d/%s/%s/%02d_%02d.gif' % (
            broker_name, t.year, t.month, t.day, pair, tf, t.hour, t.minute)

        if len(system_name) > 0:
            path = '%s_%s' % (path, system_name)

        return path

    def get_subscribed_accounts(self):
        if self.subscribed_accounts is None or self.subscribed_accounts == '':
            return []
        return [int(x) for x in self.subscribed_accounts.split(',')]

    def get_trades(self):
        return Trade.objects.filter(signal=self)

    @property
    def bullish(self):
        return self.direction == 'buy'

    @property
    def bearish(self):
        return self.direction == 'sell'

    def notify(self):
        self.notify_by_email()
        self.notify_by_chat()

    def notify_by_email(self):
        img_path = '<img src="http://XXX:9000%s" />' % self.get_chart()
        text = "%s\n%s\n%s\n%s\n\n%s" % (
            self.system.name.upper(), self.pair.name, self.tf, self.account_name, datetime_to_string(self.client_time))
        html = "%s<br />%s<br />%s<br />%s<br /><br />%s<br /><br />%s" % (
            self.system.name.upper(), self.pair.name, self.tf, self.account_name, datetime_to_string(self.client_time),
            img_path)
        sendMail('SIGNAL | %s %s %s' % (self.pair.name, self.tf, datetime_to_string(self.client_time)), html, text)

    def notify_by_chat(self):
        sendMsg('signals', render_to_string('chat/signal.txt', {
            'pair': self.pair.name,
            'tf': self.tf,
            'system': self.system.name.upper()
        }))

    def spread_in_pips(self):
        try:
            return self.pair.spread / self.pair.pip_value
        except Exception:
            log.error('spread_in_pips error in signal_id=%s' % self.id)
            return 0

    def size_in_pips(self):
        try:
            return abs(self.high - self.low) / self.pair.pip_value
        except Exception:
            log.error('size_in_pips error in signal_id=%s' % self.id)
            return 0

    def size_to_spread(self):
        try:
            return abs(self.high - self.low) / self.pair.spread
        except Exception:
            log.error('size_to_spread error in signal_id=%s' % self.id)
            return 0

    def calculate_lot_size(self):
        return self.pair.lot_size(self.account.highest_balance, self.account.base_risk * self.relative_risk,
                                  self.size_in_pips())


class TradeManager(models.Manager):
    def get_by_account_ticket(self, broker, account, ticket):
        acc = Account.objects.get_by_broker_and_account(broker, account)

        try:
            return self.filter(account=acc, ticket=ticket).get()
        except Exception, e:
            log.error('Cannot find ticket. %s with ticket %s' % (str(acc), ticket))
            return None


class Trade(models.Model):
    signal = models.ForeignKey(Signal)
    account = models.ForeignKey('Account')
    status = models.CharField(max_length=10, choices=(
        ('NEW', 'New'), ('WAITING', 'Waiting'), ('LIVE', 'Live'), ('PROFIT', 'Profit'), ('LOSS', 'Loss'), ('BE', 'Be')),
                              default='NEW')
    ticket = models.IntegerField(default=0)
    size = models.DecimalField(max_digits=10, decimal_places=3)
    profit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)
    tp = models.DecimalField(max_digits=10, decimal_places=5)
    sl = models.DecimalField(max_digits=10, decimal_places=5)
    open_price = models.DecimalField(max_digits=10, decimal_places=5)
    close_price = models.DecimalField(max_digits=10, decimal_places=5, blank=True, default=0)
    open_spread = models.DecimalField(max_digits=7, decimal_places=5)
    close_spread = models.DecimalField(max_digits=7, decimal_places=5, blank=True, default=0)
    commision = models.DecimalField(max_digits=12, decimal_places=2, blank=True, default=0)
    swap = models.DecimalField(max_digits=12, decimal_places=2, blank=True, default=0)
    net_profit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, default=0)
    gross_profit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, default=0)
    last_profit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TradeManager()

    class Meta:
        db_table = 'trade'

    def __unicode__(self):
        return "Trade of %s - Broker: %s" % (str(self.signal), self.account)

    def notify(self):
        log.info('Trade opened')
        obj = {
            'pair': self.signal.pair.name,
            'tf': self.signal.tf,
            'system': self.signal.system.name.upper(),
        }
        sendMail('NEW TRADE', render_to_string('mail/trade_open.html', obj))
        sendMsg('trades', render_to_string('chat/trade_open.txt', obj))


class SystemManager(models.Manager):
    def get_by_name_and_version(self, name, version):
        try:
            return self.filter(name=name, version=version).get()
        except System.DoesNotExist:
            return None


class System(models.Model):
    name = models.CharField(max_length=20)
    version = models.CharField(max_length=15)
    notify_by_mail = models.BooleanField(default=True)
    notify_by_chat = models.BooleanField(default=True)
    store_in_gdocs = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SystemManager()

    class Meta:
        unique_together = ('name', 'version')
        db_table = 'system'

    def __unicode__(self):
        return "%s" % (self.name)

    def save(self, *args, **kwargs):
        is_new = False
        if (self.id is None): is_new = True

        super(System, self).save(*args, **kwargs)

        if not is_new: return

        for pair in Pair.objects.all():
            for tf in settings.TFS:
                sp = SystemPair()
                sp.system = self
                sp.pair = pair
                sp.tf = tf[0]
                if pair.is_active:
                    sp.is_active = True
                else:
                    sp.is_active = False
                sp.save()

    def can_trade_pair_and_tf(self, pair, tf):
        try:
            if SystemPair.objects.filter(system=self, pair=pair, tf=tf, is_active=True).count() > 0:
                return True
            return False
        except SystemPair.DoesNotExist:
            return False


class SystemRiskManager(models.Manager):
    pass


class SystemRisk(models.Model):
    system = models.ForeignKey(System)
    broker = models.ForeignKey("Broker")
    account = models.IntegerField(default=None, null=True, blank=True)  # general settings for all account if None
    risk_per_trade = models.DecimalField(max_digits=4, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SystemRiskManager()

    class Meta:
        unique_together = ('system', 'account')
        db_table = 'system_risk'

    def __unicode__(self):
        return "SystemRisk"


class SystemLogManager(models.Manager):
    def add_log(self, broker, account, action, comment=None, pair=None, tf=None, signal_id=None, system=None):

        acc = Account.objects.get_by_broker_and_account(broker, account)
        if acc is None:
            log.warning('Cannot find broker')
            return

        if signal_id is not None:
            signal = Signal.objects.get(id=signal_id)

            if signal is not None:
                log = SystemLog()
                log.account = acc
                log.action = action
                log.comment = comment
                log.pair = str(signal.pair)
                log.tf = str(signal.tf)
                log.signal_id = signal.id
                log.system = str(signal.system)
                log.save()

                return

        log = SystemLog()
        log.account = acc
        log.action = action
        log.comment = comment
        log.pair = pair
        log.tf = tf
        log.signal_id = signal_id
        log.system = system
        log.save()


class SystemLog(models.Model):
    account = models.ForeignKey('Account')
    pair = models.CharField(max_length=6, default=None, null=True, blank=True)
    tf = models.CharField(max_length=3, default=None, null=True, blank=True)
    signal_id = models.IntegerField(default=None, null=True, blank=True)
    action = models.CharField(max_length=255)
    comment = models.CharField(max_length=255, default=None, null=True, blank=True)
    system = models.CharField(max_length=20, default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = SystemLogManager()

    class Meta:
        db_table = 'system_log'

    def __unicode__(self):
        return 'Log %s for signal - %s' % (self.action, self.signal_id)


class BrokerManager(models.Manager):
    def get_by_name(self, name):
        try:
            return self.filter(name__iexact=name).get()
        except Broker.DoesNotExist:
            return None


class Broker(models.Model):
    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=3, choices=(('ecn', 'ECN'), ('stp', 'STP'), ('mm', 'MM')))
    rating = models.IntegerField(max_length=1, default=0)  # 1-5
    timezone = models.CharField(max_length=3)
    min_lot = models.DecimalField(max_digits=6, decimal_places=2)
    max_lot = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BrokerManager()

    class Meta:
        db_table = 'broker'

    def __unicode__(self):
        return "%s" % self.name


class AccountManager(models.Manager):
    def get_by_broker_and_account(self, broker_name, number):
        broker = Broker.objects.get_by_name(broker_name)

        if broker is None: return None

        try:
            return self.filter(broker=broker, number=number).get()
        except Account.DoesNotExist:
            return None

    def save(self, *args, **kwargs):
        if self.token is None:
            self.token = uuid.uuid4().hex

        super(Account, self).save(*args, **kwargs)


class Account(models.Model):
    broker = models.ForeignKey(Broker)
    number = models.CharField(max_length=100)
    type = models.CharField(max_length=4, choices=(('demo', 'DEMO'), ('live', 'LIVE')))
    base_risk = models.DecimalField(max_digits=3, decimal_places=2)
    leverage = models.IntegerField(max_length=4, default=100)
    leverage_in_use = models.IntegerField(max_length=4, default=None)
    last_equity = models.DecimalField(max_digits=12, decimal_places=2)
    last_balance = models.DecimalField(max_digits=12, decimal_places=2)
    last_net_balance = models.DecimalField(max_digits=12, decimal_places=2)
    last_margin = models.DecimalField(max_digits=12, decimal_places=2)
    last_margin_in_use = models.DecimalField(max_digits=12, decimal_places=2)
    last_free_margin = models.DecimalField(max_digits=12, decimal_places=2)
    highest_balance = models.DecimalField(max_digits=12, decimal_places=2)
    highest_balance_time = models.DateTimeField(default=None)
    last_ping = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=32)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    class Meta:
        db_table = 'broker_account'
        verbose_name = u'Account'

    def __unicode__(self):
        return "%s: %s (%s)" % (self.broker.name, self.number, self.type.upper())

    def to_dict(self):
        return {
            'broker': str(self.broker),
            'account_no': self.number,
            'type': self.type,
            'leverage': self.leverage,
            'leverage_in_use': self.leverage_in_use,
            'last_equity': self.last_equity,
            'last_balance': self.last_balance,
            'last_net_balance': self.last_net_balance,
            'last_margin': self.last_margin,
            'last_margin_in_use': self.last_margin_in_use,
            'last_free_margin': self.last_free_margin,
            'highest_balance': self.highest_balance,
            'highest_balance_time': settings.DATETIME_FORMAT.format(self.highest_balance_time),
            'last_ping': settings.DATETIME_FORMAT.format(self.last_ping),
            'is_active': self.is_active
        }

    def ping(self):
        self.last_ping = datetime.datetime.now()
        self.save()


class AccountSystemManager(models.Manager):
    pass


class AccountSystem(models.Model):
    account = models.ForeignKey(Account)
    system = models.ForeignKey(System)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountSystemManager()

    class Meta:
        unique_together = ('account', 'system')
        db_table = 'account_system'
        verbose_name = u'Account System'

    def __unicode__(self):
        return "Account System - %s - %s" % (str(self.account), str(self.system))


class BarManager(models.Manager):
    def get_last_bars(self, pair, tf):
        return self.filter(pair=pair, tf=tf).order_by('-time')[:100]

    def get_bar_for(self, pair, tf):
        return self.filter(pair=pair, tf=tf).order_by('-time')


class Bar(models.Model):
    broker_account = models.ForeignKey(Account)
    pair = models.ForeignKey(Pair)
    tf = models.CharField(max_length=3, choices=settings.TFS)
    open = models.DecimalField(max_digits=10, decimal_places=5, default=0.00001)
    high = models.DecimalField(max_digits=10, decimal_places=5, default=0.00001)
    low = models.DecimalField(max_digits=10, decimal_places=5, default=0.00001)
    close = models.DecimalField(max_digits=10, decimal_places=5, default=0.00001)
    time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BarManager()

    class Meta:
        db_table = 'bar'

    def __unicode__(self):
        return '%s / %s (%s)' % (self.pair, self.tf, datetime_to_string(self.time))


class SignalAccountManager(models.Manager):
    def has_signals(self, account):
        return self.filter(account=account).count() > 0

    def add_signal(self, account, signal):
        try:
            sa = SignalAccount()
            sa.account = account
            sa.signal = signal
            sa.save()
            return True
        except Exception:
            return False

    def get_signals(self, account):
        signals = []
        for signal in self.filter(account=account):
            signals.append(signal)
        return signals


class SignalAccount(models.Model):
    account = models.ForeignKey("Account")
    signal = models.ForeignKey("Signal")
    created_at = models.DateTimeField(auto_now_add=True)

    objects = SignalAccountManager()

    class Meta:
        db_table = 'signal_account'
        verbose_name = u'Signal Account'

    def __unicode__(self):
        return "%s / %s" % (str(self.account), self.signal.id)


class TradeUpdateManager(models.Manager):
    def add_update(self, trade, net_profit, gross_profit, commision, swap):
        tu = TradeUpdate()
        tu.trade = trade
        tu.net_profit = Decimal(str(net_profit))
        tu.gross_profit = Decimal(str(gross_profit))
        tu.commision = Decimal(str(commision))
        tu.swap = Decimal(str(swap))
        tu.save()


class TradeUpdate(models.Model):
    trade = models.ForeignKey("Trade")
    net_profit = models.DecimalField(max_digits=12, decimal_places=2)
    gross_profit = models.DecimalField(max_digits=12, decimal_places=2)
    swap = models.DecimalField(max_digits=12, decimal_places=2)
    commision = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = TradeUpdateManager()

    class Meta:
        db_table = 'trade_update'
        verbose_name = u'Trade Update'

    def __unicode__(self):
        return "%s / %s" % (str(self.trade), self.net_profit)


# SignalArchive
class SignalArchive(models.Model):
    signal_id = models.IntegerField(max_length=11)
    account = models.ForeignKey("Account")
    system = models.ForeignKey("System")
    pair = models.ForeignKey("Pair")
    status = models.CharField(max_length=10, choices=(
        ('NEW', 'New'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected'), ('PROFIT', 'Profit'), ('LOSS', 'Loss'),
        ('BE', 'BE'), ('CANCELLED', 'Cancelled'), ('DELETED', 'Deleted')), default='NEW')
    tf = models.CharField(max_length=3, choices=settings.TFS)
    direction = models.CharField(max_length=4, choices=(('buy', 'Buy'), ('sell', 'Sell')))
    open = models.DecimalField(max_digits=10, decimal_places=5)
    close = models.DecimalField(max_digits=10, decimal_places=5)
    high = models.DecimalField(max_digits=10, decimal_places=5)
    low = models.DecimalField(max_digits=10, decimal_places=5)
    relative_risk = models.DecimalField(max_digits=3, decimal_places=2, default=0, null=True, blank=True)
    client_time = models.DateTimeField()
    comment = models.CharField(max_length=255, null=True, blank=True)
    server_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    # objects = SignalArchiveManager()

    class Meta:
        db_table = 'signal_archive'
        verbose_name = u'Signal Archive'

    def __unicode__(self):
        return "Archived Signal / %s, %s, %s, %s" % (self.system, self.pair, self.tf, self.direction)

    def to_dict(self):
        return {
            'signal_id': self.id,
            'system': str(self.system),
            'pair': str(self.pair),
            'tf': self.tf,
            'status': self.status,
            'direction': self.direction,
            'high': self.high,
            'low': self.low,
            'relative_risk': self.relative_risk,
            'client_time': settings.DATETIME_FORMAT.format(self.client_time),
            'server_time': settings.DATETIME_FORMAT.format(self.server_time),
            'archived_at': settings.DATETIME_FORMAT.format(self.created_at)
        }

    def create_signal_copy(self, s):
        self.signal_id = s.id
        self.account = s.account
        self.system = s.system
        self.pair = s.pair
        self.status = s.status
        self.tf = s.tf
        self.direction = s.direction
        self.open = s.open
        self.close = s.close
        self.high = s.high
        self.low = s.low
        self.relative_risk = s.relative_risk
        self.client_time = s.client_time
        self.comment = s.comment
        self.server_time = s.server_time
        self.save()
