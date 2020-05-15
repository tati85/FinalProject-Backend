const mongoose = require('mongoose');
var Users = require('../models/Users.model');
// var CreditCardAccount = require('../models/CreditCardAccount.model');
// var CreditReminder = require('../models/CreditReminder.model');
var OffLineAccount = require('../models/OffLineAccount.model');
// var OffLineAccountReminder = require('../models/OffLineAccountReminder.model');

mongoose
    .connect('mongodb://localhost/rem-bill-server', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));