const { Schema, model } = require("mongoose")

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
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
    invitedPeople: Array,
    description: String,
    location: String,
    imgPath: String,
    imgName: String,
    publicId: String,
})

const Event = model("Event", eventSchema)

module.exports = Event
