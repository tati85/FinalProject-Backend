const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offLineAccountReminderSchema = new Schema(
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
            ref: "OffLineAccount",
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

const OffLineAccountReminder = mongoose.model('User', offLineAccountReminderSchema);

module.exports = OffLineAccountReminder;