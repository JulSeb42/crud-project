const router = require("express").Router()
const Event = require("../models/Event.model")
const User = require("../models/User.model")
const { uploader, cloudinary } = require("../config/cloudinary")
const bcrypt = require("bcryptjs")

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/profile", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    
    Event.find({ organiser: loggedInUser._id })
        .sort("startDate")
        .then(eventsFromDb => {
            Event.find({ invitedPeople:  loggedInUser._id })
                .sort("startDate")
                .then(eventsInvited => {
                
                    res.render("profile", {
                        user: loggedInUser,
                        doctitle: loggedInUser.fullName,
                        event: eventsFromDb,
                        events: eventsInvited,
                    })
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
        Event.find({ organiser: id })
            .sort("startDate")
            .then(eventsFromDb => {
                Event.find({ invitedPeople: id })
                    .sort("startDate")
                    .then(eventsInvited => {
                        res.render("profile/public", {
                            doctitle: userFromDb.fullName,
                            userPublic: userFromDb,
                            user: loggedInUser,
                            event: eventsFromDb,
                            events: eventsInvited,
                        })
                    })
            })
    })
})

router.get("/profile/:id/edit", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    const id = req.params.id

    User.findById(id)
        .then(userFromDb => {
            res.render("profile/edit", {
                user: loggedInUser,
                userInfo: userFromDb,
                doctitle: "Edit your profile",
                messageDelete: "Are you sure you want to delete your account?",
            })
        })
        .catch(err => next(err))
})

router.get("/profile/:id/edit-password", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    const id = req.params.id

    User.findById(id).then(userFromDb => {
        res.render("profile/edit-password", {
            user: loggedInUser,
            userInfo: userFromDb,
            doctitle: "Change your password",
        })
    })
})

router.post(
    "/profile/:id/edit",
    uploader.single("avatar"),
    loginCheck(),
    (req, res, next) => {
        const id = req.params.id
        const loggedInUser = req.session.user

        const { avatar, fullName, city, bio } = req.body

        let imgPath, imgName, publicId

        if (req.file === undefined) {
            imgPath = loggedInUser.imgPath
            imgName = loggedInUser.imgName
            publicId = loggedInUser.publicId
        } else {
            imgPath = req.file.path
            imgName = req.file.originalname
            publicId = req.file.filename
        }

        if (city.length === 0) {
            res.render("profile/edit", {
                message: "Please enter your city",
                doctitle: "Edit your profile",
                user: loggedInUser,
            })
            return
        }

        if (fullName.length === 0) {
            res.render("profile/edit", {
                message: "Your full name can not be empty",
                doctitle: "Edit your profile",
                user: loggedInUser,
            })
            return
        }

        User.findByIdAndUpdate(
            id,
            {
                avatar,
                fullName,
                city,
                imgPath,
                imgName,
                publicId,
                bio,
            },
            { new: true }
        )
            .then(updatedUser => {
                req.session.user = updatedUser
                res.redirect("/profile")
            })
            .catch(err => next(err))
    }
)

router.post("/profile/:id/edit-password", loginCheck(), (req, res, next) => {
    const id = req.params.id
    const loggedInUser = req.session.user

    const { password } = req.body

    if (password.length !== 0 && password.length < 6) {
        res.render("profile/edit", {
            message: "Your password needs to be 6 characters minimum",
            doctitle: "Edit your profile",
            user: loggedInUser,
        })

        return
    }

    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)

    User.findByIdAndUpdate(
        id,
        {
            password: hash,
        },
        { new: true }
    )
        .then(updatedUser => {
            req.session.user = updatedUser
            res.redirect("/profile")
        })
        .catch(err => next(err))
})

module.exports = router
