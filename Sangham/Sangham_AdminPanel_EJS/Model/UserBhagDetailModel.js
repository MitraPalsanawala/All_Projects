var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserBhagDetailSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: false, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: false, ref: 'Bhag' },
    Type: { type: String, required: false },//Panel, User
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'UserBhagDetail' }, { timestamps: false });
UserBhagDetailSchema.virtual('NagarData', {
    ref: 'Nagar',
    localField: 'BhagID',
    foreignField: 'BhagID',
});
UserBhagDetailSchema.virtual('VastiData', {
    ref: 'Vasti',
    localField: 'BhagID',
    foreignField: 'BhagID',
});
UserBhagDetailSchema.set('toObject', { virtuals: true });
UserBhagDetailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("UserBhagDetail", UserBhagDetailSchema);