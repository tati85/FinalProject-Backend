const express = require('express');
const router = express.Router();
const plaid = require('plaid');
const moment = require('moment');
const CreditCardAccount = require('../models/CreditCardAccount.model');
const CreditReminder = require('../models/CreditReminder.model');


const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments.development,
    {
        version: "2019-05-29"
    }
)
var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

//create new account
router.post('/api/creditcard/add', isLoggedIn, (req, res) => {
    console.log("inside the add route on server")
    PUBLIC_TOKEN = req.body.public_token;
    let date = moment().add(12, 'd');
    const userId = req.user.id;
    const { name, institution_id } = req.body.metadata.institution;
    console.log("inside server to insert in db " + req.body.metadata.institution)

    if (PUBLIC_TOKEN) {
        client
            .exchangePublicToken(PUBLIC_TOKEN)
            .then(exchangeResponse => {
                ACCESS_TOKEN = exchangeResponse.access_token;
                ITEM_ID = exchangeResponse.item_id;
                //check if the account exist for the user
                CreditCardAccount.findOne({
                    userId: req.user.id,
                    institutionId: institution_id
                })
                    .then(account => {
                        if (account)
                            console.log("account already exist")
                    })
                    .catch((err) => {
                        console.log("not found account in db")
                        client.getBalance(ACCESS_TOKEN)
                            .then(result => {
                                const { available, current } = result.accounts[0].balances;
                                const newAccount = new CreditCardAccount({
                                    userId: userId,
                                    accesToken: ACCESS_TOKEN,
                                    itemId: ITEM_ID,
                                    institutionId: institution_id,
                                    instituitionName: name,
                                    dueDate: date,
                                    balace: current,
                                    available: available
                                });
                                newAccount.save()
                                    .then(account => res.status(200).json(account))
                                    .catch((err) => { console.log(err + "  Error in db saving account") })

                            })
                    })
            })
            .catch(err => res.status(err));//error from plaid
    }
});



// //delete account
// router.delete('/api/creditcard/:id', isLoggedIn, (req, res) => {

//     CreditCardAccount.findByIdAndDelete(req.params.id)
//         .then(() => res.status(200).json({ succes: true }))
//         .catch((err) => res.status(400).json(err));

// });

// //get all accounts BY USER
// router.get('/api/credicard/accounts', (req, res) => {
//     passport.authenticate('local'),
//         (req, res) => {
//             CreditCardAccount.find({ userId: req.user.id })
//                 .populate("reminderId")
//                 .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
//                 .catch((err) => res.status(400).json(err));
//         }
// });
//ALL ACCOUNT BY USER WITHout reminderS
router.get('/api/credicard/accounts', isLoggedIn, (req, res) => {
    console.log()
    CreditCardAccount.find({ userId: req.user.id })
        .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
        .catch((err) => res.status(400).json(err));

});

//get 30 last days of transactions
router.post('/api/creditcard/transactions', isLoggedIn, (req, res) => {
    const now = moment();
    let transactions = [];
    let institutionName;
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format('YYYY-MM-DD');
    const accounts = req.body;

    if (accounts) {
        accounts.forEach(account => {
            ACCESS_TOKEN = account.accesToken;
            institutionName = account.institutionName;
            client.getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
                .then(response => {
                    transactions.push({
                        accountName: institutionName,
                        transactions: response.transactions
                    });
                    if (transactions.length === accounts.length)
                        res.status(200).json(transactions)
                })
                .catch((err) => res.status(400).json(err));
        })
    }
});


//delete account
router.delete('/api/accounts/:id', isLoggedIn, (req, res, ) => {

    CreditCardAccount.findById(req.params.id)
        .then(account => {
            account.reminderId.map(reminder => {
                CreditReminder.findByIdAndDelete(remainder._id)
                    .then(value => { console.log("deleted") })
                    .catch((err) => { console.log(err) })

            });

        })
        .catch((err) => { console.log() })
    CreditCardAccount.findByIdAndDelete(req.params.id)
        .then(value => res.status(200).json({ succes: true }))
        .catch(err => res.jason(err));

});


//GET BALANCE
router.post('/api/creditcard/balance', isLoggedIn, (req, res) => {

    let balances = [];
    let institutionName;
    const accounts = req.body;

    if (accounts) {
        accounts.forEach(account => {
            ACCESS_TOKEN = account.accesToken;
            institutionName = account.institutionName;
            client.getBalance(ACCESS_TOKEN)
                .then(response => {
                    balances.push({
                        accountName: institutionName,
                        balance: response.accounts
                    });
                    if (balances.length === response.length)
                        res.status(200).json(balances)
                })
                .catch((err) => res.status(400).json(err));
        })
    }
});

//get all acccounts in next 30 days(bills) 
router.get('/api/creditcard/bills', isLoggedIn, (req, res) => {

    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysNext = now.add(31, "days").format('YYYY-MM-DD');

    CreditCardAccount.find({ "dueDate": { $gte: today, $lte: thirtyDaysNext } })
        .populate("reminderId")
        .then((accountsFromDb) => { res.status(200).json(accountsFromDb) })
        .catch((err) => req.status(400).json(err));

});

//mark as paid
router.post('/apid/creditcard/:id/paid', isLoggedIn, (req, res) => {

    CreditCardAccount.findByIdAndUpdate(req.params.id, { dueDate: new Date() })
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