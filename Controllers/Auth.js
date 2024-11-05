const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//sign up
exports.signup = async (req, res) => {
    try {
        //get data
        const { name, email, password, role } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        // existingUser = await User.findOne({ name });
        // if (existingUser) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Same name already exist"
        //     });
        // }



        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10); // check bcrypt documantation

        }
        catch (err) {
            console.log("Error in hashing password,", err);
            return res.status(500).json({
                success: false,
                message: 'error in hashing password'
            });
        }
        // learn retries strategy
        // create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        console.log(role);
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "error occurred"
        })
    }
}

//  ---- Login----- 


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "fill correctly"
            })
        }

        // registered or not 
        let user = await User.findOne({ email });
        //   console.log(user.email) ;
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found"
            })
        }

        // password chcek . entered pass with password in db
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }
        //   const options={
        //     expiresIn:"2h"
        //   }
        if (await bcrypt.compare(password, user.password)) {
            // generate a JWT token
            // npm i jsonwebtoken


            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

            // insert token in user object.
            user = user.toObject();
            user.token = token;
            user.password = undefined; // remove pass from object (not from DB) so that when we send user object as reponse password wont be passed. 


            //  res.cookie(cookie name,cookie data,options) - takes 3 parameters ;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true, // means from client server it cannot be accessed.



            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: "pass  do not match"
            })
        }



    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failure",
        })
    }
}
