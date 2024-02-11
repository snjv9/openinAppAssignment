const express = require('express')
const subTaskController = require('../controllers/subTaskController')
const authController = require('../controllers/authController')

const router = express.Router();

router.route('/').get(authController.protect, subTaskController.getAllUserSubTask);
router.route('/').post(subTaskController.createSubTask);
router.route('/:id').patch(subTaskController.updateSubTask);
router.route('/:id').delete(subTaskController.deleteSubTask)

module.exports = router;