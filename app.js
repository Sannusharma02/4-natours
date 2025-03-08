const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {

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
});

app.delete('/api/v1/tours/:id', (req, res) => {

  if (parseInt(req.params.id, 10)>tours.length ) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
