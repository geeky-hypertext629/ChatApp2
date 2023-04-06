
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');

//Setting up Mongoose

const mongoose = require('mongoose');

const connectdb = async () => {
    try {
        await mongoose.connect('mongodb+srv://subh28909jsr:subham@chatting.zslar5a.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true});
        console.log('connected to db')
    }
    catch (err) {
        console.log(err);
    }
}

connectdb();

const mongooseSchema = new mongoose.Schema({
        room : String,
        author : String,
        message : String,
        time : String,
});

const userMsg = new mongoose.model("userMsg",mongooseSchema);








app.use(cors());
const http = require('http');
const server = http.createServer(app);
const port1 = 3001 || process.env.PORT;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`);
    socket.on('join_room', ({ username, room }) => {
        socket.join(room);
        console.log(`${username} has joined the room ${room}`);
        const fetchmsg = async () =>{
            const msgs = await userMsg.find({room : room });
            socket.emit("self_message", msgs);
        }
        fetchmsg();
    })

    socket.on("send_message", async (data) => {
        console.log(data)
        await userMsg.create(data);
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log(`User Disconnected ${socket.id}`);
    })
})

server.listen(port1, () => {
    console.log('Server running at port 3001');
})