import pymysql
import matplotlib.pyplot as plt
import numpy as np
import json

with open('home_connector/db_infor.json')as json_file:
        json_data=json.load(json_file)
        
juso_db=pymysql.connect(
    user=json_data["user"], 
    passwd=json_data["password"], 
    host=json_data["host"], 
    db=json_data["database"], 
    charset='utf8'
)

lang={"C":0,"C++":0,"C#":0,"Python":0,"Java":0,"JavaScript":0,"Kotlin":0,"Swift":0,"Html":0}

cursor=juso_db.cursor(pymysql.cursors.DictCursor)
sql="select language from poster"
cursor.execute(sql)
result=cursor.fetchall()

for a in result:
    lang[a['language']]+=1

top3=sorted(lang.items(), key=lambda x: x[1], reverse=True)[0:3]
top3=dict(top3)
lang_top3=list(top3.keys())
lang_value_top3=list(top3.values())

x=np.arange(3)

plt.bar(x, lang_value_top3)
plt.xticks(x, lang_top3)
plt.savefig('connector/graph.png')
plt.show()