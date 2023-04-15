// src/app.js

const express = require('express');
const cors = require('cors');

// functions to create a success or failure json response
// use example: res.status(200).json(newSuccessResponse(message))
const { newSuccessResponse, newFailedResponse } = require('./response');

// creates express app instance
const app = express();

const allowlist = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://silver-sundae-d1d08d.netlify.app',
];

const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// using cors() middleware to make post requests across origins
app.use(cors(corsOptionsDelegate));

// middleware to parse incoming JSON requests and add them in req.body
app.use(express.json());

// ROUTES: all routes will be define under './routes'
app.use('/', require('./routes/router'));

// 404 middleware for requests to resources that doesn't exist
app.use((req, res) => {
  // TODO: replace with not found page
  res.status(404).json(newFailedResponse('Error 404: page not found'));
});

// error-handler middleware for everything else
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || 'unable to process the request';

  res.status(errStatus).json(newFailedResponse(errMessage));
});

// export app to be accessed by server.js
module.exports = app;
