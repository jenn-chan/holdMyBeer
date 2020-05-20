var mongoose = require("mongoose");

// Schema set up - how a comment obj should look like
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // ref = refers to the model being used
        },
        username: String
    }
});

// make a model with schema to make an obj with a bunch of mongoose funcationality
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;