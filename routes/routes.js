const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const router = express.Router();

var db = require("../models");

// Initialize Express
var app = express();

// Load the main page
router.get('/', function(req, res){
   res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

// Scrape the NYT site
app.get("/scrape", function(req, res) {
	axios.get("https://nytimes.com").then(function(response) {
		var $ = cheerio.load(response.data);

		$("h2.story-heading, p.summary").each(function(i, element) {

			var result = {} ;

			//Add the text for each title and the URL and save as properties of the result object
			result.headline = $(this)
				.children("a")
				.text();
			result.url = $(this)
				.children("a")
				.attr("href");
			result.summary = $(this)
				.text();

		//Create a new Article using result and resultSum objects from scraping
		db.Article
			.create(result)
			.then(function(dbArticle) {
				res.send("Scrape Complete");
			})
			.catch(function(err) {
          		res.json(err);				
			});

		});

	}); //axios
}); //app.get


// Route for getting articles from Mongo
app.get("/articles", function(req, res) {
	// Find all documents in Artcles collections
	db.Article
		.find({})
		.then((dbArticle => res.json(dbArticle)))
		.catch((err) => res.json(err))

});

// Route for grabbing individual Article by id, populate with its note
app.get("/articles/:id", function(req, res) {
	db.Article
		.findOne({_id: req.params.id })
		.populate("note")
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// Route for saving Article's note
app.post("/articles/:id", function(req, res) {
	db.Article
		.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneaAndUpdate( {_id: req.params.id}, { note: dbNote._id }, { new: true });
		})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});


module.exports = app;