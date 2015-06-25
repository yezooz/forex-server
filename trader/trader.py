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

import calendar

import redis

REDIS_ADDR = '127.0.0.1'

UNIT = {
    'MINUTE': 'M',
    'HOUR': 'H',
    'DAY': 'D'
}


class Unit(object):
    MINUTE = 60
    HOUR = 3600
    DAY = 3600 * 24


class Trader(object):
    def __init__(self):
        self.pool = redis.ConnectionPool(host=REDIS_ADDR, port=6379, db=0)
        self.redis = redis.Redis(connection_pool=self.pool)

    def get_tf(self, unit, number):
        unit_name = ''
        if unit == Unit.MINUTE:
            unit_name = 'M'
        elif unit == Unit.HOUR:
            unit_name = 'H'
        elif unit == Unit.DAY:
            unit_name = 'D'

        return '%s%d' % (unit_name, int(number))

    def get_key(self, pair, tf, time):
        return 'BAR:%s:%s:%s' % (pair, tf, time)

    def to_timestamp(self, date):
        return calendar.timegm(date.utctimetuple())

    def get_pairs(self):
        return [
            'EURUSD',
            'GBPUSD',
            'USDCHF',
            'AUDUSD',
            'EURGBP',
            'NZDUSD',
            'EURJPY',
            'USDJPY',
            'USDCAD',
            'EURCAD',
            'AUDCAD',
            'CADCHF',
            'CADJPY',
            'CHFJPY',
            'EURAUD',
            'EURNZD',
            'GBPCAD',
            'GBPCHF',
            'GBPJPY',
            'NZDCAD',
            'NZDCHF',
            'NZDJPY',
            'AUDJPY',
            'AUDCHF',
            'AUDNZD',
            'GBPAUD',
            'GBPNZD',
            'EURCHF',

            # 'XAGUSD',
            # 'XAUUSD',
            # 'EURPLN',
            # 'USDPLN',
            # 'EURNOK',
            # 'SGDJPY',
            # 'USDDKK',
            # 'USDNOK',
            # 'USDTRY',
            # 'AUDSGD',
            # 'USDSEK',
            # 'USDSGD',
            # 'USDZAR',
            # 'USDMXN',
            # 'USDHKD',
            # 'HKDJPY',
            # 'EURSEK',
            # 'EURSGD',
            # 'EURTRY',
            # 'EURHKD',
            # 'EURDKK',
            # 'CHFSGD',
            # 'CADHKD',
        ]
