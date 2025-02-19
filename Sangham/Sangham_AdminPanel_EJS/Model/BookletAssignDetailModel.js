var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BookletAssignDetailSchema = new mongoose.Schema({
    BookletMasterID: { type: ObjectId, required: true, ref: 'BookletMasters' },
    BookletAssignID: { type: ObjectId, required: false, ref: 'BookletAssignDetails' },
    Type:{ type: String, required: true }, //SuperUser, NormalUser
    BookNo: { type: String, required: true },
    Status:{ type: String, required: true }, //Pending, Assign, Complete
    BookletGivenByID: { type: ObjectId, required: true, ref: 'UserMaster' },
    BookletGivenToID: { type: ObjectId, required: true, ref: 'UserMaster' },
    Amount: { type: String, required: false },
    BookletReturnDate: { type: Date, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'BookletAssignDetails' }, { timestamps: false });
module.exports = mongoose.model("BookletAssignDetails", BookletAssignDetailSchema);