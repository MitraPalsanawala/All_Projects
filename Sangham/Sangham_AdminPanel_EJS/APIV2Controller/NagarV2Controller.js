const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');

async function BindNagarDetailData(req) {
    var CheckUserID, DataResponse, bodyuserID, bodybhagID, CheckBhagID, bodyuserRole, CheckUserRole;
    console.log(req.body)
    bodyuserID = req.body.UserID;
    bodybhagID = req.body.BhagID;
    bodyuserRole = req.body.UserRole;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckBhagID = ((bodybhagID) ? ({ $in: [mongoose.Types.ObjectId(bodybhagID)] }) : { $nin: [] });
    CheckUserRole = ((bodyuserRole) ? ({ $in: [bodyuserRole] }) : { $nin: [] });

    if (bodyuserID && bodyuserRole) {
        let UserData = await UserMasterModel.find({ "_id": CheckUserID, "UserRole": CheckUserRole }).sort({ _id: -1 }).exec();
        if (UserData.length > 0) {
            if (UserData[0].UserRole == "MainUser") {
                DataResponse = await NagarModel.find({ "BhagID": CheckBhagID })
                    .populate({ path: 'BhagID', select: 'BhagName' }).sort({ '_id': -1 }).exec();
            } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser") {
                DataResponse = await UserNagarDetailModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID })
                    .populate({ path: 'UserID', select: 'UserName' })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .populate({ path: 'NagarID', select: 'NagarName' }).sort({ '_id': -1 }).exec();
            } else if (UserData[0].UserRole == "BhagUser") {
                DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID, "BhagID": CheckBhagID })
                    .populate({ path: 'UserID', select: 'UserName' })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .populate('NagarData')
                    //.populate({ path: 'NagarData', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                    .sort({ '_id': -1 }).exec();
            } else {
                return DataResponse;
            }
            return DataResponse;
        } else {
            return DataResponse = 0;
        }
    } else {
        DataResponse = await NagarModel.find({ "BhagID": CheckBhagID }).populate({ path: 'BhagID', select: 'BhagName' }).sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
exports.GetNagarDataV2 = [async (req, res) => {
    try {
        let GetAllNagarData = await BindNagarDetailData(req);
        if (GetAllNagarData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", BhagData: GetAllNagarData, error: null });
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