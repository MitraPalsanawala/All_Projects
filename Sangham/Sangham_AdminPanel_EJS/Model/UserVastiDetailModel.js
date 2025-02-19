var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserVastiDetailSchema = new mongoose.Schema({
    UserID: { type: ObjectId, required: false, ref: 'UserMaster' },
    BhagID: { type: ObjectId, required: false, ref: 'Bhag' },
    NagarID: { type: ObjectId, required: false, ref: 'Nagar' },
    VastiID: { type: ObjectId, required: false, ref: 'Vasti' },
    Type: { type: String, required: false },//Panel, User
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'UserVastiDetail' }, { timestamps: false });
module.exports = mongoose.model("UserVastiDetail", UserVastiDetailSchema);