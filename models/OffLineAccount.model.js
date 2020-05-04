const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offLineAccountSchema = new Schema(
  {
    name: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    frecuency: {
      type: String,
      enum: ['once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semiannual', 'annual'],
      default: 'once'
    },
    dueDate: {
      type: Date
    },
    amount: {
      type: Number
    },
    trasactionId: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction"
        }
      ]
    },
    reminderId: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Remainder"
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

const OffLineAccount = mongoose.model('OffLineAccount', offLineAccountSchema);

module.exports = OffLineAccount;