const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    headlineID: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    },
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;