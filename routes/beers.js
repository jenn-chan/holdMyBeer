const express = require("express");
const router = express.Router();
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
router.get("/new", isLoggedIn, function(req, res) {
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
router.get("/:id/edit", checkBeerOwnership, function(req, res) {
    Beer.findById(req.params.id, function(err, foundBeer) {
        res.render("beers/edit", {beer : foundBeer});
    });
});

// update route
router.put("/:id", checkBeerOwnership, function(req, res) {
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
router.delete("/:id", checkBeerOwnership, function(req, res) {
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
    })
})

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkBeerOwnership(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find campground with the id 
        Beer.findById(req.params.id, function(err, foundBeer) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the campground
                if (foundBeer.author.id.equals(req.user._id)) { // *.equals is only from mongoose plugin (so req.user.id doesn't have a .equals method)
                    next();
                } else {
                    console.log("user doesn't have permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = router;
