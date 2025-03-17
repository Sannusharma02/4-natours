const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, passwordConfirm

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo:{
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password!'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
  }
});

const User = mongoose.model('User', userScheme)

module.exports = User;