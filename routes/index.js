const express = require('express');
const userModel=require("./users");
const passport = require('passport');
const postModel=require("./post");
const changedp=require("./multerdp");
const savedpost=require("./multersaved");
const flash = require('connect-flash');
const upload=require("./multer");

const router = express.Router();


const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get("/", function(req,res) {
  res.render('index');
})
router.get("/feed", isLoggedIn, function(req,res) {
  res.render('index');
})

router.get("/profile",isLoggedIn, async function(req,res){
  const user=await userModel.findById(req.user._id).populate("posts");

  

  res.render("profile",{user});


})
router.get("/register" ,function(req,res){
  res.render('register');
})
router.get("/changedp", isLoggedIn, async function(req, res) {
  res.render('changedp');
});

router.post("/saved", isLoggedIn, changedp.single("file"), async (req, res) => {
  try {
      const user = await userModel.findOne({ username: req.session.passport.user });

      if (!user) {
          return res.status(400).send('User ID is required');
      }

      user.dp = req.file.filename; // Save uploaded file name as user's profile picture
      user.dpcaption=req.body.caption;
      await user.save();

      res.redirect("/profile"); // Redirect to profile page after saving the profile picture
  } catch (error) {
      console.error(error);
      return res.status(500).send('Error occurred');
  }
});
router.get("/savedpost",isLoggedIn,function(req,res){
  res.render("saved");
})





router.post('/upload',isLoggedIn, upload.single('file'), async (req, res,next) => {
  try {
    const user=await userModel.findOne({username:req.session.passport.user});
console.log(user);
    if (!user) {
      return res.status(400).send('User ID is required');
    }

    // Check if a similar post exists for the user
    

    const newPost = await postModel.create({
      image: req.file.filename,
      PostText: req.body.caption,
      user: user._id
    });
    user.posts.push(newPost._id);
    await user.save();
   
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error occurred');
  }
});






router.post("/register", function(req, res) {
  if (!req.body.username || req.body.username.trim() === '') {
    // Handle case where the username is empty or null
    return res.status(400).send("Username cannot be empty");
  }

  const userData = new userModel({
    username: req.body.username,
    email: req.body.email
    // Other user-related fields
  });

  userModel.register(userData, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile");
      });
    })
    .catch(err => {
      // Handle errors, like duplicate username, appropriately
      res.status(500).send("Error registering user");
    });
});

router.get("/login" ,function(req,res){
  res.render('login', {error:req.flash('error')});
})

router.post("/login", passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
 
}), function (req, res) {
  console.log('Login route hit!');
  // Additional debug statements if needed
});


router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){ return next(err);}

    res.redirect('/');
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}


module.exports = router;
