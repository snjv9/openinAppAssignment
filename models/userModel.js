const mongoose = require('mongoose')
const { phone } = require('phone')

const { Schema } = mongoose
const userSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    phoneNumber: {
        type: String,
        minLength: 10,
        maxlength: 10,
        validator: {
            validate: function (num) {
                const temp = phone(num, { country: 'IN' })
                return temp.isValid
            },
            message: "Please Check Phone NUmber"
        },
        required: true
    },
    priority: {
        type: Number,
        min: 0,
        max: 2,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next) {
    const len = await this.constructor.countDocuments();
    this.id = len + 1;
    next();

})
const User = mongoose.model('User', userSchema)

module.exports = User;

