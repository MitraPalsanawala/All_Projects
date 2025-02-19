var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NagarSchema = new mongoose.Schema({
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarName: { type: String, required: true },
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
}, { collection: 'Nagar' }, { timestamps: false });

module.exports = mongoose.model("Nagar", NagarSchema);