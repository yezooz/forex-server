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

from functools import wraps
import logging

import simplejson as json
from django.http import HttpResponse

from fserver.models import Account

log = logging.getLogger(__name__)


def api_call(view_func):
    def _decorator(request, *args, **kwargs):
        token = kwargs['token']

        if request.method not in ('GET', 'POST'):
            log.warn('Invalid request type: %s' % request.method)
            return HttpResponse('INVALID REQUEST TYPE')

        if Account.objects.filter(token=token).count() == 0:
            log.warn('Invalid token: %s' % token)
            return HttpResponse('INVALID TOKEN')

        log.debug('API REQUEST: %s' % request.get_full_path())

        response = view_func(request, *args, **kwargs)

        log.debug(request.get_full_path())
        log.debug(json.dumps(response))

        return render_json(response)

    return wraps(view_func)(_decorator)


def render_json(data):
    return HttpResponse(json.dumps(data), content_type='application/json')
