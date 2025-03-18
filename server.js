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

/*const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(con => console.log('DB Connection Successfully Connected!'))
  .catch(err => console.error('DB Connection Error:', err));

const port = process.env.PORT || 3000;

console.log(port);

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

// Catch uncaught exceptions (for synchronous code)
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Catch unhandled promise rejections (for asynchronous code)
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection, shutting down...');
  console.log('Reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Simulate an uncaught exception
setTimeout(() => {
  throw new Error('Uncaught exception test');
}, 1000);

// Simulate an unhandled promise rejection
setTimeout(() => {
  Promise.reject('Unhandled rejection test');
}, 2000);
*/