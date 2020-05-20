const express = require("express");
const router = express.Router({mergeParams: true}); // merge params from beers with comments
const middlewareObj = require("../middleware/index");
const Beer = require("../models/beer");
const Comment = require("../models/comment");

// comments new
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
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
            // add username and id to comment
            newComment.author = {
                id: req.user._id,
                username: req.user.username
            }
            newComment.save();
            // connect new comment to beer
            foundBeer.comments.push(newComment);
            foundBeer.save();
            res.redirect("/beers/" + foundBeer._id);
        });
    });
});

// edit route
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        res.render("comments/edit", {beer_id: req.params.id, comment:foundComment});
    });
});

// update route
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            console.log(err);
        }
        return res.redirect("/beers/" + req.params.id);
    });
});

// destroy route
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment) {
        if(err) console.log(err);
        return res.redirect("/beers/" + req.params.id);
    });
});


module.exports = router;
