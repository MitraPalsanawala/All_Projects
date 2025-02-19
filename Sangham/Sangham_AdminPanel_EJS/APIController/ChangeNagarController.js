const NagarModel = require("../Model/NagarModel");
const BhagModel = require("../Model/BhagModel");
const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
//------------------------------------------ App ----------------------------------------------------//

exports.GetNagarV2 = [async (req, res) => {
    try {
        var CheckUserID, CheckBhagID, CheckSearchID, DataResponse;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        if (req.body.UserID) {
            let UserData = await UserMasterModel.find({ _id: CheckUserID }).sort({ _id: -1 }).exec();
            if (UserData[0].UserType == "MainUser") {
                DataResponse = await NagarModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Nagar": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Nagar.BhagID",
                                "from": "Bhag",
                                "foreignField": "_id",
                                "as": "Bhag"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Bhag",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "Nagar._id": CheckSearchID,
                                "Nagar.BhagID": CheckBhagID,
                                "$and": [
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Nagar._id",
                                "NagarName": "$Nagar.NagarName",
                                "UserID": "",
                                // "UserName": "$UserMaster.UserName",
                                "BhagID": "$Nagar.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "KaryavahName": "$Nagar.KaryavahName",
                                "MobileNo": "$Nagar.MobileNo",
                                "Address": "$Nagar.Address",
                                "EmailID": "$Nagar.EmailID",
                                "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                                "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                                "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                                "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                                "IsActive": "$Nagar.IsActive",
                                "IsDelete": "$Nagar.IsDelete",
                                "ModifiedDate": "$Nagar.ModifiedDate",
                                "CreatedDate": "$Nagar.CreatedDate"
                            }
                        },
                    ]).exec();
            } else if (UserData[0].UserType == "SuperUser" || UserData[0].UserType == "NormalUser") {
                DataResponse = await NagarModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Nagar": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Nagar._id",
                                "from": "UserNagarDetail",
                                "foreignField": "NagarID",
                                "as": "UserNagarDetail"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$UserNagarDetail",
                                "preserveNullAndEmptyArrays": true
                            }
                        },

                        {
                            "$lookup": {
                                "localField": "Nagar.BhagID",
                                "from": "Bhag",
                                "foreignField": "_id",
                                "as": "Bhag"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Bhag",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "UserNagarDetail.UserID": CheckUserID,
                                "Nagar._id": CheckSearchID,
                                "Nagar.BhagID": CheckBhagID,
                                "$and": [
                                    { "$or": [{ "UserNagarDetail.IsActive": { "$exists": false } }, { "UserNagarDetail.IsActive": { "$eq": true } }] },
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Nagar._id",
                                "NagarName": "$Nagar.NagarName",
                                "UserID": "$UserNagarDetail.UserID",
                                // "UserName": "$UserMaster.UserName",
                                "BhagID": "$Nagar.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "KaryavahName": "$Nagar.KaryavahName",
                                "MobileNo": "$Nagar.MobileNo",
                                "Address": "$Nagar.Address",
                                "EmailID": "$Nagar.EmailID",
                                "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                                "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                                "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                                "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                                "IsActive": "$Nagar.IsActive",
                                "IsDelete": "$Nagar.IsDelete",
                                "ModifiedDate": "$Nagar.ModifiedDate",
                                "CreatedDate": "$Nagar.CreatedDate"
                            }
                        },
                    ]).exec();
            } else if (UserData[0].UserType == "BhagUser") {
                DataResponse = await NagarModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Nagar": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Nagar.BhagID",
                                "from": "Bhag",
                                "foreignField": "_id",
                                "as": "Bhag"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Bhag",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "Nagar._id": CheckSearchID,
                                "Nagar.BhagID": CheckBhagID,
                                "$and": [
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Nagar._id",
                                "NagarName": "$Nagar.NagarName",
                                "UserID": "",
                                // "UserName": "$UserMaster.UserName",
                                "BhagID": "$Nagar.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "KaryavahName": "$Nagar.KaryavahName",
                                "MobileNo": "$Nagar.MobileNo",
                                "Address": "$Nagar.Address",
                                "EmailID": "$Nagar.EmailID",
                                "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                                "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                                "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                                "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                                "IsActive": "$Nagar.IsActive",
                                "IsDelete": "$Nagar.IsDelete",
                                "ModifiedDate": "$Nagar.ModifiedDate",
                                "CreatedDate": "$Nagar.CreatedDate"
                            }
                        },
                    ]).exec();
            } else {
                return res.status(200).json({ status: 0, message: "Success.", data: null, error: null });
            }
            return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
        } else {
            DataResponse = await NagarModel.aggregate(
                [
                    {
                        "$project": {
                            "_id": "_id",
                            "Nagar": "$$ROOT"
                        }
                    },


                    {
                        "$lookup": {
                            "localField": "Nagar.BhagID",
                            "from": "Bhag",
                            "foreignField": "_id",
                            "as": "Bhag"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$Bhag",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        "$match": {
                            "Nagar._id": CheckSearchID,
                            "Nagar.BhagID": CheckBhagID,
                            "$and": [
                                { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                            ],
                            "Bhag.IsActive": true,
                        }
                    },

                    { "$sort": { "Nagar._id": -1 } },
                    {
                        "$project": {
                            "_id": "$Nagar._id",
                            "NagarName": "$Nagar.NagarName",
                            "UserID": "",
                            // "UserName": "$UserMaster.UserName",
                            "BhagID": "$Nagar.BhagID",
                            "BhagName": "$Bhag.BhagName",
                            "KaryavahName": "$Nagar.KaryavahName",
                            "MobileNo": "$Nagar.MobileNo",
                            "Address": "$Nagar.Address",
                            "EmailID": "$Nagar.EmailID",
                            "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                            "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                            "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                            "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                            "IsActive": "$Nagar.IsActive",
                            "IsDelete": "$Nagar.IsDelete",
                            "ModifiedDate": "$Nagar.ModifiedDate",
                            "CreatedDate": "$Nagar.CreatedDate"
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