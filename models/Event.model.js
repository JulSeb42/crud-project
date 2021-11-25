const { Schema, model } = require("mongoose")

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    organiser: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    public: String,
    invitedPeople: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    post: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    description: String,
    location: String,
    imgPath: String,
    imgName: String,
    publicId: String,
})

const Event = model("Event", eventSchema)

module.exports = Event
