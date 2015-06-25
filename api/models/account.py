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

from api import API
from fserver.models import Account as AccountModel

log = logging.getLogger(__name__)


class Account(API):
    def __init__(self, request):
        super(API, self).__init__(request)

    def get_list(self):
        arr = []

        models = AccountModel.objects.all()
        if request.GET.has_key('is_active'):
            models = models.filter(is_active=True)
        if request.GET.has_key('is_not_active'):
            models = models.filter(is_active=False)
        if request.GET.has_key('is_demo'):
            models = models.filter(type='DEMO')
        if request.GET.has_key('is_live'):
            models = models.filter(type='LIVE')

        for m in models:
            arr.append(m.to_dict())
        return arr

    def get_account(self, account_id):
        try:
            return AccountModel.objects.get(id=account_id).to_dict()
        except AccountModel.DoesNotExists:
            log.info('Account %s not found' % account_id)
            return {}
