var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AayamDetailSchema = new mongoose.Schema({
    AayamID: { type: ObjectId, required: true, ref: 'Aayam' },
    ContactName: { type: String, required: false },
    ContactMobileNo: { type: String, required: false },
    Type: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'AayamDetail' }, { timestamps: false });

module.exports = mongoose.model("AayamDetail", AayamDetailSchema);