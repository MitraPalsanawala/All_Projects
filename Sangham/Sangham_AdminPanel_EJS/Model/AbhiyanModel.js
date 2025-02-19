var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AbhiyanSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: true, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: true, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: true, ref: 'Vasti' },
    SocietyID: { type: ObjectId, required: true, ref: 'Society' },
    Sampark: { type: String, required: true },
    SocietyType: { type: String, required: false },//Hindu Society, SarvaDharma Society
    Type: { type: String, required: false },
    HinduCount: { type: String, required: false },
    MuslimCount: { type: String, required: false },
    ChristiansCount: { type: String, required: false },
    AnyCount: { type: String, required: false },
    BJP: { type: String, required: false },
    BJPAnswer: { type: String, required: false },
    Congress: { type: String, required: false },
    CongressAnswer: { type: String, required: false },
    AAP: { type: String, required: false },
    AAPAnswer: { type: String, required: false },
    Others: { type: String, required: false },
    OthersAnswer: { type: String, required: false },
    ServeType: { type: String, required: false, default: "" },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Abhiyan' }, { timestamps: false });

module.exports = mongoose.model("Abhiyan", AbhiyanSchema);