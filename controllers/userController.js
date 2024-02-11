const User = require('../models/userModel')

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create({
            phoneNumber: req.body.phoneNumber,
            priority: req.body.priority
        })
        res.status(201).json({
            status: "success",
            data: user
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'Error',
            message: "Error Creating user"
        })
    }
}