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

from api import API
from fserver.models import Trade as TradeModel
from fserver.models import Signal as SignalModel
# from fserver.models import SignalAccount

import logging

log = logging.getLogger(__name__)


class Trade(API):
    def __init__(self, request):
        super(API, self).__init__(request)
        self.redis = None

    def get_list(self):
        objs = []
        for obj in TradeModel.objects.all():
            objs.append(obj.to_dict())
        return objs

    def get_trade(self, trade_id):
        try:
            model = TradeModel.objects.get(id=trade_id)
            return self.get_trade_dict(model)
        except TradeModel.DoesNotExist:
            log.info('Trade %s not found' % trade_id)
            return None

    def get_trade_dict(self, trade):
        obj = trade.to_dict()
        obj['accounts'] = []
        for sa in SignalAccount.objects.filter(trade=trade):
            obj['accounts'].append(sa.to_dict())
        return obj

    def get_trade_by_signal(self, signal_id):
        try:
            signal = SignalModel.objects.get(id=signal_id)
        except SignalModel.DoesNotExist:
            log.info('Signal %s not found' % signal_id)
            return None

        return self.get_trade(signal.trade.id)

    def log_action(self, trade_id, key, value):
        self.redis.set(key, value)

    def log_info(self, trade_id, key, value):
        self.redis.set(key, value)

    def log_error(self, trade_id, key, value):
        # alerts
        self.redis.set(key, value)
