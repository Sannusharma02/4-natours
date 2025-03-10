const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Tour = require('./../../models/tourModel');

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

//  Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//Import Data Into Db
const importData = async() => {
  try{
    await Tour.create(tours);
    process.exit();
    console.log('Tours created successfully');
  } catch (err) {
    console.error(err);
  }
}

//  Delete All Data from collection
const deleteTour = async() => {
  try{
    await Tour.deleteMany();
    console.log('Tours deleted successfully');
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2]=== '--import') {
  importData()
}else if(process.argv[2]=== '--delete') {
  deleteTour()
}

console.log(process.argv);