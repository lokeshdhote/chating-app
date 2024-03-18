const  mongoose = require("mongoose")

const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/newone")

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    profileImage: {
      type: String,
      default: "https://th.bing.com/th?id=OIP.NRgJJNrJhlvqRpWFwurtHQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
    },
    socketId: String,
    friends: [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    } ]
  })

userSchema.plugin(plm)
module.exports = mongoose.model("user",userSchema)
