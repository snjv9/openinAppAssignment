const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { promisify } = require('util')

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new Error(' Please Log In to continue')
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        const freshUser = await User.find({ id: decoded.id });
        if (!freshUser) {
            throw new Error('The user belonging to this token does not exist',)
        }
        req.user = freshUser;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            status: "Error",
            message: "Login Failure"

        })
    }
}