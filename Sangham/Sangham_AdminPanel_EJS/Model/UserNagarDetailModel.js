var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserNagarDetailSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: false, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: false, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: false, ref: 'Nagar' },
    Type: { type: String, required: false },//Panel, User
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'UserNagarDetail' }, { timestamps: false });
UserNagarDetailSchema.virtual('VastiDatas', {
    ref: 'Vasti',
    localField: 'NagarID',
    foreignField: 'NagarID',
});
UserNagarDetailSchema.set('toObject', { virtuals: true });
UserNagarDetailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("UserNagarDetail", UserNagarDetailSchema);