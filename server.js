var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require routes
var routes = require("./routes/routes.js");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware


app.use("/", routes);
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB

const localDbUrl = 'mongodb://localhost/Article';

mongoose.Promise = Promise;

if (process.env.MONGODB_URI) {

mongoose.connect(process.env.MONGODB_URI);
} else { mongoose.connect(localDbUrl);}

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
