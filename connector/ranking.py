import pymysql
import matplotlib.pyplot as plt
import numpy as np
import json

with open('connector/db_infor.json')as json_file:
        json_data=json.load(json_file)
        
juso_db=pymysql.connect(
    user='root', 
    passwd='qazwsxedc9070@', 
    host='172.30.1.40', 
    db='users', 
    charset='utf8'
)
cursor=juso_db.cursor(pymysql.cursors.DictCursor)
sql="select language from poster"
cursor.execute(sql)
result=cursor.fetchall()
#print(result[0]['language'])
for a in result:
    print(a['language'])