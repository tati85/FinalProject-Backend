const express = require('express');
const router = express.Router();
const passport = require('passport');
const CreditReminder = require('../models/CreditReminder.model');
const CreditCardAccount = require('../models/CreditCardAccount.model');


//delete account
router.delete('/api/creditreminder/:accountId/:id', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            CreditCardAccount.findByIdAndUpdate(
                req.params.accountId,
                { $pull: { reminderId: id } },
                { new: true }
            )
                .then(() => {
                    CreditReminder.findByIdAndDelete(req.params.id)
                        .then(() => res.status(200).json({ succes: true }))
                        .catch((err) => req.status(400).json(err));
                })
                .catch((err) => req.status(400).json(err));
        }
});

//get all accounts
router.get('/api/creditreminder/accounts', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            Creditreminder.find({ userId: req.user.id })
                .populate("reminderId")
                .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});
//get remiander by account
router.get('/api/creditreminder/:id/accounts', (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            Creditreminder.find({ userId: req.user.id, cardId: req.params.id })
                .then((reminderFromDb) => { res.status(200).json(reminderFromDb) })
                .catch((err) => req.status(400).json(err));
        }
});

//update account
router.post('/api/creditreminder/:id/update'), (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            const account = req.body;
            account.userId = req.user.id;
            Creditreminder.findByIdAndUpdate(req.params.id, account, { new: true })
                .then((updatedAccount) => { res.status(200).json(updatedAccount) })
                .catch((err) => res.status(400).json(err));
        }
}

//add Account
router.post('/api/creditreminder/:accountId/add'), (req, res) => {
    passport.authenticate('local'),
        (req, res) => {
            const account = req.body;
            account.userId = req.user.id;
            Creditreminder.create(account)
                .then((createdAccount) => {
                    CreditCardAccount.findByIdAndUpdate(
                        req.params.accountId,
                        { $push: { reminderId: createdAccount._id } },
                        { new: true }
                    )
                        .then((updatedAccount) => {
                            res.status(200).json(createdAccount);
                        })
                        .catch((err) => res.status(400).json(err));
                })
                .catch((err) => res.status(400).json(err));
        }
}
module.exports = router;