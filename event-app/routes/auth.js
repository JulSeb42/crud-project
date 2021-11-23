const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const { uploader, cloudinary } = require("../config/cloudinary")

router.get("/signup", (req, res) => {
    res.render("auth/signup", { doctitle: "Create an account" })
})

router.get("/login", (req, res) => {
    res.render("auth/login", { doctitle: "Log in" })
})

router.post("/signup", uploader.single("avatar"), (req, res, next) => {
    const { fullName, email, password, city } = req.body

    const imgPath = req.file.path
    const imgName = req.file.originalname
    const publicId = req.file.filename

    if (password.length < 6) {
        res.render("auth/signup", {
            message: "Your password needs to be 6 char min",
            doctitle: "Sign up",
        })
        return
    }

    if (city.length === 0) {
        res.render("auth/signup", {
            message: "Please enter your city",
        })
        return
    }

    if (fullName.length === 0) {
        res.render("auth/signup", {
            message: "Please enter your full name",
            doctitle: "Sign up",
        })
        return
    }

    if (!email.includes("@")) {
        res.render("auth/signup", {
            message: "Please enter valid email",
            doctitle: "Sign up",
        })
        return
    }

    User.findOne({ email: email }).then(userFromDb => {
        if (userFromDb !== null) {
            res.render("auth/signup", {
                message: "This email is already taken",
                doctitle: "Sign up",
            })
        } else {
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            User.create({
                fullName,
                email,
                password: hash,
                imgPath,
                imgName,
                publicId,
                city,
            
            })
                .then(() => {
                    res.redirect("/thank-you")
                })
                .catch(err => next(err))
        }
    })
})

router.post("/login", (req, res, next) => {
    const { email, password } = req.body

    User.findOne({ email: email }).then(userFromDB => {
        if (userFromDB === null) {
            res.render("auth/login", {
                message: "This email address is not in our database",
                doctitle: "Log in",
            })
            return
        }

        if (bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB
            res.redirect("/profile")
        } else {
            res.render("auth/login", {
                message: "Password is invalid",
                doctitle: "Log in",
            })
        }
    })
})

router.post("/profile/:id/delete", (req, res, next) => {
    const id = req.params.id

    User.findByIdAndRemove(id)
        .then(() => {
            res.redirect("/login")
        })
        .catch(err => next(err))
})

router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        err ? next(err) : res.redirect("/login")
    })
})

module.exports = router
