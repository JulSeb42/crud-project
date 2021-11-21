const router = require("express").Router()

const loginCheck = () => {
    return (req, res, next) => {
        req.session.user ? next() : res.redirect("/login")
    }
}

router.get("/profile", loginCheck(), (req, res, next) => {
    const loggedInUser = req.session.user
    res.render("profile", { user: loggedInUser })
})

module.exports = router
