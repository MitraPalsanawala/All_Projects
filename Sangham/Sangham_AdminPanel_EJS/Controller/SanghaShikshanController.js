const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetSanghShikshan = [async (req, res) => {
    try {
        if (!req.body.SanghShikshanName) {
            res.json({ status: 0, message: "Please Enter SanghShikshan!", data: null, error: null });
        } else {
            let SangData = await SanghShikshanModel.findOne({ IsActive: true, SanghShikshanName: req.body.SanghShikshanName }).exec();
            if (SangData) {
                return res.status(200).json({ status: 1, message: "SanghShikshan  is already available.", data: ResData, error: null });
            } else {
                var sanghamdata = await SanghShikshanModel({
                    SanghShikshanName: req.body.SanghShikshanName,
                }).save();
                return res.status(200).json({ status: 1, message: "SanghShikshan Successfully Inserted.", data: sanghamdata, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetSanghShikshan = [async (req, res) => {
    try {
        let SangData = await SanghShikshanModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: SangData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}]

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}