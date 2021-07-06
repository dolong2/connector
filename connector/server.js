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
            crypto.randomBytes(64, (err, buf) => {
                crypto.pbkdf2(data.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
                    salt=buf.toString('base64');
                    pw=key.toString('base64');
                    console.log(data);
                    console.log(data.email,pw,data.name,data.jockey,salt);
                    user.query('insert into user value(?,?,?,?,?,?)',[data.email,pw,data.name,data.jockey,salt,null],function(err,result){
                        if(err){
                            console.log(err);
                            response.writeHead(200,{"Content-Type":"text/html"});
                            response.write(register);
                            response.end("<script>alert('중복되는 아이디가 존재합니다.');</script>");
                        }
                        else {
                            response.redirect("/");
                        }
                    });
                });
            });
    });
});
server.get('/findid',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findid);
    response.end();
});
server.post('/findid',function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        user.query("select name from user where name=? and jockey=?",[data.name,data.jockey],function(err,result){
            if(err){
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write(login);
                response.end("<script>alert('등록된 유저가 아닙니다 회원가입을 시도해 보세요');</script>");
            }
            else{
                user.query("select pw from user where name=? and jockey=?",[data.name,data.jockey],function(err,result){
                    var pw=JSON.stringify(result);
                    console.log(pw);
                });
            }
        })
        console.log("name=",data.name);
        console.log("pw=",data.password);
    });
});
server.get('/findpw',function(request,response){
    response.redirect('/findpw.html');
});