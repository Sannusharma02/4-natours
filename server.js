const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// hosted
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose
//   .connect(DB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(con => {
//   console.log('DB Connection Successfully Connected!');});\

mongoose
  .connect(DB)  // No need for extra options
  .then(con => console.log('DB Connection Successfully Connected!'))
  .catch(err => console.error('DB Connection Error:', err));

const port = process.env.PORT || 3000;

console.log(port);

app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
