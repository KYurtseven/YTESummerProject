# YTESummerProject
2018-Summer-Practice-Project

# How to run
1-	First, initiate app.py in flask directory, when it completes, it only connects to the cassandra. 
	It does not create the database

2- When the initialization is completed, go to '0.0.0.0:5000/api/init' route to initialize database

3- Go to react directory. Run react with "npm start" command

React works on localhost:3000, python/database works on http://127.0.0.1:5000/'

To enable data share between them, use google chrome extension named "Access-Control-Expose-Headers"