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

# from django.test import TestCase
from unittest import TestCase

from fserver.models import Pair


class PairTestCase(TestCase):
    def setUp(self):
        # Pair.objects.create(name='EURUSD')
        pass

    def test_data(self):
        pair = Pair.objects.get(name='EURUSD')

        self.assertEqual(pair.name, 'EURUSD')
        self.assertEqual(pair.pip_value, 0.0001)
        self.assertEqual(pair.point, 4)
        self.assertEqual(pair.pip_worth_in_usd, 0.0001)

    def test_lot_size(self):
        pair = Pair.objects.get(name='EURUSD')

        self.assertEqual(pair.lot_size(10000, 0.1, 100), 0.41)

        pair = Pair.objects.get(name='EURJPY')

        self.assertEqual(pair.lot_size(10000, 0.1, 100), 0.1)

        self.assertEqual(False, True)
