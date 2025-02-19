var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShakhaMasterSchema = new mongoose.Schema({
    ShakhaName: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'ShakhaMaster' }, { timestamps: false });
module.exports = mongoose.model("ShakhaMaster", ShakhaMasterSchema);