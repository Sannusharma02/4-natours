const AppError = require('../utils/appError');
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

const sendErrorDev =(err,res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const sendErrorPro =(err,res) => {
  // Operational, trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Production error or other unknown error : don't want the clients to know
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}
module.exports = (err,req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err,res);
  } else if(process.env.NODE_ENV === 'production') {
    let error ={ ...err}
    if (error.name === 'CastError')  error = handleCastErrorDB(error);
    sendErrorPro(err,res);
  }
}
