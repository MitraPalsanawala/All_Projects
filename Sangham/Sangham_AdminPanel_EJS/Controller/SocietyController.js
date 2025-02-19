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
const workbook = new excelJS.Workbook(); // Create a new workbook
//------------------------------------------ App ----------------------------------------------------//
exports.SetSociety = [async (req, res) => {
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
exports.GetSociety = [async (req, res) => {
    try {
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });

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
                {
                    "$unwind": {
                        "path": "$UserMaster",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "SocietyModel.BhagID",
                        "from": "Bhag",
                        "foreignField": "_id",
                        "as": "Bhag"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Bhag",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "SocietyModel.NagarID",
                        "from": "Nagar",
                        "foreignField": "_id",
                        "as": "Nagar"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Nagar",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "SocietyModel.VastiID",
                        "from": "Vasti",
                        "foreignField": "_id",
                        "as": "Vasti"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Vasti",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$match": {
                        "SocietyModel.IsActive": true,
                        "UserMaster.IsActive": true,
                        "Bhag.IsActive": true,
                        "Nagar.IsActive": true,
                        "Vasti.IsActive": true,
                        "SocietyModel._id": CheckSearchID,
                        "SocietyModel.UserID": CheckUserID,
                        "SocietyModel.BhagID": CheckBhagID,
                        "SocietyModel.NagarID": CheckNagarID,
                        "SocietyModel.VastiID": CheckVastiID,
                    }
                },
                {
                    "$sort": {
                        "SocietyModel._id": -1
                    }
                },
                {
                    "$project": {
                        "_id": "$SocietyModel._id",
                        "UserID": "$SocietyModel.UserID",
                        "UserName": "$UserMaster.UserName",
                        "BhagID": "$SocietyModel.BhagID",
                        "BhagName": "$Bhag.BhagName",
                        "NagarID": "$SocietyModel.NagarID",
                        "NagarName": "$Nagar.NagarName",
                        "VastiID": "$SocietyModel.VastiID",
                        "VastiName": "$Vasti.VastiName",
                        "SocietyName": "$SocietyModel.SocietyName",
                        "SecretaryName": "$SocietyModel.SecretaryName",
                        "SecretaryMobileNo": "$SocietyModel.SecretaryMobileNo",
                        "SecretaryAddress": "$SocietyModel.SecretaryAddress",
                        "SecretaryEmailID": "$SocietyModel.SecretaryEmailID",
                        "Landmark": "$SocietyModel.Landmark",
                        "NumberOfHouse": "$SocietyModel.NumberOfHouse",
                        "Type": "$SocietyModel.Type",
                        "SocietyType": "$SocietyModel.SocietyType",
                        "IsActive": "$SocietyModel.IsActive",
                        "IsDelete": "$SocietyModel.IsDelete",
                        "CreatedDate": "$SocietyModel.CreatedDate",
                        "ModifiedDate": "$SocietyModel.ModifiedDate"
                    }
                }
            ]);
        return res.status(200).json({ status: 1, message: "Success.", data: SocietyData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.RemoveSociety = [async (req, res) => {
    try {
        if (!req.body.ID) {
            res.json({ status: 0, message: "Please Enter ID!", data: null, error: null });
        }
        else {
            const ID = new mongoose.Types.ObjectId(req.body.ID)

            var UpdateSocietyData = {};
            UpdateSocietyData["IsActive"] = false;
            UpdateSocietyData["IsDelete"] = true
            SocietyModel.updateOne({ _id: ID }, UpdateSocietyData).exec((error, result) => {
                if (error) {
                    return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                } else {
                    return res.status(200).json({ status: 1, message: "Society Successfully Deleted.", data: null, error: null });
                }
            })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//

async function BindSocietyData(req) {
    var CheckSearchID, CheckBhagID, CheckUserID, CheckNagarID, CheckVastiID, query1;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });

    if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.EndDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

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
            {
                "$unwind": {
                    "path": "$UserMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "SocietyModel.BhagID",
                    "from": "Bhag",
                    "foreignField": "_id",
                    "as": "Bhag"
                }
            },
            {
                "$unwind": {
                    "path": "$Bhag",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "SocietyModel.NagarID",
                    "from": "Nagar",
                    "foreignField": "_id",
                    "as": "Nagar"
                }
            },
            {
                "$unwind": {
                    "path": "$Nagar",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "SocietyModel.VastiID",
                    "from": "Vasti",
                    "foreignField": "_id",
                    "as": "Vasti"
                }
            },
            {
                "$unwind": {
                    "path": "$Vasti",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$match": {
                    "SocietyModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "SocietyModel._id": CheckSearchID,
                    "SocietyModel.UserID": CheckUserID,
                    "SocietyModel.BhagID": CheckBhagID,
                    "SocietyModel.NagarID": CheckNagarID,
                    "SocietyModel.VastiID": CheckVastiID,
                    "SocietyModel.CreatedDate": query1
                }
            },
            {
                "$sort": {
                    "SocietyModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$SocietyModel._id",
                    "UserID": "$SocietyModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$SocietyModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$SocietyModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$SocietyModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyName": "$SocietyModel.SocietyName",
                    "SecretaryName": "$SocietyModel.SecretaryName",
                    "SecretaryMobileNo": "$SocietyModel.SecretaryMobileNo",
                    "SecretaryAddress": "$SocietyModel.SecretaryAddress",
                    "SecretaryEmailID": "$SocietyModel.SecretaryEmailID",
                    "Landmark": "$SocietyModel.Landmark",
                    "NumberOfHouse": "$SocietyModel.NumberOfHouse",
                    "Type": "$SocietyModel.Type",
                    "SocietyType": "$SocietyModel.SocietyType",
                    "IsActive": "$SocietyModel.IsActive",
                    "IsDelete": "$SocietyModel.IsDelete",
                    "CreatedDate": "$SocietyModel.CreatedDate",
                    "ModifiedDate": "$SocietyModel.ModifiedDate"
                }
            }
        ]);
    return SocietyData;
}
exports.ViewSocietyData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await BindSocietyData(req);

            res.render('./PanelUser/ViewSocietyDetail', {
                title: 'ViewSocietyDetail', SocietyData: SocietyData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                SearchData: '', FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SearchingSocietyData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.StartDate + '~' + req.body.EndDate;
            console.log("SearchData", SearchData)
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await BindSocietyData(req);
            if (req.params.ID) {
                res.render('./PanelUser/ViewSocietyDetail', {
                    title: 'ViewSocietyDetail', SocietyData: SocietyData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                    SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1
                });
            } else {
                res.render('./PanelUser/ViewSocietyDetail', {
                    title: 'ViewSocietyDetail', SocietyData: SocietyData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                    SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1
                });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.ExportSocietyData1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
            var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
            var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
            var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
            var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });

            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID

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
                    {
                        "$unwind": {
                            "path": "$UserMaster",
                            "preserveNullAndEmptyArrays": false
                        }
                    },
                    {
                        "$lookup": {
                            "localField": "SocietyModel.BhagID",
                            "from": "Bhag",
                            "foreignField": "_id",
                            "as": "Bhag"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$Bhag",
                            "preserveNullAndEmptyArrays": false
                        }
                    },
                    {
                        "$lookup": {
                            "localField": "SocietyModel.NagarID",
                            "from": "Nagar",
                            "foreignField": "_id",
                            "as": "Nagar"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$Nagar",
                            "preserveNullAndEmptyArrays": false
                        }
                    },
                    {
                        "$lookup": {
                            "localField": "SocietyModel.VastiID",
                            "from": "Vasti",
                            "foreignField": "_id",
                            "as": "Vasti"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$Vasti",
                            "preserveNullAndEmptyArrays": false
                        }
                    },
                    {
                        "$match": {
                            "SocietyModel.IsActive": true,
                            "UserMaster.IsActive": true,
                            "Bhag.IsActive": true,
                            "Nagar.IsActive": true,
                            "Vasti.IsActive": true,
                            "SocietyModel._id": CheckSearchID,
                            "SocietyModel.UserID": CheckUserID,
                            "SocietyModel.BhagID": CheckBhagID,
                            "SocietyModel.NagarID": CheckNagarID,
                            "SocietyModel.VastiID": CheckVastiID,
                        }
                    },
                    {
                        "$sort": {
                            "SocietyModel._id": -1
                        }
                    },
                    {
                        "$project": {
                            "_id": "$SocietyModel._id",
                            "UserID": "$SocietyModel.UserID",
                            "UserName": "$UserMaster.UserName",
                            "BhagID": "$SocietyModel.BhagID",
                            "BhagName": "$Bhag.BhagName",
                            "NagarID": "$SocietyModel.NagarID",
                            "NagarName": "$Nagar.NagarName",
                            "VastiID": "$SocietyModel.VastiID",
                            "VastiName": "$Vasti.VastiName",
                            "SocietyName": "$SocietyModel.SocietyName",
                            "SecretaryName": "$SocietyModel.SecretaryName",
                            "SecretaryMobileNo": "$SocietyModel.SecretaryMobileNo",
                            "SecretaryAddress": "$SocietyModel.SecretaryAddress",
                            "SecretaryEmailID": "$SocietyModel.SecretaryEmailID",
                            "IsActive": "$SocietyModel.IsActive",
                            "IsDelete": "$SocietyModel.IsDelete",
                            "CreatedDate": "$SocietyModel.CreatedDate",
                            "ModifiedDate": "$SocietyModel.ModifiedDate"
                        }
                    }
                ]);
            var Result = [];
            SocietyData.forEach((sdata) => {
                Result.push({
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,
                    "SecretaryName": sdata.SecretaryName,
                    "SecretaryMobileNo": sdata.SecretaryMobileNo,
                    "SecretaryAddress": sdata.SecretaryAddress,
                    "SecretaryEmailID": sdata.SecretaryEmailID,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("SocietyDetail");

            worksheet.columns = [

                { header: "User Name", key: "UserName", width: 15 },
                { header: "Bhag Name", key: "BhagName", width: 15 },
                { header: "Nagar Name", key: "NagarName", width: 15 },
                { header: "Vasti Name", key: "VastiName", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "Society Name", key: "SocietyName", width: 22 },
                { header: "Secretary Name", key: "SecretaryName", width: 16 },
                { header: "Secretary MobileNo", key: "SecretaryMobileNo", width: 18 },
                { header: "Secretary Address", key: "SecretaryAddress", width: 22 },
                { header: "Secretary EmailID", key: "SecretaryEmailID", width: 16 },
                { header: "Entry Date", key: "CreatedDate", width: 15 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'SocietyDetail'

            // Optional merge and styles
            worksheet.mergeCells('A1:J1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(Result);
            worksheet.eachRow(function (row, rowNumber) {

                row.eachCell((cell, colNumber) => {
                    if (rowNumber == 1) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '8b74a2db' }
                        },
                            cell.font = { color: { argb: 'ffffff' }, bold: true }
                    }
                    //Set border of each cell
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                })
                //Commit the changed row to the stream
                row.commit();
            });
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "SocietyDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.render('./PanelUser/ViewSocietyDetail', {
            //     title: 'ViewSocietyDetail', SocietyData: SocietyData,
            //     BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
            //     SearchData: '', FetchData: '', cookieData: req.cookies.admindata.UserName
            // });


        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.ExportSocietyData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let SocietyData = await BindSocietyData(req);

            var Result = [];
            var count = 1;
            SocietyData.forEach((sdata) => {
                Result.push({
                    "Sr.No.": count++,
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,
                    "SecretaryName": sdata.SecretaryName,
                    "SecretaryMobileNo": sdata.SecretaryMobileNo,
                    "SecretaryAddress": sdata.SecretaryAddress,
                    "SecretaryEmailID": sdata.SecretaryEmailID,
                    "Landmark": sdata.Landmark,
                    "NumberOfHouse": sdata.NumberOfHouse,
                    "Type": sdata.Type,
                    "SocietyType": sdata.SocietyType,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Society Detail");

            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "User Name", key: "UserName", width: 15 },
                { header: "Bhag Name", key: "BhagName", width: 15 },
                { header: "Nagar Name", key: "NagarName", width: 15 },
                { header: "Vasti Name", key: "VastiName", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "Society Name", key: "SocietyName", width: 22 },
                { header: "Secretary Name", key: "SecretaryName", width: 16 },
                { header: "Secretary MobileNo", key: "SecretaryMobileNo", width: 18 },
                { header: "Secretary Address", key: "SecretaryAddress", width: 22 },
                { header: "Secretary EmailID", key: "SecretaryEmailID", width: 16 },
                { header: "Landmark", key: "Landmark", width: 15 },
                { header: "Number Of House", key: "NumberOfHouse", width: 18 },
                { header: "Type", key: "Type", width: 15 },
                { header: "Society Type", key: "SocietyType", width: 18 },
                { header: "Entry Date", key: "CreatedDate", width: 15 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Society Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:O1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(Result);
            worksheet.eachRow(function (row, rowNumber) {

                row.eachCell((cell, colNumber) => {
                    if (rowNumber == 1) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '8b74a2db' }
                        },
                            cell.font = { color: { argb: 'ffffff' }, bold: true }
                    }
                    //Set border of each cell
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                })
                //Commit the changed row to the stream
                row.commit();
            });
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "SocietyDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.render('./PanelUser/ViewSocietyDetail', {
            //     title: 'ViewSocietyDetail', SocietyData: SocietyData,
            //     BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
            //     SearchData: '', FetchData: '', cookieData: req.cookies.admindata.UserName
            // });


        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}
