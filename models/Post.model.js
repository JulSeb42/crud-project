const { Schema, model } = require("mongoose")

const postSchema = new Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
    },

    message: {
        type: String,
        required: true,
    }
})

const Post = model("Post", postSchema)

module.exports = Post