var express = require('express');
var router = express.Router();
const userModel  = require("./users")
const users = require('./users')
const messageModel = require('./message')
const passport = require("passport")
const upload = require("./multer")
const localStrategy = require("passport-local");
const message = require('./message');
passport.use(new localStrategy (userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' );
});
/* GET home page. */
router.get('/profile', isLoggedIn,async function(req, res, next) {
  const loggedUser = await userModel.findOne({
    username: req.user.username
  }).populate("friends")


  res.render('profile',{ loggedUser});
 
});

router.get("/userprofile",isLoggedIn ,function(req,res,next){
  const user = req.user
  // console.log(user)
  res.render('userprofile',{user})

})

router.post("/uploads",isLoggedIn,upload.single("image"),async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    user.profileImage = req.file.filename
 
    await user.save();
  
    
    res.redirect("/userprofile");
  }
);

router.get("/editProfile",isLoggedIn,async function (req, res) {
  const user = req.user

  res.render("editProfile",{user})
 }
 );
 router.post("/editProfile",isLoggedIn,async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  user.username = req.body.username
  user.email = req.body.email
await user.save()

  res.redirect("/userprofile");
  }
  );

router.post('/getMSG', isLoggedIn, async (req, res, next) => {

console.log(req.user.username)

console.log(req.user.sender)

const chats  = await messageModel.find({
   $or: [
      {
        sender: req.user.username,
        receiver: req.body.receiver
      },
      {
        sender: req.body.receiver,
        receiver: req.user.username
      }
    ]
})

  res.status(200).json(chats)
})



router.post("/register",function(req,res,next ){
  var userdata = new userModel({
    username :req.body.username,
    email:req.body.email,
    secret:req.body.secret
  })
  
  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})


router.post("/login" , passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"

}),function(req,res){})

router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err) return next(err)
    res.redirect("/")
  })
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated ()){
    return next()
  }
  res.redirect("/")
  }
  


  router.post("/searchUser",isLoggedIn,async function(req,res,next){
const data = req.body.data

const allUser = await userModel.find({
  username:{
    $regex:data,
    $options:"i"
  }
})

res.status(200).json(allUser)
  })

  router.post("/addFriend",isLoggedIn,async function(req,res,next){


    const friendId = req.body.friendId
     const friendUser = await userModel.findOne({
      _id:friendId
     })
     const loggedInUser = await userModel.findOne({
      username:req.session.passport.user
     })

const indexoffriendUser = loggedInUser.friends.indexOf(friendUser._id)


 if(indexoffriendUser!==-1){
  res.status(200).json({
    message : `allready friends`
  })
  return
 }
 else{
  loggedInUser.friends.push(friendUser._id)
 friendUser.friends.push(loggedInUser._id)
 }

  await loggedInUser.save()
  await friendUser.save()

  res.status(200).json({
    message: "friend added"
  })

      })
    
    


module.exports = router;
