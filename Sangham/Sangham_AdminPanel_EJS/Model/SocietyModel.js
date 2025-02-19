var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SocietySchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: true, ref: 'Vasti' },
    SocietyName: { type: String, required: true },
    SecretaryName: { type: String, required: false },
    SecretaryMobileNo: { type: String, required: false },
    SecretaryAddress: { type: String, required: false },
    SecretaryEmailID: { type: String, required: false },
    Landmark: { type: String, required: false },
    NumberOfHouse: { type: String, required: false },
    Type: { type: String, required: false },//Pramukh, Secratory
    SocietyType: { type: String, required: false },//Society, SevaVasti
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Society' }, { timestamps: false });

module.exports = mongoose.model("Society", SocietySchema);