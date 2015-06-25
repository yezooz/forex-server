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

# from django.conf import settings
import logging

from django.http import HttpResponse

from fserver.models import *

log = logging.getLogger(__name__)


class Report(object):
    def __init__(self, action, req_dict={}):
        self.action = action
        self.req_dict = req_dict

        if not all([req_dict.get('ticket'), req_dict.get('price'), req_dict.get('spread'), req_dict.get('broker'),
                    req_dict.get('account')]):
            return

        if action == 'open_trade':
            self.open_trade()

        if action == 'close_trade':
            self.close_trade()

    def open_trade(self):

        if not all([self.req_dict.get('signal_id'), self.req_dict.get('size'), self.req_dict.get('tp'),
                    self.req_dict.get('sl')]):
            return

        signal = Signal.objects.get_by_id(self.req_dict['signal_id'])
        account = Account.objects.get_by_broker_and_account(self.req_dict['broker'], self.req_dict['account'])

        if signal is None or account is None:
            Alert().warning('Something is None')
            return False

        # SystemLog.objects.add_log(broker=self.req_dict['broker'], account=self.req_dict['account'], action='open', signal_id=signal.id)

        t = Trade()
        t.signal = signal
        t.account = account
        t.ticket = self.req_dict['ticket']
        t.size = Decimal(self.req_dict['size'])
        # t.tp = Decimal(self.req_dict['tp'])
        # t.sl = Decimal(self.req_dict['sl'])
        t.tp = Decimal('0.0')
        t.sl = Decimal('0.0')
        t.open_price = Decimal(self.req_dict['price'])
        t.open_spread = Decimal(self.req_dict['spread'])
        t.status = 'LIVE'
        try:
            t.save()
        except Exception, e:
            Alert().error(e)
            return False

        t.signal.status = 'LIVE'
        try:
            t.signal.save()
        except Exception, e:
            Alert().error(e)
            return False

        t.notify()

    def close_trade(self):
        if not all([self.req_dict.get('profit'), self.req_dict.get('price'), self.req_dict.get('spread')]):
            return

        t = Trade.objects.get_by_account_ticket(self.req_dict['broker'], self.req_dict['account'],
                                                self.req_dict['ticket'])
        if t is None: return False

        t.profit = Decimal(self.req_dict['profit'])
        t.close_price = Decimal(self.req_dict['price'])
        t.close_spread = Decimal(self.req_dict['spread'])
        t.commision = Decimal(self.req_dict['commision'])
        t.swap = Decimal(self.req_dict['swap'])
        t.net_profit = Decimal(self.req_dict['net_profit'])
        t.gross_profit = Decimal(self.req_dict['gross_profit'])
        if t.profit >= 0:
            t.status = 'PROFIT'
            t.signal.profit()
        else:
            t.status = 'LOSS'
            t.signal.loss()
        try:
            t.save()
        except Exception, e:
            Alert().error(e)
            return False


def index(request):
    if not all([request.GET.get('action')]):
        return HttpResponse('NO DATA');

    Report(request.GET['action'], request.GET)

    return HttpResponse("OK")


def trade(request):
    if not all([request.GET.get('ticket'), request.GET.get('broker'), request.GET.get('account')]):
        return HttpResponse('NO DATA');

    t = Trade.objects.get_by_account_ticket(request.GET['broker'], request.GET['account'], request.GET['ticket'])
    if t is None: return HttpResponse("NO TRADE FOUND")

    t.last_profit = Decimal(request.GET['net_profit'])
    t.save()

    TradeUpdate.objects.add_update(trade=t, net_profit=request.GET['net_profit'],
                                   gross_profit=request.GET['gross_profit'], swap=request.GET['swap'],
                                   commision=request.GET['commision'])

    return HttpResponse("OK")


def log(request):
    if not all([request.GET.get('action'), request.GET.get('broker'), request.GET.get('account')]):
        return HttpResponse('NO DATA');

    Report(request.GET['action'], request.GET)

    SystemLog.objects.add_log(broker=request.GET['broker'], account=request.GET['account'],
                              action=request.GET['action'], comment=request.GET.get('comment'),
                              pair=request.GET.get('pair'), tf=request.GET.get('tf'),
                              signal_id=request.GET.get('signal_id'), system=request.GET.get('system'))

    return HttpResponse("OK")
