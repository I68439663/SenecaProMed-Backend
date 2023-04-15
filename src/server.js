// src/server.js

// to gracefully shutdown the server
const stoppable = require('stoppable');

// Read environment variables from an .env file (if present)
require('dotenv').config();

// express app instance
const app = require('./app');

// cors
const cors = require('cors');

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

app.use(cors(corsOptionsDelegate));

// get port number
const port = parseInt(process.env.PORT || 8080, 10);

// mongoose db instance
const mongoose = require('mongoose');

// ensures that only the fields specified in the Schema will be saved in the database
mongoose.set('strictQuery', false);

// start a server listening on set port.
// wrapped in stoppable to shutdown server gracefully
const server = stoppable(
  app.listen(port, () => {
    console.log(`REST API is up and running on PORT: ${port}`);

    // connect to MongoDB
    mongoose
      .connect(
        `mongodb+srv://senecapromed:senec%40ProMed1234@senecapromeddb.xjhswji.mongodb.net/UsersDB?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log('Successfully connected to MongoDB');
      })
      .catch((err) => {
        console.err(`Failed to connect to MongoDB: ${err}`);
      });
  })
);

// exporting an instance to be accessed by other parts if necessary
module.exports = server;
