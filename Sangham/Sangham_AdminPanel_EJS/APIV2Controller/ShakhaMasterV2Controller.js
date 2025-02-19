const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetShakhaV2 = [async (req, res) => {
    try {
        if (!req.body.ShakhaName) {
            res.json({ status: 0, message: "Please Enter Shakha Name!", data: null, error: null });
        } else {
            let ShakhaData = await ShakhaMasterModel.findOne({ IsActive: true, ShakhaName: req.body.ShakhaName }).exec();
            if (ShakhaData) {
                return res.status(200).json({ status: 1, message: "Shakha name is already available.", data: ShakhaData, error: null });
            } else {
                var Shakha = await ShakhaMasterModel({
                    ShakhaName: req.body.ShakhaName,
                }).save();
                return res.status(200).json({ status: 1, message: "Shakha Successfully Inserted.", data: Shakha, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.GetShakhaV2 = [async (req, res) => {
    try {
        let shakahadata = await ShakhaMasterModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: shakahadata, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}