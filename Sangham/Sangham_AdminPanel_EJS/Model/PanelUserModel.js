var mongoose = require("mongoose");

var PanelUserSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    Password: { type: String, required: true },
    CodeBook: { type: String, required: true },
    IsActive: { type: Boolean, required: false, default: 1 },
    IsDelete: { type: Boolean, required: false, default: 0 },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date },
}, { collection: 'PanelUser' }, { timestamps: false });

module.exports = mongoose.model("PanelUser", PanelUserSchema);