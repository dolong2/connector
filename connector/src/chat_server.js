const express=require('express');
const fs=require('fs');
const app = express();
const http = require("http");
const server = http.createServer(app);
var io=require('socket.io')(server);
var db_set=require('../db_infor.json');
var mysql=require("mysql");

let roomname;
var user=mysql.createConnection({
    host : db_set.host,
    user : db_set.user,
    password : db_set.password,
    database : db_set.database
});
app.get("/:id", (req, res) => {
    if(req.url=='/chat.js'){
        fs.readFile("../public/chat.js", (error, data) => {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.end(data);
        });
    }
    else if(req.url=='/chat.css'){
        fs.readFile("../public/chat.css", (error, data) => {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        });
    }
    else{
        fs.readFile("../public/chat.html", (error, data) => {
            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
        roomname=req.params.id;
    }
});
io.sockets.on("connection", (socket) => {
    console.log('연결!');
    console.log(roomname);
    socket.join(roomname);
    socket.on('in',(name)=>{
        console.log(name.name);
        user.query('select name from user where id=?',[name.name],(err,result)=>{
            console.log(result[0].name);
            io.to(roomname).emit('in',result[0].name);
        });
    })
    socket.on("message", data => {
        user.query("select name from user where id=?",[data.name],function(err,result){
            console.log(data.name);
            console.log(result[0].name);
            console.log(data.content);
            io.to(roomname).emit("message", result[0].name,data.content);
            console.log("메세지가 보내짐");
        });
    });
    socket.on('disconnect',()=>{
        console.log('연결이 끊김');
        io.to(roomname).emit('exit_chat');
    });
});

server.listen(8085,function(){
    console.log("채팅 서버실행");
});
