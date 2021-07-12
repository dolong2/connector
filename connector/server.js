const express=require('express');
const fs=require('fs');
const querystring=require("querystring");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser=require('body-parser');

var db_set=require('./db_infor.json');
var ejs=require('ejs');
var mysql=require("mysql");
var cookieParser = require('cookie-parser');
const { response } = require('express');
//const { response } = require('express');

var Li;
var css;
var register;
var findid;
var findpw,findpw1,findpw2;
var main;
var view_all_contents;
fs.readFile('temp_main.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    main=data;
});
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
fs.readFile('findpw1.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findpw1=data;
});
fs.readFile('findpw2.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findpw2=data;
});
fs.readFile('view_all_contents.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    view_all_contents=data;
});
var user=mysql.createConnection({
    host : db_set.host,
    user : db_set.user,
    password : db_set.password,
    database : db_set.database
});
var server=express();
server.use(cookieParser());
server.use(express.urlencoded({extended: true}));

server.listen(8080,function(){
    console.log("서버실행");
});
server.get('/main',function(request,response){
    console.log(request.cookies.auth);
    if(request.cookies.auth){
        user.query("select * from poster",function(err,result){
            response.send(ejs.render(main,{
                main:result
            }));
        });
    }
});
server.get('/viewallcontents/:id',function(request,response){
    console.log(request.params.id);
    if(request.cookies.auth){
        user.query("select *from poster where id=?",[request.params.id],function(err,result){
            response.send(ejs.render(view_all_contents,{
                data:result[0]
            }));
        });
    }
});
server.get('/',function(request,response){
    if(request.cookies.auth){
        response.redirect('/main')
    }
    else{
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(Li);
        response.end();
    }
});//complete
server.post('/',function(request,response){
    console.log(request.body.id);
    user.query("select pw,salt from user where id=?",[request.body.id],function(err,res){
        if(err){response.send("<script type='text/javascript'>alert('입력하신 id가 존재하지 않습니다 다시입력해주세요');document.location.href='/';</script>");}
        else if(res.length>0){
            console.log("아이디 정확");
            var temp=JSON.stringify(res);
            var infor=temp.split(',');
            var pw=infor[0].substring(8,infor[0].length-1);
            var salt=infor[1].substring(8,infor[1].length-3);
            console.log(pw);
            console.log(salt);
            crypto.pbkdf2(request.body.password, salt, 100000, 64, 'sha512',function(err, key){
                var hashed = key.toString('base64');
                console.log(hashed);
                if(hashed==pw){
                    console.log("로그인 성공~!");
                    response.cookie('auth',true);
                    response.cookie('id',request.body.id);
                    response.send("<script>alert('로그인 되셨습니다');document.location.href='/main';</script>");
                }
                else{
                    console.log("로그인 실패");
                    response.send("<script type='text/javascript'>alert('패스워드를 잘못 입력하셨습니다 다시입력해주세요');document.location.href='/';</script>");
                }
            });
            //console.log(id);
        }
        else{
            response.send("<script type='text/javascript'>alert('입력하신 id가 존재하지 않습니다 다시입력해주세요');document.location.href='/';</script>");
        }
    });
});//complete
server.get('/register',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(register);
    response.end();
});//complete
server.get('/Li.css',function(request,response){
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css);
    response.end();
});//complete
server.post('/register',function(request,response){
    console.log(request.body.password);
    var pw,salt;
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(request.body.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
            salt=buf.toString('base64');
            pw=key.toString('base64');
            console.log(request.body.email,pw,request.body.name,request.body.jockey,salt);
            user.query('insert into user value(?,?,?,?,?,?)',[request.body.email,pw,request.body.name,request.body.jockey,salt,null],function(err,result){
                if(err){
                    response.send("<script type='text/javascript'>alert('중복되는 아이디가 존재합니다.');document.location.href='/register'</script>");
                }
                else {
                    response.redirect("/");
                }
            });
        });
    });
});//complete
server.get('/findid',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findid);
    response.end();
});//need fix
server.post('/findid',function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        user.query("select name from");
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
});//need fix
server.get('/findpw',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw);
    response.end();
});//complete
server.post('/findpw',function(request,response){
    console.log(request.body.id);
    user.query("select id from user where id=?",[request.body.id],function(err,result){
        if(err){
            response.send("<script type='text/javascript'>alert('ㅅㅂ 프로젝트하기 ㅈ같다');document.location.href='/findpw';</script>");
        }
        else if(result.length>0){
            response.redirect('/findpw|');
        }
        else{
            response.send("<script type='text/javascript'>alert('입력하신 아이디가 존재하지않습니다');document.location.href='/findpw';</script>");
        }
    });
});//complete
server.get('/findpw|',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw1);
    response.end();
});//complete
server.post('/findpw|',function(request,response){
    console.log("/findpw| 실행됨");
});
server.post('/send_email',function(request,response){
    console.log("실행됨");
    console.log(request.body.mail);
});