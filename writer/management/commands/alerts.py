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

from django.core.management.base import NoArgsCommand

from fserver.models import Account, Bar
from alert import Alert


# import logging
# log = logging.getLogger(__name__)

class Command(NoArgsCommand):
    def handle_noargs(self, **options):
        alert = Alert()

        some_time_ago = datetime.datetime.now() - time.timedelta(minutes=15)
        yesterday = datetime.datetime.now() - time.timedelta(days=1, minutes=15)

        warnings = []
        for a in Account.objects.all():
            if a.last_ping < some_time_ago:
                warnings.append('Account %s is not sending updates.' % str(a))

            for pair in Pair.objects.filter(is_active=True):
                if Bar.objects.filter(pair__id=pair.id, broker_account__id=a.id).count() > 0:
                    last_bar = Bar.objects.filter(pair__id=pair.id, broker_account__id=a.id).order('created_at')[-1]
                    if last_bar.created_at < yesterday:
                        warnings.append('Expected new %s bar from %s by now.' % (str(pair.name), str(a)))

            if len(warnings) > 0:
                alert.warning("\n".join(warnings))
