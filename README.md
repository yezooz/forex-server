fserver
=======

- collects signals from many sources
- stores them in the db
- allows for browsing signals
- sends filtered and modifies signals to robots


Dependencies
===

```
apt-get install python
apt-get install python-dev
apt-get install cython
apt-get install mysql-server
apt-get install redis-server
apt-get install python-setuptools
apt-get install python-pip
apt-get install python-mysqldb
apt-get install gunicorn
apt-get install openjdk-6-jdk
apt-get install sendmail

wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz
tar xvfz ta-lib-0.4.0-src.tar.gz
cd ta-lib
./configure
make
make install

pip install -r requirements.txt
```

One-line install
===

```
apt-get install gcc; apt-get install python; apt-get install python-dev; apt-get install cython; apt-get install mysql-server; apt-get install redis-server; apt-get install python-setuptools; apt-get install python-pip; apt-get install python-mysqldb; apt-get install gunicorn; apt-get install openjdk-6-jdk; apt-get install sendmail; pip install Django==1.6.1; pip install simplejson; pip install redis; pip install python-simple-hipchat; pip install django-mathfilters; pip install numpy; wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz; tar xvfz ta-lib-0.4.0-src.tar.gz; cd ta-lib; ./configure; make; make install; pip install ta-lib
```

API
===

URL: http://XXX:9000/signal/writer/

Required parameters for every request:
- broker
- account

* /
	* csv
		* system
		* version
		* pair
		* tf
		* open
		* high
		* low
		* close
		* time
		* broker
		* account
		* comment
* /ping
* /bar
	* pair
	* tf
	* high
	* low
	* open
	* close
	* time
* /pair
	* pair
	* pip_value
	* digits
	* pip_worth_usd (optional)
	* pip_worth_gbp (optional)
* /update
	* trade_id
	* profit
