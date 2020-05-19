const express = require("express"); // web server framework we're using
const app = express();
const bodyParser = require("body-parser"); // to parse info from a post request
const mongoose = require("mongoose");
const passport = require("passport");   // authentication middleware for node.js with different strategies (login, fb, twitter, etc.)
const LocalStrategy = require("passport-local"); // local strategy = username and passpord
const Beer = require("./models/beer");
const User = require("./models/user");
const Comment = require("./models/comment");

// requiring routes
const beerRoutes = require("./routes/beers");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

//var seedDB = require("./seeds");

//seedDB();

// Mongoose settings
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/beer_diary", { useNewUrlParser: true });

app.use(bodyParser.json()); // parse JSON request body to be able to call res.json
app.use(bodyParser.urlencoded({extended: true})); // parsing bodies from url (key-val pairs)
app.set("view engine", "ejs");

// Passport Configuration
app.use(require("express-session")({    // need to include seperate package for session and express
    // !!! in production => produce a randomly generated string from environment var
    secret: "HoldMyBeer",   // used to sign the session ID cookie (salt for the hash/ encode and decode the sessions)
    // forces the session to be saved back to the session store (even if it was never modified during request)
    resave: false,
    // saveUnitialized - forces a session that is unitialized (new but not modified) to be saved to the store
    saveUninitialized: false // false - reduces server storage usage and comply with laws that require permission before setting a cookie
}));

app.use(passport.initialize()); // middleware that's required to initialize Passport
app.use(passport.session()); // session - provide state to http requests (sending along user info with request)
passport.use(new LocalStrategy(User.authenticate())); // using locaal strategy

// tell passport to use what's already defined on the user (methods we got from plugging in passportLocalMongoose)
passport.serializeUser(User.serializeUser()); // setting id as cookie in user's browser (encoding)
passport.deserializeUser(User.deserializeUser()); // getting id from cookie => used in callback to get user info (decoding)

// whatever function we pass in app.use will be called in every route
app.use(function(req, res, next) {
    // want every route to have access to req.user
    res.locals.currentUser = req.user;
    next();
});

// using the routes we required (append comment parts to clean up code)
app.use("/beers", beerRoutes);
app.use("/beers/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function() {
    console.log("Server started!");
});