const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
exports.signup = catchAsync(async(req,res,next) => {
  console.log("here");
  console.log(req);
  const newUser = await User.create(req.body);

  req.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});