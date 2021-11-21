const router = require("express").Router()

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index", { doctitle: "Homepage" })
})

module.exports = router
