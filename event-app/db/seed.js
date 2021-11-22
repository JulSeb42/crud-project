const faker = require("faker")
const mongoose = require("mongoose")

const User = require("../models/User.model")

mongoose.connect("mongodb://localhost/event-app")

let fakeUsers = []

// Test avatars
const RandomUser = require("randomuser")
const client = new RandomUser()

// client.getUsers(data => console.log(data))

let avatarsArr = []

// async function addAvatars() {
//     for (i = 0; i < 100; i++) {
//         await client.getUsers(data => console.log())
//     }

//     console.log(avatarsArr)
// }

for (let i = 0; i < 50; i++) {
    avatarsArr.push(`https://randomuser.me/api/portraits/men/${i}.jpg`)
}

for (let i = 0; i < 50; i++) {
    avatarsArr.push(`https://randomuser.me/api/portraits/women/${i}.jpg`)
}

console.log(avatarsArr)

for (let i = 0; i < 100; i++) {
    fakeUsers.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        imgPath: avatarsArr[i],
    })
}

User.insertMany(fakeUsers)
    .then(user => {
        console.log(`Success, ${user.length} users were added to the db`)
        mongoose.connection.close()
    })
    .catch(err => console.log(err))
