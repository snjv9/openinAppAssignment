const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
const { CronJob } = require('cron')
const Task = require('./models/taskModel')


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)
mongoose.set("strictQuery", false);

// Define the database URL to connect to.

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(DB);
    console.log('Connected To DataBase');
}


const updatePriority = async () => {
    try {
        const currDate = new Date()
        const tasks0 = await Task.updateMany({
            isDeleted: false,
            dueDate: {
                $lt: currDate.setDate(currDate.getDate() + 1)
            }
        }, {
            priority: 0
        })
        console.log('Tasks with 0(immediate) priority updated')
        const tasks1 = await Task.updateMany({
            isDeleted: false,
            dueDate: {
                $lte: currDate.setDate(currDate.getDate() + 3),
                $gt: currDate.setDate(currDate.getDate() + 1)
            }

        }, {
            priority: 1
        })
        console.log('Tasks with priority 1 updated')

        const tasks2 = await Task.updateMany({
            isDeleted: false,
            dueDate: {
                $lte: currDate.setDate(currDate.getDate() + 5),
                $gt: currDate.setDate(currDate.getDate() + 3)
            }
        }, {
            priority: 2
        })
        console.log('Tasks with priority 2 updated')

    } catch (err) {
        console.log(err)
    }

}
const job = new CronJob(
    '0 0 0 * * *', // cronTime (At 12 am daily)
    updatePriority, // onTick
    null, // onComplete
    true, // start
    'default' // timeZone
);

