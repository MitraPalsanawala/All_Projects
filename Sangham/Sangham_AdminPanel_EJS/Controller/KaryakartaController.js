const KaryakartaModel = require("../Model/KaryakartaModel");
const SocietyModel = require("../Model/SocietyModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const TypeMasterModel = require("../Model/TypeMasterModel");
const TypeDetailMasterModel = require("../Model/TypeDetailMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
const DIR = "./public/upload";
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook(); // Create a new workbook
//------------------------------------------ App ----------------------------------------------------//
exports.SetKaryakarta = [async (req, res) => {
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
        } else if (!req.body.Name) {
            res.json({ status: 0, message: "Please Enter Name!", data: null, error: null });
        } else if (!req.body.TypeID) {
            res.json({ status: 0, message: "Please Select Type!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let CheckKaryakartaData = await KaryakartaModel.findOne({
                    IsActive: true,
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    TypeID: mongoose.Types.ObjectId(req.body.TypeID),
                    Name: req.body.Name
                }).exec();
                if (CheckKaryakartaData) {
                    return res.status(200).json({ status: 1, message: "Karyakarta Name Already Exist.", data: CheckKaryakartaData, error: null });
                } else {
                    var Karyakarta = await KaryakartaModel({
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyID: req.body.SocietyID,
                        TypeID: req.body.TypeID,
                        Name: req.body.Name,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        EmailID: req.body.EmailID,
                        IsActive: true,
                    }).save();
                    return res.status(200).json({ status: 1, message: "Karyakarta Successfully Inserted.", data: Karyakarta, error: null });
                }
            }
            else {
                let CheckKaryakartaData = await KaryakartaModel.findOne({
                    IsActive: true, _id: { $nin: mongoose.Types.ObjectId(req.body.ID) },
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    TypeID: mongoose.Types.ObjectId(req.body.TypeID),
                    Name: req.body.Name
                }).exec();
                if (CheckKaryakartaData) {
                    return res.status(200).json({ status: 1, message: "Karyakarta Name Already Exist.", data: CheckKaryakartaData, error: null });
                }
                else {
                    var UpdateKaryakartaData = {};
                    UpdateKaryakartaData["UserID"] = req.body.UserID;
                    UpdateKaryakartaData["BhagID"] = req.body.BhagID;
                    UpdateKaryakartaData["NagarID"] = req.body.NagarID;
                    UpdateKaryakartaData["VastiID"] = req.body.VastiID;
                    UpdateKaryakartaData["SocietyID"] = req.body.SocietyID;
                    UpdateKaryakartaData["Name"] = req.body.Name;
                    UpdateKaryakartaData["MobileNo"] = req.body.MobileNo;
                    UpdateKaryakartaData["Address"] = req.body.Address;
                    UpdateKaryakartaData["EmailID"] = req.body.EmailID;
                    UpdateKaryakartaData["TypeID"] = req.body.TypeID;
                    UpdateKaryakartaData["ModifiedDate"] = new Date();
                    //await KaryakartaModel.updateOne({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateKaryakartaData).exec();

                    KaryakartaModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateKaryakartaData, { new: true }).exec((error, result) => {
                        if (error) {
                            return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                        } else {
                            return res.status(200).json({ status: 1, message: "Karyakarta Successfully Updated.", data: result, error: null });
                        }
                    })
                }
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetKaryakarta = [async (req, res) => {
    try {
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        var CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
        var CheckSearchTypeID = ((req.body.TypeID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeID)] }) : { $nin: [] });

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
                {
                    "$unwind": {
                        "path": "$UserMaster",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "KaryakartaModel.BhagID",
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
                        "localField": "KaryakartaModel.NagarID",
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
                        "localField": "KaryakartaModel.VastiID",
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
                        "localField": "KaryakartaModel.SocietyID",
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
                    "$lookup": {
                        "localField": "KaryakartaModel.TypeID",
                        "from": "TypeMaster",
                        "foreignField": "_id",
                        "as": "TypeMaster"
                    }
                },
                {
                    "$unwind": {
                        "path": "$TypeMaster",
                        "preserveNullAndEmptyArrays": false
                    }
                },

                {
                    "$match": {
                        "KaryakartaModel.IsActive": true,
                        "UserMaster.IsActive": true,
                        "Bhag.IsActive": true,
                        "Nagar.IsActive": true,
                        "Vasti.IsActive": true,
                        "Society.IsActive": true,
                        "TypeMaster.IsActive": true,
                        "KaryakartaModel._id": CheckSearchID,
                        "KaryakartaModel.UserID": CheckSearchUserID,
                        "KaryakartaModel.BhagID": CheckSearchBhagID,
                        "KaryakartaModel.NagarID": CheckSearchNagarID,
                        "KaryakartaModel.VastiID": CheckSearchVastiID,
                        "KaryakartaModel.SocietyID": CheckSearchSocietyID,
                        "KaryakartaModel.TypeID": CheckSearchTypeID,
                    }
                },
                {
                    "$sort": {
                        "KaryakartaModel._id": -1
                    }
                },
                {
                    "$project": {
                        "_id": "$KaryakartaModel._id",
                        "UserID": "$KaryakartaModel.UserID",
                        "UserName": "$UserMaster.UserName",
                        "BhagID": "$KaryakartaModel.BhagID",
                        "BhagName": "$Bhag.BhagName",
                        "NagarID": "$KaryakartaModel.NagarID",
                        "NagarName": "$Nagar.NagarName",
                        "VastiID": "$KaryakartaModel.VastiID",
                        "VastiName": "$Vasti.VastiName",
                        "SocietyID": "$KaryakartaModel.SocietyID",
                        "SocietyName": "$Society.SocietyName",
                        "TypeID": "$KaryakartaModel.TypeID",
                        "Type": "$TypeMaster.Type",
                        "Name": "$KaryakartaModel.Name",
                        "MobileNo": "$KaryakartaModel.MobileNo",
                        "Address": "$KaryakartaModel.Address",
                        "EmailID": "$KaryakartaModel.EmailID",
                        // "Type": "$KaryakartaModel.Type",
                        "IsActive": "$KaryakartaModel.IsActive",
                        "IsDelete": "$KaryakartaModel.IsDelete",
                        "CreatedDate": "$KaryakartaModel.CreatedDate",
                        "ModifiedDate": "$KaryakartaModel.ModifiedDate"
                    }
                }
            ]);
        return res.status(200).json({ status: 1, message: "Success.", data: KaryakartaData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.RemoveKaryakarta = [async (req, res) => {
    try {
        if (!req.body.ID) {
            res.json({ status: 0, message: "Please Enter ID!", data: null, error: null });
        }
        else {
            const ID = new mongoose.Types.ObjectId(req.body.ID)

            var UpdateKaryakartaData = {};
            UpdateKaryakartaData["IsActive"] = false;
            UpdateKaryakartaData["IsDelete"] = true;
            KaryakartaModel.updateOne({ _id: ID }, UpdateKaryakartaData).exec((error, result) => {
                if (error) {
                    return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                } else {
                    return res.status(200).json({ status: 1, message: "Karyakarta Successfully Deleted.", data: null, error: null });
                }
            })
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
async function BindKaryakartaData(req) {
    var CheckSearchID, CheckSearchUserID, CheckSearchBhagID, CheckSearchNagarID, CheckSearchVastiID, CheckSearchSocietyID, CheckSearchTypeID, query1;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
    CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
    CheckSearchTypeID = ((req.body.TypeID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeID)] }) : { $nin: [] });
    CheckSearchTypeDetailID = ((req.body.TypeDetailID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeDetailID)] }) : { $nin: [] });

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
            {
                "$unwind": {
                    "path": "$UserMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.BhagID",
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
                    "localField": "KaryakartaModel.NagarID",
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
                    "localField": "KaryakartaModel.VastiID",
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
                    "localField": "KaryakartaModel.SocietyID",
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
                "$lookup": {
                    "localField": "KaryakartaModel.TypeID",
                    "from": "TypeMaster",
                    "foreignField": "_id",
                    "as": "TypeMaster"
                }
            },
            {
                "$unwind": {
                    "path": "$TypeMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$lookup": {
                    "localField": "KaryakartaModel.TypeDetailID",
                    "from": "TypeDetailMaster",
                    "foreignField": "_id",
                    "as": "TypeDetailMaster"
                }
            },
            {
                "$unwind": {
                    "path": "$TypeDetailMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },

            {
                "$match": {
                    "KaryakartaModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    "TypeMaster.IsActive": true,
                    "KaryakartaModel._id": CheckSearchID,
                    "KaryakartaModel.UserID": CheckSearchUserID,
                    "KaryakartaModel.BhagID": CheckSearchBhagID,
                    "KaryakartaModel.NagarID": CheckSearchNagarID,
                    "KaryakartaModel.VastiID": CheckSearchVastiID,
                    "KaryakartaModel.SocietyID": CheckSearchSocietyID,
                    "KaryakartaModel.TypeID": CheckSearchTypeID,
                    "KaryakartaModel.TypeDetailID": CheckSearchTypeDetailID,
                    "KaryakartaModel.CreatedDate": query1
                }
            },
            {
                "$sort": {
                    "KaryakartaModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$KaryakartaModel._id",
                    "UserID": "$KaryakartaModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$KaryakartaModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$KaryakartaModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$KaryakartaModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyID": "$KaryakartaModel.SocietyID",
                    "SocietyName": "$Society.SocietyName",
                    "TypeID": "$KaryakartaModel.TypeID",
                    "Type": "$TypeMaster.Type",

                    "TypeDetailID": "$KaryakartaModel.TypeDetailID",
                    "TypeDetail": "$TypeDetailMaster.TypeDetail",

                    "Name": "$KaryakartaModel.Name",
                    "MobileNo": "$KaryakartaModel.MobileNo",
                    "Address": "$KaryakartaModel.Address",
                    "EmailID": "$KaryakartaModel.EmailID",
                    // "Type": "$KaryakartaModel.Type",
                    "IsActive": "$KaryakartaModel.IsActive",
                    "IsDelete": "$KaryakartaModel.IsDelete",
                    "CreatedDate": "$KaryakartaModel.CreatedDate",
                    "ModifiedDate": "$KaryakartaModel.ModifiedDate"
                }
            }
        ]);
    return KaryakartaData;
}
exports.ViewKaryakartaData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let TypeData = await TypeMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let TypeDetailData = await TypeDetailMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let KaryakartaData = await BindKaryakartaData(req);
            res.render('./PanelUser/ViewKaryakartaDetail', {
                title: 'ViewKaryakartaDetail', KaryakartaData: KaryakartaData, SocietyData: SocietyData, TypeData: TypeData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData, TypeDetailData: TypeDetailData,
                SearchData: '', FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SearchingKaryakartaData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.TypeID + '~' + req.body.TypeDetailID + '~' + req.body.StartDate + '~' + req.body.EndDate;
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let TypeData = await TypeMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let TypeDetailData = await TypeDetailMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let KaryakartaData = await BindKaryakartaData(req);
            if (req.params.ID) {
                res.render('./PanelUser/ViewKaryakartaDetail', {
                    title: 'ViewKaryakartaDetail', KaryakartaData: KaryakartaData, SocietyData: SocietyData, TypeData: TypeData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData, TypeDetailData: TypeDetailData,
                    SearchData: SearchData, FetchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1
                });
            } else {
                res.render('./PanelUser/ViewKaryakartaDetail', {
                    title: 'ViewKaryakartaDetail', KaryakartaData: KaryakartaData, SocietyData: SocietyData, TypeData: TypeData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, UserData: UserData, TypeDetailData: TypeDetailData,
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
exports.ExportKaryakartaData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.TypeID + '~' + req.body.TypeDetailID + '~' + req.body.StartDate + '~' + req.body.EndDate;
            let KaryakartaData = await BindKaryakartaData(req);
            var Result = [];
            var count = 1;
            KaryakartaData.forEach((sdata) => {
                Result.push({
                    "Sr.No.": count++,
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,
                    "Type": sdata.Type,
                    "Name": sdata.Name,
                    "MobileNo": sdata.MobileNo,
                    "Address": sdata.Address,
                    "EmailID": sdata.EmailID,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });

            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Karyakarta Detail");
            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "Name", key: "Name", width: 16 },
                { header: "MobileNo", key: "MobileNo", width: 16 },
                { header: "EmailID", key: "EmailID", width: 18 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Bhag Name", key: "BhagName", width: 20 },
                { header: "Nagar Name", key: "NagarName", width: 15 },
                { header: "Vasti Name", key: "VastiName", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "Society Name", key: "SocietyName", width: 18 },
                { header: "Type", key: "Type", width: 16 },
                { header: "Address", key: "Address", width: 16 },
                { header: "Entry Date", key: "CreatedDate", width: 16 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Karyakarta Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:L1')
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
                "attachment; filename=" + "KaryakartaDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.render('./PanelUser/ViewKaryakartaDetail', {
            //     title: 'ViewKaryakartaDetail', KaryakartaData: KaryakartaData, SocietyData: SocietyData, TypeData: TypeData,
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
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}