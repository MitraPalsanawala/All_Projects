const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const NagarModel = require("../Model/NagarModel");
const BhagModel = require("../Model/BhagModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const moment = require('moment-timezone');
const moment1 = require('moment');
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//

exports.GetVastiV2 = [async (req, res) => {
    try {
        var CheckUserID, CheckBhagID, CheckSearchID, CheckNagarID, DataResponse;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });

        if (req.body.UserID) {
            let UserData = await UserMasterModel.find({ _id: CheckUserID }).sort({ _id: -1 }).exec();
            if (UserData[0].UserType == "MainUser") {
                var DataResponse = await VastiModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Vasti": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Vasti.BhagID",
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
                            "$lookup": {
                                "localField": "Vasti.NagarID",
                                "from": "Nagar",
                                "foreignField": "_id",
                                "as": "Nagar"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Nagar",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "Vasti._id": CheckSearchID,
                                "Vasti.BhagID": CheckBhagID,
                                "Vasti.NagarID": CheckNagarID,
                                "$and": [
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Vasti._id",
                                "VastiName": "$Vasti.VastiName",
                                "UserID": "",
                                "BhagID": "$Vasti.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "NagarID": "$Vasti.NagarID",
                                "NagarName": "$Nagar.NagarName"
                            }
                        },
                    ]).exec();
            }
            else if (UserData[0].UserType == "SuperUser" || UserData[0].UserType == "NormalUser") {
                var DataResponse = await VastiModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Vasti": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Vasti._id",
                                "from": "UserVastiDetail",
                                "foreignField": "VastiID",
                                "as": "UserVastiDetail"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$UserVastiDetail",
                                "preserveNullAndEmptyArrays": true
                            }
                        },

                        {
                            "$lookup": {
                                "localField": "Vasti.BhagID",
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
                            "$lookup": {
                                "localField": "Vasti.NagarID",
                                "from": "Nagar",
                                "foreignField": "_id",
                                "as": "Nagar"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Nagar",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "UserVastiDetail.UserID": CheckUserID,
                                "Vasti._id": CheckSearchID,
                                "Vasti.BhagID": CheckBhagID,
                                "Vasti.NagarID": CheckNagarID,
                                "$and": [
                                    { "$or": [{ "UserVastiDetail.IsActive": { "$exists": false } }, { "UserVastiDetail.IsActive": { "$eq": true } }] },
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Vasti._id",
                                "VastiName": "$Vasti.VastiName",
                                "UserID": "$UserVastiDetail.UserID",
                                "BhagID": "$Vasti.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "NagarID": "$Vasti.NagarID",
                                "NagarName": "$Nagar.NagarName"
                            }
                        },
                    ]).exec();
            }
            else if (UserData[0].UserType == "BhagUser") {
                var DataResponse = await VastiModel.aggregate(
                    [
                        {
                            "$project": {
                                "_id": "_id",
                                "Vasti": "$$ROOT"
                            }
                        },
                        {
                            "$lookup": {
                                "localField": "Vasti._id",
                                "from": "UserVastiDetail",
                                "foreignField": "VastiID",
                                "as": "UserVastiDetail"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$UserVastiDetail",
                                "preserveNullAndEmptyArrays": true
                            }
                        },

                        {
                            "$lookup": {
                                "localField": "Vasti.BhagID",
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
                            "$lookup": {
                                "localField": "Vasti.NagarID",
                                "from": "Nagar",
                                "foreignField": "_id",
                                "as": "Nagar"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$Nagar",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            "$match": {
                                "UserVastiDetail.UserID": CheckUserID,
                                "Vasti._id": CheckSearchID,
                                "Vasti.BhagID": CheckBhagID,
                                "Vasti.NagarID": CheckNagarID,
                                "$and": [
                                    { "$or": [{ "UserVastiDetail.IsActive": { "$exists": false } }, { "UserVastiDetail.IsActive": { "$eq": true } }] },
                                    { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                                ],
                                "Bhag.IsActive": true,
                            }
                        },

                        { "$sort": { "Nagar._id": -1 } },
                        {
                            "$project": {
                                "_id": "$Vasti._id",
                                "VastiName": "$Vasti.VastiName",
                                "UserID": "$UserVastiDetail.UserID",
                                "BhagID": "$Vasti.BhagID",
                                "BhagName": "$Bhag.BhagName",
                                "NagarID": "$Vasti.NagarID",
                                "NagarName": "$Nagar.NagarName"
                            }
                        },
                    ]).exec();
                return res.status(200).json({ status: 0, message: "Success.", data: null, error: null });
            }
            else {
                return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
            }
        } else {
            var DataResponse = await VastiModel.aggregate(
                [
                    {
                        "$project": {
                            "_id": "_id",
                            "Vasti": "$$ROOT"
                        }
                    },
                    {
                        "$lookup": {
                            "localField": "Vasti.BhagID",
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
                        "$lookup": {
                            "localField": "Vasti.NagarID",
                            "from": "Nagar",
                            "foreignField": "_id",
                            "as": "Nagar"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$Nagar",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        "$match": {
                            "Vasti._id": CheckSearchID,
                            "Vasti.BhagID": CheckBhagID,
                            "Vasti.NagarID": CheckNagarID,
                            "$and": [
                                { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                            ],
                            "Bhag.IsActive": true,
                        }
                    },

                    { "$sort": { "Nagar._id": -1 } },
                    {
                        "$project": {
                            "_id": "$Vasti._id",
                            "VastiName": "$Vasti.VastiName",
                            "UserID": "",
                            "BhagID": "$Vasti.BhagID",
                            "BhagName": "$Bhag.BhagName",
                            "NagarID": "$Vasti.NagarID",
                            "NagarName": "$Nagar.NagarName",
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
