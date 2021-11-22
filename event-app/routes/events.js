const router = require("express").Router()
const Event = require("../models/Event.model")
const { uploader } = require("../config/cloudinary")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    Event.find().then(eventFromDb => {
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

    Event.findById(id)
        .populate("organiser")
        .then(eventFromDb => {
            res.render("events/detail", {
                doctitle: eventFromDb.title,
                event: eventFromDb,
                user: loggedInUser,
            })
        })
        .catch(err => next(err))
})

router.get("/profile/new-event", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("profile/new-event", {
        user: loggedInUser,
        doctitle: "Create a new event",
    })
})

// Create Events
router.post(
    "/profile/new-event",
    loginCheck(),
    uploader.single("cover"),
    (req, res, next) => {
        const loggedInUser = req.session.user

        const {
            title,
            startDate,
            endDate,
            startTime,
            endTime,
            organiser,
            description,
        } = req.body

        const imgPath = req.file.path
        const imgName = req.file.originalname
        const publicId = req.file.filename

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
            imgPath,
            imgName,
            publicId,
        }).then(createdEvent => {
            console.log(createdEvent)
            res.redirect(`/events/${createdEvent._id}`)
        })
    }
)

module.exports = router
