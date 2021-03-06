var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require routes
var routes = require("./routes/routes.js");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;
// var PORT = 3000 ;

// Initialize Express
var app = express();

// Configure middleware


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.use("/", routes);
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;

const localDbUri = 'mongodb://localhost/Article';
// mongoose.connect(localDbUri, {
//   useMongoClient: true
// });
if (process.env.MONGODB_URI) {

mongoose.connect(process.env.MONGODB_URI);
} else { mongoose.connect(localDbUri);}

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
