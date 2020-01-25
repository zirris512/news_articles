const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;