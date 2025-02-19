const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');

async function BindVastiDetailData(req) {
    var CheckUserID, DataResponse, bodyuserID, bodyuserRole, bodybhagID, bodynagarID, CheckBhagID, CheckUserRole;
    bodyuserID = req.body.UserID;
    bodybhagID = req.body.BhagID;
    bodynagarID = req.body.NagarID;
    bodyuserRole = req.body.UserRole;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckBhagID = ((bodybhagID) ? ({ $in: [mongoose.Types.ObjectId(bodybhagID)] }) : { $nin: [] });
    CheckNagarID = ((bodynagarID) ? ({ $in: [mongoose.Types.ObjectId(bodynagarID)] }) : { $nin: [] });
    CheckUserRole = ((bodyuserRole) ? ({ $in: [bodyuserRole] }) : { $nin: [] });
    if (bodyuserID && bodyuserRole) {
        let UserData = await UserMasterModel.find({ "_id": CheckUserID, "UserRole": CheckUserRole }).sort({ _id: -1 }).exec();
        if (UserData.length > 0) {
            if (UserData[0].UserRole == "MainUser") {
                DataResponse = await VastiModel.find({ "BhagID": CheckBhagID, "NagarID": CheckNagarID })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .populate({ path: 'NagarID', select: 'NagarName' })
                    .sort({ '_id': -1 }).exec();
            } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser" || UserData[0].UserRole == "BhagUser12") {
                DataResponse = await UserVastiDetailModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID })
                    .populate({ path: 'UserID', select: 'UserName' })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .populate({ path: 'NagarID', select: 'NagarName' })
                    .populate({ path: 'VastiID', select: 'VastiName' })
                    .sort({ '_id': -1 }).exec();
            } else if (UserData[0].UserRole == "BhagUser") {
                DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID })
                    .populate({ path: 'UserID', select: 'UserName' })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .populate({ path: 'VastiData', match: { "NagarID": CheckNagarID } })
                    .sort({ '_id': -1 }).exec();
            } else {
                return DataResponse;
            }
            return DataResponse;
        } else {
            return DataResponse = 0;
        }
    } else {
        DataResponse = await VastiModel.find({ "BhagID": CheckBhagID, "NagarID": CheckNagarID })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
exports.GetVastiDataV2 = [async (req, res) => {
    try {
        let GetAllVastiData = await BindVastiDetailData(req);
        if (GetAllVastiData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", BhagData: GetAllVastiData, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", BhagData: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}