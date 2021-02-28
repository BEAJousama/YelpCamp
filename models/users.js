var mongoose = require("mongoose");
var PassportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

userSchema.plugin(PassportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);