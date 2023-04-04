
const express = require('express');
const {Server} = require('socket.io');
const app = express();
const cors = require('cors');
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const port1 = 3001 || process.env.PORT;
const io =new Server(server,{
    cors : {
        origin : "http://localhost:3000",
        methods : ['GET','POST'],
    }
})

io.on("connection",(socket)=>{
    console.log(`User Connected ${socket.id}`);
    socket.on('join_room',({username,room})=>{
        socket.join(room);
        console.log(`${username} has joined the room ${room}`);

    })

    socket.on("send_message",(data)=>{
        console.log(data)
        socket.to(data.room).emit("receive_message",data);
    })

    socket.on("disconnect",()=>{
        console.log(`User Disconnected ${socket.id}`);
    })
})

server.listen(port1,()=>{
    console.log('Server running at port 3001');
})