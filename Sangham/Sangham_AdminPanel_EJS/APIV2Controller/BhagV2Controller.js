const BhagModel = require("../Model/BhagModel");
const UserMasterModel = require("../Model/UserMasterModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');

async function BindBhagDetailData(req) {
    console.log("req.body", req.body);
    var CheckUserID, CheckSearchID, DataResponse, bodyuserID, bodyuserRole, CheckUserRole;
    bodyuserID = req.body.UserID;
    bodyuserRole = req.body.UserRole;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchMobileno = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    CheckUserRole = ((bodyuserRole) ? ({ $in: [bodyuserRole] }) : { $nin: [] });

    if (bodyuserID && bodyuserRole) {
        let UserData = await UserMasterModel.find({ "_id": CheckUserID, "UserRole": CheckUserRole }).sort({ _id: -1 }).exec();
        console.log("UserData", UserData)
        if (UserData.length > 0) {
            if (UserData[0].UserRole == "MainUser") {
                DataResponse = await BhagModel.find({ "_id": CheckSearchID }).sort({ '_id': -1 }).exec();
            } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser" || UserData[0].UserRole == "BhagUser") {
                DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID })
                    .populate({ path: 'UserID', select: 'UserName' })
                    .populate({ path: 'BhagID', select: 'BhagName' })
                    .sort({ '_id': -1 }).exec();
            } else {
                return DataResponse;
            }
            return DataResponse;
        } else {
            return DataResponse = 0;
        }
    } else {
        DataResponse = await BhagModel.find({ "_id": CheckSearchID }).sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
exports.GetBhagDataV2 = [async (req, res) => {
    try {
        let GetAllBhagData = await BindBhagDetailData(req);
        if (GetAllBhagData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", BhagData: GetAllBhagData, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", BhagData: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.SetBhagV2 = [async (req, res) => {
    try {
        if (!req.body.BhagName) {
            res.json({ status: 0, message: "Please Enter Bhag Name!", data: null, error: null });
        } else {
            let BhagData = await BhagModel.findOne({ IsActive: true, BhagName: req.body.BhagName }).exec();
            if (BhagData) {
                return res.status(200).json({ status: 1, message: "Bhag name is already available.", data: BhagData, error: null });
            } else {
                var Bhag = await BhagModel({
                    BhagName: req.body.BhagName,
                    KaryavahName: req.body.KaryavahName,
                    MobileNo: req.body.MobileNo,
                    Address: req.body.Address,
                    EmailID: req.body.EmailID,
                    SahKaryakartaName: req.body.SahKaryakartaName,
                    SahKaryakartaMobileNo: req.body.SahKaryakartaMobileNo,
                    SahKaryakartaAddress: req.body.SahKaryakartaAddress,
                    SahKaryakartaEmailID: req.body.SahKaryakartaEmailID
                }).save();
                return res.status(200).json({ status: 1, message: "Bhag Successfully Inserted.", data: Bhag, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}