const mongoose = require("mongoose");
// help implement passport with mongoose (plugin - too for reusing logic in other schemas)
// takes care of salting/hashing password (random bits added to each unique passport)
const passportLocalMongoose = require("passport-local-mongoose");   // don't need but will make it faster to work with since we have mongo db

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Get functionality from passport-local-mongoose on user model
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;