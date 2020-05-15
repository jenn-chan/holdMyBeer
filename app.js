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
    image: String,
    description: String
});

// make a model with schema to make an obj with a bunch of mongoose funcationality
var Beer = mongoose.model("Beer", beerSchema);

// Beer.create({
//     name: "Beer 1",
//     image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
//     description: "Very hoppy"
// });

app.get("/", function(req, res) {
    res.redirect("/beers"); 
});

// Index route - show all beers
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

// New route - show form to create a new beer
app.get("/beers/new", function(req, res) {
    res.render("new");
});

// Create route - adding a new beer
app.post("/beers", function(req, res) {
    // get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newBeer = {name: name, image: image, desc: desc};
    // Create a new beer and save to DB
    Beer.create(newBeer, function(err, newBeer) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/beers");
        }
    });
});

// viewing beer details - make sure to put after new route 
// * new is technically after /beers/
app.get("/beers/:id", function(req, res) {
    // find campground with the id
    Beer.findById(req.params.id, function(err, foundBeer) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {beer: foundBeer});
        }
    });
});

app.listen(3000, function() {
    console.log("Server started!");
});