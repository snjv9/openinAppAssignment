const mongoose = require('mongoose')

const { Schema } = mongoose

const taskSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [40, 'Title should be less than 40 characters'],
        minLength: [1, 'Title should be more than 1 character']
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['TO_DO', 'IN_PROGRESS', 'DONE'],
            message: `status is either TO_DO, IN_PROGRESS or DONE`
        },
        default: 'TO_DO'
    },
    priority: {
        type: Number,
        min: 0,
        max: 3,
        default: 3
    },
    userId: {
        type: Number,
        required: [true, 'Task should be created by a user']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    dueDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {

    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})

taskSchema.pre('save', async function (next) {
    const len = await this.constructor.countDocuments();
    this.id = len + 1;
    const currentTime = new Date();
    const timeDiff = (this.dueDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24);
    if (timeDiff >= 5) {
        this.priority = 3
    } else if (timeDiff < 5 && timeDiff >= 3) {
        this.priority = 2
    } else if (timeDiff < 3 && timeDiff >= 1) {
        this.priority = 1
    } else {
        this.priority = 0
    }

    next();
})
// taskSchema.virtual('user', {
//     ref: 'User',
//     foreignField: 'id',
//     localField: 'userId'
// })

taskSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'phoneNumber priority'
    })
    next();
})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;