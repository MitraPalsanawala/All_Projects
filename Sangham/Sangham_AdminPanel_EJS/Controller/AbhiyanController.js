const AbhiyanModel = require("../Model/AbhiyanModel");
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
const { query } = require("express");
const workbook = new excelJS.Workbook(); // Create a new workbook
//------------------------------------------ App ----------------------------------------------------//
exports.SetAbhiyan = [async (req, res) => {
    try {
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Select User!", data: null, error: null });
        } else if (!req.body.BhagID) {
            res.json({ status: 0, message: "Please Select Bhag!", data: null, error: null });
        } else if (!req.body.NagarID) {
            res.json({ status: 0, message: "Please Select Nagar!", data: null, error: null });
        } else if (!req.body.VastiID) {
            res.json({ status: 0, message: "Please Select Vasti!", data: null, error: null });
        } else if (!req.body.SocietyID) {
            res.json({ status: 0, message: "Please Select Society!", data: null, error: null });
        } else if (!req.body.Sampark) {
            res.json({ status: 0, message: "Please Enter Sampark!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let CheckAbhiyanData = await AbhiyanModel.findOne({
                    IsActive: true,
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    Sampark: req.body.Sampark
                }).exec();
                if (CheckAbhiyanData) {
                    return res.status(200).json({ status: 1, message: "Abhiyan Sampark Already Exist.", data: CheckAbhiyanData, error: null });
                } else {
                    var abhiyan = await AbhiyanModel({
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyID: req.body.SocietyID,
                        Sampark: req.body.Sampark,
                        SocietyType: req.body.SocietyType,
                        Type: req.body.Type,
                        HinduCount: req.body.HinduCount,
                        MuslimCount: req.body.MuslimCount,
                        ChristiansCount: req.body.ChristiansCount,
                        AnyCount: req.body.AnyCount,
                        BJP: req.body.BJP,
                        BJPAnswer: req.body.BJPAnswer,
                        Congress: req.body.Congress,
                        CongressAnswer: req.body.CongressAnswer,
                        AAP: req.body.AAP,
                        AAPAnswer: req.body.AAPAnswer,
                        Others: req.body.Others,
                        OthersAnswer: req.body.OthersAnswer,
                        ServeType: req.body.ServeType,
                        IsActive: true,
                    }).save();
                    return res.status(200).json({ status: 1, message: "Abhiyan Successfully Inserted.", data: abhiyan, error: null });
                }
            }
            else {
                let CheckAbhiyanData = await AbhiyanModel.findOne({
                    IsActive: true, _id: { $nin: mongoose.Types.ObjectId(req.body.ID) },
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    Sampark: req.body.Sampark
                }).exec();
                if (CheckAbhiyanData) {
                    return res.status(200).json({ status: 1, message: "Abhiyan Sampark Already Exist.", data: CheckAbhiyanData, error: null });
                }
                else {
                    var UpdateAbhiyanData = {};
                    UpdateAbhiyanData["UserID"] = req.body.UserID;
                    UpdateAbhiyanData["BhagID"] = req.body.BhagID;
                    UpdateAbhiyanData["NagarID"] = req.body.NagarID;
                    UpdateAbhiyanData["VastiID"] = req.body.VastiID;
                    UpdateAbhiyanData["SocietyID"] = req.body.SocietyID;
                    UpdateAbhiyanData["Sampark"] = req.body.Sampark;
                    UpdateAbhiyanData["SocietyType"] = req.body.SocietyType;
                    UpdateAbhiyanData["Type"] = req.body.Type;
                    UpdateAbhiyanData["HinduCount"] = req.body.HinduCount;
                    UpdateAbhiyanData["MuslimCount"] = req.body.MuslimCount;
                    UpdateAbhiyanData["ChristiansCount"] = req.body.ChristiansCount;
                    UpdateAbhiyanData["AnyCount"] = req.body.AnyCount;
                    UpdateAbhiyanData["BJP"] = req.body.BJP;
                    UpdateAbhiyanData["BJPAnswer"] = req.body.BJPAnswer;
                    UpdateAbhiyanData["Congress"] = req.body.Congress;
                    UpdateAbhiyanData["CongressAnswer"] = req.body.CongressAnswer;
                    UpdateAbhiyanData["AAP"] = req.body.AAP;
                    UpdateAbhiyanData["AAPAnswer"] = req.body.AAPAnswer;
                    UpdateAbhiyanData["Others"] = req.body.Others;
                    UpdateAbhiyanData["OthersAnswer"] = req.body.OthersAnswer;
                    UpdateAbhiyanData["ServeType"] = req.body.ServeType;
                    UpdateAbhiyanData["ModifiedDate"] = new Date();
                    //await AbhiyanModel.updateOne({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateAbhiyanData).exec();
                    AbhiyanModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateAbhiyanData, { new: true }).exec((error, result) => {
                        if (error) {
                            return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                        } else {
                            return res.status(200).json({ status: 1, message: "Abhiyan Successfully Updated.", data: result, error: null });
                        }
                    })
                }
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetAbhiyan = [async (req, res) => {
    try {
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        var CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });

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
                {
                    "$unwind": {
                        "path": "$UserMaster",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "AbhiyanModel.BhagID",
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
                        "localField": "AbhiyanModel.NagarID",
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
                        "localField": "AbhiyanModel.VastiID",
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
                    "$lookup": {
                        "localField": "AbhiyanModel.SocietyID",
                        "from": "Society",
                        "foreignField": "_id",
                        "as": "Society"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Society",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$match": {
                        "AbhiyanModel.IsActive": true,
                        "UserMaster.IsActive": true,
                        "Bhag.IsActive": true,
                        "Nagar.IsActive": true,
                        "Vasti.IsActive": true,
                        "Society.IsActive": true,
                        "AbhiyanModel._id": CheckSearchID,
                        "AbhiyanModel.UserID": CheckSearchUserID,
                        "AbhiyanModel.BhagID": CheckSearchBhagID,
                        "AbhiyanModel.NagarID": CheckSearchNagarID,
                        "AbhiyanModel.VastiID": CheckSearchVastiID,
                        "AbhiyanModel.SocietyID": CheckSearchSocietyID
                    },
                },
                {
                    "$sort": {
                        "AbhiyanModel._id": -1
                    }
                },
                {
                    "$project": {
                        "_id": "$AbhiyanModel._id",
                        "UserID": "$AbhiyanModel.UserID",
                        "UserName": "$UserMaster.UserName",
                        "BhagID": "$AbhiyanModel.BhagID",
                        "BhagName": "$Bhag.BhagName",
                        "NagarID": "$AbhiyanModel.NagarID",
                        "NagarName": "$Nagar.NagarName",
                        "VastiID": "$AbhiyanModel.VastiID",
                        "VastiName": "$Vasti.VastiName",
                        "SocietyID": "$AbhiyanModel.SocietyID",
                        "SocietyName": "$Society.SocietyName",
                        "Sampark": "$AbhiyanModel.Sampark",
                        "SocietyType": "$AbhiyanModel.SocietyType",
                        "Type": "$AbhiyanModel.Type",
                        "HinduCount": "$AbhiyanModel.HinduCount",
                        "MuslimCount": "$AbhiyanModel.MuslimCount",
                        "ChristiansCount": "$AbhiyanModel.ChristiansCount",
                        "AnyCount": "$AbhiyanModel.AnyCount",
                        "BJP": "$AbhiyanModel.BJP",
                        "BJPAnswer": "$AbhiyanModel.BJPAnswer",
                        "Congress": "$AbhiyanModel.Congress",
                        "CongressAnswer": "$AbhiyanModel.CongressAnswer",
                        "AAP": "$AbhiyanModel.AAP",
                        "AAPAnswer": "$AbhiyanModel.AAPAnswer",
                        "Others": "$AbhiyanModel.Others",
                        "OthersAnswer": "$AbhiyanModel.OthersAnswer",
                        "ServeType": "$AbhiyanModel.ServeType",
                        "IsActive": "$AbhiyanModel.IsActive",
                        "IsDelete": "$AbhiyanModel.IsDelete",
                        "CreatedDate": "$AbhiyanModel.CreatedDate",
                        "ModifiedDate": "$AbhiyanModel.ModifiedDate"
                    }
                }
            ]);

        return res.status(200).json({ status: 1, message: "Success.", data: AbhiyanData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.RemoveAbhiyan = [async (req, res) => {
    try {
        if (!req.body.ID) {
            res.json({ status: 0, message: "Please Enter ID!", data: null, error: null });
        }
        else {
            const ID = new mongoose.Types.ObjectId(req.body.ID)
            var UpdateAbhiyanData = {};
            UpdateAbhiyanData["IsActive"] = false;
            UpdateAbhiyanData["IsDelete"] = true
            AbhiyanModel.updateOne({ _id: ID }, UpdateAbhiyanData).exec((error, result) => {
                if (error) {
                    return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                } else {
                    return res.status(200).json({ status: 1, message: "Abhiyan Successfully Deleted.", data: null, error: null });
                }
            })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
async function BindAbhiyanData(req) {
    var CheckSearchID, CheckSearchUserID, CheckSearchBhagID, CheckSearchNagarID, CheckSearchVastiID, CheckSearchSocietyID, query1;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
    CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });

    if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
        var todayi = new Date(req.body.StartDate);
        var todayEODi = new Date(req.body.EndDate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
            '$gte': todayi, '$lte': todayEODi
        }
    } else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
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
            {
                "$unwind": {
                    "path": "$UserMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "AbhiyanModel.BhagID",
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
                    "localField": "AbhiyanModel.NagarID",
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
                    "localField": "AbhiyanModel.VastiID",
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
                "$lookup": {
                    "localField": "AbhiyanModel.SocietyID",
                    "from": "Society",
                    "foreignField": "_id",
                    "as": "Society"
                }
            },
            {
                "$unwind": {
                    "path": "$Society",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$match": {
                    "AbhiyanModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    "AbhiyanModel._id": CheckSearchID,
                    "AbhiyanModel.UserID": CheckSearchUserID,
                    "AbhiyanModel.BhagID": CheckSearchBhagID,
                    "AbhiyanModel.NagarID": CheckSearchNagarID,
                    "AbhiyanModel.VastiID": CheckSearchVastiID,
                    "AbhiyanModel.SocietyID": CheckSearchSocietyID,
                    "AbhiyanModel.CreatedDate": query1
                }
            },
            {
                "$sort": {
                    "AbhiyanModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$AbhiyanModel._id",
                    "UserID": "$AbhiyanModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$AbhiyanModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$AbhiyanModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$AbhiyanModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyID": "$AbhiyanModel.SocietyID",
                    "SocietyName": "$Society.SocietyName",
                    "Sampark": "$AbhiyanModel.Sampark",
                    "SocietyType": "$AbhiyanModel.SocietyType",
                    "Type": "$AbhiyanModel.Type",
                    "HinduCount": "$AbhiyanModel.HinduCount",
                    "MuslimCount": "$AbhiyanModel.MuslimCount",
                    "ChristiansCount": "$AbhiyanModel.ChristiansCount",
                    "ServeType": "$AbhiyanModel.ServeType",
                    "IsActive": "$AbhiyanModel.IsActive",
                    "IsDelete": "$AbhiyanModel.IsDelete",
                    "CreatedDate": "$AbhiyanModel.CreatedDate",
                    "ModifiedDate": "$AbhiyanModel.ModifiedDate"
                }
            }
        ]);
    return AbhiyanData;
}
exports.ViewAbhiyanData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let AbhiyanData = await BindAbhiyanData(req);
            res.render('./PanelUser/ViewAbhiyanDetail', {
                title: 'ViewAbhiyanDetail', AbhiyanData: AbhiyanData, SocietyData: SocietyData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                SearchData: '', FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SearchingAbhiyanData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.StartDate + '~' + req.body.EndDate;
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let AbhiyanData = await BindAbhiyanData(req);
            if (req.params.ID) {
                res.render('./PanelUser/ViewAbhiyanDetail', {
                    title: 'ViewAbhiyanDetail', AbhiyanData: AbhiyanData, SocietyData: SocietyData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                    SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
                });
            } else {
                res.render('./PanelUser/ViewAbhiyanDetail', {
                    title: 'ViewAbhiyanDetail', AbhiyanData: AbhiyanData, SocietyData: SocietyData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
                    SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
                });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.ExportAbhiyanData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let AbhiyanData = await BindAbhiyanData(req);
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.StartDate + '~' + req.body.EndDate;

            var Result = [];
            var count = 1;
            AbhiyanData.forEach((sdata) => {

                Result.push({
                    "Sr.No.": count++,
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,

                    "SocietyType": sdata.SocietyType,
                    "Sampark": sdata.Sampark,
                    "ServeType": sdata.ServeType,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Abhiyan Detail");

            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Bhag Name", key: "BhagName", width: 20 },
                { header: "Nagar Name", key: "NagarName", width: 15 },
                { header: "Vasti Name", key: "VastiName", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "Society Name", key: "SocietyName", width: 18 },
                { header: "Society Type", key: "SocietyType", width: 18 },
                { header: "Sampark", key: "Sampark", width: 16 },
                { header: "ServeType", key: "ServeType", width: 16 },
                { header: "Entry Date", key: "CreatedDate", width: 16 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Abhiyan Detail'

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
                "attachment; filename=" + "AbhiyanDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.render('./PanelUser/ViewAbhiyanDetail', {
            //     title: 'ViewAbhiyanDetail', AbhiyanData: AbhiyanData, SocietyData: SocietyData,
            //     BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData,
            //     SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName
            // });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}