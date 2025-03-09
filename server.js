const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// //Local
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);
// mongoose.connect(process.env.DATABASE_LOCAL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(con => {});

// hosted
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(DB);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {});

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
