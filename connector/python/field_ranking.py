import pymysql
import matplotlib.pyplot as plt
import numpy as np
import json

from pymysql import cursors

with open('home_connector/db_infor.json')as json_file:
    json_data=json.load(json_file)

jusodb=pymysql.connect(
    user=json_data["user"], 
    passwd=json_data["password"], 
    host=json_data["host"], 
    db=json_data["database"], 
    charset='utf8'
)

field={"Front_end":0,"Back_end":0,"Android":0,"Ios":0,"A.I":0,"Game":0}

cursor=jusodb.cursor(pymysql.cursors.DictCursor)
sql="select class from poster"
cursor.execute(sql)
result=cursor.fetchall()

for a in result:
    field[a['class']]+=1

top5=sorted(field.items(),key=lambda x:x[1],reverse=True)[0:5]
top5=dict(top5)
top5_field=list(top5.keys())
top5_value_field=list(top5.values())

x=np.arange(5)

plt.bar(x,top5_value_field)
plt.xticks(x,top5_field)
plt.savefig('connector/field_graph')
plt.show()