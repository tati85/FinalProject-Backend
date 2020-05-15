const express = require('express');
const router = express.Router();
const passport = require('passport');
const OffLineAccount = require('../models/OffLineAccount.model');
const OffLineAccountReminder = require('../models/OffLineAccountReminder.model');

//delete account
router.delete('/api/offlineaccount/delete/:name', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccount.find(req.params.name)
                .then(accounts => {
                    accounts.map(account => {
                        if (account.reminderId.length) {
                            account.reminderId.map(reminder => {
                                OffLineAccountReminder.findByIdAndDelete(remainder._id)
                                    .then(value => { console.log("deleted") })
                                    .catch((err) => { console.log(err) })

                            });

                        }

                    });
                })
                .then(() => {
                    OffLineAccount.deleteMany({ name: req.params.name, userId: req.user.id })
                        .then(() => res.status(200).json({ succes: true }))


                })
                .catch((err) => req.status(400).json(err));
        }
});

//get all accounts--
router.get('/api/offlineaccount/accounts/', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            console.log("inside get offline account server");
            console.log(req.user.id + "  **********")
            OffLineAccount.find({ userId: req.user.id })
                // .populate("reminderId")
                .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});

//update account
router.post('/api/offlineaccount/:id/update'), (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccount.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then((updatedAccount) => { res.status(200).json(updatedAccount) })
                .catch((err) => res.status(400).json({ err }));
        }
}

//add Account
router.post('/api/offlineaccount/add'), (req, res, next) => {
    passport.authenticate('local'),
        (req, res) => {
            const account = req.body;
            console.log("inside add offline account server")
            account.userId = req.user.id;
            const monthFromNow = now.add(31, "days");
            let recordToInsert = [];
            let dueDate = moment(account.dueDate)
            const frecuency = account.frecuency;
            let i = 1;
            recordToInsert.push(account);
            if (frecuency >= 1 && frecuency <= 30) {

                while (monthFromNow.diff(dueDate) < 1) {
                    account.dueDate = dueDate.add((frecuency * i), "days");
                    i++;
                    recordToInsert.push(newRec);
                }
            }
            OffLineAccount.insertMany(recordToInsert)
                .then((res) => {
                    if (res.length > 1) {
                        let newRes = res[0];
                        res.status(200).json(newRes);
                    }
                    else
                        res.status(200).json(createdAccounts)
                })
                .catch((err) => res.status(400).json(err));
        }
}


//get all acccounts in next 30 days 
router.get('/api/offlineaccount/bills', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            const now = moment();
            const today = now.format("YYYY-MM-DD");
            const thirtyDaysNext = now.add(31, "days").format('YYYY-MM-DD');

            OffLineAccount.find({ "dueDate": { $gte: today, $lte: thirtyDaysNext } })
                .populate("reminderId")
                .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});
module.exports = router;

