var mongoose = require("mongoose");
var ItemTypeSchema = new mongoose.Schema({
    ItemType: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'ItemType' }, { timestamps: false });
module.exports = mongoose.model("ItemType", ItemTypeSchema);