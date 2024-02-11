const express = require('express')
const taskController = require('../controllers/taskController')
const authController = require('../controllers/authController')
const router = express.Router();

router.route('/').post(authController.protect, taskController.createTask)
router.route('/').get(authController.protect, taskController.getAllTasksForUser)
router.route('/:taskId').delete(taskController.deleteTask)
router.route('/:taskId').patch(taskController.updateTask)


module.exports = router;