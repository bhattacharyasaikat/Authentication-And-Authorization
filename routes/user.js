const express = require('express')
const router = express.Router();

const { login, signup } = require("../Controllers/Auth");
const { auth, isStudent, isAdmin } = require('../middlewares/auth');
router.post("/login", login);
router.post("/signup", signup);

// !------- Protected Routes------------

// single middleware
router.get("/test", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "This is protected route for test"
    });
})
// multiple middleware
router.get("/student", auth, isStudent, (req, res) => {
    res.status(200).json({
        success: true,
        message: "This is protected route for Studnet"
    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "This is protected route for Admin"
    });
})
module.exports = router;