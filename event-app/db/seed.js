const faker = require("faker")
const mongoose = require("mongoose")

const User = require("../models/User.model")

mongoose.connect("mongodb://localhost/event-app")

let fakeUsers = []

for (let i = 0; i < 100; i++) {
    fakeUsers.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    })
}

User.insertMany(fakeUsers)
    .then(user => {
        console.log(`Success, ${user.length} users were added to the db`)
        mongoose.connection.close()
    })
    .catch(err => console.log(err))
