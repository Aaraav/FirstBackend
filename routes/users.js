const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = new mongoose.Schema({
  username:{ 
    type: String,
   unique:true,
     required: true
     },
  email: { type: String,
     required: true,
     unique:true },

  posts: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' }],
  password: { type: String },
  dp:{
    type:String
  },
  dpcaption:{
    type:String
  },
  saved:[{
    type:String
  }]
  
  // Other user-related fields can be added here
});

userSchema.plugin(plm);

const User = mongoose.model('User', userSchema);
module.exports = User;
