from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
import json
cluster = Cluster(['127.0.0.1'])
session = cluster.connect('yte')

app = FlaskAPI(__name__)


@app.route('/api/cassandraExample/')
def cassandraExample():
	queryResult = session.execute("Select json * from YTE.lazy_employees")
	ret = []

	for rows in queryResult:
		tmp = json.loads(rows.json)

		ret.append({
			'username' : tmp['username'], 
			'dates' :  tmp['dates'], 
			'deposit' : tmp['deposit'],
			'email' : tmp['email'],
			'name' : tmp['name'],
			'usertype' : tmp['usertype']
		})
	return ret


if __name__ == "__main__":
    app.run(debug=True)