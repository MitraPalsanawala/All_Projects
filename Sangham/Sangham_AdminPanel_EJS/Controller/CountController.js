const UserMasterModel = require("../Model/UserMasterModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const KaryakartaModel = require("../Model/KaryakartaModel");
const AbhiyanModel = require("../Model/AbhiyanModel");

const TypeMasterModel = require("../Model/TypeMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ResponsibilityModel = require("../Model/ResponsibilityModel");
const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var underscore_ = require('underscore')
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { distinct } = require("../Model/UserMasterModel");

async function BindBhagCount(req) {

    var DataResponse = await BhagModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "Bhag": "$$ROOT",
                }
            },
            {
                "$match": {
                    "Bhag.IsActive": true,
                }
            },
            { "$sort": { "Bhag._id": -1 } },
            {
                "$project": {
                    "_id": "$Bhag._id",
                    "BhagName": "$Bhag.BhagName",
                    "UserID": "",
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
    return DataResponse
}
async function BindNagarCount(req) {

    var DataResponse = await NagarModel.aggregate(
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
            // {
            //     "$unwind": {
            //         "path": "$Bhag",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
            {
                "$match": {
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                }
            },
            {
                "$sort": { "Nagar._id": -1 }
            },
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
                    "CreatedDate": "$Nagar.CreatedDate",
                    "Bhag_Count": { $size: "$Bhag" },

                }
            },
        ]).exec();
    return DataResponse
}
async function BindVastiCount(req) {
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
            // {
            //     "$unwind": {
            //         "path": "$Bhag",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },

            {
                "$lookup": {
                    "localField": "Vasti.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Nagar",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
            {
                "$match": {
                    // "Vasti._id": CheckSearchID,
                    // "Vasti.CreatedDate": query1,
                    // "Vasti.BhagID": CheckBhagID,
                    // "Vasti.NagarID": CheckNagarID,
                    // "$and": [
                    //     { "$or": [{ "Nagar.IsActive": { "$exists": false } }, { "Nagar.IsActive": { "$eq": true } }] },
                    // ],
                    "Bhag.IsActive": true,
                }
            },

            { "$sort": { "Nagar._id": -1 } },
            {
                "$project": {
                    "_id": "$Vasti._id",
                    "VastiName": "$Vasti.VastiName",
                    "UserID": "",
                    // "VastiName": "$UserMaster.UserName",
                    "BhagID": "$Vasti.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$Vasti.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    // "Bhag_Count": { $size: "$Bhag" },
                    // "Nagar_Count": { $size: "$Nagar" },
                    // "Bhag_Count": "$Bhag",
                    // "Nagar_Count": "$Nagar",
                }
            },
        ]).exec();
    return DataResponse;
}
async function BindSocietyCount(req) {
    // var query1, CheckSearchID, CheckUserID;
    // CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    // CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    // if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
    //     var todayi = new Date(req.body.StartDate);
    //     var todayEODi = new Date(req.body.EndDate);
    //     todayi.setHours(0, 0, 0, 0);
    //     todayEODi.setHours(23, 59, 59, 999);
    //     console.log("===today==", todayi)
    //     query1 = {
    //         // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
    //         '$gte': todayi, '$lte': todayEODi
    //     }
    // }
    // else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
    //     var todayi = new Date(req.body.StartDate);
    //     var todayEODi = new Date(req.body.StartDate);
    //     todayi.setHours(0, 0, 0, 0);
    //     todayEODi.setHours(23, 59, 59, 999);

    //     query1 = {
    //         '$gte': todayi, '$lte': todayEODi
    //     }
    // } else {
    //     const date = new Date();
    //     const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
    //     //console.log("3442242424", todaydate)

    //     var todayi = new Date(todaydate);
    //     var todayEODi = new Date(todaydate);
    //     todayi.setHours(0, 0, 0, 0);
    //     todayEODi.setHours(23, 59, 59, 999);

    //     query1 = {
    //         '$gte': todayi, '$lte': todayEODi
    //     }
    // }
    var SocietyData = await SocietyModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "SocietyModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "SocietyModel.UserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "UserMaster"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$UserMaster",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "SocietyModel.BhagID",
                    "from": "Bhag",
                    "foreignField": "_id",
                    "as": "Bhag"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Bhag",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "SocietyModel.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Nagar",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "SocietyModel.VastiID",
                    "from": "Vasti",
                    "foreignField": "_id",
                    "as": "Vasti"
                },

            },
            // {
            //     "$unwind": {
            //         "path": "$Vasti",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$match": {
                    "SocietyModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    // "SocietyModel.CreatedDate": query1,
                    // "SocietyModel._id": CheckSearchID,
                    // "SocietyModel.UserID": CheckUserID,
                    // "SocietyModel.UserID": CheckUserID,
                    // "SocietyModel.BhagID": CheckBhagID,
                    // "SocietyModel.NagarID": CheckNagarID,
                    // "SocietyModel.VastiID": CheckVastiID,
                }
            },
            {
                "$sort": {
                    "SocietyModel._id": -1
                }
            },

            {
                "$project": {
                    // "_id": "$SocietyModel._id",
                    // "CreatedDate": "$SocietyModel.CreatedDate",
                    // "ModifiedDate": "$SocietyModel.ModifiedDate",
                    //"Bhag_Count": "$Bhag",
                    "total": { $sum: { $size: "$Bhag" } },
                    "Bhag_Count": { $size: "$Bhag" },
                    "Nagar_Count": { $size: "$Nagar" },
                    "Vasti_Count": { $size: "$Vasti" },
                    "User_Count": { $size: "$UserMaster" },

                }
            }
        ]);
    console.log("===count====", SocietyData)
    return SocietyData;
}
async function BindKaryakartaCount(req) {
    var CheckSearchID, CheckSearchTypeID, CheckSearchUserID, query1;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchTypeID = ((req.body.TypeID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.EndDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);
        console.log("===today==", todayi)
        query1 = {
            // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
            '$gte': todayi, '$lte': todayEODi
        }
    }
    else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.StartDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    } else {
        const date = new Date();
        const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
        //console.log("3442242424", todaydate)

        var todayi = new Date(todaydate);
        var todayEODi = new Date(todaydate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    }
    var KaryakartaData = await KaryakartaModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "KaryakartaModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.UserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "UserMaster"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$UserMaster",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.BhagID",
                    "from": "Bhag",
                    "foreignField": "_id",
                    "as": "Bhag"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Bhag",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Nagar",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.VastiID",
                    "from": "Vasti",
                    "foreignField": "_id",
                    "as": "Vasti"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Vasti",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.SocietyID",
                    "from": "Society",
                    "foreignField": "_id",
                    "as": "Society"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Society",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },

            {
                "$lookup": {
                    "localField": "KaryakartaModel.TypeID",
                    "from": "TypeMaster",
                    "foreignField": "_id",
                    "as": "TypeMaster"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$TypeMaster",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },

            {
                "$match": {
                    "KaryakartaModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    "TypeMaster.IsActive": true,
                    "KaryakartaModel.CreatedDate": query1,
                    "KaryakartaModel._id": CheckSearchID,
                    "KaryakartaModel.TypeID": CheckSearchTypeID,
                    "KaryakartaModel.UserID": CheckSearchUserID,
                    // "KaryakartaModel.BhagID": CheckSearchBhagID,
                    // "KaryakartaModel.NagarID": CheckSearchNagarID,
                    // "KaryakartaModel.VastiID": CheckSearchVastiID,
                    // "KaryakartaModel.SocietyID": CheckSearchSocietyID,
                    // "KaryakartaModel.TypeID": CheckSearchTypeID,
                }
            },
            {
                "$sort": {
                    "KaryakartaModel._id": -1
                }
            },
            {
                "$project": {
                    // "_id": "$KaryakartaModel._id",
                    // "CreatedDate": "$KaryakartaModel.CreatedDate",
                    // "ModifiedDate": "$KaryakartaModel.ModifiedDate",
                    "Bhag_Count": { $size: "$Bhag" },
                    "Nagar_Count": { $size: "$Nagar" },
                    "Vasti_Count": { $size: "$Vasti" },
                    "Society_Count": { $size: "$Society" },
                    "User_Count": { $size: "$UserMaster" },
                }
            }
        ]);
    return KaryakartaData;
}
async function BindAbhiyanCount(req) {
    var query1, CheckSearchID, CheckSearchUserID;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.EndDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);
        console.log("===today==", todayi)
        query1 = {
            // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
            '$gte': todayi, '$lte': todayEODi
        }
    }
    else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.StartDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    } else {
        const date = new Date();
        const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
        //console.log("3442242424", todaydate)

        var todayi = new Date(todaydate);
        var todayEODi = new Date(todaydate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    }
    var AbhiyanData = await AbhiyanModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "AbhiyanModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.UserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "UserMaster"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$UserMaster",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.BhagID",
                    "from": "Bhag",
                    "foreignField": "_id",
                    "as": "Bhag"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Bhag",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Nagar",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.VastiID",
                    "from": "Vasti",
                    "foreignField": "_id",
                    "as": "Vasti"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Vasti",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.SocietyID",
                    "from": "Society",
                    "foreignField": "_id",
                    "as": "Society"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Society",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$match": {
                    "AbhiyanModel.IsActive": true,
                    "AbhiyanModel.CreatedDate": query1,
                    // "UserMaster.IsActive": true,
                    // "Bhag.IsActive": true,
                    // "Nagar.IsActive": true,
                    // "Vasti.IsActive": true,
                    // "Society.IsActive": true,
                    "AbhiyanModel._id": CheckSearchID,
                    "AbhiyanModel.UserID": CheckSearchUserID,
                    // "AbhiyanModel.BhagID": CheckSearchBhagID,
                    // "AbhiyanModel.NagarID": CheckSearchNagarID,
                    // "AbhiyanModel.VastiID": CheckSearchVastiID,
                    // "AbhiyanModel.SocietyID": CheckSearchSocietyID,
                }
            },
            {
                "$sort": {
                    "AbhiyanModel._id": -1
                }
            },
            {
                "$project": {
                    // "_id": "$AbhiyanModel._id",
                    // "CreatedDate": "$AbhiyanModel.CreatedDate",
                    // "ModifiedDate": "$AbhiyanModel.ModifiedDate",
                    "Bhag_Count": { $size: "$Bhag" },
                    "Nagar_Count": { $size: "$Nagar" },
                    "Vasti_Count": { $size: "$Vasti" },
                    "Society_Count": { $size: "$Society" },
                    "User_Count": { $size: "$UserMaster" },
                }
            }
        ]);
    return AbhiyanData;
}
async function BindUserCount(req) {
    var query1, CheckSearchID;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.EndDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);
        console.log("===today==", todayi)
        query1 = {
            // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
            '$gte': todayi, '$lte': todayEODi
        }
    }
    else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.StartDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    } else {
        const date = new Date();
        const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
        //console.log("3442242424", todaydate)

        var todayi = new Date(todaydate);
        var todayEODi = new Date(todaydate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    }
    var userdata = await UserMasterModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "UserMaster": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster.ShakhaMasterID",
                    "from": "ShakhaMaster",
                    "foreignField": "_id",
                    "as": "ShakhaMaster"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster.ResponsibilityID",
                    "from": "Responsibility",
                    "foreignField": "_id",
                    "as": "Responsibility"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$Responsibility",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "UserMaster.SanghShikshanID",
                    "from": "SanghShikshan",
                    "foreignField": "_id",
                    "as": "SanghShikshan"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$SanghShikshan",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "UserMaster._id",
                    "from": "UserBhagDetail",
                    "foreignField": "UserID",
                    "as": "UserBhagDetail"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$UserBhagDetail",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            {
                "$lookup": {
                    "localField": "UserBhagDetail.BhagID",
                    "from": "Bhag",
                    "foreignField": "_id",
                    "as": "Bhag"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster._id",
                    "from": "UserNagarDetail",
                    "foreignField": "UserID",
                    "as": "UserNagarDetail"
                }
            },
            {
                "$lookup": {
                    "localField": "UserNagarDetail.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster._id",
                    "from": "UserVastiDetail",
                    "foreignField": "UserID",
                    "as": "UserVastiDetail"
                }
            },
            {
                "$lookup": {
                    "localField": "UserVastiDetail.VastiID",
                    "from": "Vasti",
                    "foreignField": "_id",
                    "as": "Vasti"
                }
            },
            {
                "$match": {
                    "UserMaster.IsActive": true,
                    "UserMaster.CreatedDate": query1,
                    // "UserMaster.UserType": "SuperUser",
                    // "UserMaster.UserStatus": "Complete",
                    "UserMaster._id": CheckSearchID,
                    // "UserMaster.MobileNo": CheckSearchMobilenO,
                }
            },
            {
                "$sort": {
                    "UserMaster._id": -1
                }
            },
            {
                "$project": {
                    // "_id": "$UserMaster._id",
                    // "CreatedDate": "$UserMaster.CreatedDate",
                    "Bhag_Count": { $size: "$Bhag" },
                    "Nagar_Count": { $size: "$Nagar" },
                    "Vasti_Count": { $size: "$Vasti" },
                    // "User_Count": { $size: "$UserMaster" },
                }
            }
        ]
    )
    console.log("====userdata====", userdata)
    return userdata;
}
exports.GetAllCountData1 = [async (req, res) => {
    try {
        //var SearchData = req.body.UserID + '~' + req.body.ID + '~' + req.body.TypeID + '~' + req.body.StartDate + '~' + req.body.EndDate;
        let Bhagdata = await BindBhagCount(req);
        let BhgCount = Bhagdata.length;
        let Nagardata = await BindNagarCount(req);
        let NagarCount = Nagardata.length;
        let Vastidata = await BindVastiCount(req);
        let VastiCount = Vastidata.length;


        let Societydata = await BindSocietyCount(req);
        let SocietyCount = Societydata.length;

        // let Karyakartadata = await BindKaryakartaCount(req);
        // let KaryakartaCount = Karyakartadata.length;

        // let Abhiyandata = await BindAbhiyanCount(req);
        // let AbhiyanCount = Abhiyandata.length;

        // let Userdata = await BindUserCount(req);
        // let UserCount = Userdata.length;

        return res.status(200).json({
            // SearchData: SearchData,
            status: 1, message: "Success.",
            // Bhagdata: Bhagdata,
            TotalBhagCount: BhgCount,

            //Nagardata: Nagardata,
            TotalNagarCount: NagarCount,

            //Vastidata: Vastidata,
            TotalVastiCount: VastiCount,

            TotalSocietyCount: SocietyCount,
            TodaySocietyCount: Societydata,

            // TotalKaryakartaCount: KaryakartaCount,
            // TodayKaryakartaCount: Abhiyandata,
            // TotalAbhiyanCount: AbhiyanCount,

            // TodayUserCount: Userdata,
            // TotalUserCount: UserCount,
            error: null
        });

    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetAllCountData = [async (req, res) => {
    try {
        // let bhagdata = await BhagModel.distinct('_id');
        let bhagdata = await BhagModel.distinct('_id').count('_id');
        let Nagardata = await NagarModel.distinct('BhagID').count('_id');
        let Vastidata = await VastiModel.distinct('BhagID, NagarID').count('_id');
        let societydata = await SocietyModel.distinct('UserID,BhagID,NagarID,VastiID').count('_id');
        let Abhiyandata = await AbhiyanModel.distinct('UserID,BhagID,NagarID,VastiID,SocietyID').count('_id');
        let Karyakartadata = await KaryakartaModel.distinct('UserID,BhagID,NagarID,VastiID,SocietyID').count('_id');
        let Userdata = await UserMasterModel.distinct('_id').count('_id');
        console.log("===121212====", bhagdata);
        var TotalCount = [];
        TotalCount.push({
            TotalBhagCount: bhagdata,
            TotalNagarCount: Nagardata,
            TotalVastiCount: Vastidata,
            TotalSocietyCount: societydata,
            TotalAbhiyanCount: Abhiyandata,
            TotalKaryakartaCount: Karyakartadata,
            TotalUserCount: Userdata
        });
        console.log("===121212====", TotalCount);
        return res.status(200).json({ status: 1, message: "Success.", TotalCount: TotalCount, error: null });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.TodayCount = [async (req, res) => {
    try {
        // let Totalbhagdata = await BhagModel.distinct('_id').count('_id');
        // let TotalNagardata = await NagarModel.distinct('BhagID').count('_id');
        // let TotalVastidata = await VastiModel.distinct('BhagID, NagarID').count('_id');
        // let Totalsocietydata = await SocietyModel.distinct('UserID,BhagID,NagarID,VastiID').count('_id');
        // let TotalAbhiyandata = await AbhiyanModel.distinct('UserID,BhagID,NagarID,VastiID,SocietyID').count('_id');
        // let TotalKaryakartadata = await KaryakartaModel.distinct('UserID,BhagID,NagarID,VastiID,SocietyID').count('_id');
        // let TotalUserdata = await UserMasterModel.distinct('_id').count('_id');

        let Totalbhagdata = await BhagModel.find({}).count('_id');
        let TotalNagardata = await NagarModel.find({}).count('_id');
        let TotalVastidata = await VastiModel.find({}).count('_id');
        let Totalsocietydata = await SocietyModel.find({}).count('_id');
        let TotalAbhiyandata = await AbhiyanModel.find({}).count('_id');
        let TotalKaryakartadata = await KaryakartaModel.find({}).count('_id');
        let TotalUserdata = await UserMasterModel.find({}).count('_id');


        var query1, CheckUserID;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            console.log("===today==", todayi)
            query1 = {
                // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
            //console.log("3442242424", todaydate)

            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        let SBhagdata = await (await SocietyModel.distinct('BhagID')).length;
        let SNagardata = await (await SocietyModel.distinct('NagarID')).length;
        let SVastiSdata = await (await SocietyModel.distinct('VastiID')).length;
        let societydata = await SocietyModel.find({ "UserID": CheckUserID, "CreatedDate": query1 }).count();

        let ABhagdata = await (await AbhiyanModel.distinct('BhagID')).length;
        let ANagardata = await (await AbhiyanModel.distinct('NagarID')).length;
        let AVastidata = await (await AbhiyanModel.distinct('VastiID')).length;
        // let ASocietydata = await (await AbhiyanModel.distinct('SocietyID')).length;
        let abhiyandata = await AbhiyanModel.find({ "UserID": CheckUserID, "CreatedDate": query1 }).count();

        let KBhagdata = await (await KaryakartaModel.distinct('BhagID')).length;
        let KNagardata = await (await KaryakartaModel.distinct('NagarID')).length;
        let KVastiSdata = await (await KaryakartaModel.distinct('VastiID')).length;
        // let KSocietydata = await (await KaryakartaModel.distinct('SocietyID')).length;
        let karyadata = await KaryakartaModel.find({ "UserID": CheckUserID, "CreatedDate": query1 }).count();

        TotalBhag = SBhagdata + ABhagdata + KBhagdata;
        TotalNagar = SNagardata + ANagardata + KNagardata;
        TotalVasti = SVastiSdata + AVastidata + KVastiSdata;
        // TotalSociety = SNagardata + ANagardata + KNagardata;

        console.log("-------121-------------->>>>>>>>>>>>>", TotalBhag)
        // let karyadata = await KaryakartaModel.find({ "CreatedDate": query1 }).count();
        let userdata = await UserMasterModel.find({ "_id": CheckUserID, "CreatedDate": query1 }).count();
        return res.status(200).json({
            status: 1, message: "Success.",
            TodayBhagCount: TotalBhag,
            TotalBhagCount: Totalbhagdata,
            TodayNagarCount: TotalNagar,
            TotalNagarCount: TotalNagardata,
            TodayVastiCount: TotalVasti,
            TotalVastiCount: TotalVastidata,
            TodaySocietyCount: societydata,
            TotalSocietyCount: Totalsocietydata,
            TodayKaryakartaCount: karyadata,
            TotalKaryakartaCount: TotalKaryakartadata,
            TodayAbhiyanCount: abhiyandata,
            TotalAbhiyanCount: TotalAbhiyandata,
            TodayUserCount: userdata,
            TotalUserCount: TotalUserdata,
            error: null
        });

    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ReportCount = [async (req, res) => {
    try {
        var CheckSearchID, query1;
        CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            console.log("===today==", todayi)
            query1 = {
                // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
            //console.log("3442242424", todaydate)

            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        if (!req.body.ID) {
            return res.json({ status: 0, Message: "Please Enter UserID", data: null })
        } else {
            let TotalUserdata = await UserMasterModel.find({ _id: CheckSearchID }).exec();
            if (TotalUserdata.length > 0) {
                if (!TotalUserdata) {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                } else {
                    var AllData = [];
                    var BhagData = {};
                    var NagarData = {};
                    var VastiData = {};
                    var SocietyData = {};
                    var AbhiyanData = {};
                    var KaryakartaData = {};

                    if (TotalUserdata[0].UserRole == "BhagUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();
                        let nagarData = await NagarModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' }).exec();
                        let vastiDatas = await VastiModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();

                        //Vasti : _ids : 50 -> 30 Soc New Add : 400
                        let SocietyDatas = await SocietyModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let AbhiyanDatas = await AbhiyanModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let KaryakartaDatas = await KaryakartaModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let Todaybhagdetail = await UserBhagDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();
                        let TodaynagarData = await NagarModel.find({ "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).exec();
                        let TodayvastiData = await VastiModel.find({ "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        let TodaySocietyData = await SocietyModel.find({ "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let TodayAbhiyanData = await AbhiyanModel.find({ "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let TodayKaryakartaData = await KaryakartaModel.find({ "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        //1. allbhag => Foreach -> Filter.

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingSocietyData = []
                        PendingAbhiyanData = [], PendingKaryakartaData = [];

                        if (BhagDetailData.length != Todaybhagdetail.length) {
                            BhagDetailData.forEach((bhag) => {
                                let data = Todaybhagdetail.filter((ele) => {
                                    //console.log(ele)
                                    console.log(ele.BhagID._id.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                                    return ele.BhagID._id.toString() != bhag.BhagID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingBhagData.push(bhag)
                                }
                            })
                        }

                        if (nagarData.length != TodaynagarData.length) {
                            nagarData.forEach((nagar) => {
                                let data2 = TodaynagarData.filter((ele) => {
                                    console.log(ele.NagarID.toString(), nagar.NagarID._id.toString(), ele.NagarID.toString() == nagar.NagarID._id.toString())
                                    return ele.NagarID._id.toString() != nagar.NagarID._id.toString()
                                })
                                if (data2.length > 0) {
                                    PendingNagarData.push(nagar)
                                }
                            })
                        }

                        if (vastiDatas.length != TodayvastiData.length) {
                            vastiDatas.forEach((vasti) => {
                                let data = TodayvastiData.filter((ele) => {
                                    console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele.VastiID._id.toString() != vasti.VastiID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingVastiData.push(vasti)
                                }
                            })
                        }

                        if (SocietyDatas.length != TodaySocietyData.length) {
                            SocietyDatas.forEach((society) => {
                                let data = TodaySocietyData.filter((ele) => {
                                    console.log("data12121", ele)
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != society._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingSocietyData.push(society)
                                }
                            })
                        }

                        if (AbhiyanDatas.length != TodayAbhiyanData.length) {
                            AbhiyanDatas.forEach((abhiyan) => {
                                let data = TodayAbhiyanData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != abhiyan._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingAbhiyanData.push(abhiyan)
                                }
                            })
                        }

                        if (KaryakartaDatas.length != TodayKaryakartaData.length) {
                            KaryakartaDatas.forEach((karyakarta) => {
                                let data = TodayKaryakartaData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != karyakarta._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingKaryakartaData.push(karyakarta)
                                }
                            })
                        }


                        //console.log(BhagDetailData)
                        //console.log(Todaybhagdetail)
                        // var PendingBhagData = underscore_.difference(BhagDetailData, Todaybhagdetail)

                        BhagData = {
                            TotalBhagData: BhagDetailData,
                            SearchingBhagData: Todaybhagdetail,
                            PendingBhagData: PendingBhagData,
                            TotalBhagDataCount: BhagDetailData.length,
                            SearchingBhagDataCount: Todaybhagdetail.length,
                            PendingBhagDataCount: PendingBhagData.length
                        }
                        NagarData = {
                            TotalNagarData: nagarData,
                            SearchingNagarData: TodaynagarData,
                            PendingNagarData: PendingNagarData,
                            TotalNagarDataCount: nagarData.length,
                            SearchingNagarDataCount: TodaynagarData.length,
                            PendingNagarDataCount: PendingNagarData.length
                        }
                        VastiData = {
                            TotalVastiData: vastiDatas,
                            SearchingVastiData: TodayvastiData,
                            PendingVastiData: PendingVastiData,
                            TotalVastiDataCount: vastiDatas.length,
                            SearchingVastiDataCount: TodayvastiData.length,
                            PendingVastiDataCount: PendingVastiData.length
                        }
                        SocietyData = {
                            TotalSocietyData: SocietyDatas,
                            SearchingSocietyData: TodaySocietyData,
                            PendingSocietyData: PendingSocietyData,
                            TotalSocietyDataCount: SocietyDatas.length,
                            SearchingSocietyDataCount: TodaySocietyData.length,
                            PendingSocietyDataCount: PendingSocietyData.length
                        }
                        AbhiyanData = {
                            TotalAbhiyanData: AbhiyanDatas,
                            SearchingAbhiyanData: TodayAbhiyanData,
                            PendingAbhiyanData: PendingAbhiyanData,
                            TotalAbhiyanDataCount: AbhiyanDatas.length,
                            SearchingAbhiyanDataCount: TodayAbhiyanData.length,
                            PendingAbhiyanDataCount: PendingAbhiyanData.length
                        }
                        KaryakartaData = {
                            TotalKaryakartaData: KaryakartaDatas,
                            SearchingKaryakartaData: TodayKaryakartaData,
                            PendingKaryakartaData: PendingKaryakartaData,
                            TotalKaryakartaDataCount: KaryakartaDatas.length,
                            SearchingKaryakartaDataCount: TodayKaryakartaData.length,
                            PendingKaryakartaDataCount: PendingKaryakartaData.length
                        }
                        AllData.push({
                            UserData: TotalUserdata,
                            BhagData: BhagData,
                            NagarData: NagarData,
                            VastiData: VastiData,
                            SocietyData: SocietyData,
                            AbhiyanData: AbhiyanData,
                            KaryakartaData: KaryakartaData,
                        })
                        return res.status(200).json({
                            status: 1, message: "Success.",
                            UserRole: "BhagUser",
                            AllData: AllData,
                            // UserData: TotalUserdata,
                            // BhagData: BhagData,
                            // NagarData: NagarData,
                            // VastiData: VastiData,
                            // SocietyData: SocietyData,
                            // AbhiyanData: AbhiyanData,
                            // KaryakartaData: KaryakartaData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "SuperUser") {
                        let SuperBhagDetailData = await UserBhagDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let SuperNagarDetailData = await UserNagarDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let SuperVastiDetailData = await UserVastiDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'VastiID', select: 'VastiName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let SuperSocietyData = await SocietyModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let SuperAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let SuperKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        let TodaySuperbhagdetail = await UserBhagDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodaySupernagarData = await UserNagarDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodaySupervastiData = await UserVastiDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'VastiID', select: 'VastiName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodaySuperSocietyData = await SocietyModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let TodaySuperAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let TodaySuperKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingSocietyData = []
                        PendingAbhiyanData = [], PendingKaryakartaData = [];

                        if (SuperBhagDetailData.length != TodaySuperbhagdetail.length) {
                            SuperBhagDetailData.forEach((bhag) => {
                                let data = TodaySuperbhagdetail.filter((ele) => {
                                    console.log(ele.BhagID.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                                    return ele.BhagID._id.toString() != bhag.BhagID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingBhagData.push(bhag)
                                }
                            })
                        }

                        if (SuperNagarDetailData.length != TodaySupernagarData.length) {
                            SuperNagarDetailData.forEach((nagar) => {
                                let data = TodaySupernagarData.filter((ele) => {
                                    console.log(ele.NagarID.toString(), nagar.NagarID._id.toString(), ele.NagarID.toString() == nagar.NagarID._id.toString())
                                    return ele.NagarID._id.toString() != nagar.NagarID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingNagarData.push(nagar)
                                }
                            })
                        }

                        if (SuperVastiDetailData.length != TodaySupervastiData.length) {
                            SuperVastiDetailData.forEach((vasti) => {
                                let data = TodaySupervastiData.filter((ele) => {
                                    console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele.VastiID._id.toString() != vasti.VastiID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingVastiData.push(vasti)
                                }
                            })
                        }

                        if (SuperSocietyData.length != TodaySuperSocietyData.length) {
                            SuperSocietyData.forEach((society) => {
                                let data = TodaySuperSocietyData.filter((ele) => {
                                    console.log("data12121", ele._id.toString() != society._id.toString())
                                    // console.log("data12121-----------", society._id.toString())
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != society._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingSocietyData.push(society)
                                }
                                // console.log("society===", society)
                            })
                        }

                        if (SuperAbhiyanData.length != TodaySuperAbhiyanData.length) {
                            SuperAbhiyanData.forEach((abhiyan) => {
                                let dataabhiyan = TodaySuperAbhiyanData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != abhiyan._id.toString()
                                })
                                if (dataabhiyan.length > 0) {
                                    PendingAbhiyanData.push(abhiyan)
                                }
                                console.log("--------------->>>>>>>>>>>>>", abhiyan)
                            })
                        }

                        if (SuperKaryakartaData.length != TodaySuperKaryakartaData.length) {
                            SuperKaryakartaData.forEach((karyakarta) => {
                                let data = TodaySuperKaryakartaData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != karyakarta._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingKaryakartaData.push(karyakarta)
                                }
                            })
                        }

                        BhagData = {
                            TotalBhagData: SuperBhagDetailData,
                            SearchingBhagData: TodaySuperbhagdetail,
                            PendingBhagData: PendingBhagData,
                            TotalBhagDataCount: SuperBhagDetailData.length,
                            SearchingBhagDataCount: TodaySuperbhagdetail.length,
                            PendingBhagDataCount: PendingBhagData.length,
                        }
                        NagarData = {
                            TotalNagarData: SuperNagarDetailData,
                            SearchingNagarData: TodaySupernagarData,
                            PendingNagarData: PendingNagarData,
                            TotalNagarDataCount: SuperNagarDetailData.length,
                            SearchingNagarDataCount: TodaySupernagarData.length,
                            PendingNagarDataCount: PendingNagarData.length,
                        }
                        VastiData = {
                            TotalVastiData: SuperVastiDetailData,
                            SearchingVastiData: TodaySupervastiData,
                            PendingVastiData: PendingVastiData,
                            TotalVastiDataCount: SuperVastiDetailData.length,
                            SearchingVastiDataCount: TodaySupervastiData.length,
                            PendingVastiDataCount: PendingVastiData.length
                        }
                        SocietyData = {
                            TotalSocietyData: SuperSocietyData,
                            SearchingSocietyData: TodaySuperSocietyData,
                            PendingSocietyData: PendingSocietyData,
                            TotalSocietyDataCount: SuperSocietyData.length,
                            SearchingSocietyDataCount: TodaySuperSocietyData.length,
                            PendingSocietyDataCount: PendingSocietyData.length
                        }
                        AbhiyanData = {
                            TotalAbhiyanData: SuperAbhiyanData,
                            SearchingAbhiyanData: TodaySuperAbhiyanData,
                            PendingAbhiyanData: PendingAbhiyanData,
                            TotalAbhiyanDataCount: SuperAbhiyanData.length,
                            SearchingAbhiyanDataCount: TodaySuperAbhiyanData.length,
                            PendingAbhiyanDataCount: PendingAbhiyanData.length
                        }
                        KaryakartaData = {
                            TotalKaryakartaData: SuperKaryakartaData,
                            SearchingKaryakartaData: TodaySuperKaryakartaData,
                            PendingKaryakartaData: PendingKaryakartaData,
                            TotalKaryakartaDataCount: SuperKaryakartaData.length,
                            SearchingKaryakartaDataCount: TodaySuperKaryakartaData.length,
                            PendingKaryakartaDataCount: PendingKaryakartaData.length
                        }
                        AllData.push({
                            UserData: TotalUserdata,
                            BhagData: BhagData,
                            NagarData: NagarData,
                            VastiData: VastiData,
                            SocietyData: SocietyData,
                            AbhiyanData: AbhiyanData,
                            KaryakartaData: KaryakartaData,
                        })

                        return res.status(200).json({
                            status: 1, message: "Success.",
                            UserRole: "SuperUser",
                            AllData: AllData,

                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "NormalUser") {
                        let NormalBhagDetailData = await UserBhagDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let NormalNagarDetailData = await UserNagarDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let NormalVastiDetailData = await UserVastiDetailModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'VastiID', select: 'VastiName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let NormalSocietyData = await SocietyModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let NormalAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let NormalKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        let TodayNormalBhagDetailData = await UserBhagDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodayNormalNagarDetailData = await UserNagarDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodayNormalVastiDetailData = await UserVastiDetailModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).populate({ path: 'VastiID', select: 'VastiName' }).populate({ path: 'UserID', select: 'UserName' }).exec();

                        let TodayNormalSocietyData = await SocietyModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let TodayNormalAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let TodayNormalKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingSocietyData = []
                        PendingAbhiyanData = [], PendingKaryakartaData = [];

                        if (NormalBhagDetailData.length != TodayNormalBhagDetailData.length) {
                            NormalBhagDetailData.forEach((bhag) => {
                                let data = TodayNormalBhagDetailData.filter((ele) => {
                                    console.log(ele.BhagID.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                                    return ele.BhagID._id.toString() != bhag.BhagID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingBhagData.push(bhag)
                                }
                            })
                        }

                        if (NormalNagarDetailData.length != TodayNormalNagarDetailData.length) {
                            NormalNagarDetailData.forEach((nagar) => {
                                let data = TodayNormalNagarDetailData.filter((ele) => {
                                    console.log(ele.NagarID.toString(), nagar.NagarID._id.toString(), ele.NagarID.toString() == nagar.NagarID._id.toString())
                                    return ele.NagarID._id.toString() != nagar.NagarID._id.toString()
                                });
                                if (data.length > 0) {
                                    PendingNagarData.push(nagar)
                                }
                            })
                        }

                        if (NormalVastiDetailData.length != TodayNormalVastiDetailData.length) {
                            NormalVastiDetailData.forEach((vasti) => {
                                let data = TodayNormalVastiDetailData.filter((ele) => {
                                    console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele.VastiID._id.toString() != vasti.VastiID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingVastiData.push(vasti)
                                }
                            })
                        }

                        if (NormalSocietyData.length != TodayNormalSocietyData.length) {
                            NormalSocietyData.forEach((society) => {
                                let data = TodayNormalSocietyData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != society._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingSocietyData.push(society)
                                }
                            })
                        }

                        if (NormalAbhiyanData.length != TodayNormalAbhiyanData.length) {
                            NormalAbhiyanData.forEach((abhiyan) => {
                                let data = TodayNormalAbhiyanData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != abhiyan._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingAbhiyanData.push(abhiyan)
                                }
                            })
                        }

                        if (NormalKaryakartaData.length != TodayNormalKaryakartaData.length) {
                            NormalKaryakartaData.forEach((karyakarta) => {
                                let data = TodayNormalKaryakartaData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != karyakarta._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingKaryakartaData.push(karyakarta)
                                }
                            })
                        }

                        BhagData = {
                            TotalBhagData: NormalBhagDetailData,
                            SearchingBhagData: TodayNormalBhagDetailData,
                            PendingBhagData: PendingBhagData,
                            TotalBhagDataCount: NormalBhagDetailData.length,
                            SearchingBhagDataCount: TodayNormalBhagDetailData.length,
                            PendingBhagDataCount: PendingBhagData.length,
                        }
                        NagarData = {
                            TotalNagarData: NormalNagarDetailData,
                            SearchingNagarData: TodayNormalNagarDetailData,
                            PendingNagarData: PendingNagarData,
                            TotalNagarDataCount: NormalNagarDetailData.length,
                            SearchingNagarDataCount: TodayNormalNagarDetailData.length,
                            PendingNagarDataCount: PendingNagarData.length,
                        }
                        VastiData = {
                            TotalVastiData: NormalVastiDetailData,
                            SearchingVastiData: TodayNormalVastiDetailData,
                            PendingVastiData: PendingVastiData,
                            TotalVastiDataCount: NormalVastiDetailData.length,
                            SearchingVastiDataCount: TodayNormalVastiDetailData.length,
                            PendingVastiDataCount: PendingVastiData.length,
                        }
                        SocietyData = {
                            TotalSocietyData: NormalSocietyData,
                            SearchingSocietyData: TodayNormalSocietyData,
                            PendingSocietyData: PendingSocietyData,
                            TotalSocietyDataCount: NormalSocietyData.length,
                            SearchingSocietyDataCount: TodayNormalSocietyData.length,
                            PendingSocietyDataCount: PendingSocietyData.length
                        }
                        AbhiyanData = {
                            TotalAbhiyanData: NormalAbhiyanData,
                            SearchingAbhiyanData: TodayNormalAbhiyanData,
                            PendingAbhiyanData: PendingAbhiyanData,
                            TotalAbhiyanDataCount: NormalAbhiyanData.length,
                            SearchingAbhiyanDataCount: TodayNormalAbhiyanData.length,
                            PendingAbhiyanDataCount: PendingAbhiyanData.length
                        }
                        KaryakartaData = {
                            TotalKaryakartaData: NormalKaryakartaData,
                            SearchingKaryakartaData: TodayNormalKaryakartaData,
                            PendingKaryakartaData: PendingKaryakartaData,
                            TotalKaryakartaDataCount: NormalKaryakartaData.length,
                            SearchingKaryakartaDataCount: TodayNormalKaryakartaData.length,
                            PendingKaryakartaDataCount: PendingKaryakartaData.length
                        }

                        AllData.push({
                            UserData: TotalUserdata,
                            BhagData: BhagData,
                            NagarData: NagarData,
                            VastiData: VastiData,
                            SocietyData: SocietyData,
                            AbhiyanData: AbhiyanData,
                            KaryakartaData: KaryakartaData,
                        })

                        return res.status(200).json({
                            status: 1, message: "Success.",
                            UserRole: "NormalUser",
                            AllData: AllData,
                            // UserData: TotalUserdata,
                            // BhagData: BhagData,
                            // NagarData: NagarData,
                            // VastiData: VastiData,
                            // SocietyData: SocietyData,
                            // AbhiyanData: AbhiyanData,
                            // KaryakartaData: KaryakartaData,

                            // data: TotalUserdata,
                            // UserData: UserData,
                            // TotalBhagData: NormalBhagDetailData,
                            // TotalNagarData: NormalNagarDetailData,
                            // TotalVastiData: NormalVastiDetailData,
                            // TotalSocietyData: NormalSocietyData,
                            // TotalAbhiyanData: NormalAbhiyanData,
                            // TotalKaryakartaData: NormalKaryakartaData,

                            // TodayBhagData: TodayNormalBhagDetailData,
                            // TodayNagarData: TodayNormalNagarDetailData,
                            // TodayVastiData: TodayNormalVastiDetailData,
                            // TodaySocietyData: TodayNormalSocietyData,
                            // TodayAbhiyanData: TodayNormalAbhiyanData,
                            // TodayKaryakartaData: TodayNormalKaryakartaData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "MainUser") {
                        let MainBhagDetailData = await BhagModel.find({}).exec();

                        let MainNagarDetailData = await NagarModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' }).exec();

                        let MainVastiDetailData = await VastiModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).exec();
                        let MainSocietyData = await SocietyModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let MainAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let MainKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        let TodayMainBhagDetailData = await BhagModel.find({})
                            .exec();
                        let TodayMainNagarDetailData = await NagarModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' }).exec();
                        let TodayMainVastiDetailData = await VastiModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'NagarID', select: 'NagarName' }).exec();
                        let TodayMainSocietyData = await SocietyModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let TodayMainAbhiyanData = await AbhiyanModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();
                        let TodayMainKaryakartaData = await KaryakartaModel.find({ "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' }).exec();

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingSocietyData = []
                        PendingAbhiyanData = [], PendingKaryakartaData = [];

                        if (MainBhagDetailData.length != TodayMainBhagDetailData.length) {
                            MainBhagDetailData.forEach((bhag) => {
                                let data = TodayMainBhagDetailData.filter((ele) => {
                                    console.log(ele.BhagID.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                                    return ele.BhagID._id.toString() != bhag.BhagID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingBhagData.push(bhag)
                                }
                            })
                        }

                        if (MainNagarDetailData.length != TodayMainNagarDetailData.length) {
                            MainNagarDetailData.forEach((nagar) => {
                                let data = TodayMainNagarDetailData.filter((ele) => {
                                    console.log(ele.NagarID.toString(), nagar.NagarID._id.toString(), ele.NagarID.toString() == nagar.NagarID._id.toString())
                                    return ele.NagarID._id.toString() != nagar.NagarID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingNagarData.push(nagar)
                                }
                            })
                        }

                        if (MainVastiDetailData.length != TodayMainVastiDetailData.length) {
                            MainVastiDetailData.forEach((vasti) => {
                                let data = TodayMainVastiDetailData.filter((ele) => {
                                    console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele.VastiID._id.toString() != vasti.VastiID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingVastiData.push(vasti)
                                }
                            })
                        }

                        if (MainSocietyData.length != TodayMainSocietyData.length) {
                            MainSocietyData.forEach((society) => {
                                let data = TodayMainSocietyData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != society._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingSocietyData.push(society)
                                }
                            })
                        }

                        if (MainAbhiyanData.length != TodayMainAbhiyanData.length) {
                            MainAbhiyanData.forEach((abhiyan) => {
                                let data = TodayMainAbhiyanData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != abhiyan._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingAbhiyanData.push(abhiyan)
                                }
                            })
                        }

                        if (MainKaryakartaData.length != TodayMainKaryakartaData.length) {
                            MainKaryakartaData.forEach((karyakarta) => {
                                let data = TodayMainKaryakartaData.filter((ele) => {
                                    // console.log(ele.VastiID.toString(), vasti.VastiID._id.toString(), ele.VastiID.toString() == vasti.VastiID._id.toString())
                                    return ele._id.toString() != karyakarta._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingKaryakartaData.push(karyakarta)
                                }
                            })
                        }
                        BhagData = {
                            TotalBhagData: MainBhagDetailData,
                            SearchingBhagData: TodayMainBhagDetailData,
                            PendingBhagData: PendingBhagData,
                            TotalBhagDataCount: MainBhagDetailData.length,
                            SearchingBhagDataCount: TodayMainBhagDetailData.length,
                            PendingBhagDataCount: PendingBhagData.length
                        }
                        NagarData = {
                            TotalNagarData: MainNagarDetailData,
                            SearchingNagarData: TodayMainNagarDetailData,
                            PendingNagarData: PendingNagarData,
                            TotalNagarDataCount: MainNagarDetailData.length,
                            SearchingNagarDataCount: TodayMainNagarDetailData.length,
                            PendingNagarDataCount: PendingNagarData.length
                        }
                        VastiData = {
                            TotalVastiData: MainVastiDetailData,
                            SearchingVastiData: TodayMainVastiDetailData,
                            PendingVastiData: PendingVastiData,
                            TotalVastiDataCount: MainVastiDetailData.length,
                            SearchingVastiDataCount: TodayMainVastiDetailData.length,
                            PendingVastiDataCount: PendingVastiData.length,
                        }
                        SocietyData = {
                            TotalSocietyData: MainSocietyData,
                            SearchingSocietyData: TodayMainSocietyData,
                            PendingSocietyData: PendingSocietyData,
                            TotalSocietyDataCount: MainSocietyData.length,
                            SearchingSocietyDataCount: TodayMainSocietyData.length,
                            PendingSocietyDataCount: PendingSocietyData.length
                        }
                        AbhiyanData = {
                            TotalAbhiyanData: MainAbhiyanData,
                            SearchingAbhiyanData: TodayMainAbhiyanData,
                            PendingAbhiyanData: PendingAbhiyanData,
                            TotalAbhiyanDataCount: MainAbhiyanData.length,
                            SearchingAbhiyanDataCount: TodayMainAbhiyanData.length,
                            PendingAbhiyanDataCount: PendingAbhiyanData.length,
                        }
                        KaryakartaData = {
                            TotalKaryakartaData: MainKaryakartaData,
                            SearchingKaryakartaData: TodayMainKaryakartaData,
                            PendingKaryakartaData: PendingKaryakartaData,
                            TotalKaryakartaDataCount: MainKaryakartaData.length,
                            SearchingKaryakartaDataCount: TodayMainKaryakartaData.length,
                            PendingKaryakartaDataCount: PendingKaryakartaData.length,
                        }

                        AllData.push({
                            UserData: TotalUserdata,
                            BhagData: BhagData,
                            NagarData: NagarData,
                            VastiData: VastiData,
                            SocietyData: SocietyData,
                            AbhiyanData: AbhiyanData,
                            KaryakartaData: KaryakartaData,
                        })

                        return res.status(200).json({
                            status: 1, message: "Success.",
                            UserRole: "MainUser",
                            AllData: AllData,
                            // UserData: TotalUserdata,
                            // BhagData: BhagData,
                            // NagarData: NagarData,
                            // VastiData: VastiData,
                            // SocietyData: SocietyData,
                            // AbhiyanData: AbhiyanData,
                            // KaryakartaData: KaryakartaData,

                            // UserData: TotalUserdata,
                            // TotalMainUserBhagData: MainBhagDetailData,
                            // TotalMainUserNagarData: MainNagarDetailData,
                            // TotalMainUserVastiData: MainVastiDetailData,
                            // TotalMainUserSocietyData: MainSocietyData,
                            // TotalMainUserAbhiyanData: MainAbhiyanData,
                            // TotalMainUserKaryakartaData: MainKaryakartaData,

                            // TodayBhagData: TodayMainBhagDetailData,
                            // TodayNagarData: TodayMainNagarDetailData,
                            // TodayVastiData: TodayMainVastiDetailData,
                            // TodaySocietyData: TodayMainSocietyData,
                            // TodayAbhiyanData: TodayMainAbhiyanData,
                            // TodayKaryakartaData: TodayMainKaryakartaData,

                            error: null
                        });
                    } else {
                        return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                    }
                }
            } else {
                return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AllCount2 = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID;
        bodyuserID = req.body.ID;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        if (!bodyuserID) {
            return res.json({ status: 0, Message: "Please Enter UserID", data: null })
        } else {
            let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID })
                .populate('BhagDetail')
                .populate('NagarDetail')
                .populate('VastiDetail')
                .exec();
            if (!TotalUserdata) {
                return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
            } else {
                var AllData = [];
                var BhagData = {};
                var NagarData = {};
                var VastiData = {};
                var SocietyData = {};
                var AbhiyanData = {};
                var KaryakartaData = {};
                if (TotalUserdata[0].UserRole == "BhagUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "UserID": CheckSearchID }, 'BhagID -_id').exec();

                    //.populate({ path: 'BhagID', select: 'BhagName' }).populate({ path: 'UserID', select: 'UserName' }).exec();
                    // let NagarData = await UserBhagDetailModel.find({})
                    //     .populate('NagarData').sort({ '_id': -1 }).exec();
                    // let VastiData = await UserBhagDetailModel.find({})
                    //     .populate('VastiData').sort({ '_id': -1 }).exec();
                    console.log("Bhagdata", BhagDetailData[0].BhagID);
                    let SocietyDatas = await SocietyModel.find({ "UserID": CheckSearchID, $nin: BhagDetailData[0].BhagID }).exec();
                    // .populate({ path: 'UserID', select: 'UserName' })
                    // .populate({ path: 'BhagID', select: 'BhagName' })
                    // .populate({ path: 'NagarID', select: 'NagarName' })
                    // .populate({ path: 'VastiID', select: 'VastiName' }).exec();

                    // if (BhagDetailData.length != Todaybhagdetail.length) {
                    //     BhagDetailData.forEach((bhag) => {
                    //         let data = Todaybhagdetail.filter((ele) => {
                    //             //console.log(ele)
                    //             console.log(ele.BhagID._id.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                    //             return ele.BhagID._id.toString() != bhag.BhagID._id.toString()
                    //         })
                    //         if (data.length > 0) {
                    //             PendingBhagData.push(bhag)
                    //         }
                    //     })
                    // }
                    // BhagDetailData.forEach((bhag) => {
                    //     bhag.BhagID.toString();
                    // });

                    return res.status(200).json({
                        status: 1, message: "Done.",
                        UserData: TotalUserdata,
                        Bhagdata: BhagDetailData,
                        // NagarData: NagarData,
                        // VastiData: VastiData,
                        SocietyData: SocietyDatas,
                        error: null
                    });
                } else {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AllCount = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID, query1;
        bodyuserID = req.body.ID;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            console.log("===today==", todayi)
            query1 = {
                // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
            //console.log("3442242424", todaydate)

            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        if (!bodyuserID) {
            return res.json({ status: 0, Message: "Please Enter UserID", data: null })
        } else {
            let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID })
                .populate('BhagDetail')
                .populate('NagarDetail')
                .populate('VastiDetail')
                .exec();
            if (!TotalUserdata) {
                return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
            } else {
                var AllData = [];
                // var BhagData = {};
                // var NagarData = {};
                // var VastiData = {};
                // var SocietyData = {};
                // var AbhiyanData = {};
                // var KaryakartaData = {};
                if (TotalUserdata[0].UserRole == "BhagUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID }).distinct('BhagID').exec();
                    let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData } }).distinct('_id').exec();
                    let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: NagarDetail } }).distinct('_id').exec();
                    let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();

                    console.log("", userdatanormal)
                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                        // console.log(userid)
                    }
                    // let UserBhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData } }).exec();
                    // let UserNagarDetailData = await UserNagarDetailModel.find({ "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData } }).exec();
                    // let UserVastiDetailData = await UserVastiDetailModel.find({ "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData } }).exec();


                    // console.log("-----", UserBhagDetailData)
                    // console.log("-----", BhagDetailData)
                    // console.log("-----", UserNagarDetailData)
                    // console.log("-----", UserVastiDetailData)


                    // console.log("-----", UserVastiDetailData)

                    var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingUserData = [];
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    console.log("1111SocietyDetailSearchBhag", SocietyDetailSearchBhag)
                    console.log("2222KaryakartaSearchBhag", KaryakartaDetailSearchBhag)
                    console.log("4444AbhiyanSearchBhag", AbhiyanDetailSearchBhag)


                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();


                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();


                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();

                    let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    })
                        .distinct('NagarID').exec();
                    let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();

                    console.log("---mmmmm--", TodayUserBhagDetailData)
                    // console.log("-----", TodayUserNagarDetailData)
                    // console.log("-----", TodayUserVastiDetailData)

                    console.log("--mitra---", TodayUserBhagDetailData.length)
                    // console.log("-----", TodayUserNagarDetailData.length)
                    // console.log("-----", TodayUserVastiDetailData.length)

                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        // console.log("set-------------------->", set);
                        // console.log("set-------------------->", lengthSet);
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        // console.log("set-------------------->", set);
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        console.log("set-------------------->", set);
                        return [...set].join(',')
                    };


                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                    console.log("PendingBhagData-------------------->", PendingBhagData);
                    // PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();

                    } else {
                        lengthSet1 = 0;
                    }
                    // let masterbhag = await BhagModel.find({ "_id": { $in: Data } }).exec()
                    // console.log("Data-------------------->", Data);
                    // console.log("masterbhag-------------------->", masterbhag);


                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                        // var arr = Data2.split(',');
                        // let masternagar = await NagarModel.find({ "_id": { $in: arr } }).exec()
                        // console.log("Data-------------------->", Data);
                        // console.log("masternagar-------------------->", masternagar);
                    } else {
                        lengthSet2 = 0;
                    }



                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }


                    AllData.push({
                        TotalBhagdata: BhagDetailData.length,
                        TotalNagarData: NagarDetail.length,
                        TotalVastiData: VastiDetail.length,
                        TotalSocietyData: SocietyDetail.length,
                        TotalKaryakartaData: KaryakartaDetail.length,
                        TotalAbhiyanData: AbhiyanDetail.length,
                        TotalUserData: Alluserdatanormal.length,
                        SearchUserData: userdatanormal.length,
                        // SearchUserData: todayuserdata.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        SearchSocietyData: TodaySocietyDetailSearch.length,
                        SearchKaryakartaData: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length,

                        // TotalBhagdata: BhagDetailData,
                        // TotalNagarData: NagarDetail,
                        // TotalVastiData: VastiDetail,
                        // TotalSocietyData: SocietyDetail,
                        // TotalKaryakartaData: KaryakartaDetail,
                        // TotalAbhiyanData: AbhiyanDetail,
                        // SearchBhagDatadata: Data,
                        // SearchBhagDatadata2: Data2,

                    });
                    return res.status(200).json({
                        status: 1, message: "Done.",
                        AllData: AllData,
                        error: null
                    });
                } else if (TotalUserdata[0].UserRole == "SuperUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID }).distinct('BhagID').exec();
                    let NagarDetail = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID, "BhagID": { $in: BhagDetailData } }).distinct('NagarID').exec();
                    let VastiDetail = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID, "BhagID": { $in: BhagDetailData } }).distinct('VastiID').exec();
                    let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();
                    let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();
                    let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();

                    // console.log("mmmmmmmmmmmmmm", BhagDetailData);
                    // console.log("mmmmmmmmmmmmmm", NagarDetail);
                    // console.log("mmmmmmmmmmmmmm", VastiDetail);
                    // console.log("mmmmmmmmmmmmmm", SocietyDetail);
                    // let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    // let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();

                    // console.log("", userdatanormal)
                    // if (userdatanormal.length > 0) {
                    //     var userid = [];
                    //     userdatanormal.forEach((doc) => {
                    //         userid.push(doc._id)
                    //     });
                    //     // console.log(userid)
                    // }
                    // let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                    //     "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    // }).distinct('BhagID').exec();
                    // let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                    //     "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    // })
                    //     .distinct('NagarID').exec();
                    // let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                    //     "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    // }).distinct('VastiID').exec();

                    var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();

                    console.log("xxxxxxxxxxxxxxxxxxx", SocietyDetailSearchBhag)
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();

                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();


                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();


                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();

                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        console.log("set-------------------->", set);
                        // console.log("set-------------------->", lengthSet);
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        console.log("set-------------------->", set);
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        console.log("set-------------------->", set);
                        return [...set].join(',')
                    };


                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();
                    } else {
                        lengthSet1 = 0;
                    }

                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                    } else {
                        lengthSet2 = 0;
                    }

                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }
                    console.log("===dsta333===", Data3)
                    // console.log("===dsta222===", Data2)





                    AllData.push({
                        // TotalBhagdata: BhagDetailData,
                        // TotalNagarData: NagarDetailData,
                        // TotalVastiData: VastiDetailData,
                        // TotalSocietyData: SocietyDetail,
                        // TotalKaryakartaData: KaryakartaDetail,
                        // TotalAbhiyanData: AbhiyanDetail,
                        // TodaySocietyDetailSearch: TodaySocietyDetailSearch,
                        // TodayKaryakartaDetailSearch: TodayKaryakartaDetailSearch,
                        // TodayAbhiyanDetailSearch: TodayAbhiyanDetailSearch,

                        TotalBhagdata: BhagDetailData.length,
                        TotalNagarData: NagarDetail.length,
                        TotalVastiData: VastiDetail.length,
                        TotalSocietyData: SocietyDetail.length,
                        TotalKaryakartaData: KaryakartaDetail.length,
                        TotalAbhiyanData: AbhiyanDetail.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        SearchSocietyData: TodaySocietyDetailSearch.length,
                        SearchKaryakartaData: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length

                    })
                    return res.status(200).json({
                        status: 1, message: "Done.",
                        AllData: AllData,
                        error: null
                    });
                } else if (TotalUserdata[0].UserRole == "MainUser") {
                    let BhagDetails = await BhagModel.find({ "IsActive": true }).distinct('_id').exec();
                    let NagarDetails = await NagarModel.find({ "IsActive": true }).distinct('_id').exec();
                    let VastiDetails = await VastiModel.find({ "IsActive": true }).distinct('_id').exec();
                    let SocietyDetails = await SocietyModel.find({ "IsActive": true }).distinct('_id').exec();
                    let AbhiyanDetails = await AbhiyanModel.find({ "IsActive": true }).distinct('_id').exec();
                    let KaryakartaDetails = await KaryakartaModel.find({ "IsActive": true }).distinct('_id').exec();

                    let userdata = await UserMasterModel.find({ "IsActive": true, "UserRole": "NormalUser", "UserStatus": "Complete" }).distinct('_id').exec();
                    PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();

                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();


                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();


                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();

                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();

                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        // console.log("set-------------------->", set);
                        // console.log("set-------------------->", lengthSet);
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        // console.log("set-------------------->", set);
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        // console.log("set-------------------->", set);
                        return [...set].join(',')
                    };


                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();
                    } else {
                        lengthSet1 = 0;
                    }

                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                    } else {
                        lengthSet2 = 0;
                    }

                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }


                    // console.log("Data2-------------------->", Data2);
                    // console.log("Data3-------------------->", Data3);

                    return res.status(200).json({
                        status: 1, message: "Done.",
                        TotalBhagdata: BhagDetails.length,
                        TotalNagarData: NagarDetails.length,
                        TotalVastiData: VastiDetails.length,
                        TotalSocietyData: SocietyDetails.length,
                        TotalKaryakartaData: KaryakartaDetails.length,
                        TotalAbhiyanData: AbhiyanDetails.length,
                        TotalUser: userdata,
                        SearchSocietyDetailSearch: TodaySocietyDetailSearch.length,
                        SearchKaryakartaDetailSearch: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailSearch: TodayAbhiyanDetailSearch.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        error: null
                    });
                } else {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AllCountDetailView = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID, UserStatus, query1;
        bodyuserID = req.body.ID;
        UserStatus = req.body.UserStatus;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            console.log("===today==", todayi)
            query1 = {
                // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
            //console.log("3442242424", todaydate)

            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }

        console.log("UserSt------------", UserStatus);
        if (UserStatus == 'Complete') {
            if (!bodyuserID) {
                return res.json({ status: 0, Message: "Please Enter UserID", data: null })
            } else {
                let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID })
                    .populate('BhagDetail')
                    .populate('NagarDetail')
                    .populate('VastiDetail')
                    .exec();
                if (!TotalUserdata) {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                } else {
                    var AllData = [];
                    if (TotalUserdata[0].UserRole == "BhagUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: bhagid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (NagarDetail.length > 0) {
                            var nagarid = [];
                            NagarDetail.forEach((doc) => {
                                nagarid.push(doc._id)
                            });
                        }
                        let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: nagarid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (VastiDetail.length > 0) {
                            var vastiid = [];
                            VastiDetail.forEach((doc) => {
                                vastiid.push(doc._id)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        // console.log("BhagDetailData-------------------->", NagarDetail);
                        // console.log("KaryakartaDetailSearchNagar-------------------->", KaryakartaDetailSearchVasti);
                        // console.log("AbhiyanDetailSearchNagar-------------------->", AbhiyanDetailSearchVasti);
                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingUserData = [];
                        // let SocietySearchBhag = await SocietyModel.find({
                        //     "IsActive": true, "CreatedDate": query1,
                        //     "BhagID": { $in: bhagid }
                        // }).distinct('BhagID', function (error, ids) {
                        //     BhagModel.find({ '_id': { $in: ids } }, function (err, result) {
                        //         console.log(result);
                        //         console.log(err);

                        //     });
                        //     console.log(error);
                        // });

                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();




                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            console.log("set-------------------->", set);
                            // console.log("set-------------------->", lengthSet);
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                            console.log("masterbhag-------------------->", masterbhag);
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } }).exec();
                            console.log("masternagar-------------------->", masternagar);
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } }).exec()
                        } else {
                            lengthSet3 = 0;
                        }
                        let TodaySocietyDetailSearch = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetail,
                            TotalVastiData: VastiDetail,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearch,
                            SearchKaryakartaData: TodayKaryakartaDetailSearch,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearch,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "SuperUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetailData = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (NagarDetailData.length > 0) {
                            var nagarid = [];
                            NagarDetailData.forEach((doc) => {
                                nagarid.push(doc.NagarID)
                            });
                        }
                        let VastiDetailData = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        if (VastiDetailData.length > 0) {
                            var vastiid = [];
                            VastiDetailData.forEach((doc) => {
                                vastiid.push(doc.VastiID)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let TodaySocietyDetailSearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let TodayKaryakartaDetailSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let TodayAbhiyanDetailSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();




                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            console.log("set-------------------->", set);
                            // console.log("set-------------------->", lengthSet);
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                            console.log("masterbhag-------------------->", masterbhag);
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } }).exec();
                            console.log("masternagar-------------------->", masternagar);
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } }).exec()
                        } else {
                            lengthSet3 = 0;
                        }





                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetailData,
                            TotalVastiData: VastiDetailData,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearchBhag,
                            SearchKaryakartaData: TodayKaryakartaDetailSearchBhag,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearchBhag,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "MainUser") {
                        let bhagdataall = await BhagModel.find({}).sort({ '_id': -1 }).exec();
                        let nagardataall = await NagarModel.find({}).sort({ '_id': -1 }).exec();
                        let vastidetaall = await VastiModel.find({}).sort({ '_id': -1 }).exec();
                        let Societydataall = await SocietyModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let Karyakartadataall = await KaryakartaModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let Abhiyandataall = await AbhiyanModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        // let searchbhagdataall = await BhagModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        // let searchnagardataall = await NagarModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        // let searchvastidetaall = await VastiModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        let searchSocietydataall = await SocietyModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let searchKaryakartadataall = await KaryakartaModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let searchAbhiyandataall = await AbhiyanModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();




                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            console.log("set-------------------->", set);
                            // console.log("set-------------------->", lengthSet);
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            console.log("set-------------------->", set);
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                            console.log("masterbhag-------------------->", masterbhag);
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } }).exec();
                            console.log("masternagar-------------------->", masternagar);
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } }).exec()
                        } else {
                            lengthSet3 = 0;
                        }


                        AllData.push({
                            TotalBhagdata: bhagdataall,
                            TotalNagarData: nagardataall,
                            TotalVastiData: vastidetaall,
                            TotalSocietyData: Societydataall,
                            TotalKaryakartaData: Karyakartadataall,
                            TotalAbhiyanData: Abhiyandataall,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: searchSocietydataall,
                            SearchKaryakartaData: searchKaryakartadataall,
                            SearchAbhiyanDetailData: searchAbhiyandataall,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });

                    } else {
                        return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                    }
                }
            }
        } else if (UserStatus == 'Pending') {
            if (!bodyuserID) {
                return res.json({ status: 0, Message: "Please Enter UserID", data: null })
            } else {
                let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID })
                    .populate('BhagDetail')
                    .populate('NagarDetail')
                    .populate('VastiDetail')
                    .exec();
                if (!TotalUserdata) {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                } else {
                    var AllData = [];
                    if (TotalUserdata[0].UserRole == "BhagUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' }).exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $nin: bhagid } }).exec();
                        if (NagarDetail.length > 0) {
                            var nagarid = [];
                            NagarDetail.forEach((doc) => {
                                nagarid.push(doc._id)
                            });
                        }
                        let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $nin: nagarid } }).exec();
                        if (VastiDetail.length > 0) {
                            var vastiid = [];
                            VastiDetail.forEach((doc) => {
                                vastiid.push(doc._id)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();
                        // console.log("BhagDetailData-------------------->", NagarDetail);
                        // console.log("KaryakartaDetailSearchNagar-------------------->", KaryakartaDetailSearchVasti);
                        // console.log("AbhiyanDetailSearchNagar-------------------->", AbhiyanDetailSearchVasti);

                        let SocietyDetailSearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetail,
                            TotalVastiData: VastiDetail,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            SearchSocietyData: SocietyDetailSearchBhag,
                            SearchKaryakartaData: KaryakartaDetailSearchBhag,
                            SearchAbhiyanDetailData: AbhiyanDetailSearchBhag,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "SuperUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' }).exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetailData = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' }).exec();
                        if (NagarDetailData.length > 0) {
                            var nagarid = [];
                            NagarDetailData.forEach((doc) => {
                                nagarid.push(doc.NagarID)
                            });
                        }
                        let VastiDetailData = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' }).exec();
                        if (VastiDetailData.length > 0) {
                            var vastiid = [];
                            VastiDetailData.forEach((doc) => {
                                vastiid.push(doc.VastiID)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid } }).exec();


                        let SocietyDetailSearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).exec();
                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetailData,
                            TotalVastiData: VastiDetailData,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            SearchSocietyData: SocietyDetailSearchBhag,
                            SearchKaryakartaData: KaryakartaDetailSearchBhag,
                            SearchAbhiyanDetailData: AbhiyanDetailSearchBhag,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "MainUser") {
                        let

                    } else {
                        return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                    }
                }
            }
        } else {
            return res.status(200).json({ status: 0, message: "Not available.", data: null, error: null });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}
