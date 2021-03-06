var mongoose = require("mongoose");

var compgrounSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String

    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Compground", compgrounSchema);