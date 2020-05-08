const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema(
  {
    name: {
      type: String

    },
    dueDate: {
      type: Date
    },
    frecuency: {
      type: String,
      enum: ['once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semiannual', 'annual'],
      default: 'once'
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
    }
  },
  {
    timestamps: true
  }
);

const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = Reminder;