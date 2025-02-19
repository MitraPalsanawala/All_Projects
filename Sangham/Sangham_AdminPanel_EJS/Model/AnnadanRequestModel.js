var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnnadanRequestSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: true, ref: 'UserMaster' },
    UserMasterID: { type: ObjectId, required: true, ref: 'UserMaster' },
    UniqueID: { type: String, required: false },
    AnnadanRequestStatus: { type: String, required: false, default: 'Pending' },
    RequestStatus: { type: String, required: false, default: '' },
    DirectAccess: { type: String, required: false, default: '' },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'AnnadanRequest' }, { timestamps: false });

module.exports = mongoose.model("AnnadanRequest", AnnadanRequestSchema);