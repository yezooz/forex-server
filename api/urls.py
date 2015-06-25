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

urlpatterns = patterns('api.methods',
                       url(r'^(?P<token>\w{32})/$', 'views.index'),

                       url(r'^(?P<token>\w{32})/account$', 'account.index'),
                       url(r'^(?P<token>\w{32})/account/(?P<account_id>\d+)$', 'account.details'),

                       url(r'^(?P<token>\w{32})/signal$', 'signal.index'),
                       url(r'^(?P<token>\w{32})/signal/(?P<signal_id>\d+)$', 'signal.details'),

                       url(r'^(?P<token>\w{32})/trade$', 'trade.index'),
                       url(r'^(?P<token>\w{32})/trade/(?P<trade_id>\d+)$', 'trade.details'),
                       url(r'^(?P<token>\w{32})/trade/for_signal/(?P<signal_id>\d+)$', 'trade.for_signal'),
                       url(r'^(?P<token>\w{32})/trade/open/(?P<trade_id>\d+)$', 'trade.open'),
                       url(r'^(?P<token>\w{32})/trade/fill/(?P<trade_id>\d+)$', 'trade.fill'),
                       url(r'^(?P<token>\w{32})/trade/update/(?P<trade_id>\d+)$', 'trade.update'),
                       url(r'^(?P<token>\w{32})/trade/close/(?P<trade_id>\d+)$', 'trade.close'),
                       url(r'^(?P<token>\w{32})/trade/expired/(?P<trade_id>\d+)$', 'trade.expired'),
                       url(r'^(?P<token>\w{32})/trade/info/(?P<trade_id>\d+)$', 'trade.log_info'),
                       url(r'^(?P<token>\w{32})/trade/error/(?P<trade_id>\d+)$', 'trade.log_error'),

                       url(r'^(?P<token>\w{32})/update/ping$', 'update.ping'),
                       url(r'^(?P<token>\w{32})/update/bar$', 'update.bar'),
                       url(r'^(?P<token>\w{32})/update/pair$', 'update.pair'),
                       url(r'^(?P<token>\w{32})/update/level2$', 'update.level2'),

                       url(r'^(?P<token>\w{32})/log/info$', 'log.info'),
                       url(r'^(?P<token>\w{32})/log/error$', 'log.error'),

                       url(r'^(?P<token>\w{32})/report/cashflow/(?P<unit>\w+)$', 'report.cashflow'),
                       url(r'^(?P<token>\w{32})/report/cashflow/(?P<unit>\w+)/group/(?P<groups>[\w,]+)$',
                           'report.cashflow_group'),

                       url(r'^(?P<token>\w{32})/news$', 'news.index'),
                       )
