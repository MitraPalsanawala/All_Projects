var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BookletMasterSchema = new mongoose.Schema({
    BookNo: { type: String, required: true },
    Amount: { type: String, required: false },
    Status: { type: Boolean, required: false }, // true, false
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'BookletMasters' }, { timestamps: false });
module.exports = mongoose.model("BookletMasters", BookletMasterSchema);