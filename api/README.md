API
===

PATH: /api/v1/:token/

- /account
	- GET /
		[ { broker, account_id, leverage, leverage_in_use, free_margin, balance, net_balance, max_balance, last_ping }]
- /signal
	- GET / { [strategy, pair, tf] }
		All available signals for given account. Optionally for system, pair or TF
	- GET /:id
		Info about given signal
	- POST /:id/re/opportunity
		Inform client there is chance for re-entry
	- POST /:id/re
		Generate new signal (re-entry)
	- DELETE /:id
		Deletes signal
	- POST / { pair, tf, system, direction, open, high, low, close, client_time, comment }
		Adds new signal
- /trade
	- GET / { [status = ( NEW, ACCEPTED, REJECTED, LIVE, PROFIT, LOSS )] }
		List of all trades in given state
	- GET /:id
		Trade details
	- GET /for_signal/:signal_id
		List of trades for signal
	- POST /open { signal_id, ticket_id, wanted_size, given_size, spread, date, commission }
		Adds new trade based on signal ID
	- POST /fill/:id { wanted_price, given_price, fill_time, spread, date, commission, account_leverage, account_leverage_in_use, account_free_margin, account_balance, account_net_balance }
		Pending order has been fulfilled
	- POST /update/:id { profit, net_profit, pips, swap, spread, date, account_leverage, account_leverage_in_use, account_free_margin, account_balance, account_net_balance }
		Currently running trade
	- POST /close/:id { wanted_price, given_price, close_time, profit, net_profit, pips, swap, date, spread, commission, account_leverage, account_leverage_in_use, account_free_margin, account_balance, account_net_balance }
		Closed trade
	- POST /expired/:id { spread, date, commission }
		Closed pending order
	- POST /info/:id { message }
	- POST /error/:id { message }
- /update
	- GET /ping
	- GET /bar { pair, tf, open, high, low, close, date, [volume] }
		Adds new candle
	- GET /pair { pair, pip_value, digits, [pip_worth_usd, pip_worth_gbp] }
		Updates info about pair
	- GET /level2 { pair, [ price, bid_volume, ask_volume ]}
		Current order book level 2
- /log
	- GET /info { message }
		Send various logs
	- POST /error { message }
- /report
	- GET /cashflow/:unit { unit = ( CASH, POINTS, PIPS )}
	    Currently running trades in given unit
		[{ pair, tf, strategy, progress (-100;100) }]
	- GET /cachflow/:unit/group/:group_by_csv { unit = ( CASH, POINTS, PIPS ), group_by = (PAIR, TF, STRATEGY, DIRECTION )}
		{ group_1: [pair, tf, strategy, profit_in_unit, progress (-100%;+100%)] }
- /news
	- GET / { [ pair ] }
		List of latest news. Optionally with pair.
	- POST / { pair, severity, message, date }
		Sends news