const express = require('express');
const router = express.Router();
const plaid = require('plaid');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const CreditCardAccount = require('../models/CreditCardAccount.model');
const User = require('../models/User.model');

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

