const express = require('express');


const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'test from my account',
        from: '+12075077630',
        to: '+17867151065'
    })
    .then(message => console.log(message.sid));
