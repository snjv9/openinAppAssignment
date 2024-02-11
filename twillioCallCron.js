const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
const { CronJob } = require('cron')
const Task = require('./models/taskModel');
const client = require('twilio')(process.env.accountSid, process.env.authToken);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)
mongoose.set("strictQuery", false);

// Define the database URL to connect to.

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(DB);
    console.log('Connected To DataBase');
}


const twilioCall = async () => {
    try {
        const currDate = new Date()
        const tasks = await Task.find({
            isDeleted: false,
            dueDate: {
                $lte: currDate
            }
        }).select('title user')
        let users = tasks.filter((el) => {
            return el.user
        })

        let uniqueUsers = []
        users.forEach(element => {
            if (!uniqueUsers.includes(element)) {
                uniqueUsers.push(element);
            }
        })
        uniqueUsers.sort(function (x, y) {
            if (x.priority > y.priority) {
                return 1;
            }
            else {
                return -1;
            }
        })

        for (let task of uniqueUsers) {
            const phoneNumber = '+91'.concat(task.user.phoneNumber)

            await client.calls.create({
                twiml: `<MESSAGE>`,
                to: phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER
            })

        }
    }
    catch (err) {
        console.log(err)
    }

}
twilioCall()
const job = new CronJob(
    '0 0 0 * * *', // cronTime (At 12 am daily)
    twilioCall, // onTick
    null, // onComplete
    true, // start
    'default' // timeZone
);