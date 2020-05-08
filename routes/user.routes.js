const express = require('express');
const router = express.Router();
const passport = require('passport');
const Users = require('../models/Users.model');
const upLoadCloud = require('../config/cloudinary.config');

//update  user's profile
router.post('/api/user/profile', upLoadCloud.single('image'), (req, res, next) => {
    passport.authenticate('local'),
        (req, res) => {
            const profile = req.body;
            profile.image = req.fiel.url;

            Users.findByIdAndUpdate(req.user.id, req.body, { new: true })
                .then((updatedUser) => { res.status(200).json(updatedUser) })
                .catch((err) => req.status(400).json(err));
        }
})
module.exports = router;