
const session = require("express-session");          // require session

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


module.exports = app => {
  app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true, cookie: { maxAge: 86400 }, // 1 day
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 // 1 day
    })
  }))
};