const TypeMasterModel = require("../Model/TypeMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetType = [async (req, res) => {
    try {
        if (!req.body.Type) {
            res.json({ status: 0, message: "Please Enter Type!", data: null, error: null });
        } else {
            let TypeData = await TypeMasterModel.findOne({ IsActive: true, Type: req.body.Type }).exec();
            if (TypeData) {
                return res.status(200).json({ status: 0, message: "Type is already available.", data: null, error: null });
            } else {
                var types = await TypeMasterModel({
                    Type: req.body.Type
                }).save();
                return res.status(200).json({ status: 1, message: "Type Successfully Inserted.", data: types, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetType = [async (req, res) => {
    try {
        let TypeData = await TypeMasterModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: TypeData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}]
//---------------------------------------  Panel -------------------------------------------------------//
exports.ViewTypeData = [async (req, res) => {
    try {
        let TypeData = await TypeMasterModel.find({ IsActive: true }).exec();
        res.render('./PanelUser/Type', {
            title: 'Type', TypeData: TypeData,
            SearchData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, ID: ''
        });
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}