const passport = require('passport');
const User = require('../models/Users.model')




// Configure Passport authenticated session persistence.


passport.serializeUser((loggedInUser, next) => {
  next(null, loggedInUser._id)
});

passport.deserializeUser((userIdFromSession, next) => {
  User.findById(userIdFromSession)
    .then(fullUserDoc => next(null, fullUserDoc))
    .catch(err => next(err));
});