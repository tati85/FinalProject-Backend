const passport = require('passport');

require('./localStrategy.config');
require('./passportSerializer.config');

module.exports = app => {
  app.use(passport.initialize()); // this "fires" the passport package
  app.use(passport.session()); // connects passport to sessions
};