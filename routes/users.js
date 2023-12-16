const mongoose = require('mongoose');
require('dotenv').config();
const plm = require("passport-local-mongoose");

const MONGO_URL = process.env.MONGO_URL; // Check or default the URL

mongoose.connect(MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
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
