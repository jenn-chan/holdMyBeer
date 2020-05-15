var mongoose = require("mongoose");

// Schema set up - how a beer obj should look like
var beerSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [ // array of comment ids
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"  // name of model
        }
    ]
});

// make a model with schema to make an obj with a bunch of mongoose funcationality
var Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;