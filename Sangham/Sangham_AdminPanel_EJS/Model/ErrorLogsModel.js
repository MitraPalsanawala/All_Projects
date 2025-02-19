var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ErrorLogsSchema = new Schema({
   ServiceName: { type: String, required: true },
   Method: { type: String, required: true },
   Message: { type: String, required: false },
   RequestBody: { type: JSON, required: false, default: {} },
   InsertBy: { type: String, required: false, default: '' },//future use by the specific user store
   EntryDate: { type: Date, default: Date.now },
}, { collection: 'ErrorLogs' }, { timestamps: false });

module.exports = mongoose.model('ErrorLogs', ErrorLogsSchema);
