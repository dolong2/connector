const express=require('express');
const fs=require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

var db_set=require('../json/db_infor.json');
var mail_set=require('../json/mail_infor.json');
var ejs=require('ejs');
var mysql=require("mysql");
var cookieParser = require('cookie-parser');
const { response } = require('express');
const { request } = require('http');

var Li;
var css;
var css2;
var css3;
var register;
var findid;
var findpw,findpw1,mail_auth,changepw;
var main,view_all_contents,posting,eidtinfor,ranking;
fs.readFile('../public/html/temp_main.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    main=data;
});
fs.readFile('../public/html/Li.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    Li=data;
});
fs.readFile('../public/html/register.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    register=data;
});
fs.readFile('../public/html/findid.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findid=data;
});
fs.readFile('../public/html/findpw.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findpw=data;
});
fs.readFile('../public/html/findpw1.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    findpw1=data;
});
fs.readFile('../public/html/mail_auth.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    mail_auth=data;
});
fs.readFile('../public/html/view_all_contents.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    view_all_contents=data;
});
fs.readFile('../public/html/change_pw.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    changepw=data;
});
fs.readFile('../public/html/posting.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    posting=data;
});
fs.readFile('../public/css/Li.css','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    css=data;
});
fs.readFile('../public/css/posting.css','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    css3=data;
});
fs.readFile('../public/css/main_1.css','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    css2=data;
});
fs.readFile('../public/html/editinfor.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    eidtinfor=data;
});
fs.readFile('../public/html/ranking.html','utf8',function(err,data){
    if(err){
        return console.error(err);
    }
    ranking=data;
});

var user=mysql.createConnection({
    host : db_set.host,
    user : db_set.user,
    password : db_set.password,
    database : db_set.database
});
let transporter=nodemailer.createTransport({
    service: 'gmail',
    // host??? gmail??? ??????
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: mail_set.user,
        pass: mail_set.pass,
    },
});
var server=express();
server.use(cookieParser());
server.use(express.urlencoded({extended: true}));

server.listen(8000,function(){
    console.log("????????????");
});//complete
server.get('/Li.css',function(request,response){
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css);
    response.end();
});//complete
server.get('/main_1.css',function(request,response){
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css2);
    response.end();
});//complete
server.get('/posting.css',function(request,response){
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css3);
    response.end();
});//complete
server.get('/language_graph.png',(request,response)=>{
    console.log("????????? ???????????????");
    fs.readFile('./language_graph.png', function(error,data){
        response.writeHead(200, {"Content-Type":"image/png"});
        response.write(data);
        response.end();
        console.log('????????? ????????????'); 
    });
});//compelete
server.get('/ranking',(request,response)=>{
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(ranking);
    response.end();
});//compelete
server.get('/posting',function(request,response){
    if(request.cookies.id){
        user.query("select *from user where id=?",[request.cookies.id],(err,result)=>{
            response.send(ejs.render(posting,{
                data:result[0]
            }));
        });
    }
    else{
        response.send("<script type='text/javascript'>alert('????????? ?????? ????????????');document.location.href='/';</script>");
    }
});//complete
server.post('/posting',function(request,response){
    user.query('select name from user where id=?',[request.cookies.id],function(err,result){
        user.query('select id from poster order by id desc',function(err,results){
            console.log(result[0].name);
            console.log(request.body.title);
            user.query('insert into poster value(?,?,?,?,?,?)',[results[0].id+1,request.body.title,request.body.content,request.body.option_lang,request.body.option_field,result[0].name],(err,result)=>{
                if(err){
                    response.send('<script type="text/javascript">alert("??? ?????? ??? ????????? ??????????????????");document.location.href="/posting";</script>');
                }
                else {
                    response.send('<script type="text/javascript">alert("?????? ??????????????? ?????????????????????");document.location.href="/";</script>');
                }
            });
        });
    });
});//complete
server.get('/editinfor/:id',(request,response)=>{
    if(request.cookies.id){
        user.query('select *from user where id=?',[request.params.id],(err,result)=>{
            response.send(ejs.render(eidtinfor,{
                data:result[0]
            }));
        });
    }
});//complete
server.get('/main',function(request,response){
    console.log(request.cookies.id);
    if(request.cookies.id){
        user.query("select * from poster",function(err,results){
            user.query("select *from user where id=?",[request.cookies.id],(err,result)=>{
                console.log(result[0].language);
                response.send(ejs.render(main,{
                    main:results,
                    data:result[0]
                }));
            });
        });
    }
    else{
        response.send("<script type='text/javascript'>alert('????????? ?????? ????????????');document.location.href='/';</script>");
    }
});
server.get('/viewallcontents/:id',function(request,response){
    console.log(request.params.id);
    if(request.cookies.id){
        user.query("select *from poster where id=?",[request.params.id],function(err,result){
            response.send(ejs.render(view_all_contents,{
                data:result[0]
            }));
        });
    }
    else{
        response.send('<script type="text/javascript"charset="utf-8">alert("????????? ?????? ????????????");document.location.href="/";</script>');
    }
});//complete
server.get('/',function(request,response){
    if(request.cookies.id){
        response.redirect('/main')
    }
    else{
        response.clearCookie('auth_num');
        response.clearCookie('id_findpw');
        response.clearCookie('changepw');
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(Li);
        response.end();
    }
});//complete
server.post('/',function(request,response){
    console.log(request.body.id);
    user.query("select pw,salt from user where id=?",[request.body.id],function(err,res){
        if(err){response.send("<script type='text/javascript'>alert('???????????? id??? ???????????? ???????????? ????????????????????????');document.location.href='/';</script>");}
        else if(res.length>0){
            console.log("????????? ??????");
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
                    console.log("????????? ??????~!");
                    response.cookie('id',request.body.id);
                    response.send("<script>alert('????????? ???????????????');document.location.href='/main';</script>");
                }
                else{
                    console.log("????????? ??????");
                    response.send("<script type='text/javascript'>alert('??????????????? ?????? ????????????????????? ????????????????????????');document.location.href='/';</script>");
                }
            });
            //console.log(id);
        }
        else{
            response.send("<script type='text/javascript'>alert('???????????? id??? ???????????? ???????????? ????????????????????????');document.location.href='/';</script>");
        }
    });
});//complete
server.get('/register',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(register);
    response.end();
});//complete
server.post('/register',function(request,response){
    console.log(request.body.password);
    var pw,salt;
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(request.body.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
            salt=buf.toString('base64');
            pw=key.toString('base64');
            console.log(request.body.email,pw,request.body.name,request.body.jockey,salt,request.body.language,request.body.class);
            user.query('insert into user value(?,?,?,?,?,?,?)',[request.body.email,pw,request.body.name,request.body.jockey,salt,request.body.language,request.body.class],function(err,result){
                if(err){
                    response.send("<script type='text/javascript'>alert('???????????? ???????????? ???????????????.');document.location.href='/register'</script>");
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
});//complete
server.post('/findid',function(request,response){
        user.query("select id,pw,salt from user where name=? and jockey=?",[request.body.name,request.body.jockey],function(err,result){
            if(err){
                response.send("<script>alert('????????? ????????? ???????????? ??????????????? ????????? ?????????');document.location.href='/';</script>");
            }
            else if (result.length > 0) {
                console.log(result[0].id);
                crypto.pbkdf2(request.body.password,result[0].salt,100000, 64, 'sha512',(err,key)=>{
                    var pw = key.toString('base64');
                    if(pw==result[0].pw){
                        response.send("<script>alert('????????? ????????????"+result[0].id+"?????????');document.location.href='/';</script>");
                    }
                    else{
                        response.send("<script>alert('??????????????? ???????????? ????????????');document.location.href='/findid';</script>");
                    }
                 });
            } else {
                response.send('<script type="text/javascript">alert("????????? ????????? ???????????? ????????????."); document.location.href="/findid";</script>');
            } 
        });
});//complete
server.get('/findpw',function(request,response){
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(findpw);
    response.end();
});//complete
server.post('/findpw',function(request,response){
    console.log(request.body.id);
    user.query("select id from user where id=?",[request.body.id],function(err,result){
        if(err){
            response.send("<script type='text/javascript'>alert('?????? ?????????????????? ?????????');document.location.href='/findpw';</script>");
        }
        else if(result.length>0){
            response.cookie('id_findpw',request.body.id);
            response.send("<script type='text/javascript'>document.location.href='/mail_auth';</script>");
        }
        else{
            response.send("<script type='text/javascript'>alert('???????????? ???????????? ????????????????????????');document.location.href='/findpw';</script>");
        }
    });
});//complete
server.get('/mail_auth',function(request,response){
    if(request.cookies.id_findpw){
        response.clearCookie('auth_num');
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(mail_auth);
        response.end();
    }
    else{
        response.send('<script type="text/javascript">alert("??????????????? ?????????");document.location.href="/";</script>');
    }
});//complete
server.post('/mail_auth',function(request,response){
    console.log(request.body.mail);
    var auth_num=Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    console.log(auth_num);
    let info = transporter.sendMail({
        from: `"Connector Team" <${mail_set.user}>`,
        to: request.body.mail,
        subject: '??????',
        text: '?????? ????????????',
        html: `<b>????????????:${auth_num}</b>`,
    });
    response.cookie('auth_num',auth_num);
    response.send('<script type="text/javascript">alert("??????????????? ??????????????????");document.location.href="/findpw|";</script>');
});//complete
server.get('/logout',function(request,response){
    response.clearCookie('auth');
    response.clearCookie('id');
    response.send('<script>alert("???????????? ???????????????");document.location.href="/";</script>');
});//complete
server.get('/changepw',function(request,response){
    if(request.cookies.changepw){
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(changepw);
        response.end();
    }
    else{
        response.send('<script type="text/javascript">alert("??????????????? ?????????");document.location.href="/";</script>');
    }
});//complete
server.post('/changepw',function(request,response){
    if(request.cookies.changepw){
        user.query('select salt from user where id=?',[request.cookies.id_findpw],function(err,result){
            crypto.pbkdf2(request.body.password, result[0].salt, 100000, 64, 'sha512', (err, key) => {
                pw=key.toString('base64');
                user.query('update user set pw=? where id=?',[pw,request.cookies.id_findpw]);
            });
        });
        response.send('<script>alert("??????????????? ??????????????? ?????????????????????");document.location.href="/";</script>');
    }
});//complete
server.get('/findpw|',function(request,response){
    if(request.cookies.id_findpw&&request.cookies.auth_num){
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(findpw1);
        response.end();
    }
    else{
        response.send('<script type="text/javascript">alert("??????????????? ?????????");document.location.href="/";</script>');
    }
});//compelete
server.post('/findpw|',function(request,response){
    console.log("/findpw| ?????????");
    console.log(request.body.num);
    if(request.body.num==request.cookies.auth_num){
        response.clearCookie('auth_num');
        response.cookie('changepw',true);
        response.send('<script type="text/javascript">alert("??????????????? ?????????????????????");document.location.href="/changepw";</script>');
    }
    else{
        response.clearCookie('auth_num');
        response.send('<script type="text/javascript">alert("??????????????? ????????????????????????");document.location.href="/findpw|";</script>');
    }
});//complete
//test
