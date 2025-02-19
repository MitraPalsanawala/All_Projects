var mongoose = require("mongoose");

var BannerSchema = new mongoose.Schema({
    BannerImage: { type: String, required: true },
    PlayStoreLink: { type: String, required: false },
    PlayStoreType: { type: String, required: false },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'Banner' }, { timestamps: false });

module.exports = mongoose.model("Banner", BannerSchema);