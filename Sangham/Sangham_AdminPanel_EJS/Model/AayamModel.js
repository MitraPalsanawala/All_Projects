var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AayamSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: true, ref: 'Vasti' },
    SocietyID: { type: ObjectId, required: true, ref: 'Society' },
    AayamType: { type: String, required: false },
    AccosiationName: { type: String, required: false },
    AayamDate: { type: String, required: false },
    AayamCount: { type: String, required: false },
    InterestSubject: { type: String, required: false },
    Description: { type: String, required: false },
    Type: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Aayam' }, { timestamps: false });
AayamSchema.virtual('AayamDetail', {
    ref: 'AayamDetail',
    localField: '_id',
    foreignField: 'AayamID',
});
AayamSchema.set('toObject', { virtuals: true });
AayamSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("Aayam", AayamSchema);