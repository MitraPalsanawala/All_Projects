var mongoose = require("mongoose");

var SanghShikshanSchema = new mongoose.Schema({
    SanghShikshanName: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'SanghShikshan' }, { timestamps: false });

module.exports = mongoose.model("SanghShikshan", SanghShikshanSchema);

