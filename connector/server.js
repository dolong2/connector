const express=require('express');
const fs=require('fs');
const querystring=require("querystring");
const crypto = require('crypto');

var mysql=require("mysql");

var Li;
var css;
var register;
var findid;
var findpw;
fs.readFile('Li.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    Li=data;
});
fs.readFile('Li.css','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    css=data;
});
fs.readFile('register.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    register=data;
});
fs.readFile('findid.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findid=data;
});
fs.readFile('findpw.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findpw=data;
});
var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'qazwsxedc9070@',
    database: 'users'
}
var user=mysql.createConnection(db_info);

var server=express();
server.listen(8080,function(){
    console.log("서버실행");
});
server.get('/',function(request,response){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(Li);
    response.end();
});
server.get('/register',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(register);
    response.end();
});
server.get('/Li.css',function(request,response){
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css);
    response.end();
});
server.post('/register',function(request,response){
    request.on('data',function(oreder){
        console.log(oreder.toString());
            var data=querystring.parse(oreder.toString());
            var pw,salt;
            var checkid=user.query('select id from user where id=?',[data.email]).values.toString();
            if(data.email==''||data.password==''||data.name==''||data.jockey==''){
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write(register);
                response.end("<script>alert('정보를 덜 입력하셨습니다.');</script>");
            }
            else if(checkid==data.email){

                response.writeHead(200,{"Content-Type":"text/html"});
                response.write(register);
                response.end("<script>alert('중복되는 아이디가 존재합니다.');</script>");
            }
            else{
                crypto.randomBytes(64, (err, buf) => {
                        crypto.pbkdf2(data.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
                        salt=buf.toString('base64');
                        pw=key.toString('base64');
                        console.log(data);
                        console.log(data.email,pw,data.name,data.jockey,salt);
                        user.query('insert into user value(?,?,?,?,?)',[data.email,pw,data.name,data.jockey,salt]);
                    });
                    response.redirect("/");
                });
            }
    });
});
server.get('/findid',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findid);
    response.end();
});
server.get('/findpw',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw);
    response.end();
});
server.post('/checkid',function(request,response){
    req.on('data', function(chunk){
        console.log(chunk.toString());
        var data = querystring.parse(chunk.toString());
        
    });
    response.redirect("/findid");
});