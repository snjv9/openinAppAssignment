const SubTask = require('../models/subTaskModel')
const Task = require('../models/taskModel')
const _ = require('lodash/array')



exports.getAllUserSubTask = async (req, res, next) => {
    try {
        const userId = req.user[0].id
        let tasks = await Task.find({ userId })
        if (!tasks) {
            throw new Error('No tasks for this user')
        }
        tasks = tasks.map((task) => { return task.id });
        if (req.query.taskId) {
            tasks = req.query.taskId.split(',');
        }
        let subTasks = [];
        for (const id of tasks) {
            const doc = await SubTask.find({
                taskId: id,
                isDeleted: false
            });
            subTasks.push(doc);
        }
        const results = _.flatten(subTasks)
        if (!results) {
            throw Error('No subtasks found for this user');
        }
        res.status(200).json({
            status: 'success',
            results: results.length,
            data: results
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: "Error",
            message: "Unable to fetch subtasks"
        })
    }
}

exports.createSubTask = async (req, res, next) => {
    try {

        const taskId = req.body.taskId;

        const task = await Task.findOne({ id: taskId });
        if (!task) {
            throw new Error('Task not found for this taskId')
        }
        const subTask = await SubTask.create({
            taskId

        });
        res.status(201).json({
            status: 'success',
            data: subTask
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Error',
            message: "Error creating subTask"

        })
    }
}

exports.updateSubTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const subTask = await SubTask.findOneAndUpdate({
            id,
            isDeleted: false
        }, {
            status: req.body.status
        }, {
            new: true,
            runValidators: true
        })
        if (!subTask) {
            throw new Error('No sub task found for this user')
        }
        subTask.status = req.body.status
        await subTask.save()
        if (subTask.status === 1) {
            await Task.updateOne({ id: subTask.taskId }, {
                status: 'IN_PROGRESS'
            })
        }

        res.status(201).json({
            status: "success",
            data: subTask
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Error",
            message: "Unable to update"
        })
    }
}

exports.deleteSubTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const subTask = await SubTask.findOneAndUpdate({ id }, { isDeleted: true });
        if (!subTask) {
            throw new Error('No subtask found for this user')
        }
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Error",
            message: "Unable to delete"
        })
    }
}