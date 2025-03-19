const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async(req,res,next) => {
  const newUser = await User.create(req.body);
  // {
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm
  // }

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});


exports.login = catchAsync( async (req,res,next) =>{
  const { email, password } = req.body;

  // 1) Check if email and password exists && password is correct
  if(!email || !password){
    return next(new AppError('Please provide a valid email and password', 400));
  }
  // 2) Check is user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError('Please provide a valid email and password', 401));
  }

  // 3) If everything ok, send token is correct
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token
  });
});

exports.protect = catchAsync( async (req,res,next) =>{
  // 1) Getting token and check of it's there
  let token;
  // console.log(req.headers);
  // console.log(req.query.Authorization);
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if(!currentUser){
    return next(new AppError(
      'The user belonging to this token does no longer exist.',
      401
      )
    );
  }

  // 4) Check if user change password after the jwt was issued
  if (currentUser.changesPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // Grant Access to protected route
  req.user = currentUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync( async (req,res,next) => {
  // 1) get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('there is no user with this email address', 404));
  }

  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email`;
try{
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!'
  });
  } catch(err){
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({validateBeforeSave: false});

  return next(new AppError('There was an error sending your password. Try again later!', 500));
  }

});


exports.resetPassword = catchAsync( async (req,res,next) => {
  // get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.headers.token).digest('hex');

  const user  = await User.findOne({ passwordResetToken: hashedToken });

  // if the token has not expired, and there is user, set the new password

  // update changedPasswordAt property for the user

  // log the user in, send JWT
})

















