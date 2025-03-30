const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const Tour = require('../models/tourModel');
const req = require('express/lib/request');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  if(req.params.tourId) filter = {tour: req.params.tourId};

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.setTourUserIds = (req, res, next) => {
  console.log(req.body);
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next()
 }

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)


