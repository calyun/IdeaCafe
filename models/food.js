var mongoose = require("mongoose");

// Mongoose Schema of Food
var foodSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// gives us the foodSchema as Food
module.exports = mongoose.model("Food", foodSchema )
// reflects var Food = mongoose.model("Food", foodSchema) when in app.js