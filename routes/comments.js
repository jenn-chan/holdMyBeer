const express = require("express");
const router = express.Router({mergeParams: true}); // merge params from beers with comments
const Beer = require("../models/beer");
const Comment = require("../models/comment");

// comments new
router.post("/", isLoggedIn, function(req, res) {
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

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

module.exports = router;