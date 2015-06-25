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

from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from fserver.models import *

log = logging.getLogger(__name__)


@login_required
def index(request):
    live_accounts = {}
    for acc in Account.objects.filter(id__in=settings.ALL_ACCOUNTS):
        live_accounts[acc.id] = str(acc)

    return render(request, 'index.html', {
        'unapproved_signals': Signal.objects.get_signals_to_confirm(),
        'unapproved_signals_count': Signal.objects.get_signals_to_confirm_count(),
        'live_accounts': live_accounts
    })


@login_required
def action(request):
    signal = Signal.objects.get(pk=request.GET['signal_id'])
    if request.GET['action'] == 'approve':
        signal.accept()
    elif request.GET['action'] == 'decline':
        signal.reject()
    elif request.GET['action'] == 'profit':
        signal.profit()
    elif request.GET['action'] == 'loss':
        signal.loss()
    elif request.GET['action'] == 'be':
        signal.be()
    elif request.GET['action'] == 'cancel':
        signal.cancel()
    elif request.GET['action'] == 'comment':
        signal.comment = request.GET['comment']
    elif request.GET['action'] == 'risk':
        signal.relative_risk = request.GET['value']
    elif request.GET['action'] == 'tp':
        signal.tp = request.GET['value']  # TODO
    elif request.GET['action'] == 'sl':
        signal.sl = request.GET['value']  # TODO
    elif request.GET['action'] == 'high':
        signal.high = request.GET['value']
    elif request.GET['action'] == 'low':
        signal.low = request.GET['value']
    elif request.GET['action'] == 'toggle_account':
        if signal.subscribed_accounts is None:
            signal.subscribed_accounts = ''

        subs = signal.subscribed_accounts.split(',')
        if request.GET['value'] in signal.subscribed_accounts.split(','):
            del subs[subs.index(request.GET['value'])]
        else:
            subs.append(request.GET['value'])

        try:
            del subs[subs.index('')]
        except Exception:
            pass

        signal.subscribed_accounts = ','.join(subs)
    else:
        return HttpResponse('UNKNOWN ACTION')

    signal.save()
    return HttpResponse('OK')


@login_required
def signal(request, signal_id):
    signal = Signal.objects.get(id=signal_id)

    return render(request, 'index.html', {
        'signals': [signal],
    })


@login_required
def chart(request):
    pair = request.GET.get('pair', None)
    tf = request.GET.get('tf', None)

    signal = Signal()
    path = signal.get_chart(system_name='', load_latest=True, force_tf=tf, force_pair=pair)

    return render(request, 'custom_chart.html', {
        'path': path,
        'selected_pair': pair,
        'selected_tf': tf,
        'pairs': Pair.objects.all(),
        'tfs': settings.TFS
    })


@login_required
def live(request):
    return render(request, 'index.html', {
        'signals': Signal.objects.filter(status='ACCEPTED').order_by('-server_time')
    })


@login_required
def recent(request):
    return render(request, 'index.html', {
        'signals': Signal.objects.filter(status__in=('ACCEPTED', 'PROFIT', 'LOSS', 'BE', 'PENDING', 'LIVE')).order_by(
            '-server_time')[:10]
    })


@login_required
def trade(request, trade_id):
    trade = Trade.objects.get(id=trade_id)

    return render(request, 'trade.html', {
        'trade': trade,
    })


@login_required
def calculator(request):
    pairs = Pair.objects.filter(name__in=(
        'EURUSD', 'GBPUSD', 'USDCHF', 'AUDUSD', 'EURGBP', 'NZDUSD', 'EURJPY', 'USDJPY', 'USDCAD', 'EURCAD', 'AUDCAD',
        'CADCHF', 'CADJPY', 'CHFJPY', 'EURAUD', 'EURNZD', 'GBPCAD', 'GBPCHF', 'GBPJPY', 'NZDCAD', 'NZDCHF', 'NZDJPY',
        'AUDJPY', 'AUDCHF', 'AUDNZD', 'GBPAUD', 'GBPNZD', 'XAGUSD', 'XAUUSD'))

    return render(request, 'calculator.html', {
        'pairs': pairs
    })


@login_required
def summary(request):
    signals = Signal.objects.filter(status__in=('ACCEPTED', 'PENDING', 'LIVE')).order_by('-server_time')

    obj = {}
    status_list = []
    system_list = []
    tf_list = []
    pair_list = []

    for s in signals:
        if not obj.has_key(s.status):
            status_list.append(s.status)
            obj[s.status] = {}
        if not obj[s.status].has_key(s.system.name):
            if s.system.name not in system_list:
                system_list.append(s.system.name)
            system_list.append(s.system.name)
            obj[s.status][s.system.name] = {}
        if not obj[s.status][s.system.name].has_key(s.tf):
            if s.tf not in tf_list:
                tf_list.append(s.tf)
            obj[s.status][s.system.name][s.tf] = {}
        if not obj[s.status][s.system.name][s.tf].has_key(s.pair_name):
            if s.pair_name not in pair_list:
                pair_list.append(s.pair_name)
            obj[s.status][s.system.name][s.tf][s.pair_name] = []
        obj[s.status][s.system.name][s.tf][s.pair_name].append(s)

    log.info(obj)

    return render(request, 'summary.html', {
        'signals': obj,
        'status_list': status_list,
        'system_list': system_list,
        'tf_list': tf_list,
        'pair_list': pair_list,
    })


@login_required
def signal_summary(request, signal_id):
    signal = Signal.objects.filter(id=signal_id)

    return render(request, 'summary_signal.html', {
        'signal': signal
    })
