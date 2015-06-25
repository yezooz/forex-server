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

# from django.conf import settings
import logging

from mail import sendMail
from chat import sendMsg

log = logging.getLogger('fserver.alert')


class Alert(object):
    """
    Supports:
    - email
    - hipchat

    alert = Alert()
    alert.log('')
    alert.info('')
    alert.warning('')
    alert.error('')
    alert.critical('')
    """

    def __init__(self):
        pass

    def log(self, msg, title='LOG'):
        log.debug(msg)

    def info(self, msg, title='INFO'):
        log.info(msg)
        sendMsg('alerts', 'INFO. %s.' % msg)
        sendMail(title, msg)

    def warning(self, msg, title='WARNING'):
        log.warn(msg)
        sendMsg('alerts', 'WARNING. %s.' % msg)
        sendMail(title, msg)

    def error(self, msg, title='ERROR'):
        log.error(msg)
        sendMsg('alerts', 'ERROR. %s.' % msg)
        sendMail(title, msg)

    def critical(self, msg, title='CRITICAL'):
        log.critical(msg)
        sendMsg('alerts', 'CRITICAL. %s.' % msg)
        sendMail(title, msg)
