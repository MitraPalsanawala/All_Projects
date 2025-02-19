const AayamModel = require("../Model/AayamModel");
const AayamDetailModel = require("../Model/AayamDetailModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");

var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');

//------------------------------------------ App ----------------------------------------------------//
exports.SetAayamV2 = [async (req, res) => {
    try {
        if (!req.body.ID) {
            var adddata = await AayamModel({
                UserID: req.body.UserID,
                BhagID: req.body.BhagID,
                NagarID: req.body.NagarID,
                VastiID: req.body.VastiID,
                SocietyID: req.body.SocietyID,
                AayamType: req.body.AayamType,
                AccosiationName: req.body.AccosiationName,
                AayamDate: req.body.AayamDate,
                AayamCount: req.body.AayamCount,
                InterestSubject: req.body.InterestSubject,
                Description: req.body.Description,
                Type: 'App'
            }).save();
            if (req.body.ArrData) {
                var ArrData = req.body.ArrData.split('~');
                for (let i = 0; i < ArrData.length; i++) {
                    var ArrAayamID = ArrData[i].split('@');
                    Aadata = await AayamDetailModel({
                        AayamID: adddata._id,
                        ContactName: ArrAayamID[0],
                        ContactMobileNo: ArrAayamID[1],
                        Type: 'App'
                    }).save();
                    // }
                }
            }
            return res.status(200).json({ status: 1, message: "Aayam Successfully Inserted.", data: adddata, error: null });
        } else {
            var UpdateAayamData = {};
            UpdateAayamData["UserID"] = req.body.UserID;
            UpdateAayamData["BhagID"] = req.body.BhagID;
            UpdateAayamData["NagarID"] = req.body.NagarID;
            UpdateAayamData["VastiID"] = req.body.VastiID;
            UpdateAayamData["SocietyID"] = req.body.SocietyID;
            UpdateAayamData["AayamType"] = req.body.AayamType;
            UpdateAayamData["AccosiationName"] = req.body.AccosiationName;
            UpdateAayamData["AayamDate"] = req.body.AayamDate;
            UpdateAayamData["AayamCount"] = req.body.AayamCount;
            UpdateAayamData["InterestSubject"] = req.body.InterestSubject;
            UpdateAayamData["Description"] = req.body.Description;
            await AayamModel.updateOne({ _id: req.body.ID }, UpdateAayamData).exec();
            await AayamDetailModel.deleteMany({ AayamID: req.body.ID }).exec();

            if (req.body.ArrData) {
                var ArrData = req.body.ArrData.split('~');
                for (let i = 0; i < ArrData.length; i++) {
                    var ArrAayamID = ArrData[i].split('@');
                    await AayamDetailModel({
                        AayamID: req.body.ID,
                        ContactName: ArrAayamID[0],
                        ContactMobileNo: ArrAayamID[1],
                        Type: 'App'
                    }).save();
                    // }
                }
            }
            return res.status(200).json({ status: 1, message: "Aayam Successfully Updated.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetAayamV2 = [async (req, res) => {
    try {
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
        let AayamData = await AayamModel.find({ "IsActive": true, "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID, "VastiID": CheckVastiID, "SocietyID": CheckSocietyID })
            .populate({ path: 'UserID', select: 'UserName' })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .populate({ path: 'VastiID', select: 'VastiName' })
            .populate({ path: 'SocietyID', select: 'SocietyName' })
            .populate('AayamDetail')
            // .populate({ path: 'AayamDetail', select: 'ContactName' })
            .sort({ '_id': -1 }).exec();
        if (AayamData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", Data: AayamData, error: null });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", Data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}