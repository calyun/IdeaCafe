var mongoose = require("mongoose");

// Mongoose Schema of Food
var talkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    // TODO: have separate official_video_descr and submitting_user_descr(commentary)
    video: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
});

// gives us the talkSchema as Talk
module.exports = mongoose.model("Talk", talkSchema);
// reflects var Talk = mongoose.model("Talk", talkSchema) when in app.js