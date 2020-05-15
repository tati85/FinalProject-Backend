const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offLineAccountSchema = new Schema(
  {
    name: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    },
    //number of days
    frecuency: {
      type: Number,
      // //['once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semiannual', 'annual']
      // enum: [0, 1, 2, 3, 5, 6],
      default: 0
    },
    dueDate: {
      type: Date
    },
    amount: {
      type: Number
    },
    reminderId: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "OffLineAccountreminder"
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

class OffLine {
  static getLastByName() {
    return this.aggregate([
      {
        $match: {
          active: true
        }
      },
      { $sort: { name: 1, created_at: 1 } },
      {
        $group:
        {
          _id: "name",
          lastCreated: { $last: "$created_at" }
        }
      }
    ]

    ).exec()
  }
  static insertRecord(data) {
    return this.create(data)
  }



}
offLineAccountSchema.loadClass(OffLine)

const OffLineAccount = mongoose.model('OffLineAccount', offLineAccountSchema, "offlineaccount");

module.exports = OffLineAccount;