const express=require('express');
const fs=require('fs');
const querystring=require("querystring");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

var mysql=require("mysql");
//const { response } = require('express');

var Li;
var css;
var register;
var findid;
var findpw,findpw1,findpw2;
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
var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'qazwsxedc9070@',
    database: 'users'
}
var user=mysql.createConnection(db_info);
var transporter = nodemailer.createTransport({  // transporter 에서 보낼 메일아이디와 비번 설정
    service: 'gmail', // 이메일 보내는 서비스 주소
    auth: {
        user:'bodercoding@gmail.com',
        pass:'wety4566@'
    }
})
var server=express();
server.listen(8080,function(){
    console.log("서버실행");
});
//server.use(cookieParse());
server.get('/',function(request,response){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(Li);
    response.end();
});//complete
server.post('/',function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        console.log(data.id);
        user.query("select pw,salt from user where id=?",[data.id],function(err,res){
            if(err){response.send("<script type='text/javascript'>alert('입력하신 id가 존재하지 않습니다 다시입력해주세요');document.location.href='/';</script>");}
            else if(res.length>0){
                console.log("아이디 정확");
                var temp=JSON.stringify(res);
                var infor=temp.split(',');
                //console.log(infor[0]);
                //console.log(infor[1]);
                var pw=infor[0].substring(8,infor[0].length-1);
                var salt=infor[1].substring(8,infor[1].length-3);
                console.log(pw);
                console.log(salt);
                crypto.pbkdf2(data.password, salt, 100000, 64, 'sha512',function(err, key){
                    var hashed = key.toString('base64');
                    console.log(hashed);
                    if(hashed==pw){
                        console.log("로그인 성공~!");
                        response.cookie('auth',true);
                        response.cookie('id',data.id);
                        response.send("<script>alert('로그인 되셨습니다');document.location.href='/';</script>");
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
    request.on('data',function(oreder){
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
});//complete
server.get('/findid',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findid);
    response.end();
});//complete
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
});//complete
server.get('/findpw',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw);
    response.end();
});
server.post('/findpw',function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        console.log(data.id);
        user.query("select id from user where id=?",[data.id],function(err,result){
            if(err){
                response.send("<script type='text/javascript'>alert('ㅅㅂ 프로젝트하기 ㅈ같다');document.location.href='/findpw';</script>");
            }
            else if(result.length>0){
                response.redirect('/findpw1');
            }
            else{
                response.send("<script type='text/javascript'>alert('입력하신 아이디가 존재하지않습니다');document.location.href='/findpw';</script>");
            }
        });
    });
});
server.get('/findpw1',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw1);
    response.end();
});
server.post('/findpw1',function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        console.log(data.id);
    });
});
server.post('/sendemail',async function(request,response){
    request.on('data',function(oreder){
        var data=querystring.parse(oreder.toString());
        console.log(data.email1);
        var mailOption = { // 메일 옵션  설정
            from: 'k01066624566@gmail.com',  // 보내는사람
            to: data.emial,
            subject: '[Connector] 이메일 인증',
            html: '<p>아래의 링크를 클릭해서 인증해주센!</p>' // html 코드세팅
        }
        transporter.sendMail(mailOption, function(err, res){ // 메일 발송
            if (err) {
                console.log(err);
            } else {
                console.log('이메일발송성공');
                response.send("<script type='text/javascript'>alert('인증번호가 보내졌습니다');document.location.href='/findpw1';</script>");
            }
            transporter.close();
        });
    });
});