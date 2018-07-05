import csv
from cassandra.cluster import Cluster

cluster = Cluster(['127.0.0.1'])

session = cluster.connect()

createKeySpace = "CREATE KEYSPACE IF NOT EXISTS YTE " + \
				" WITH REPLICATION = {" + \
				" 'class' : 'SimpleStrategy'," + \
				" 'replication_factor' : 1" + \
				"};"
session.execute(createKeySpace)
'''
alterKeySpace = "ALTER KEYSPACE YTE " + \
				" WITH REPLICATION = {" + \
				" 'class' : 'SimpleStrategy'," + \
				" 'replication_factor' : 1" + \
				"};"

session.execute(alterKeySpace)
'''				
createTable = "CREATE TABLE IF NOT EXISTS YTE.LAZY_EMPLOYEES( " + \
			" username text PRIMARY KEY, " + \
			" name text, " + \
			" usertype text, " + \
			" email text, " + \
			" dates list<date>, " + \
			" deposit double);"

session.execute(createTable)


with open('mockdata.csv', 'r') as csvfile:
	f = csv.reader(csvfile, delimiter = '|')
	for row in f:
		username = row[0]
		name = row[4]
		date = row[1]
		deposit = row[2]
		email = row[3]
		type = row[5]
		
		insert = "INSERT INTO YTE.LAZY_EMPLOYEES(username, name, dates, deposit, email, usertype) " +\
			"VALUES ('" + username + "','" + name + "'," + date + \
			"," + deposit + ",'" + email + "', '" + type + "')IF NOT EXISTS;"
		session.execute(insert)