const router = require("express").Router()

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("events", { user: loggedInUser, doctitle: "Events" })
})

module.exports = router
