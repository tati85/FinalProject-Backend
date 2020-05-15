const express = require('express');
const router = express.Router();
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
      return Users.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      })
        .then(user => {
          // user.passwordHash = undefined;
          // res.status(200).json({ user });
          req.login(user, err => {
            if (err)
              return res
                .status(500)
                .json({ message: 'Something went wrong with login!' });
            user.password = "";
            res.status(200).json(user);
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
            console.log(err);
          }
        });
    })
    .catch(err => next(err));
});

//login
router.post('/api/login', (req, res, next) => {
  console.log("inside login in server")

  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong with database query.' });
    }

    if (!user) {
      res.status(401).json(failureDetails);
    }

    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Something went wrong with login!' });
      user.password = "";
      console.log(user)
      res.status(200).json(user);
    });
  })(req, res);
});

//logout
router.post('/api/logout', (req, res) => {
  req.logout();
  res.status(200).json();
});

//update  user's profile
router.post('/api/user/profile', upLoadCloud.single('image'),
  (req, res, next) => {
    // const { firstName, lastName, email, phoneNumber } = req.body;
    let update = req.body;
    update.image = req.file.url;
    Users.findByIdAndUpdate(req.user.id, update,
      { new: true })
      .then((user) => { res.status(200).json(user) })
      .catch((err) => res.status(400).json(err));
  });

//get user
// router.get('/api/user', (req, res, next) => {
//   passport.authenticate('local'),
//     (req, res) => {
//       Users.findById(req.user.id)
//         .then((user) => {
//           user.password = "";
//           res.status(200).json(user)
//         })
//         .catch((err) => res.status(400).json(err));
//     }
// })


module.exports = router;