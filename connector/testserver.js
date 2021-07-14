const express=require('express');
const fs=require('fs');
const app = express();
const http = require("http");
const server = http.createServer(app);
var io=require('socket.io')(server);
app.get("/", (req, res) => {
    fs.readFile("./chat.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

io.sockets.on("connection", (socket) => {
    console.log('연결!');
    socket.on("message", (data) => {
        io.sockets.emit("message", data);
    });
});
server.listen(8085,function(){
    console.log("서버실행");
});
