const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//USER
exports.getAllUsers = async (req, res) => {
  const user = await User.find();

  // Respond with success
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    }
  });
};

exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}
