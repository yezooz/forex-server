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

from threading import Thread
import logging

from django.conf import settings

import hipchat

log = logging.getLogger('fserver.chat')

ROOMS = {
    'alerts': 'XXX',
    'fserver': 'XXX',
    'logs': 'XXX',
    'signals': 'XXX',
    'trades': 'XXX'
}


class Hipchat(object):
    def __init__(self, room_name, text):
        """
    	# List rooms
		hipster.method('rooms/list')

		# Post a message to a HipChat room
		hipster.method('rooms/message', method='POST', parameters={'room_id': 8675309, 'from': 'HAL', 'message': 'All your base...'})

		# List rooms, print response JSON
		print hipster.list_rooms()

        # POST a message to a room, print response JSON
        print hipster.message_room(8675309, 'HAL', 'All your base...')
		"""

        if room_name not in ROOMS.keys():
            log.error('ROOM NOT FOUND')
            return

        hipster = hipchat.HipChat(token=settings.TOKENS['hipchat'])
        response = hipster.message_room(ROOMS[room_name], 'fserver', text)
        log.info('Hipchat -> %s' % response)


def sendMsg(room, msg):
    thread = Thread(target=Hipchat, args=(room, msg))
    thread.start()
