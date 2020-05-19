var mongoose = require("mongoose");
var Beer = require("./models/beer");
var Comment = require("./models/comment");

var seeds = [
    {
        name: "Beer 1", 
        image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Hoppy"
    },
    {
        name: "Beer 2", 
        image: "https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Hazy"
    },
    {
        name: "Beer 3", 
        image: "https://images.unsplash.com/photo-1457382713369-161d1d986f54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Dark"
    },
    {
        name: "Beer 4", 
        image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cfdc0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Strong"
    },
    {
        name: "Beer 5", 
        image: "https://images.unsplash.com/photo-1532634726-8b9fb99845fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Light"
    }
]

async function seedDB() {
    try {
        // wait for function to finish before continuing
        await Comment.deleteMany({});
        await Beer.deleteMany({});

        // for(var seed of seeds) {
        //     let beer = await Beer.create(seed);
        //     console.log("added beer!");

        //     let comment = await Comment.create({
        //         text: 'This is one of the best beers!',
        //         author: 'Jennifer'
        //     });
        //     console.log("created comment!");

        //     beer.comments.push(comment);
        //     beer.save();
        //     console.log("beer save--");
        // }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;