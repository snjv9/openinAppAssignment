const express = require('express')
const morgan = require('morgan')
const taskRouter = require('./routes/taskRoutes')
const subTaskRouter = require('./routes/subTaskRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();

app.use(express.json({
    limit: '10kb'
}))
app.use(morgan('dev'));

app.use('/api/v1/tasks', taskRouter)
app.use('/api/v1/subtasks', subTaskRouter)
app.use('/api/v1/users', userRouter)
module.exports = app;