var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsScraper", {
  // useMongoClient: true
});

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.espn.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    // console.log(response.data)
    var $ = cheerio.load(response.data);

	$("div.contentItem__contentWrapper").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children(".contentItem__title").text();
      result.link = $(this).parent().attr("href");
      result.summary = $(this).children("p.contentItem__subhead").text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    event.preventDefault()
	// location.href = "/"
    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function(dbArticle) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push:{ note: dbNote._id }}, { new: true });
    })
    .then(function(dbUser) {
      // If the User was updated successfully, send it back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.post("/savedArticles/:id", function(req, res) {
	console.log(req.params.id)
	var ObjectId = 'ObjectId("' + req.params.id + '")';
	console.log(ObjectId)
	db.Article.findOneAndUpdate({ _id: ObjectId }, {$push: { saved: "yes" }}, { new: true });
        // .then(function(dbArticle) {
        //   // View the added result in the console
        //   console.log(dbArticle);
        // })
        // .catch(function(err) {
        //   // If an error occurred, send it to the client
        //   return res.json(err);
        // });
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
