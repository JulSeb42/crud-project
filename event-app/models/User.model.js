const { Schema, model } = require("mongoose")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
    {
        fullName: String,
        email: {
            type: String,
        },
        password: String,
        city: String,
        imgPath: String,
        imgName: String,
        publicId: String,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
)

const User = model("User", userSchema)

module.exports = User
