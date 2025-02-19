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

exports.ViewSocietyDataV2 = [async (req, res) => {
    try {
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckUserRole = ((req.body.UserRole) ? ({ $in: [(req.body.UserRole)] }) : { $nin: [] });
        let societydata = await SocietyModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID, "VastiID": CheckVastiID })
            .populate({ path: 'UserID', select: 'UserName', match: { "UserRole": CheckUserRole } })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .populate({ path: 'VastiID', select: 'VastiName' })
            .sort({ '_id': -1 }).exec();
        if (societydata.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", Societydata: societydata, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", Societydata: null, error: null });
        }

    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.SetSocietyV2 = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Select User!", data: null, error: null });
        } else if (!req.body.BhagID) {
            res.json({ status: 0, message: "Please Select Bhag!", data: null, error: null });
        } else if (!req.body.NagarID) {
            res.json({ status: 0, message: "Please Select Nagar!", data: null, error: null });
        } else if (!req.body.VastiID) {
            res.json({ status: 0, message: "Please Select Vasti!", data: null, error: null });
        } else if (!req.body.SocietyName) {
            res.json({ status: 0, message: "Please Enter Society Name!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let CheckSocietyData = await SocietyModel.findOne({
                    IsActive: true,
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyName: req.body.SocietyName
                }).exec();
                if (CheckSocietyData) {
                    return res.status(200).json({ status: 1, message: "Society Name Already Exist.", data: CheckSocietyData, error: null });
                } else {
                    var Society = await SocietyModel({
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyName: req.body.SocietyName,
                        SecretaryName: req.body.SecretaryName,
                        SecretaryMobileNo: req.body.SecretaryMobileNo,
                        SecretaryAddress: req.body.SecretaryAddress,
                        SecretaryEmailID: req.body.SecretaryEmailID,
                        Landmark: req.body.Landmark,
                        NumberOfHouse: req.body.NumberOfHouse,
                        // SocietyType: req.body.SocietyType,
                        Type: req.body.Type,
                        SocietyType: req.body.SocietyType,
                        IsActive: true,
                    }).save();
                    return res.status(200).json({ status: 1, message: "Society Successfully Inserted.", data: Society, error: null });
                }
            }
            else {
                let CheckSocietyData = await SocietyModel.findOne({
                    IsActive: true, _id: {
                        $nin: mongoose.Types.ObjectId(req.body.ID)
                    },
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyName: req.body.SocietyName
                }).exec();
                if (CheckSocietyData) {
                    return res.status(200).json({ status: 1, message: "Society Name Already Exist.", data: CheckSocietyData, error: null });
                }
                else {
                    var UpdateSocietyData = {};
                    UpdateSocietyData["UserID"] = req.body.UserID;
                    UpdateSocietyData["BhagID"] = req.body.BhagID;
                    UpdateSocietyData["NagarID"] = req.body.NagarID;
                    UpdateSocietyData["VastiID"] = req.body.VastiID;
                    UpdateSocietyData["SocietyName"] = req.body.SocietyName;
                    UpdateSocietyData["SecretaryName"] = req.body.SecretaryName;
                    UpdateSocietyData["SecretaryMobileNo"] = req.body.SecretaryMobileNo;
                    UpdateSocietyData["SecretaryAddress"] = req.body.SecretaryAddress;
                    UpdateSocietyData["SecretaryEmailID"] = req.body.SecretaryEmailID;
                    UpdateSocietyData["Landmark"] = req.body.Landmark;
                    UpdateSocietyData["NumberOfHouse"] = req.body.NumberOfHouse;
                    // UpdateSocietyData["SocietyType"] = req.body.SocietyType;
                    UpdateSocietyData["Type"] = req.body.Type;
                    UpdateSocietyData["SocietyType"] = req.body.SocietyType;
                    UpdateSocietyData["ModifiedDate"] = new Date();
                    //await SocietyModel.updateOne({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateSocietyData).exec();

                    SocietyModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateSocietyData, { new: true }).exec((error, result) => {
                        if (error) {
                            return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                        } else {
                            return res.status(200).json({ status: 1, message: "Society Successfully Updated.", data: result, error: null });
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