const mongoose = require('mongoose');
const slugify = require('slugify');
const tourScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  slug:String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  discount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour:{
    type: Boolean,
    default: false
  }
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},

});

tourScheme.virtual('durationWeeks').get(function(){
  return this.duration/7;
})

//Document middleware runs before .save() and .create() .insertMany
tourScheme.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true });
  next();
})

// tourScheme.pre('save', function(next){
//   console.log('will save');
//   next();
// })
//
// tourScheme.post('save', function(doc, next){
//   console.log(doc)
//   next();
// })

//Query middleware
tourScheme.pre(/^find/, function(next){
  this.find({ secretTour: { $ne: true } })
  this.start= Date.now();
  next();
})

tourScheme.post(/^find/, function(doc,next){
   this.end = Date.now();
  console.log(this.start-this.end);
  next();
})

const Tour = mongoose.model('Tour', tourScheme);

module.exports = Tour;
