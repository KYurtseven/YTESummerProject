'''
import json

json_data = '[{"username": "u3", "dates": ["2010-11-11"], "deposit": 50.0, "email": "u3@u3.com", "name": "n3", "usertype": "user"}, {"username": "u3", "dates": ["2010-11-11"], "deposit": 50.0, "email": "u3@u3.com", "name": "n3", "usertype": "user"}]'
loaded_json = json.loads(json_data)

print(loaded_json[0]['username'])
ret = []

for item in loaded_json:
    print("item", item)
    tmp = {'username' : None, 'dates' : None}
    tmp['username'] = item['username']
    tmp['dates'] = item['dates']
    ret.append(tmp)
print("ret",ret)

'''
from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from cassandra.cluster import Cluster
import json

cluster = Cluster(['127.0.0.1'])
session = cluster.connect('yte')

app = FlaskAPI(__name__)



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

print(ret)