var mongoose = require("mongoose");

var ResponsibilitySchema = new mongoose.Schema({
    ResponsibilityName: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Responsibility' }, { timestamps: false });

module.exports = mongoose.model("Responsibility", ResponsibilitySchema);