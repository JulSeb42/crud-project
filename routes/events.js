const router = require("express").Router()
const Event = require("../models/Event.model")
const { uploader } = require("../config/cloudinary")

const User = require("../models/User.model")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

const isOrganizer = () => {
    return (req, res, next) => {
        Event.findById(req.params.id).then(event => {
            event.organiser.toString() === req.session.user._id
                ? next()
                : res.redirect("/")
        })
    }
}

router.get("/", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    Event.find()
        .sort("startDate")
        .then(eventFromDb => {
            res.render("events", {
                user: loggedInUser,
                event: eventFromDb,
                doctitle: "Events",
            })
        })
})

router.get("/events/new-event", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user

    User.find()
        .sort("fullName")
        .then(userFromDb => {
            res.render("events/new-event", {
                user: loggedInUser,
                doctitle: "Create a new event",
                allUsers: userFromDb,
            })
        })
        .catch(err => next(err))
})

router.get("/events/:id", loginCheck(), (req, res, next) => {
    const id = req.params.id
    const loggedInUser = req.session.user

    Event.findById(id)
        .populate("organiser")
        .populate("invitedPeople")
        .then(eventFromDb => {
            const canEdit =
                eventFromDb.organiser &&
                eventFromDb.organiser._id.toString() === req.session.user._id
            res.render("events/detail", {
                doctitle: eventFromDb.title,
                event: eventFromDb,
                user: loggedInUser,
                canEdit: canEdit,
            })
        })
        .catch(err => next(err))
})

const newDates = date => {
    let convertedDate = new Date(date).toLocaleDateString("en-EN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    let splittedDate = convertedDate.split(",")

    return splittedDate.join("")
}

// Create Events
router.post(
    "/events/new-event",
    loginCheck(),
    uploader.single("cover"),
    (req, res, next) => {
        const loggedInUser = req.session.user

        let {
            title,
            startDate,
            endDate,
            startTime,
            endTime,
            organiser,
            description,
            invitedPeople,
            public,
            location,
        } = req.body

        // const imgPath = req.file.path
        // const imgName = req.file.originalname
        // const publicId = req.file.filename

        let imgPath, imgName, publicId

        // https://res.cloudinary.com/dyfxmafvr/image/upload/v1637686921/event-app/rfkqwvgddravtkkwiwhi.jpg

        if (req.file === undefined) {
            imgPath = "https://source.unsplash.com/random"
            imgName = "https://source.unsplash.com/random"
            publicId = "https://source.unsplash.com/random"
        } else {
            imgPath = req.file.path
            imgName = req.file.originalname
            publicId = req.file.filename
        }

        if (title.length === 0) {
            res.render("events/new-event", {
                message: "The title can not be empty",
            })
            return
        }

        if (startDate.length === 0) {
            res.render("events/new-event", {
                message: "Please enter a start date",
            })
            return
        }

        if (endDate.length === 0) {
            res.render("events/new-event", {
                message: "Please enter an end date",
            })
            return
        }

        if (startTime.length === 0) {
            res.render("events/new-event", {
                message: "Please enter a start time",
            })
            return
        }

        if (endTime.length === 0) {
            res.render("events/new-event", {
                message: "Please enter an end time",
            })
            return
        }

        const newStartDate = newDates(startDate)
        const newEndDate = newDates(endDate)

        Event.create({
            title,
            startDate: newStartDate,
            endDate: newEndDate,
            startTime,
            endTime,
            organiser,
            description,
            invitedPeople,
            public,
            imgPath,
            imgName,
            publicId,
            location,
        }).then(createdEvent => {
            res.redirect(`/events/${createdEvent._id}`)
        })
    }
)

router.get("/events/:id/edit", loginCheck(), isOrganizer(), (req, res, next) => {
    const loggedInUser = req.session.user
    const id = req.params.id

    Event.findById(id)
        .then(event => {
            User.find()
                .sort("fullName")
                .then(userFromDb => {
                    res.render("events/edit", {
                        event,
                        user: loggedInUser,
                        doctitle: "Edit an event",
                        allUsers: userFromDb,
                        doctitle: `Edit ${event.title}`,
                        deleteEventMsg: 'Are you sure you want to delete this event?'
                    })
                })
        })
        .catch(err => next(err))
})

router.post(
    "/events/:id/edit",
    isOrganizer(),
    uploader.single("cover"),
    loginCheck(),
    (req, res, next) => {

        const id = req.params.id
        const loggedInUser = req.session.user

        const {
            title,
            startDate,
            endDate,
            startTime,
            endTime,
            organiser,
            description,
            invitedPeople,
            public,
            location,
        } = req.body

        let imgPath, imgName, publicId

        // https://res.cloudinary.com/dyfxmafvr/image/upload/v1637686921/event-app/rfkqwvgddravtkkwiwhi.jpg

        if (req.file === undefined) {
            imgPath = imgPath
            imgName = imgName
            publicId = publicId
        } else {
            imgPath = req.file.path
            imgName = req.file.originalname
            publicId = req.file.filename
        }

        Event.findByIdAndUpdate(
            id,
            {
                title,
                startDate,
                endDate,
                startTime,
                endTime,
                location,
                description,
                invitedPeople,
                imgPath,
                imgName,
                publicId,
            },
            { new: true }
        )
            .then(() => {
                res.redirect(`/events/${id}`)

            })
            .catch(err => next(err))
    }
)

router.post("/events/:id/delete", loginCheck(), isOrganizer(), (req, res, next) => {
    const id = req.params.id

    Event.findByIdAndRemove(id)
        .then(() => {
            res.redirect("/")
        })
        .catch(err => next(err))
})

module.exports = router
