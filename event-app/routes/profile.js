const router = require("express").Router()
const Event = require("../models/Event.model")
const User = require("../models/User.model")
const { uploader, cloudinary } = require("../config/cloudinary")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/profile", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    Event.find({ organiser: loggedInUser._id }).then(eventsFromDb => {
        res.render("profile", {
            user: loggedInUser,
            doctitle: loggedInUser.fullName,
            event: eventsFromDb,
        })
    })
})

router.get("/all-users", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    User.find()
        .sort("fullName")
        .then(allUsers => {
            res.render("profile/all-users", {
                doctitle: "All users",
                user: loggedInUser,
                allUsers,
            })
        })
        .catch(err => next(err))
})

router.get("/profile/:id", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    const id = req.params.id

    User.findById(id).then(userFromDb => {
        Event.find({ organiser: id }).then(eventsFromDb => {  
            console.log('events', eventsFromDb)
        res.render("profile/public", {
            doctitle: userFromDb.fullName,
            userPublic: userFromDb,
            user: loggedInUser,
            event: eventsFromDb,
        })
    })
})
})

module.exports = router
