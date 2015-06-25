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

from datetime import datetime

from trader import Trader


class ImportBars(Trader):
    def __init__(self):
        super(ImportBars, self).__init__()

    def import_file(self, pair, tf, path):
        """
        ie. 2014.01.03 09:41:00,0.95647,0.95656,0.95636,0.95642,129.68
        """

        self.pair = pair
        self.tf = tf

        with open(path) as f:
            for line in f.readlines():
                self.import_line(line.split(','))

    def import_line(self, line):
        if line[0] == 'Time': return

        D = datetime.strptime(line[0], '%Y.%m.%d %H:%M:%S')
        O = float(line[1])
        H = float(line[2])
        L = float(line[3])
        C = float(line[4])
        V = float(line[5].replace("\r\n", ''))

        if int(V) == 0: return

        key = self.get_key(self.pair, self.tf, self.to_timestamp(D))
        self.redis.hsetnx(key, 'open', O)
        self.redis.hsetnx(key, 'high', H)
        self.redis.hsetnx(key, 'low', L)
        self.redis.hsetnx(key, 'close', C)


if __name__ == '__main__':
    b = ImportBars()

    for pair in b.get_pairs():
        print 'M1/%s_1 Min_Bid_2013.01.01_2014.01.01.csv' % pair
        b.import_file(pair, 'M1', 'M1/%s_1 Min_Bid_2013.01.01_2014.01.01.csv' % pair)

        # print 'M1/%s_1 Min_Bid_2014.01.01_2014.02.25.csv' % pair
        # b.import_file(pair, 'M1', 'M1/%s_1 Min_Bid_2014.01.01_2014.02.25.csv' % pair)
