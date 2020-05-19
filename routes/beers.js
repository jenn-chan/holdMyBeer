const express = require("express");
const router = express.Router();
const Beer = require("../models/beer");

router.get("/", function(req, res) {
    Beer.find({}, function(err, allBeers) {
        if (err) {
            console.log(err);
        } else {
            res.render("beers/beers", {beers: allBeers, currentUser: req.user});
        }
    })
});

// call middleware first and then continue to callback if logged in
// New route - show form to create a new beer
router.get("/new", isLoggedIn, function(req, res) {
    res.render("beers/new");
});

// Create route - adding a new beer
router.post("/", function(req, res) {
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
router.get("/:id", function(req, res) {
    // find campground with the id and populate with comments obj connected to this beer obj
    Beer.findById(req.params.id).populate("comments").exec(function(err, foundBeer) {
        if (err) {
            console.log(err);
        } else {
            res.render("beers/show", {beer: foundBeer});
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
