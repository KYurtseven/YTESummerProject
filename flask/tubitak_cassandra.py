from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
from passlib.hash import pbkdf2_sha256
import json
cluster = Cluster(['127.0.0.1'])
session = cluster.connect('yte')

app = FlaskAPI(__name__)

@app.route('/api/user/addDate', methods = ['POST'])
def addDate():
	username = request.get_json(force=True).get('username')
	date = request.get_json(force=True).get('date')

	query = "UPDATE YTE.LATE SET dates = dates + ['" + date + "'] WHERE username = '" + username + "'"
	session.execute(query)
	
	# TO DO, delete ret and return
	ret = {'username': username, 'date': date}
	return ret

@app.route('/api/user/updateDeposit', methods = ['POST'])
def updateDeposit():

	username = request.get_json(force=True).get('username')
	deposit = request.get_json(force=True).get('deposit')

	query = "UPDATE YTE.LATE SET deposit = " + deposit + " WHERE username = '" + username + "'"

	print("QUERY", query)
	session.execute(query)
	# TO DO, delete ret and return
	ret = {'username' : username, 'deposit' : deposit}
	return ret

@app.route('/api/user/deleteDates', methods = ['POST'])
def deleteDates():
	username = request.get_json(force=True).get('username')
	dates = request.get_json(force=True).get('dates')

	print('USERNAME', username)
	print('DATES' , dates)

	query = "UPDATE YTE.LATE SET dates = " + str(dates) + " WHERE username = '" + username + "'"
	print('QUERY', query)

	session.execute(query)

	#TO DO
	return {'name' : 'hi'}

@app.route('/api/admin/fetch/<int:groupid>', methods = ['GET'])
def fetchAdminData(groupid):
	# first fetch users in the same group
	query = "SELECT json users, groupname FROM GROUP where groupid = " + str(groupid)

	queryResult = session.execute(query)

	userlist = []
	
	#TO DO fix this for loop
	for rows in queryResult:
		tmp = json.loads(rows.json)

		groupname = tmp['groupname']
		
		for user in tmp['users']:
			userlist.append(user)
		
	# now, fetch all users data in the same group
	# prepare list for cql
	userlist  = str(userlist).replace('[','(')
	userlist = str(userlist).replace(']', ')')

	query2 = "SELECT json * FROM LATE where username in " + str(userlist)
	queryResult2 = session.execute(query2)

	users = []
	for rows in queryResult2:
		tmp = json.loads(rows.json)

		users.append({
			'username' : tmp['username'], 
			'dates' :  tmp['dates'], 
			'deposit' : tmp['deposit'],
			'email' : tmp['email'],
			'name' : tmp['name'],
			'usertype' : tmp['usertype']
		})
		
	return{
		'groupname' : groupname,
		'users'		: users
	}

@app.route('/api/user/fetch/<string:username>')
def fetchUserData(username):
	print('TODO')
	query = "SELECT json * FROM LATE where username = '" + username + "'"

	print("user query", query) 
	queryResult = session.execute(query)

	# TO DO, get rid of array and for loop

	for row in queryResult:
		tmp = json.loads(row.json)
		return{
			'username' : tmp['username'], 
			'dates' :  tmp['dates'], 
			'deposit' : tmp['deposit'],
			'email' : tmp['email'],
			'name' : tmp['name'],
			'usertype' : tmp['usertype']
		}

# TO DO
@app.route('/api/login/<string:username>/<string:password>', methods = ['GET'])
def login(username, password):

	query = "SELECT * from yte.employee where username = '" + username +"'" 

	try:
		# now, we know the usertype, groupid
		queryResult = session.execute(query)

		# TO DO: get rid of for loop
		for rows in queryResult:
			if(pbkdf2_sha256.verify(password, rows.password)):
				
				return{
					'username' 	: rows.username,
					'usertype' 	: rows.usertype,
					'groupid' 	: rows.groupid
				}
		raise Exception('Username or password invalid')
	except Exception as e:
		return{
			'error' : str(e)
		}

if __name__ == "__main__":
    app.run(debug=True)