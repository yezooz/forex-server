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

import logging

log = logging.getLogger(__name__)

# from account import Account
# from log import Log
# from news import News
# from report import Report
from signal import Signal
# from trade import Trade
# from update import Update

class API(object):
    """API main class"""

    def __init__(self, request):
        self.request = request

    def __getattr__(self, name):
        if name == 'signal':
            self.signal = Signal(request)
        else:
            raise Exception('Attribute not found %s' % name)

        return self.__getattribute__(name)

    def has_param(self, name):
        if self.request.method == 'POST':
            return self.request.POST.has_key(name)
        return self.request.GET.has_key(name)

    def get_param(self, name):
        if self.request.method == 'POST':
            v = self.request.POST.get(name)
        v = self.request.GET.get(name)

        if v.find(',') > -1:
            v = v.split(',')
        return v
