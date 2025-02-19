const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')

exports.GetSanghShikshanV2 = [async (req, res) => {
    try {
        let SangData = await SanghShikshanModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: SangData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}]

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}