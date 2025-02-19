const ResponsibilityModel = require("../Model/ResponsibilityModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetResponsibility = [async (req, res) => {
    try {
        if (!req.body.ResponsibilityName) {
            res.json({ status: 0, message: "Please Enter Responsibility!", data: null, error: null });
        } else {
            let ResData = await ResponsibilityModel.findOne({ IsActive: true, ResponsibilityName: req.body.ResponsibilityName }).exec();
            if (ResData) {
                return res.status(200).json({ status: 1, message: "responsibility  is already available.", data: ResData, error: null });
            } else {
                var responsibility = await ResponsibilityModel({
                    ResponsibilityName: req.body.ResponsibilityName,
                }).save();
                return res.status(200).json({ status: 1, message: "Responsibility Successfully Inserted.", data: responsibility, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetResponsibility = [async (req, res) => {
    try {
        let ResponsibilityData = await ResponsibilityModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: ResponsibilityData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}]

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}