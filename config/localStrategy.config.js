const User = require('../models/Users.model');
const bcryptjs = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;




passport.use('local',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, done) => {
      if (email)
        email = email.toLowerCase();
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { errorMessage: 'Incorrect email' });
          }
          if (!bcryptjs.compareSync(password, user.password)) {
            return done(null, false, { errorMessage: 'Incorrect password' });
          }
          done(null, user);
        })
        .catch(err => next(err));
    }));


