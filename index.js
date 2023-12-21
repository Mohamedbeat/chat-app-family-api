import  express, { json }  from "express";
import  cors  from "cors";
import mongoose from "mongoose";
import userRouter from './routes/userR.js'
import msgRouter from './routes/msgR.js'
// import  socket  from "socket.io";
import { Socket } from "socket.io";
import { Server } from "socket.io";

import 'dotenv/config'



const app = express()
app.use(cors())
app.use(express.json())


// mongoose.connect(process.env.DB, {
//     useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     family:4,//to use IPv4 (if this removed it will try to use IPv6)
// }).then(()=>{
//     console.log('DB connection successfully !');
// }).catch((err)=>{
//     console.log(err.message);
// })
const connectionToDB= async()=>{
    try {
        await mongoose.connect(process.env.DB, {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                family:4,//to use IPv4 (if this removed it will try to use IPv6)
            })
        console.log('Connected to mongoDB')
    } catch (error) {
        console.log(error);
    }
    }

////////////////////////////////
app.use('/api/auth', userRouter)
app.use('/api/msg', msgRouter)



const server = app.listen(process.env.PORT, ()=>{
    connectionToDB()
    console.log(`running on port ${process.env.PORT}`);
})

const io = new Server(server, {
    cors:{
        origin:['http://192.168.100.7:5173','http://localhost:5173', 'https://mohamed-chat-app-family.netlify.app'],
        credentials:true,
    }
})

global.onlineUsers = new Map()

io.on("connection", (socket)=>{

    global.chatSocket = socket;

    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id)
        console.log(onlineUsers);
    })

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        console.log(data);

        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recived", data.message)
        }
    })

})
