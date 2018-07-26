# YTESummerProject
2018-Summer-Practice-Project

# How to run
1- Install docker and docker-compose

	If the installed machine has Windows, save CSV files as ANSI,
	if the installed machine has Linux, save CSV files as UTF8.

	CSV files are under src/flask/ directory. They are needed for initializing the database. If the correct format is not given, strings with non-english characters will not be rendered properly.

2- In root directory, type the following code to the terminal:	
	docker-compose up --build

	This will install all dependencies, libraries and packages for our application.

3- If this is the first the time that the app is initialized, you need to go to the following address after docker-compose up starts listening
	http://127.0.0.1:8080/api/createDatabase

	This command will create 3 tables and create users.

4- If this is not the first time that the app is initialized, meaning that something happened and server is closed and it needs to be reopened, you need to go the following address
	http://127.0.0.1:8080/api/init

	That means, after any change in app.py, you must need to go to that address to initiate app.py
	
5- After completing these steps, go to the following address to enjoy your app
	http://127.0.0.1
	or which ip that your app is deployed in the local network

	default usernames are : uguralgul, hasancagritras etc.
	default passwords are : 123

6- If you cannot connect to the Flask from React, React configurations is under React/src/GlobalPages/Constants.js
	You can change the API address in that file.
	Change LOCAL_ROOT to the address in step 5.
