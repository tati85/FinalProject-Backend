const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);


/* GET home page */
router.get('/', (req, res) => res.json({ message: 'Index rendered.' }));

cron.schedule("30 * * * *", function () {
    console.log("running a task every minute");
    client.messages
        .create({
            body: 'test from my account',
            from: '+12075077630',
            to: '+17867151065'
        })
        .then(message => console.log(message.sid));
});

module.exports = router;