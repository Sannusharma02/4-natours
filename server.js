const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name,err.message);
  console.log('Uncaught exception, shutting down...');
  server.close(() => process.exit(1));
})

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(con =>
    console.log('DB Connection Successfully Connected!'))

const port = process.env.PORT || 3000;

console.log(port);

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name,err.message);
  console.log('Unhandled rejection, shutting down...');
  server.close(() => process.exit(1));
});
