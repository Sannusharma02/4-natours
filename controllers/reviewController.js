const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
// const Tour = require('../models/tourModel');
// const req = require('express/lib/request');

exports.setTourUserIds = (req, res, next) => {
  console.log(req.body);
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next()
 }

exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)


