const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const test = require('node:test');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = catchAsync(async(user, statusCode,res)=>{
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secret: true,
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions)

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
})

exports.signup = catchAsync(async(req,res,next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 200, res)
});

exports.login = catchAsync( async (req,res,next) =>{
  const { email, password } = req.body;

  // 1) Check if email and password exists && password is correct
  if(!email || !password){
    return next(new AppError('Please provide a valid email and password', 400));
  }
  // 2) Check is user exists && password is correct
  const user = await User.findOne({ email }).select('+password');


  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('Please provide a valid email and password', 401));
  }

  console.log(user.password);
  // 3) If everything ok, send token is correct
  createSendToken(user, 200, res)
});

exports.protect = catchAsync( async (req,res,next) =>{
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt){
    token = req.cookies.jwt;
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

//Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync( async (req,res,next) =>{
  if (req.cookies.jwt){
  // 1) verify token
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if(!currentUser){
    return next();
  }

  // 3) Check if user change password after the token was issued
  if (currentUser.changesPasswordAfter(decoded.iat)){
    return next();
  }

  // There is a logged in user
  res.locals.user = currentUser;
    return next();
  }
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
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) log the user in, send JWT
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync( async (req,res,next) => {
  // 1) GET USER FORM COLLECTION
  const user = await User.findById(req.user._id).select('+password');

  // 2) CHECK IF POSTED CURRENT PASSWORD IS CORRECT
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3) IF SO, UPDATE PASSWORD
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) LOG USER IN, USER JWT
  createSendToken(user, 200, res)
})















