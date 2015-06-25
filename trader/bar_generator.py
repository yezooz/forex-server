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

import datetime

from talib.abstract import *
from trader import Trader
from trader import Unit


class BarGenerator(Trader):
    def __init__(self, pair):
        super(BarGenerator, self).__init__()

        self.pair = pair
        self.next_bar_time = None
        self.next_minute_bar = None

    def generate(self, unit, number, start_time):
        self.unit = unit
        self.number = number
        self.start_time = start_time

        next_key = self.get_key(self.pair, self.get_tf(unit, number), self.to_timestamp(start_time))
        print next_key

        print self.next_bar()
        print self.minute_bar_keys()

    # print self.next_bar()
    # print self.next_bar()

    def minute_bar_keys(self):
        if self.next_minute_bar is None:
            self.next_minute_bar = self.start_time

        arr = []
        for i in xrange(0, (self.unit * self.number) / 60):
            arr.append(self.get_key(self.pair, 'M1', self.to_timestamp(self.next_minute_bar)))

            self.next_minute_bar += datetime.timedelta(minutes=1)

        return arr

    def next_bar(self):
        if self.next_bar_time is None:
            self.next_bar_time = self.start_time
        self.next_bar_time += datetime.timedelta(seconds=(self.unit * self.number))

        return self.get_key(self.pair, self.get_tf(self.unit, self.number), self.to_timestamp(self.next_bar_time))


if __name__ == '__main__':
    gen = BarGenerator('EURUSD')
    # gen.generate(Unit.MINUTE, 5, datetime.datetime(2014, 1, 1, 0, 0, 0))
    gen.generate(Unit.MINUTE, 10, datetime.datetime(2014, 1, 1, 0, 0, 0))
    # gen.generate(Unit.MINUTE, 15, datetime.datetime(2014, 1, 1, 0, 0, 0))
    # gen.generate(Unit.MINUTE, 20, datetime.datetime(2014, 1, 1, 0, 0, 0))
    # gen.generate(Unit.MINUTE, 25, datetime.datetime(2014, 1, 1, 0, 0, 0))
    # gen.generate(Unit.MINUTE, 30, datetime.datetime(2014, 1, 1, 0, 0, 0))
    # gen.generate(Unit.MINUTE, 35, datetime.datetime(2014, 1, 1, 0, 0, 0))
