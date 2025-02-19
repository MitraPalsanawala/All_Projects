var mongoose = require("mongoose");

var TypeMasterSchema = new mongoose.Schema({
    Type: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'TypeMaster' }, { timestamps: false });

module.exports = mongoose.model("TypeMaster", TypeMasterSchema);