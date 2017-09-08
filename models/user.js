var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String, ////{type: String, required: true},
    password: String, //{type: String, required: true},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);