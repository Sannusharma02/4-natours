const Tour = require('./../models/tourModel');
const { query, json } = require('express');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

// TOURS
exports.getAllTours = async (req, res) => {
  try{
    //Build Query
    //1 a) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'fields', 'page', 'limit'];
    excludedFields.forEach(el => delete queryObj[el])
    // 1 b) advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2 sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3 field limiting 84880
    if(req.query.fields) {
      console.log(req.query.fields);
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4 pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip =  (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if(req.query.page) {
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist');
    }

    // Execute Query
    const tours =await query;
    // query.sort().select().skip.limit()

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      }
    });
  } catch (err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
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

exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err){
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    })
  }
}

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
      message: 'Invalid data sent!',
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
      message: 'Invalid data sent!',
    })
  }
}
