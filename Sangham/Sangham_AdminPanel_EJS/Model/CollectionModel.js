var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var CollectionSchema = new mongoose.Schema({
    CollectionUserID: { type: ObjectId, required: true, ref: 'UserMaster', default: '' },
    UserID: { type: ObjectId, required: true, ref: 'UserMaster', default: '' },
    Amount: { type: String, required: false, default: 0 },
    BankAmount: { type: String, required: false, default: 0 },
    DeductAmount: { type: String, required: false, default: '' },
    TotalNoOfCheque: { type: String, required: false, default: 0 },
    CollectionType: { type: String, required: false, default: '' },
    CollectionStatus: { type: String, required: false, default: '' },
    OtherStatus: { type: String, required: false, default: '' },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Collections' }, { timestamps: false });
module.exports = mongoose.model("Collections", CollectionSchema);