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

"""
PairTest
"""

from decimal import Decimal

from django.test import TestCase

from fserver.models import Pair


class PairTest(TestCase):
    def setUp(self):
        Pair.objects.create(
            name='EURUSD',
            pip_value=Decimal('0.0001'),
            point=4,
            spread=Decimal('0.0'),
            pip_worth_usd=Decimal('0.0001'),
            pip_worth_gbp=Decimal('0.00006'),
            is_active=True
        )

    def test_data(self):
        pair = Pair.objects.get(name__exact='EURUSD')

        self.assertEqual(pair.name, 'EURUSD')
        self.assertEqual(pair.pip_value, Decimal('0.0001'))
        self.assertEqual(pair.point, 4)
        self.assertEqual(pair.pip_worth_usd, Decimal('0.0001'))

    def test_lot_size(self):
        pair = Pair.objects.get(name__exact='EURUSD')

        self.assertEqual(pair.lot_size(1000.0, 0.01, 100), 0.01)
