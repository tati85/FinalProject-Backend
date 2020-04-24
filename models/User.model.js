const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,

    },
    lastName: {
      type: String,
      trim: true,

    },

    profilePicture: {
      imgPath: { type: String, default: "./theme/images/users/default_profile.png" }
    },

    password: {
      type: String
    },

    email: {
      type: String,
      trim: true,
      unique: 'Email already exists',
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      required: 'Email is required'
    },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;