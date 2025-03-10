const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// hosted
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log('DB Connection Successfully Connected!');});

const tourScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  }
});
const Tour = mongoose.model('Tour',tourScheme);

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 4.5
})

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log(err);
});

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
