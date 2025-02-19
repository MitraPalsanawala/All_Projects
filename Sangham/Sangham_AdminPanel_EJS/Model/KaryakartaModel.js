var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var KaryakartaSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: true, ref: 'Vasti' },
    SocietyID: { type: ObjectId, required: true, ref: 'Society' },
    Name: { type: String, required: true },
    MobileNo: { type: String, required: false },
    Address: { type: String, required: false },
    EmailID: { type: String, required: false },
    TypeID: { type: ObjectId, required: true, ref: 'TypeMaster' },
    TypeDetailID: { type: ObjectId, required: false, ref: 'TypeDetailMaster' },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Karyakarta' }, { timestamps: false });

module.exports = mongoose.model("Karyakarta", KaryakartaSchema);