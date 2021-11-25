const router = require("express").Router()
const Event = require("../models/Event.model")
const Post = require("../models/Post.model")
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
        .populate("post")
        .populate({
            path: "post",
            populate: { path: "poster", model: "User" },
        })
        .lean()
        .then(eventFromDb => {
            const sortedPosts = eventFromDb.post.sort((a, b) => {
                return b.updatedAt - a.updatedAt
            })

            const canEdit =
                eventFromDb.organiser &&
                eventFromDb.organiser._id.toString() === req.session.user._id

            const newSort = sortedPosts.map(post => {
                if (req.session.user._id === post.poster._id.toString()) {
                    return { ...post, isPoster: true }
                } else {
                    return { ...post, isPoster: false }
                }
            })

            res.render("events/detail", {
                doctitle: eventFromDb.title,
                event: eventFromDb,
                user: loggedInUser,
                canEdit: canEdit,
                post: newSort,
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

const shortDates = date => {
    let convertedDate = new Date(date).toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    let splittedDate = convertedDate.split(", ")
    let splittedMonth = splittedDate[0].split(" ")

    return `${splittedMonth[1]} ${splittedMonth[0]} ${splittedDate[1]}`
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
            location,
        } = req.body

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
            imgPath,
            imgName,
            publicId,
            location,
        }).then(createdEvent => {
            res.redirect(`/events/${createdEvent._id}`)
        })
    }
)

router.get(
    "/events/:id/edit",
    loginCheck(),
    isOrganizer(),
    (req, res, next) => {
        const loggedInUser = req.session.user
        const id = req.params.id
        Event.findById(id)
            .then(event => {
                User.find()
                    .sort("fullName")
                    .then(usersFromDb => {
                        let list = ""
                        for (let user of usersFromDb) {
                            let checked = ""
                            if (event.invitedPeople.includes(user._id)) {
                                checked = "checked"
                            }
                            list += `<li>
                            <input type="checkbox" name="invitedPeople" id="user-${user._id}" value="${user._id}" ${checked}>
                            <label for="user-${user._id}">
                                <span class="img-container">
                                <img src="${user.imgPath}" alt="Picture ${user.fullName}">
                                </span>
                        <span class="name">
                        ${user.fullName}
                        </span>
                        <svg class="icon-check">
                            <use xlink:href="/images/icon-sprite.svg#check"></use>
                        </svg>
                    </label>
                </li>`
                        }
                        res.render("events/edit", {
                            event,
                            list: list,
                            user: loggedInUser,
                            doctitle: "Edit an event",
                            allUsers: usersFromDb,
                            doctitle: `Edit ${event.title}`,
                            deleteEventMsg:
                                "Are you sure you want to delete this event?",
                        })
                    })
            })
            .catch(err => next(err))
    }
)

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
            description,
            invitedPeople,
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

        // console.log(req.body)

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

router.post(
    "/events/:id/delete",
    loginCheck(),
    isOrganizer(),
    (req, res, next) => {
        const id = req.params.id

        Event.findByIdAndRemove(id)
            .then(() => {
                res.redirect("/")
            })
            .catch(err => next(err))
    }
)

// Wall
router.post("/events/:id/post", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    const id = req.params.id

    const { event, message, datePost, timePost } = req.body

    // console.log(req.body)

    const postedDate = shortDates(datePost)

    Post.create({
        poster: loggedInUser,
        event,
        message,
        datePost: postedDate,
        timePost,
    })
        .then(post => {
            Event.findByIdAndUpdate(event, { $push: { post: post._id } }).then(
                () => {
                    res.redirect(`/events/${id}`)
                }
            )
        })
        .catch(err => next(err))
})

router.post(
    "/:eventId/:postId/:posterId/delete",
    loginCheck(),
    (req, res, next) => {
        const loggedInUser = req.session.user
        const id = req.params.eventId
        const postId = req.params.postId
        const posterId = req.params.posterId

        console.log(posterId)
        console.log(loggedInUser._id)

        if (posterId === loggedInUser._id) {
            Post.findByIdAndRemove(postId).then(() => {
                res.redirect(`/events/${id}`)
            })
        }
    }
)

module.exports = router
