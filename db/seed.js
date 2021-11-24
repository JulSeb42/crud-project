const faker = require("faker")
const mongoose = require("mongoose")

const User = require("../models/User.model")
const Event = require("../models/Event.model")

mongoose.connect("mongodb://localhost/event-app")

let fakeUsers = []

let avatarsArr = []

for (let i = 0; i < 50; i++) {
    avatarsArr.push(`https://randomuser.me/api/portraits/men/${i}.jpg`)
}

for (let i = 0; i < 50; i++) {
    avatarsArr.push(`https://randomuser.me/api/portraits/women/${i}.jpg`)
}

faker.locale = "de"

for (let i = 0; i < 100; i++) {
    fakeUsers.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        imgPath: avatarsArr[i],
        city: "Berlin",
    })
}

User.insertMany(fakeUsers)
    .then(user => {
        console.log(`Success, ${user.length} users were added to the db`)
        mongoose.connection.close()
    })
    .catch(err => console.log(err))
