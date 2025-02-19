const BhagModel = require("../Model/BhagModel");
const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
//------------------------------------------ App ----------------------------------------------------//
exports.SetBhag = [async (req, res) => {
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
exports.GetBhagV2 = [async (req, res) => {
    try {
        var CheckUserID, CheckSearchID, DataResponse;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });

        if (req.body.UserID) {
            let UserData = await UserMasterModel.find({ _id: CheckUserID }).sort({ _id: -1 }).exec();
            if (UserData[0].UserType == "MainUser") {
                DataResponse = await BhagModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Bhag": "$$ROOT"
                            }
                        },
                        {
                            "$match": {
                                "Bhag._id": CheckSearchID,
                                "Bhag.IsActive": true,

                            }
                        },
                        // { "$sort": { "Bhag._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Bhag._id",
                                "BhagName": "$Bhag.BhagName",
                                // "UserID": "$UserBhagDetail._id",
                                "UserID": "",
                                // "UserID": "$UserBhagDetail.UserID.UserName",
                                "KaryavahName": "$Bhag.KaryavahName",
                                "MobileNo": "$Bhag.MobileNo",
                                "Address": "$Bhag.Address",
                                "EmailID": "$Bhag.EmailID",
                                "SahKaryakartaName": "$Bhag.SahKaryakartaName",
                                "SahKaryakartaMobileNo": "$Bhag.SahKaryakartaMobileNo",
                                "SahKaryakartaAddress": "$Bhag.SahKaryakartaAddress",
                                "SahKaryakartaEmailID": "$Bhag.SahKaryakartaEmailID",
                                "IsActive": "$Bhag.IsActive",
                                "IsDelete": "$Bhag.IsDelete",
                                "ModifiedDate": "$Bhag.ModifiedDate",
                                "CreatedDate": "$Bhag.CreatedDate"
                            }
                        },
                    ]).exec();
            } else if (UserData[0].UserType == "SuperUser" || UserData[0].UserType == "NormalUser" || UserData[0].UserType == "BhagUser") {
                DataResponse = await BhagModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Bhag": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Bhag._id",
                                "from": "UserBhagDetail",
                                "foreignField": "BhagID",
                                "as": "UserBhagDetail"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$UserBhagDetail",
                                "preserveNullAndEmptyArrays": true
                            }
                        },

                        {
                            "$match": {
                                "UserBhagDetail.UserID": CheckUserID,
                                "Bhag._id": CheckSearchID,
                                "$and": [
                                    { "$or": [{ "UserBhagDetail.IsActive": { "$exists": false } }, { "UserBhagDetail.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,

                            }
                        },
                        // { "$sort": { "Bhag._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Bhag._id",
                                "BhagName": "$Bhag.BhagName",
                                // "UserID": "$UserBhagDetail._id",
                                "UserID": "$UserBhagDetail.UserID",
                                // "UserID": "$UserBhagDetail.UserID.UserName",
                                "KaryavahName": "$Bhag.KaryavahName",
                                "MobileNo": "$Bhag.MobileNo",
                                "Address": "$Bhag.Address",
                                "EmailID": "$Bhag.EmailID",
                                "SahKaryakartaName": "$Bhag.SahKaryakartaName",
                                "SahKaryakartaMobileNo": "$Bhag.SahKaryakartaMobileNo",
                                "SahKaryakartaAddress": "$Bhag.SahKaryakartaAddress",
                                "SahKaryakartaEmailID": "$Bhag.SahKaryakartaEmailID",
                                "IsActive": "$Bhag.IsActive",
                                "IsDelete": "$Bhag.IsDelete",
                                "ModifiedDate": "$Bhag.ModifiedDate",
                                "CreatedDate": "$Bhag.CreatedDate"
                            }
                        },
                    ]).exec();
            } else {
                return res.status(200).json({ status: 0, message: "Success.", data: null, error: null });
            }
            return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
        } else {
            var DataResponse = await BhagModel.aggregate(
                [
                    {
                        "$project": {
                            "_id": "_id",
                            "Bhag": "$$ROOT"
                        }
                    },
                    {
                        "$match": {
                            "Bhag._id": CheckSearchID,
                            "Bhag.IsActive": true,

                        }
                    },
                    // { "$sort": { "Bhag._id": -1 } },
                    {
                        "$project": {
                            "_id": "$Bhag._id",
                            "BhagName": "$Bhag.BhagName",
                            // "UserID": "$UserBhagDetail._id",
                            "UserID": "",
                            // "UserID": "$UserBhagDetail.UserID.UserName",
                            "KaryavahName": "$Bhag.KaryavahName",
                            "MobileNo": "$Bhag.MobileNo",
                            "Address": "$Bhag.Address",
                            "EmailID": "$Bhag.EmailID",
                            "SahKaryakartaName": "$Bhag.SahKaryakartaName",
                            "SahKaryakartaMobileNo": "$Bhag.SahKaryakartaMobileNo",
                            "SahKaryakartaAddress": "$Bhag.SahKaryakartaAddress",
                            "SahKaryakartaEmailID": "$Bhag.SahKaryakartaEmailID",
                            "IsActive": "$Bhag.IsActive",
                            "IsDelete": "$Bhag.IsDelete",
                            "ModifiedDate": "$Bhag.ModifiedDate",
                            "CreatedDate": "$Bhag.CreatedDate"
                        }
                    },
                ]).exec();
            return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}
