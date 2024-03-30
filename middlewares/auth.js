const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
    try {
        // extract jwt token
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            console.log(payload);

            req.user = payload; // store the paylod in req.user.So that in next middleware I can get the details easily.. like roles.
            console.log(req.body.role);

        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "something wrong"
        });
    }
}

// authorization for student and admin
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            res.status(401).json({
                success: false,
                message: "this is protected route for student"
            });
        }

        next();

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "User role is not matching"
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            res.status(401).json({
                success: false,
                message: "this is protected route for Admin"
            });
        }

        next();

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "User role is not matching"
        });
    }
}