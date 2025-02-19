var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var TypeDetailMasterSchema = new mongoose.Schema({
    TypeID: { type: ObjectId, required: true, ref: 'TypeMaster' },
    TypeDetail: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'TypeDetailMaster' }, { timestamps: false });

module.exports = mongoose.model("TypeDetailMaster", TypeDetailMasterSchema);