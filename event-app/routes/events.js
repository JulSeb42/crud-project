const router = require("express").Router()
const Events = require("../models/Event.model")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    Events.find().then(eventFromDb => {
        res.render("events", {
            user: loggedInUser,
            event: eventFromDb,
            doctitle: "Events",
        })
    })
})

router.get("/events/:id", loginCheck(), (req, res, next) => {
    const id = req.params.id
    const loggedInUser = req.session.user

    Events.findById(id)
        .populate("organiser")
        .then(eventFromDb => {
            console.log(eventFromDb.organiser)
            res.render("events/detail", {
                doctitle: eventFromDb.title,
                event: eventFromDb,
                user: loggedInUser,
            })
        })
        .catch(err => next(err))
})

module.exports = router
