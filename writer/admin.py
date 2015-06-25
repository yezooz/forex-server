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

from django.contrib import admin

from fserver.models import *


class PairAdmin(admin.ModelAdmin):
    list_display = ('name', 'pip_value', 'point', 'spread', 'is_active')
    list_filter = ('spread', 'is_active')


class SignalAdmin(admin.ModelAdmin):
    list_display = ('id', 'account_name', 'system', 'pair', 'tf', 'status', 'direction', 'client_time', 'server_time')
    list_filter = ('system', 'account_name', 'status', 'pair', 'tf')


class SystemPairAdmin(admin.ModelAdmin):
    list_display = ('system', 'pair', 'tf', 'is_active')
    list_filter = ('system', 'pair', 'tf', 'is_active')


class AccountSystemAdmin(admin.ModelAdmin):
    list_display = ('account', 'system', 'is_active')
    list_filter = ('account', 'system', 'is_active')


class SystemAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'is_active')
    list_filter = ('is_active',)


class AccountAdmin(admin.ModelAdmin):
    list_display = ('broker', 'number', 'type', 'last_ping', 'is_active')
    list_filter = ('broker', 'type', 'is_active')


class BrokerAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'min_lot', 'max_lot', 'timezone', 'is_active')
    list_filter = ('type', 'is_active')


class SystemRiskAdmin(admin.ModelAdmin):
    list_display = ('system', 'broker', 'account', 'risk_per_trade')
    list_filter = ('system', 'broker', 'risk_per_trade')


class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('signal_id', 'action', 'comment', 'pair', 'tf', 'created_at')


# list_filter = ('pair', 'tf', 'account')
# search_fields = ['signal_id']


class TradeAdmin(admin.ModelAdmin):
    list_display = ('signal', 'ticket', 'size', 'profit', 'status', 'last_profit', 'created_at')
    list_filter = ('status', 'account')


class BarAdmin(admin.ModelAdmin):
    list_display = ('pair', 'tf', 'open', 'high', 'low', 'close', 'time')
    list_filter = ('pair', 'tf')


class SignalAccountAdmin(admin.ModelAdmin):
    list_display = ('account', 'signal')
    list_filter = ('account',)


class TradeUpdateAdmin(admin.ModelAdmin):
    list_display = ('trade', 'net_profit', 'gross_profit', 'swap', 'commision', 'created_at')


admin.site.register(Broker, BrokerAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(System, SystemAdmin)
admin.site.register(SystemRisk, SystemRiskAdmin)
admin.site.register(Pair, PairAdmin)
admin.site.register(SystemPair, SystemPairAdmin)
admin.site.register(Signal, SignalAdmin)
admin.site.register(Trade, TradeAdmin)
admin.site.register(AccountSystem, AccountSystemAdmin)
admin.site.register(SystemLog, SystemLogAdmin)
admin.site.register(Bar, BarAdmin)
admin.site.register(SignalAccount, SignalAccountAdmin)
admin.site.register(TradeUpdate, TradeUpdateAdmin)
