import csv
from cassandra.cluster import Cluster
from passlib.hash import pbkdf2_sha256

cluster = Cluster(['127.0.0.1'])

session = cluster.connect()

createKeySpace = "CREATE KEYSPACE IF NOT EXISTS YTE " + \
				" WITH REPLICATION = {" + \
				" 'class' : 'SimpleStrategy'," + \
				" 'replication_factor' : 1" + \
				"};"
session.execute(createKeySpace)

createEmployeeTable = "CREATE TABLE IF NOT EXISTS YTE.EMPLOYEE(" +\
			" username text PRIMARY KEY, " +\
			" password text, " +\
			" usertype text, " + \
			" groupid int);"

session.execute(createEmployeeTable)

with open('mockuserdata.csv', 'r') as csvfile:
	f = csv.reader(csvfile, delimiter = '|')
	for row in f:
		username = row[0]
		password = row[1]
		usertype = row[2]
		groupid = row[3]
		hashpassword = pbkdf2_sha256.hash(password)

		insert = "INSERT INTO YTE.EMPLOYEE(username, password, usertype, groupid) " + \
				" VALUES('" + username + "', '" + hashpassword + "'" +\
				", '" + usertype + "', " + groupid + ") IF NOT EXISTS;"

		session.execute(insert)


createLateTable = "CREATE TABLE IF NOT EXISTS YTE.LATE( " + \
			" username text PRIMARY KEY, " + \
			" name varchar, " + \
			" usertype text, " + \
			" email text, " + \
			" dates list<date>, " + \
			" deposit double);"

session.execute(createLateTable)

with open('mocklatedata.csv', 'r') as csvfile:
	f = csv.reader(csvfile, delimiter = '|')
	for row in f:
		username = row[0]
		name = row[4]
		date = row[1]
		deposit = row[2]
		email = row[3]
		usertype = row[5]
		
		insert = "INSERT INTO YTE.LATE(username, name, dates, deposit, email, usertype) " +\
			"VALUES ('" + username + "','" + name + "'," + date + \
			"," + deposit + ",'" + email + "', '" + usertype + "')IF NOT EXISTS;"
		
		session.execute(insert)


createGroupTable = "CREATE TABLE IF NOT EXISTS YTE.GROUP( " +\
			" groupid int PRIMARY KEY, " + \
			" groupname text, " + \
			" users list<text>);"

session.execute(createGroupTable)


with open('mockgroupdata.csv', 'r') as csvfile:
	f = csv.reader(csvfile, delimiter = '|')
	for row in f:
		groupid = row[0]
		users = row[1]
		groupname = row[2]
		insert = "INSERT INTO YTE.GROUP(groupid, users, groupname) " + \
				"VALUES (" + groupid + ", " + users + ", '" + groupname + "' ) IF NOT EXISTS;"
		#print("INSERT: ", insert)
		session.execute(insert)