const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
// const { uploader, cloudinary } = require("../config/cloudinary")

router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/signup", (req, res, next) => {
    const { fullName, email, password } = req.body

    // const imgPath = req.file.path
    // const imgName = req.file.originalname
    // const publicId = req.file.filename

    if (password.length < 6) {
        res.render("auth/signup", {
            message: "Your password needs to be 6 char min",
        })
        return
    }

    if (fullName.length === 0) {
        res.render("auth/signup", { message: "Please enter your full name" })
        return
    }
    if (!email.includes("@")) {
        res.render("auth/signup", { message: "Please enter valid email" })
        return
    }

    User.findOne({ email: email }).then(userFromDb => {
        if (userFromDb !== null) {
            res.render("auth/signup", {
                message: "This email is already taken",
            })
        } else {
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            User.create({
                fullName,
                email,
                password: hash,
                // imgPath,
                // imgName,
                // publicId,
            })
                .then(createdUser => {
                    //console.log(createdUser)
                    res.redirect("/login")
                })
                .catch(err => next(err))
        }
    })
})

router.post("/login", (req, res, next) => {
    const { email, password } = req.body

    User.findOne({ email: email }).then(userFromDB => {
        if (userFromDB === null) {
            res.render("login", { message: "incorrect credentials" })
            return
        }

        if (bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB
            res.redirect("/profile")
        } else {
            res.render("login", { message: "invalid credentials" })
        }
    })
})

module.exports = router
