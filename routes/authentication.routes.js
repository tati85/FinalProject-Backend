const { Router } = require('express');

const router = new Router();

const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const passport = require('passport');
const Users = require('../models/Users.model');
const upLoadCloud = require('../config/cloudinary.config');

// const validateRegisterInput = require("../validation/singup");
// const validateLoginInput = require("../validation/login");
//singup
router.post('/api/signup', (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Firstname...coming" + firstName)

  if (!firstName || !lastName || !email || !password) {
    res.status(401).json({
      message:
        'All fields are mandatory. Please provide your username, email and password.'
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).json({
      message:
        'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword
      })
        .then(user => {
          // user.passwordHash = undefined;
          // res.status(200).json({ user });
          req.login(user, err => {
            if (err)
              return res
                .status(500)
                .json({ message: 'Something went wrong with login!' });
            user.passwordHash = undefined;
            res.status(200).json({ message: 'Login successful!', user });
          });
        })
        .catch(err => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).json({ message: err.message });
          } else if (err.code === 11000) {
            res.status(500).json({
              message:
                'Email need to be unique.  Email is already used.'
            });
          } else {
            next(err);
          }
        });
    })
    .catch(err => next(err));
});

//login
router.post('/api/login', (req, res, next) => {
  // const { errors, isValid } = validateLoginInput(req.body);

  // if (!isValid) {
  //   console.log("login no valid")
  //   return res.status(400).json(errors);
  // }

  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong with database query.' });
    }

    if (!user) {
      res.status(401).json(failureDetails);
    }

    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Something went wrong with login!' });
      user.passwordHash = undefined;
      console.log(user)
      res.status(200).json({ message: 'Login successful!', user });
    });
  })(req, res, next);
});

//logout
router.post('/api/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful!' });
});

//update  user's profile
router.patch('/api/user/profile', upLoadCloud.single('image'), (req, res, next) => {

  const { errors, isValid } = validateRegisterInput(req.body);
  const { firstName, lastName, email, password } = req.body;
  let update = { firstName, lastName, email };

  // Check validation
  // if (!isValid) {
  //   console.log("update no valid in profile")
  //   return res.status(400).json(errors);
  // }

  if (req.body.password) {
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => update.password = hashedPassword)
      .catch((err) => { console.log(err) })

  }


  Users.findByIdAndUpdate(req.user.id, update, { image: req.file.url },
    { new: true })
    .then((updatedUser) => { res.status(200).json(updatedUser) })
    .catch((err) => req.status(400).json(err));

});

//get user
router.get('/api/user', (req, res, next) => {
  passport.authenticate('local'),
    (req, res) => {
      Users.findById(req.user.id)
        .then((user) => {
          user.password = "";
          req.status(200).json(user)
        })
        .catch((err) => req.status(400).json(err));
    }
})


module.exports = router;