const mongoose = require('mongoose')

const { Schema } = mongoose

const subTaskSchema = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    taskId: {
        type: Number,
        ref: 'Task',
        required: [true, 'A Sub task must be a part of Task']
    },
    status: {
        type: Number,
        required: true,
        max: 1,
        min: 0,
        default: 0,
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
        default: false,
        select: false
    }
})

subTaskSchema.pre('save', async function (next) {
    const len = await this.constructor.countDocuments();
    this.id = len + 1;
    next();

})
const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask; 