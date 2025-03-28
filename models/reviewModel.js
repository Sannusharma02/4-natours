// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review:{
      type: String,
      required: [true, 'Review is required'],
    },
    rating:{
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour:{
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to the Tour'],
    },
    user:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user '],
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

reviewSchema.pre(/^find/,function(next){
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// this.populate({
//   path: 'tour',
//   select: 'name',
// }).populate({
//   path: 'user',
//   select: 'name photo',
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//POST /tour/234fad4/reviews
//GET /tour/234fad4/reviews
//GET /tour/234fad4/reviews/31234fda