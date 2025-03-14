const Tour = require('./../models/tourModel');
const { query, json } = require('express');
const APIFeatures =require('./../utils/apiFeatures');
const res = require('express/lib/response');
const catchAsync = require('./../utils/catchAsync');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

// TOURS
exports.getAllTours = async (req, res) => {
  try{

    // Execute Query
    const features = new APIFeatures(Tour.find(),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours =await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      }
    });
  }
}

exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    }
  });
});

exports.updateTour = async (req, res) => {
  try{
    const tour =await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data:{
        tour
      }
    });
  } catch (err){
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}

exports.deleteTour = async (req, res) => {
  try{
    const tour =await Tour.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data:{
        tour
      }
    });
  } catch (err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte:4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tours: stats,
      },
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try{
    const year = parseInt(req.params.year);
    console.log(Tour.schema.paths);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tours: plan,
      },
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}
