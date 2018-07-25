# -*-coding: utf-8 -*-
import os
import json
from flask import session, redirect, url_for, escape, request
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
from passlib.hash import pbkdf2_sha256
from initiate_db import init_db

app = FlaskAPI(__name__)
## For connecting the database
cluster, c_session = 0, 0

# FOR NOW, DELETE WHEN DEPLOYMENT
#cluster = Cluster([os.environ.get('CASSANDRA_PORT_9042_TCP_ADDR', 'localhost')],
#                      port=int(os.environ.get('CASSANDRA_PORT_9042_TCP_PORT', 9042)))
#c_session = cluster.connect('yte')


@app.route('/api/admin/addDateForSingleUser', methods = ['POST'])
def addDateForSingleUser():
	username = request.get_json(force=True).get('username')
	date = request.get_json(force=True).get('date')

	queryDeposit = "SELECT deposit from YTE.LATE " + \
			" WHERE username = '" + username + "'"
	
	deposit = 0
	depositResult = c_session.execute(queryDeposit)
	
	for rows in depositResult:
		deposit = rows.deposit
	# update deposit
	deposit = deposit - 5

	query = "UPDATE YTE.LATE SET dates = dates + ['" + date + "'], " + \
			" deposit = " + str(deposit) + " WHERE username = '" + username + "'" 
	
	c_session.execute(query)
	return {}

@app.route('/api/admin/addDateForMultiUser', methods = ['POST'])
def addDateForMultiUser():

	usernames = request.get_json(force=True).get('usernames')
	date = request.get_json(force=True).get('date')
	for user in usernames:

		queryDeposit = "SELECT deposit from YTE.LATE " + \
			" WHERE username = '" + user + "'"
	
		deposit = 0
		depositResult = c_session.execute(queryDeposit)
		
		for rows in depositResult:
			deposit = rows.deposit

		# update deposit
		deposit = deposit - 5
		
		query = "UPDATE YTE.LATE SET dates = dates + ['" + date + "'], " + \
			" deposit = " + str(deposit) + " WHERE username = '" + user + "'" 
	
		c_session.execute(query)	
	return {}

@app.route('/api/admin/updateDeposit', methods = ['POST'])
def updateDeposit():

	username = request.get_json(force=True).get('username')
	deposit = request.get_json(force=True).get('deposit')

	query = "UPDATE YTE.LATE SET deposit = " + deposit + " WHERE username = '" + username + "'"

	print("QUERY", query)
	c_session.execute(query)

	return {}

@app.route('/api/admin/deleteDates', methods = ['POST'])
def deleteDates():
	username = request.get_json(force=True).get('username')
	dates = request.get_json(force=True).get('dates')

	print('USERNAME', username)
	print('DATES' , dates)

	query = "UPDATE YTE.LATE SET dates = " + str(dates) + " WHERE username = '" + username + "'"
	print('QUERY', query)

	c_session.execute(query)

	return {}

@app.route('/api/general/updateEmail', methods = ['POST'])
def updateEmail():
	username = request.get_json(force=True).get('username')
	newmail = request.get_json(force=True).get('email')

	query = "UPDATE YTE.LATE SET email = '" + newmail + "' WHERE username = '" + username + "'"

	try:
		# now, we know the usertype, groupid
		c_session.execute(query)
	except Exception as e:
		return{
			'error' : str(e)
		}
	
	return {}

@app.route('/api/general/changePassword', methods =['POST'])
def changePassword():
	print('session password' , session)
	username = request.get_json(force=True).get('username')
	newpassword = request.get_json(force=True).get('password')

	hashpassword = pbkdf2_sha256.hash(newpassword)

	query = "UPDATE EMPLOYEE SET password = '" + hashpassword + "' " + \
			" WHERE username = '" + username + "'"

	c_session.execute(query)

	return {}

@app.route('/api/admin/addUser', methods = ['POST'])
def addUser():
	username = request.get_json(force=True).get('username')
	groupid = request.get_json(force=True).get('groupid')
	email = request.get_json(force=True).get('email')
	password = request.get_json(force=True).get('password')
	name = request.get_json(force=True).get('name')
	usertype = 'user'
	
	# first, check whether there is a user with that name
	queryCheck = "SELECT username from YTE.EMPLOYEE where username = '" + username + "'"

	try:
		a = c_session.execute(queryCheck)
		for row in a:
			raise Exception('Username ' + username + ' exists')
	except Exception as e:
		return{
			'error' : str(e)
		}
	hashpassword = pbkdf2_sha256.hash(password)

	#add employee
	queryAddEmployee = 	"INSERT INTO YTE.EMPLOYEE (username, password, usertype) " + \
						" VALUES('" + username + "', '" + hashpassword + "'" + \
						", '" + usertype + "')"
	
	c_session.execute(queryAddEmployee)

	# now create late data for that employee
	deposit = 50
	queryAddLate =  "INSERT INTO YTE.LATE (username, deposit, email, name, usertype) " +\
					" VALUES ('" + username + "', " + str(deposit) + ", '" + email + "'" +\
					", '" + name + "', '" + usertype + "')"
	c_session.execute(queryAddLate)

	# now add this user to the admin's group
	
	queryAddGroup = "UPDATE YTE.GROUP SET users = users + ['" + username + "'] WHERE groupid = " + str(groupid)
	c_session.execute(queryAddGroup)

	return {'error' : ''}

@app.route('/api/admin/fetch/<int:groupid>', methods = ['GET'])
def fetchAdminData(groupid):
	# first fetch users in the same group
	query = "SELECT json users, groupname FROM GROUP where groupid = " + str(groupid)

	queryResult = c_session.execute(query)

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
	queryResult2 = c_session.execute(query2)

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
	queryResult = c_session.execute(query)

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

@app.route('/api/login/<string:username>/<string:password>', methods = ['GET'])
def login(username, password):

	query = "SELECT * from yte.employee where username = '" + username +"'" 

	try:
		# now, we know the usertype, groupid
		queryResult = c_session.execute(query)

		# TO DO: get rid of for loop
		for rows in queryResult:
			if(pbkdf2_sha256.verify(password, rows.password)):
				
				#session['username'] = rows.username 
				#print('session' , session)
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

@app.route('/api/init', methods = ['GET'])
def init():
	global cluster, c_session
	cluster = Cluster([os.environ.get('CASSANDRA_PORT_9042_TCP_ADDR', 'localhost')],
                      port=int(os.environ.get('CASSANDRA_PORT_9042_TCP_PORT', 9042)))
	c_session = cluster.connect()
	init_db(cluster, c_session)
	c_session = cluster.connect('yte')
	return "The database has been initiated!"
	
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5000, debug=True)