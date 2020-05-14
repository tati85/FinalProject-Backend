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

    image: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS7T8NdXOWlYT4z7l1OarCUSK-l4gfCqUqcshOSyTxdfbYJRApi&usqp=CAU"
    },

    phoneNumber: {
      type: Number,
      trim: true,
    },

    password: {
      type: String
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: 'Email already exists',
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      required: 'Email is required'
    }
  },
  {
    timestamps: true
  }
);


const Users = mongoose.model('Users', userSchema);

module.exports = Users;