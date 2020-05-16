const express = require('express');
const router = express.Router();
const passport = require('passport');
const OffLineAccount = require('../models/OffLineAccount.model');
const OffLineAccountReminder = require('../models/OffLineAccountReminder.model');
const moment = require('moment');

//delete account
router.delete('/api/offlineaccount/delete/:id', isLoggedIn, (req, res) => {
    OffLineAccount.findById(req.params.id)
        .then(account => {
            if (account.reminderId.length) {
                account.reminderId.map(reminder => {
                    OffLineAccountReminder.findByIdAndDelete(remainder._id)
                        .then(value => { console.log("deleted") })
                        .catch((err) => { console.log(err) })
                });
            };

            OffLineAccount.findByIdAndDelete(account._id)
                .then(() => res.status(200).json({ succes: true }))
                .catch((err) => req.status(400).json(err))
        })
        .catch((err) => req.status(400).json(err));

});

//add Account   
router.post('/api/offlineaccount', isLoggedIn, (req, res) => {
    console.log("*********************inside add acoount server")
    const { name, frecuency, dueDate, amount } = req.body;
    const newAcc = new OffLineAccount({
        name,
        frecuency,
        dueDate,
        userId: req.user.id,
        amount
    })
    newAcc.save()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json(err));

})

//get all accounts--
router.get('/api/offlineaccount/accounts', isLoggedIn, (req, res) => {

    console.log("inside get offline account server");
    console.log(req.user.id + "  **********")
    OffLineAccount.find({ userId: req.user.id })
        // .populate("reminderId")
        .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
        .catch((err) => req.status(400).json(err));

});

// //update account
// router.post('/api/offlineaccount/:id/update'), isLoggedIn, (req, res) => {

//     OffLineAccount.findByIdAndUpdate(req.params.id, req.body, { new: true })
//         .then((updatedAccount) => { res.status(200).json(updatedAccount) })
//         .catch((err) => res.status(400).json({ err }));

// }



//get all acccounts that due in next 30 days 
router.get('/api/offlineaccount/bills', isLoggedIn, (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysNext = now.add(31, "days").format('YYYY-MM-DD');

    OffLineAccount.find({ "dueDate": { $gte: today, $lte: thirtyDaysNext } })
        .populate("reminderId")
        .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
        .catch((err) => req.status(400).json(err));

});

//mark as paid
router.post('/apid/offlineaccount/:id/paid', isLoggedIn, (req, res) => {

    OffLineAccount.findByIdAndUpdate(req.params.id, { dueDate: new Date() })
        .then((data) => { res.status(200).json(data) })
        .catch((err) => { res.status(401).json(err) })
})
module.exports = router;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}
// function diffDate(d1, d2) {
//     const diffTime = Math.abs(d2 - d1);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// }

