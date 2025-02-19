var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnnadanItemDetailSchema = new mongoose.Schema({
    AnnadanID: { type: ObjectId, required: true, ref: 'Annadan' },
    ItemTypeID: { type: ObjectId, required: false, ref: 'ItemType' },
    Qty: { type: String, required: false, default: "" },
    QtyType: { type: String, required: false, default: "" },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'AnnadanItemDetail' }, { timestamps: false });

AnnadanItemDetailSchema.virtual('ItemDetail', {
    ref: 'ItemType',
    localField: 'ItemTypeID',
    foreignField: '_id',
});
AnnadanItemDetailSchema.set('toObject', { virtuals: true });
AnnadanItemDetailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model("AnnadanItemDetail", AnnadanItemDetailSchema);