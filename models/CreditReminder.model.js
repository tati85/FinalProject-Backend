const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creditReminderSchema = new Schema(
    {
        active: {
            type: Boolean,
            default: false,

        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },

        cardId: {
            type: Schema.Types.ObjectId,
            ref: "CreditCardAccount",
        },

        message: {
            type: String,
            default: 'Remember to pay this account',
        }

    },
    {
        timestamps: true
    }
);

const CreditReminder = mongoose.model('Creditreminder', creditReminderSchema);

module.exports = CreditReminder;