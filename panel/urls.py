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

from django.conf.urls import patterns, url

urlpatterns = patterns('panel.views',
                       url(r'^$', 'index', name='panel'),
                       url(r'^action$', 'action', name='signal_action'),
                       url(r'^signal/(\d{1,})$', 'signal', name='signal'),
                       url(r'^live$', 'live', name='live_trades'),
                       url(r'^recent$', 'recent', name='recently_approved'),
                       url(r'^trade/(\d{1,})$', 'trade', name='trade'),

                       url(r'^chart$', 'chart'),
                       url(r'^chart/(\S+)/(\S{2,4})$', 'chart'),

                       url(r'^calc$', 'calculator', name='calculator'),

                       url(r'^summary/$', 'summary', name='summary'),
                       url(r'^summary/(?P<signal_id>\d+)$', 'signal_summary', name='signal_summary'),
                       )
