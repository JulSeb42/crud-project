const router = require("express").Router()
const Event = require("../models/Event.model")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/profile", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("profile", { user: loggedInUser })
})

router.get("/profile/new-event", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    console.log(loggedInUser)
    res.render("profile/new-event", { user: loggedInUser })
})

router.get("/profile/event-created", (req, res, next) => {
    res.render("profile/event-created")
})

router.post("/profile/new-event", (req, res, next) => {
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
