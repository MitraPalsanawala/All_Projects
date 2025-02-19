const VastiModel = require("../Model/VastiModel");
const NagarModel = require("../Model/NagarModel");
const BhagModel = require("../Model/BhagModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const moment1 = require('moment');
var mongoose = require('mongoose')

exports.BindNagarDropDown = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let NagarData = await NagarModel.find({ IsActive: true, BhagID: mongoose.Types.ObjectId(req.params.BhagID) }).sort({ _id: -1 }).exec();
            res.json({ status: 0, NagarData: NagarData });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.BindVastiDropDown = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let VastiData = await VastiModel.find({ IsActive: true, NagarID: mongoose.Types.ObjectId(req.params.NagarID) }).sort({ _id: -1 }).exec();
            res.json({ status: 0, VastiData: VastiData });
        } else {
            res.redirect('/Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}