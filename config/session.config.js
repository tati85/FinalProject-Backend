
const session = require("express-session");          // require session




module.exports = app => {
  app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true
  }))
};