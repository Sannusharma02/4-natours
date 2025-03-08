const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello world!');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//  2. Route handlers
// TOURS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  });
}

const getTour = (req, res) => {
  const id = parseInt(req.params.id, 10); // parsing string to int as 10 decimal
  const tour = tours.find(el => el.id === id);

  // if(id>tours.length){
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }

  res.status(200).json({
    status: 'success',
    results: tour.length,
    data: {
      tour }
  });
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // Write the entire tours array (with the new tour added) to the file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'fail',
          message: 'Could not update tours file',
        });
        return;
      }

      // If successful, send a response with the newly created tour
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
}

const updateTour = (req, res) => {

  if (parseInt(req.params.id, 10)>tours.length ) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }

  res.status(200).json({
    status: 'success',
    data:{
      tour: '<Updated tour here...>'
    }
  });
}

const deleteTour = (req, res) => {

  if (parseInt(req.params.id, 10) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}

  //USER
  const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

const createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!!!'
  })}

app
  .route('/api/v1/users')
  .get(getAllUsers)
.post(createUsers)

app
  .route('/api/v1/users/:id')
  .get(getUsers)
  .patch(updateUser)
  .delete(deleteUser);

// 4.  Routes
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 5.  Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
