const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    date: {
      type: Date
    },
    description: {
      type: String
    },

    category: {
      type: String
    },

    amount: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;