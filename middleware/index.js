const Beer = require("../models/beer");
const Comment = require("../models/comment");

// all middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("doing flash rn");
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.checkBeerOwnership = function(req, res, next) {
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
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find comment with that id
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("user doesn't have permission");
                    res.redirect("back");
                }
            }
        })
    } else {
        console.log("Uesr need to be logged in");
        res.redirect("back");
    }
}

module.exports = middlewareObj;