const Tour = require('./../models/tourModel');
// TOURS
exports.getAllTours = async (req, res) => {
  try{
    console.log(req.query);
    const tours = await Tour.find();
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
