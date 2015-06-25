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

from email.mime.text import MIMEText
from subprocess import Popen, PIPE
from threading import Thread
import logging

from django.conf import settings

log = logging.getLogger('fserver.chat')


class SendMail(object):
    def __init__(self, rcp, subject, text):
        msg = MIMEText(text)
        msg["From"] = 'fserver@XXX'
        msg["To"] = rcp
        msg["Subject"] = subject
        p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
        p.communicate(msg.as_string())


class SendHTMLMail(object):
    def __init__(self, rcp, subject, html, text):
        # Send an HTML email with an embedded image and a plain text message for
        # email clients that don't want to display the HTML.

        from email.MIMEMultipart import MIMEMultipart
        from email.MIMEText import MIMEText

        # Define these once; use them twice!
        strFrom = 'fserver@XXX'
        strTo = rcp

        # Create the root message and fill in the from, to, and subject headers
        msgRoot = MIMEMultipart('related')
        msgRoot['Subject'] = subject
        msgRoot['From'] = strFrom
        msgRoot['To'] = strTo
        msgRoot.preamble = 'This is a multi-part message in MIME format.'

        # Encapsulate the plain and HTML versions of the message body in an
        # 'alternative' part, so message agents can decide which they want to display.
        msgAlternative = MIMEMultipart('alternative')
        msgRoot.attach(msgAlternative)

        msgText = MIMEText(text)
        msgAlternative.attach(msgText)

        # We reference the image in the IMG SRC attribute by the ID we give it below
        msgText = MIMEText(html, 'html')
        msgAlternative.attach(msgText)

        # This example assumes the image is in the current directory
        # fp = open('static/mt4/FxPro_MT4/screen/2014/02/13/EURUSD/D1/00_00.gif', 'rb')
        # msgImage = MIMEImage(fp.read())
        # fp.close()

        # Define the image's ID as referenced above
        # msgImage.add_header('Content-ID', '<image1>')
        # msgRoot.attach(msgImage)

        p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
        p.communicate(msgRoot.as_string())

        # Send the email (this example assumes SMTP authentication is required)
        # import smtplib
        # smtp = smtplib.SMTP()
        # smtp.connect('smtp.example.com')
        # smtp.login('exampleuser', 'examplepass')
        # smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        # smtp.quit()

        log.info('Email sent. (TO=%s, SUBJECT=%s)' % (rcp, subject))


def sendMail(title, html_msg='', text_msg=''):
    for admin in settings.ADMINS:
        thread = Thread(target=SendHTMLMail, args=(admin[1], title, html_msg, text_msg))
        thread.start()
