const AbhiyanModel = require("../Model/AbhiyanModel");
const SocietyModel = require("../Model/SocietyModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
const DIR = "./public/upload";
const excelJS = require("exceljs");
const { query } = require("express");

exports.ViewAbhiyanDataV2 = [async (req, res) => {
    try {
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
        var CheckUserRole = ((req.body.UserRole) ? ({ $in: [(req.body.UserRole)] }) : { $nin: [] });
        let abhiyandata = await AbhiyanModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID, "VastiID": CheckVastiID, "SocietyID": CheckSocietyID })
            .populate({ path: 'UserID', select: 'UserName', match: { "UserRole": CheckUserRole } })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .populate({ path: 'VastiID', select: 'VastiName' })
            .populate({ path: 'SocietyID', select: 'SocietyName' })
            .sort({ '_id': -1 }).exec();
        if (abhiyandata.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", abhiyandata: abhiyandata, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", abhiyandata: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SetAbhiyanV2 = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Select User!", data: null, error: null });
        } else if (!req.body.BhagID) {
            res.json({ status: 0, message: "Please Select Bhag!", data: null, error: null });
        } else if (!req.body.NagarID) {
            res.json({ status: 0, message: "Please Select Nagar!", data: null, error: null });
        } else if (!req.body.VastiID) {
            res.json({ status: 0, message: "Please Select Vasti!", data: null, error: null });
        } else if (!req.body.SocietyID) {
            res.json({ status: 0, message: "Please Select Society!", data: null, error: null });
        } else if (!req.body.Sampark) {
            res.json({ status: 0, message: "Please Enter Sampark!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let CheckAbhiyanData = await AbhiyanModel.findOne({
                    IsActive: true,
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    Sampark: req.body.Sampark
                }).exec();
                if (CheckAbhiyanData) {
                    return res.status(200).json({ status: 1, message: "Abhiyan Sampark Already Exist.", data: CheckAbhiyanData, error: null });
                } else {
                    var abhiyan = await AbhiyanModel({
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyID: req.body.SocietyID,
                        Sampark: req.body.Sampark,
                        SocietyType: req.body.SocietyType,
                        Type: req.body.Type,
                        HinduCount: req.body.HinduCount,
                        MuslimCount: req.body.MuslimCount,
                        ChristiansCount: req.body.ChristiansCount,
                        AnyCount: req.body.AnyCount,
                        BJP: req.body.BJP,
                        BJPAnswer: req.body.BJPAnswer,
                        Congress: req.body.Congress,
                        CongressAnswer: req.body.CongressAnswer,
                        AAP: req.body.AAP,
                        AAPAnswer: req.body.AAPAnswer,
                        Others: req.body.Others,
                        OthersAnswer: req.body.OthersAnswer,
                        ServeType: req.body.ServeType,
                        IsActive: true,
                    }).save();
                    return res.status(200).json({ status: 1, message: "Abhiyan Successfully Inserted.", data: abhiyan, error: null });
                }
            }
            else {
                let CheckAbhiyanData = await AbhiyanModel.findOne({
                    IsActive: true, _id: { $nin: mongoose.Types.ObjectId(req.body.ID) },
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    Sampark: req.body.Sampark
                }).exec();
                if (CheckAbhiyanData) {
                    return res.status(200).json({ status: 1, message: "Abhiyan Sampark Already Exist.", data: CheckAbhiyanData, error: null });
                }
                else {
                    var UpdateAbhiyanData = {};
                    UpdateAbhiyanData["UserID"] = req.body.UserID;
                    UpdateAbhiyanData["BhagID"] = req.body.BhagID;
                    UpdateAbhiyanData["NagarID"] = req.body.NagarID;
                    UpdateAbhiyanData["VastiID"] = req.body.VastiID;
                    UpdateAbhiyanData["SocietyID"] = req.body.SocietyID;
                    UpdateAbhiyanData["Sampark"] = req.body.Sampark;
                    UpdateAbhiyanData["SocietyType"] = req.body.SocietyType;
                    UpdateAbhiyanData["Type"] = req.body.Type;
                    UpdateAbhiyanData["HinduCount"] = req.body.HinduCount;
                    UpdateAbhiyanData["MuslimCount"] = req.body.MuslimCount;
                    UpdateAbhiyanData["ChristiansCount"] = req.body.ChristiansCount;
                    UpdateAbhiyanData["AnyCount"] = req.body.AnyCount;
                    UpdateAbhiyanData["BJP"] = req.body.BJP;
                    UpdateAbhiyanData["BJPAnswer"] = req.body.BJPAnswer;
                    UpdateAbhiyanData["Congress"] = req.body.Congress;
                    UpdateAbhiyanData["CongressAnswer"] = req.body.CongressAnswer;
                    UpdateAbhiyanData["AAP"] = req.body.AAP;
                    UpdateAbhiyanData["AAPAnswer"] = req.body.AAPAnswer;
                    UpdateAbhiyanData["Others"] = req.body.Others;
                    UpdateAbhiyanData["OthersAnswer"] = req.body.OthersAnswer;
                    UpdateAbhiyanData["ServeType"] = req.body.ServeType;
                    UpdateAbhiyanData["ModifiedDate"] = new Date();
                    AbhiyanModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateAbhiyanData, { new: true }).exec((error, result) => {
                        if (error) {
                            return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                        } else {
                            return res.status(200).json({ status: 1, message: "Abhiyan Successfully Updated.", data: result, error: null });
                        }
                    })
                }
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}