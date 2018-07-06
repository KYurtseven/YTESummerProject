from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
from datetime import datetime
from json import dumps

cluster = Cluster(['127.0.0.1'])
session = cluster.connect('yte')

app = FlaskAPI(__name__)


@app.route('/api/cassandraExample/')
def cassandraExample():
	queryResult = session.execute(
		"Select toJson(*) from YTE.lazy_employees where username = 'u3'; ")
	ret = []
	for rows in queryResult:
		ret.append({
		'username' : rows.username,
		'deposit' : rows.deposit,
        'email' : rows.email,
		'dates' : rows.dates,
        'name' : rows.name,
        'usertype' : rows.usertype
        })
	return ret


if __name__ == "__main__":
    app.run(debug=True)