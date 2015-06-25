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

#!/usr/bin/python

from django.conf import settings

import gdata.spreadsheet.service

GID_TABLE = {
    'od6': 0,
    'od7': 1,
    'od4': 2,
    'od5': 3,
    'oda': 4,
    'odb': 5,
    'od8': 6,
    'od9': 7,
    'ocy': 8,
    'ocz': 9,
    'ocw': 10,
    'ocx': 11,
    'od2': 12,
    'od3': 13,
    'od0': 14,
    'od1': 15,
    'ocq': 16,
    'ocr': 17,
    'oco': 18,
    'ocp': 19,
    'ocu': 20,
    'ocv': 21,
    'ocs': 22,
    'oct': 23,
    'oci': 24,
    'ocj': 25,
    'ocg': 26,
    'och': 27,
    'ocm': 28,
    'ocn': 29,
    'ock': 30,
    'ocl': 31,
    'oe2': 32,
    'oe3': 33,
    'oe0': 34,
    'oe1': 35,
    'oe6': 36,
    'oe7': 37,
    'oe4': 38,
    'oe5': 39,
    'odu': 40,
    'odv': 41,
    'ods': 42,
    'odt': 43,
    'ody': 44,
    'odz': 45,
    'odw': 46,
    'odx': 47,
    'odm': 48,
    'odn': 49,
    'odk': 50,
    'odl': 51,
    'odq': 52,
    'odr': 53,
    'odo': 54,
    'odp': 55,
    'ode': 56,
    'odf': 57,
    'odc': 58,
    'odd': 59,
    'odi': 60,
    'odj': 61,
    'odg': 62,
    'odh': 63,
    'obe': 64,
    'obf': 65,
    'obc': 66,
    'obd': 67,
    'obi': 68,
    'obj': 69,
    'obg': 70,
    'obh': 71,
    'ob6': 72,
    'ob7': 73,
    'ob4': 74,
    'ob5': 75,
    'oba': 76,
    'obb': 77,
    'ob8': 78,
    'ob9': 79,
    'oay': 80,
    'oaz': 81,
    'oaw': 82,
    'oax': 83,
    'ob2': 84,
    'ob3': 85,
    'ob0': 86,
    'ob1': 87,
    'oaq': 88,
    'oar': 89,
    'oao': 90,
    'oap': 91,
    'oau': 92,
    'oav': 93,
    'oas': 94,
    'oat': 95,
    'oca': 96,
    'ocb': 97,
    'oc8': 98,
    'oc9': 99
}


class SpreadsheetStorage(object):
    def __init__(self, worksheet_id='od6'):
        self.email = settings.USERNAME
        self.password = settings.PASSWORD
        self.spreadsheet_key = 'XXX'
        self.worksheet_id = worksheet_id

        self.client = gdata.spreadsheet.service.SpreadsheetsService()
        self.client.email = self.email
        self.client.password = self.password
        self.client.source = 'Server'
        self.client.ProgrammaticLogin()

    def add_row(self, dicti):
        self.client.InsertRow(dicti, self.spreadsheet_key, self.worksheet_id)
        # print 'row added'
