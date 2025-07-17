const express = require('express');
const router = express.Router();
const { login, signUp, sendOTP,changePassword,} = require("../controllers/Auth")
const { resetPasswordToken , resetPassword} = require("../controllers/ResetPass")

const {auth} = require("../middleware/auth")

router.post("/login",login)
router.post("/signup",signUp)
router.post("/sendotp",sendOTP);
router.put("/changepassword",auth,changePassword)

//Reset Password

router.post("/reset-password-token",resetPasswordToken);

router.post("/reset-password",resetPassword)
module.exports = router;