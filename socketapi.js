const io = require("socket.io")();
const userModel = require('./routes/users')
const messageModel = require('./routes/message');
const message = require("./routes/message");
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {


    socket.on('join-server', async username => {
        await userModel.findOneAndUpdate({
            username
        }, {
            socketId: socket.id
        })

    })

socket.on('messageModel', async messageObject=>{

    await messageModel.create({
        sender:messageObject.sender,
        receiver:messageObject.receiver,
        message:messageObject.message
        
        

    })
     const receiver = await userModel.findOne({
        username:messageObject.receiver
     })
    //  socket.emit('returnmessageModel',messageObject)
    // console.log(messageObject.message)
    
     socket.to(receiver.socketId).emit('receive-private-message', messageObject=>{
        messageObject={
            message: message,
            receiver:receiver

        }
        console.log(message)
     })
  
})
// socket.on('send-private-message', async messageObject => {

   


//     const receiver = await userModel.findOne({
//         username: messageObject.receiver
//     })

//     console.log(receiver)


   
// // console.log(messageObject.message);
// })

});



module.exports = socketapi;

