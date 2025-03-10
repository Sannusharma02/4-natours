const Tour = require('./../models/tourModel');

// TOURS
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    // results: tours.length,
    // data: { tours }
  });
}

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id, 10); // parsing string to int as 10 decimal
  // const tour = tours.find(el => el.id === id);
  //
  // res.status(200).json({
  //   status: 'success',
  //   results: tour.length,
  //   data: {
  //     tour }
  // });
}

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tours: newTour,
    // },
  });
}

exports.updateTour = (req, res) => {

  res.status(200).json({
    status: 'success',
    data:{
      tour: '<Updated tour here...>'
    }
  });
}

exports.deleteTour = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null
  });
}
