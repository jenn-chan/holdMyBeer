const express = require("express");
const router = express.Router();
const middlewareObj = require("../middleware/index");
const Beer = require("../models/beer");
const Comment = require("../models/comment");

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
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("beers/new");
});

// Create route - adding a new beer
router.post("/", function(req, res) {
    var newBeer = req.body.beer;
    newBeer.author = {
        id: req.user._id,
        username: req.user.username
    }
    console.log(newBeer);
    // Create a new beer and save to DB
    Beer.create(newBeer, function(err, newBeer) {
        if (err) {
            console.log(err);
        } else {
            // add username and id to beer
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

// edit route
router.get("/:id/edit", middlewareObj.checkBeerOwnership, function(req, res) {
    Beer.findById(req.params.id, function(err, foundBeer) {
        res.render("beers/edit", {beer : foundBeer});
    });
});

// update route
router.put("/:id", middlewareObj.checkBeerOwnership, function(req, res) {
    // find and update beer
    Beer.findByIdAndUpdate(req.params.id, req.body.beer, function(err, updatedBeer) {
        if(err) {
            console.log(err);
            return res.redirect("/beers");
        }
        res.redirect("/beers/" + req.params.id);
    });
    // redirect
});

// destroy route
router.delete("/:id", middlewareObj.checkBeerOwnership, function(req, res) {
    Beer.findByIdAndRemove(req.params.id, function(err, removedBeer) {
        if(err) {
            console.log(err);
            return res.redirect("/beers");
        }

        // Delete its comments
        Comment.deleteMany( {_id: { $in: removedBeer.comments } }, function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/beers");
        });
    });
});


module.exports = router;
