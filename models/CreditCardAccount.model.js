const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const creditCardAccountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        accesToken: {
            type: String
        },
        dueDate: {
            type: Date
        },
        itemId: {
            type: String
        },
        institutionId: {
            type: String
        },
        institutionName: {
            type: String
        },
        accountName: {
            type: String
        },
        accountType: {
            type: String
        },
        accountSubtype: {
            type: String
        },
        dueDate: {
            type: Date
        },
        reminderId: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Creditreminder"
                }
            ]
        }

    },
    {
        timestamps: true
    }
);
const CreditCardAccount = mongoose.model('Transaction', creditCardAccountSchema);
module.exports = CreditCardAccount;
