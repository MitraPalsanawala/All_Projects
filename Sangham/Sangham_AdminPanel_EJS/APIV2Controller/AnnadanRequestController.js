const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const AnnadanRequestModel = require("../Model/AnnadanRequestModel");
const helper = require("../helpers/utility");
const uuid = require('uuid')
var mongoose = require('mongoose')

exports.PendingAnnadanRequestV2 = [async (req, res) => {
    try {
        if (!req.body.ID) {
            return res.status(200).json({ status: 1, message: "Please Enter User ID.", data: null, error: null })
        } else {
            let getuserdata = await UserMasterModel.find({ "_id": req.body.ID })
                .populate({ path: 'UserID', select: 'UserName DeviceID' }).sort({ '_id': -1 }).exec();
            let getannadanrequestdata = await AnnadanRequestModel.find({ "UserID": req.body.ID }).exec();
            var GetAllNotification = [];
            var ArrUserData = [];
            var uniqueRandomID = uuid.v4();
            if (getuserdata.length > 0) {
                if (getannadanrequestdata.length > 0) {
                    if (getannadanrequestdata[0].RequestStatus == "Request Sent") {
                        return res.status(200).json({ status: 1, message: "Request Already Sent.", data: null, error: null })
                    }
                } else {
                    for (const doc of getuserdata) {
                        if (doc.UserID) {
                            if (doc.UserID.DeviceID) {
                                GetAllNotification.push(doc.UserID.DeviceID);
                            }
                        } else {
                            let alldata = await UserMasterModel.find({ "MainUserCollectionStatus": true }).sort({ '_id': -1 }).exec();
                            alldata.forEach((userdata) => {
                                if (userdata.DeviceID) {
                                    GetAllNotification.push(userdata.DeviceID);
                                }
                                ArrUserData.push(userdata._id);
                            });
                        }
                    };
                    if (ArrUserData.length > 0) {
                        for (let i = 0; i < ArrUserData.length; i++) {
                            var ArrUserID = ArrUserData[i];
                            await new AnnadanRequestModel({
                                UserID: req.body.ID,
                                UserMasterID: ArrUserData[i],
                                UniqueID: uniqueRandomID,
                                RequestStatus: 'Request Sent'
                            }).save();
                        }
                    } else {
                        await AnnadanRequestModel({
                            UserID: req.body.ID,
                            UserMasterID: getuserdata[0].UserID._id,
                            UniqueID: uniqueRandomID,
                            RequestStatus: 'Request Sent'
                        }).save();
                    }
                    helper.send_fcm_notifications('Annadan Request', "New Annadan Request", GetAllNotification, 'SA_ViewRequestActivity')
                    return res.status(200).json({ status: 1, message: "Request Sent.", data: null, error: null })
                }
            } else {
                return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null })
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewAllPendingDataV2 = [async (req, res) => {
    try {
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckUserMasterID = ((req.body.UserMasterID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserMasterID)] }) : { $nin: [] });
        let annadanrequestdata = await AnnadanRequestModel.find({ "UserID": CheckUserID, "UserMasterID": CheckUserMasterID, "AnnadanRequestStatus": "Pending" })
            .populate({ path: 'UserID', select: 'UserName MobileNo DeviceID' })
            .populate({ path: 'UserMasterID', select: 'UserName MobileNo DeviceID' })
            .exec();
        if (annadanrequestdata.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", data: annadanrequestdata, error: null })
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null })
        }
        // }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AcceptAnnadanRequestV2 = [async (req, res) => {
    try {
        if (!req.body.UniqueID) {
            return res.status(200).json({ status: 1, message: "Please Enter ID.", data: null, error: null })
        } else if (!req.body.UserID) {
            return res.status(200).json({ status: 1, message: "Please Enter UserID.", data: null, error: null })
        }
        else {
            var UpdateData = {};
            UpdateData["AnnadanRequestStatus"] = "Complete";
            await AnnadanRequestModel.updateMany({ "UniqueID": req.body.UniqueID }, UpdateData).exec();
            var UpdateMaster = {};
            UpdateMaster["MainAnnadanStatus"] = true;
            await UserMasterModel.updateOne({ "_id": req.body.UserID }, UpdateMaster).exec();
            var GetAllNotification = [];
            let getuserdata = await UserMasterModel.find({ "_id": req.body.UserID }).sort({ '_id': -1 }).exec();
            if (getuserdata.length > 0) {
                getuserdata.forEach(async (doc) => {
                    if (doc.DeviceID) {
                        GetAllNotification.push(doc.DeviceID);
                    }
                    helper.send_fcm_notifications('Annadan Accepted', "Your Annadan Request is Accepted", GetAllNotification, 'SA_Dashboard2Activity')
                });
            }
            return res.status(200).json({ status: 1, message: "Succesfully Updated.", data: null, error: null })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.DirectAnnadanRequestV2 = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            return res.status(200).json({ status: 1, message: "Please Enter ID.", data: null, error: null })
        } if (!req.body.AccessID) {
            return res.status(200).json({ status: 1, message: "Please Enter Name.", data: null, error: null })
        } else {
            var uniqueRandomID = uuid.v4()
            var UpdateMaster = {};
            UpdateMaster["MainAnnadanStatus"] = true;
            await UserMasterModel.updateOne({ "_id": req.body.AccessID }, UpdateMaster).exec();
            await AnnadanRequestModel({
                UserID: req.body.AccessID,
                UserMasterID: req.body.UserID,
                UniqueID: uniqueRandomID,
                DirectAccess: 'Direct Access',
                AnnadanRequestStatus: "Compelete"
            }).save();
            return res.status(200).json({ status: 1, message: "Succesfully Updated.", data: null, error: null })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}
