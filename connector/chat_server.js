const express=require('express');
const fs=require('fs');
const app = express();
const http = require("http");
var cookieParser = require('cookie-parser');
const server = http.createServer(app);
var io=require('socket.io')(server);
var db_set=require('./db_infor.json');
var mysql=require("mysql");

var roomname;
var user=mysql.createConnection({
    host : db_set.host,
    user : db_set.user,
    password : db_set.password,
    database : db_set.database
});
app.get("/:id", (req, res) => {
    fs.readFile("./chat.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
    roomname=req.params.id;
});

io.sockets.on("connection", (socket) => {
    console.log('연결!');
    console.log(roomname);
    socket.on("message", data => {
        user.query("select name from user where id=?",[data.name],function(err,result){
            console.log(data.name);
            console.log(result[0].name);
            console.log(data.content);
            io.sockets.emit("message", result[0].name,data.content);
        });
    });
});
var namespace = io.of('/balmostory');
namespace.on('connection',(Socket)=>{
    console.log('success')
    Socket.emit('message','hello')
})

server.listen(8085,function(){
    console.log("채팅 서버실행");
});
