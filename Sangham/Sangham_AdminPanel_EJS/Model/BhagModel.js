var mongoose = require("mongoose");

var BhagSchema = new mongoose.Schema({
    BhagName: { type: String, required: true },
    KaryavahName: { type: String, required: false },
    MobileNo: { type: String, required: false },
    Address: { type: String, required: false },
    EmailID: { type: String, required: false },
    SahKaryakartaName: { type: String, required: false },
    SahKaryakartaMobileNo: { type: String, required: false },
    SahKaryakartaAddress: { type: String, required: false },
    SahKaryakartaEmailID: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Bhag' }, { timestamps: false });
BhagSchema.virtual('NagarDetail', {
    ref: 'Nagar',
    localField: '_id',
    foreignField: 'UserID',
});
BhagSchema.virtual('VastiDetail', {
    ref: 'Vasti',
    localField: '_id',
    foreignField: 'UserID',
});
BhagSchema.set('toObject', { virtuals: true });
BhagSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("Bhag", BhagSchema);