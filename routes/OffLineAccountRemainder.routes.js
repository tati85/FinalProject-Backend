const express = require('express')
const router = express.Router();
const passport = require('passport');
const OffLineAccountReminder = require('../models/OffLineAccountReminder.model');
const OffLineAccount = require('../models/OffLineAccount.model');


//delete account
router.delete('/api/offlinereminder/:accountId/:id', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccount.findByIdAndUpdate(
                req.params.accountId,
                { $pull: { reminderId: req.params.id } },
                { new: true }
            )
                .then(() => {
                    OffLineAccountReminder.findByIdAndDelete(req.params.id)
                        .then(() => res.status(200).json({ succes: true }))
                        .catch((err) => req.status(400).json(err));

                })

                .catch((err) => req.status(400).json(err));
        }
});

//get all accounts
router.get('/api/offlinereminder/accounts', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccountReminder.find({ userId: req.user.id })
                .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});
//get remiander by account
router.get('/api/offlinereminder/:id/accounts', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccountReminder.find({ userId: req.user.id, cardId: req.params.id })
                .then((reminderFromDb) => { res.status(200).json(reminderFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});

//update account
router.post('/api/offlinereminder/:id/update'), (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            OffLineAccountReminder.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then((updatedAccount) => { res.status(200).json(updatedAccount) })
                .catch((err) => res.status(400).json(err));
        }
}

//add Account
router.post('/api/offlinereminder/:accountId/add'), (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            const account = req.body;
            account.userId = req.user.id;
            OffLineAccountReminder.create(account)
                .then((createdAccount) => {
                    OffLineAccount.findByIdAndUpdate(
                        req.params.accountId,
                        { $push: { reminderId: createdAccount._id } },
                        { new: true }
                    )
                        .then(updatedAccount => {
                            res.status(200).json(createdAccount)
                        })
                        .catch((err) => res.status(400).json(err));
                })
                .catch((err) => res.status(400).json(err));
        }
}
module.exports = router;