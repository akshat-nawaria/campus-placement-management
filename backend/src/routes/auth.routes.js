const express = require("express")

const {googleLogin, register, login} = require("../controllers/auth.controller")

const router = express.Router();

router.post("/google", googleLogin)
router.post("/register", register)
router.post("/login", login)

module.exports = router;