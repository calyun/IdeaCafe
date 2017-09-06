var mongoose = require("mongoose");

// Mongoose Schema of Food
var talkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    video: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// gives us the talkSchema as Talk
module.exports = mongoose.model("Talk", talkSchema);
// reflects var Talk = mongoose.model("Talk", talkSchema) when in app.js