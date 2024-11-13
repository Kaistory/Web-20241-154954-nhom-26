const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute")
const messageRoute = require("./Routes/messageRoute");
const {Server} = require("socket.io")
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// CRUD

app.get("/", (req, res) =>{
    res.send("Welcome our chat app APIs ..");
});

const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

const expressServer = app.listen(port, (req, res) =>{
    console.log(`Server running on port : ${port}`);
});

mongoose.connect(uri,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  const io = new Server(expressServer, { cors: process.env.CLIENT_URL});
  var onlineUsers = [];

  io.on("connection", (socket) => {
    
    // console.log("hoaquarson", socket.id)
    // listen to a connection
    socket.on("addNewUser", (userId) =>{
     
      !onlineUsers.some((user)=> user?.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
      
      io.emit("getOnlineUsers", onlineUsers);
    })
    // add message
    socket.on("sendMessage",(message) => {
      
      const user = onlineUsers.find((user)=> user.userId === message.recipientId);
      
      if(user){
        console.log("getOnlineUsers",user)
        io.to(user.socketId).emit("newMessage", message);
        io.to(user.socketId).emit("getNotification", {
          senderId: message.senderId,
          isRead: false,
          date: new Date(),
        });
      }
    })
  
    socket.on("disconnect",() =>{
      
      onlineUsers = onlineUsers.filter(user => user.socketId != socket.id)
      io.emit("getOnlineUsers", onlineUsers);
    })
  });
  


