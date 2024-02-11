const Task = require('../models/taskModel')
const User = require('../models/userModel')
const SubTask = require('../models/subTaskModel')

exports.createTask = async (req, res, next) => {
    try {
        const userId = req.user[0].id;
        const user = await User.findOne({ id: userId })
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            userId,
            user: user._id

        });
        res.status(201).json({
            status: 'success',
            data: task
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Error",
            message: 'Error creating Task.Please check the body '
        })
    }
}

exports.getAllTasksForUser = async (req, res, next) => {
    try {

        const userId = req.user[0].id;
        const user = await User.findOne({ id: userId });
        if (!user) {
            const errorMessage = 'User not found'
            throw Error(errorMessage);
        }
        let query = Task.find({
            userId,
            isDeleted: false
        });
        if (req.query) {

            //Deep Copy
            const queryObject = { ...req.query }
            //We don't want to query via these words so we have to exclude them
            const excludedFields = ['page', 'limit',]
            excludedFields.forEach((el) => { delete queryObject[el] });

            let queryStr = JSON.stringify(queryObject);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
                return `$${match}`
            })

            query = query.find(JSON.parse(queryStr));
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 100;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit)

        }
        const tasks = await query

        if (!tasks) {
            throw new Error('NO tasks found for this user')
        }
        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: tasks
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: 'Error',
            message: "Unable to fetch Tasks"
        })
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const id = req.params.taskId;
        const task = await Task.findOneAndUpdate({ id }, {
            isDeleted: true
        });
        if (!task) {
            throw new Error('Task to be deleted not found')
        }
        const subTasks = await SubTask.updateMany({ taskId: id }, { isDeleted: true })

        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'Error',
            message: "Unable to delete Task"
        })
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        const id = req.params.taskId;

        const task = await Task.findOneAndUpdate({ id: id, isDeleted: false }, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            throw new Error('Task to be updated not found')
        }
        res.status(203).json({
            status: "success",
            data: task
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: 'Error',
            message: "Unable to Update Tasks"
        })
    }
}