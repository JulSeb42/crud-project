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
    res.render("profile", {
        user: loggedInUser,
        doctitle: loggedInUser.fullName,
    })
})

router.get("/profile/new-event", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("profile/new-event", {
        user: loggedInUser,
        doctitle: "Create a new event",
    })
})

router.get("/profile/event-created", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("profile/event-created", {
        doctitle: "Event created!",
        user: loggedInUser,
    })
})

router.get("/all-users", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    User.find()
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
    // res.render("profile/public", {
    //     user: loggedInUser,
    //     doctitle: loggedInUser.fullName,
    // })
    User.findById(id).then(userFromDb => {
        res.render("profile/public", {
            doctitle: userFromDb.fullName,
            userPublic: userFromDb,
            user: loggedInUser,
        })
    })
})

router.post("/profile/new-event", loginCheck(), uploader.single('cover'), (req, res, next) => {
    const loggedInUser = req.session.user

    const {
        title,
        startDate,
        endDate,
        startTime,
        endTime,
        organiser,
        description,
        imgPath,
        imgName,
        publicId,
    } = req.body

    if (title.length === 0) {
        res.render("profile/new-event", {
            message: "The title can not be empty",
        })
        return
    }

    if (startDate.length === 0) {
        res.render("profile/new-event", {
            message: "Please enter a start date",
        })
        return
    }

    if (endDate.length === 0) {
        res.render("profile/new-event", {
            message: "Please enter an end date",
        })
        return
    }

    if (startTime.length === 0) {
        res.render("profile/new-event", {
            message: "Please enter a start time",
        })
        return
    }

    if (endTime.length === 0) {
        res.render("profile/new-event", {
            message: "Please enter an end time",
        })
        return
    }

    Event.create({
        title,
        startDate,
        endDate,
        startTime,
        endTime,
        organiser,
        description,
    }).then(() => {
        res.redirect("/profile/event-created")
    })
})

module.exports = router
