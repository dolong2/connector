const express=require('express');
const fs=require('fs');
const querystring=require("querystring");
const crypto = require('crypto');

var mysql=require("mysql");
const { response } = require('express');

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
                    //console.log(data);
                    console.log(data.email,pw,data.name,data.jockey,salt);
                    user.query('insert into user value(?,?,?,?,?,?)',[data.email,pw,data.name,data.jockey,salt,null],function(err,result){
                        if(err){
                            response.send("<script type='text/javascript'>alert('중복되는 아이디가 존재합니다.');document.location.href='/register'</script>");
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
                response.send("<script>alert('등록된 유저가 아닙니다 회원가입을 시도해 보세요');document.location.href='/';</script>");
            }
            else if (result.length > 0) {
                user.query("select pw from user where name=? and jockey=?",[data.name,data.jockey],function(err,result){
                    if(err){
                        response.send('<script type="text/javascript">alert("입력한 정보가 올바르지 않습니다");document.location.href="/findid";</script>');
                    }
                    else {
                        user.query("select salt from user where name=? and jockey=?",[data.name,data.jockey],function(err,res){
                            if(err){
                            }
                            else if(result.length>0){
                                var salt_temp=JSON.stringify(res);
                                var salt=salt_temp.split(',');
                                if(salt.length==1){
                                    salt[0]=salt[0].substring(10,salt[0].length-3);    
                                }
                                else{
                                    salt[0]=salt[0].substring(10,salt[0].length-2);
                                    console.log(salt.length);
                                    for(var i=1;i<salt.length-2;i++){
                                        salt[i]=salt[i].substring(9,salt[i].length-2);
                                    }
                                    salt[salt.length-1]=salt[salt.length-1].substring(9,salt[i].length-3);
                                }
                                crypto.pbkdf2(data.password, salt[0], 100000, 64, 'sha512',function(err, key){
                                    var hashed = key.toString('base64');
                                    console.log("hashed_pw:",hashed);
                                    user.query("select id from user where pw=?",[hashed],function(err,results){
                                        if(err)response.send('<script type="text/javascript">alert("입력한 패스워드가 일치하지 않습니다");document.location.href="/findid";</script>');
                                        else if(result.length>0){
                                            var id_temp=JSON.stringify(results);
                                            var id=id_temp.split(',');
                                            id[0]=id[0].substring(8,id[0].length-3);
                                            console.log(id[0]);
                                            if(id=='[]'){
                                                response.send('<script type="text/javascript">alert("입력한 패스워드가 일치하지 않습니다");document.location.href="/findid";</script>');
                                            }
                                            else{
                                                response.send('<script type="text/javascript">alert("아이디는'+id[0]+'입니다");document.location.href="/";</script>');
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            } else {              
                
                response.send('<script type="text/javascript">alert("입력한 정보가 일치하지 않습니다."); document.location.href="/findid";</script>');
            } 
        });
    });
});
server.get('/findpw',function(request,response){
    response.redirect('/findpw.html');
});