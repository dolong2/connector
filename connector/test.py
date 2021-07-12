import pymssql

# DB 서버 주소
server = '3306'
# 데이터 베이스 이름
database = 'users'
# 접속 유저명
username = 'root'
# 접속 유저 패스워드
password = 'qazwsxedc9070@'

# MSSQL 접속
cnxn =  pymssql.connect(server , username, password, database)
cursor = cnxn.cursor()
 
# SQL문 실행
cursor.execute('SELECT * FROM TEST;')

# 데이타를 하나씩 Fetch하여 출력
row = cursor.fetchone()

while row:
    print(row[0], row[1],  row[2])
    row = cursor.fetchone()

# 연결 끊기
cnxn.close()