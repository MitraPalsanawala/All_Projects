var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var VastiSchema = new mongoose.Schema({
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiName: { type: String, required: true },
    PramukhName: { type: String, required: false },
    MobileNo: { type: String, required: false },
    Address: { type: String, required: false },
    EmailID: { type: String, required: false },
    VastiVali: { type: String, required: false },
    VastiToli: { type: String, required: false },
    UpPramukhName: { type: String, required: false },
    UpPramukhMobileNo: { type: String, required: false },
    UpPramukhAddress: { type: String, required: false },
    UpPramukhEmailID: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Vasti' }, { timestamps: false });
module.exports = mongoose.model("Vasti", VastiSchema);