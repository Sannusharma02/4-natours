const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el) ) { newObj[el] = obj[el]; }
  });
  return newObj;
}

//USER
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if(req.body.password || req.body.passwordConfirm){
    return next(
      new AppError(
        'This route is not for password updates. Please use / updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields name that are not allowed to be update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody,{
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data:{
      user: updateUser
    }
  })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  })
})

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

// DO not update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)


// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!!!'
//   })}
