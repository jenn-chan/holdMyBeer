const express = require("express");
// router obj is isolated instance of middleware and routes
const router = express.Router(); // behaves like middleware so you can pass it into app.use()
const passport = require("passport");
const User = require("../models/user");

// Root route
router.get("/", function(req, res) {
    res.redirect("/beers"); 
});

// ==============
// AUTH Routes
// ==============
// show register form
router.get("/register", function(req, res) {
    res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    // User.register will make a new user and handle the logic of hashing the password
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        // once user is signed up, will log them in (authenticate)
        passport.authenticate("local")(req, res, function() {
            res.redirect("/beers");
        });
    }) 
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// after logging in, passport will put the username and id in req.user
// calling passport.authenticate => will use the method from the passport-local-mongoose package on User obj
router.post("/login", passport.authenticate("local", {
    successRedirect: "/beers",
    failureRedirect: "/login",
    //failureFlash: true
}));

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/beers");
});

// error page
router.get("*", function(req, res) {
    res.render("error");
});

module.exports = router;
