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
console.log(__dirname)
const tours = fs.readFileSync(`${__dirname}\tour-simple.json`)

console.log(tours)
//Import Data Into Db
const importData = async() => {
  try{
    await Tour.create(tours);
    console.log('Tours created successfully');
  } catch (err) {
    console.error(err);
  }
}

//  Delete All Data from collection
const deleteTour = async() => {
  try{
    await Tour.deleteMany();
    console.log('Tours created successfully');
  } catch (err) {
    console.error(err);
  }
}

console.log(process.argv);