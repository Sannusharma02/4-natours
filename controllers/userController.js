const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
// const Tour = require('../models/tourModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  }else{
    cb(new AppError('Not an image! Please upload an image file', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = catchAsync( async (req, res, next) => {
  if(!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el) ) { newObj[el] = obj[el]; }
  });
  return newObj;
}

exports.getMe = (req, res, next) => {
  req.params.id =req.user.id
  next()
}



exports.updateMe = catchAsync(async (req, res, next) => {
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
  if(req.file) filteredBody.photo = req.file.filename;
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

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!! Please use SignUp'
  })}

exports.getUsers = factory.getOne(User);
exports.getAllUsers = factory.getAll(User)

// DO not update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)


// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!!!'
//   })}
