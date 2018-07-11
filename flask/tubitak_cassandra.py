from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
import json
cluster = Cluster(['127.0.0.1'])
session = cluster.connect('yte')

app = FlaskAPI(__name__)


@app.route('/api/cassandraExample/', methods = ['GET'])
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

@app.route('/api/user/addDate/', methods = ['POST'])
def addDate():
	username = request.get_json(force=True).get('username')
	date = request.get_json(force=True).get('date')

	query = "UPDATE YTE.lazy_employees SET dates = dates + ['" + date + "'] WHERE username = '" + username + "'"
	session.execute(query)
	
	# TO DO, delete ret and return
	ret = {'username': username, 'date': date}
	return ret

@app.route('/api/user/updateDeposit/', methods = ['POST'])
def updateDeposit():

	username = request.get_json(force=True).get('username')
	deposit = request.get_json(force=True).get('deposit')

	query = "UPDATE YTE.lazy_employees SET deposit = " + deposit + " WHERE username = '" + username + "'"

	print("QUERY", query)
	session.execute(query)
	# TO DO, delete ret and return
	ret = {'username' : username, 'deposit' : deposit}
	return ret

@app.route('/api/user/deleteDates/', methods = ['POST'])
def deleteDates():
	username = request.get_json(force=True).get('username')
	dates = request.get_json(force=True).get('dates')

	print('USERNAME', username)
	print('DATES' , dates)

	query = "UPDATE YTE.lazy_employees SET dates = " + str(dates) + " WHERE username = '" + username + "'"
	print('QUERY', query)

	session.execute(query)

	#TO DO
	return {'name' : 'hi'}

if __name__ == "__main__":
    app.run(debug=True)