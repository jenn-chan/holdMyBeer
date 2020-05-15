var express = require("express"); // web server framework we're using
var app = express();
var bodyParser = require("body-parser"); // to parse info from a post request
var mongoose = require("mongoose");
var Beer = require("./models/beer");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

//seedDB();

// Mongoose settings
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/beer_diary", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


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
            res.render("beers/beers", {beers: allBeers});
        }
    })
});

// New route - show form to create a new beer
app.get("/beers/new", function(req, res) {
    res.render("beers/new");
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
    // find campground with the id and populate with comments obj connected to this beer obj
    Beer.findById(req.params.id).populate("comments").exec(function(err, foundBeer) {
        if (err) {
            console.log(err);
        } else {
            res.render("beers/show", {beer: foundBeer});
        }
    });
});

//==== COMMENTS ROUTES ======
app.post("/beers/:id/comments", function(req, res) {
    // look up beer using id
    Beer.findById(req.params.id, function(err, foundBeer) {
        if (err) {
            console.log(err);
            return res.redirect("/beers");
        } 

        // create new comment
        var comment = req.body.comment;
        Comment.create(comment, function(err, newComment) {
            if (err) {
                console.log(err);
                return res.redirect("/beers");
            } 

            // connect new comment to beer
            foundBeer.comments.push(newComment);
            foundBeer.save();
            res.redirect("/beers/" + foundBeer._id);
        });
    });
});

app.listen(3000, function() {
    console.log("Server started!");
});