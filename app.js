var express = require("express"); // web server framework we're using
var app = express();
var bodyParser = require("body-parser"); // to parse info from a post request
var mongoose = require("mongoose");

// Mongoose settings
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/beer_diary", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema set up - how a beer obj should look like
var beerSchema = new mongoose.Schema({
    name: String,
    image: String
});

// make a model with schema to make an obj with a bunch of mongoose funcationality
var Beer = mongoose.model("Beer", beerSchema);

app.get("/", function(req, res) {
    res.redirect("/beers"); 
});

app.get("/beers", function(req, res) {
    //res.render("beers", {beers: beers});
    Beer.find({}, function(err, allBeers) {
        if (err) {
            console.log(err);
        } else {
            res.render("beers", {beers: allBeers});
        }
    })
});

app.get("/beers/new", function(req, res) {
    res.render("new");
});

// Posting a new beer
app.post("/beers", function(req, res) {
    // get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var newBeer = {name, image};
    // Create a new beer and save to DB
    Beer.create(newBeer, function(err, newBeer) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/beers");
        }
    });
});

app.listen(3000, function() {
    console.log("Server started!");
});