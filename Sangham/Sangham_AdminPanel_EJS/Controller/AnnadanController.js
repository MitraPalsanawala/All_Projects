const UserMasterModel = require("../Model/UserMasterModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const ItemTypeModel = require("../Model/ItemTypeModel");
const AnnadanRequestModel = require("../Model/AnnadanRequestModel");
const CollectionModel = require("../Model/CollectionModel");
const AnnadanModel = require("../Model/AnnadanModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const axios = require('axios')
const excel = require("exceljs");
const excelJS = require("exceljs");
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const DIR = "./public/SmartCollection/Users";
const DIR1 = "./public/SmartCollection/Slips/";
const fontPath = "./public/SmartCollection";
const fs = require('fs');
var Jimp = require("jimp");
// var shortUrl = require("node-url-shortener");
var path = require('path')
var Canvas = require('canvas')
const { v4: uuidv4 } = require("uuid");

var TinyURL = require('tinyurl');

//var fileName = './public/SmartCollection/NewSlip.jpg';
var fileName = './public/images/NewSlip.jpg';
var fileName1 = './public/images/CashSlip.jpg';
var fileName2 = './public/images/ByItemSlip.jpg';

var fileName3 = './public/images/SanghamBank.jpeg';
var fileName4 = './public/images/SanghamCashSlip.jpeg';
var fileName5 = './public/images/SanghamByItemSlip.jpeg';
var imageCaption = 'Image caption';
var imageCaption1 = 'Image caption testttt';
var loadedImage;


function fontFile(name) {
    return path.join(fontPath, '/fonts/', name)
}
async function BindAnnadanData(req) {
    var CheckSearchID, CheckSearchUserID, CheckSearchBhagID, CheckSearchNagarID, CheckSearchVastiID, CheckSearchSocietyID, CheckCharityType, CheckModeOfPayment, query1, CheckTrustName, CheckAnnadanStatus;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
    CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
    CheckCharityType = ((req.body.CharityType) ? ({ $in: [(req.body.CharityType)] }) : { $nin: [] });
    CheckModeOfPayment = ((req.body.ModeOfPayment) ? ({ $in: [(req.body.ModeOfPayment)] }) : { $nin: [] });
    CheckTrustName = ((req.body.TrustName) ? ({ $in: [(req.body.TrustName)] }) : { $nin: [] });
    CheckAnnadanStatus = ((req.body.AnnadanStatus) ? ({ $in: [(req.body.AnnadanStatus)] }) : { $nin: [] });


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
    var DataResponce = await AnnadanModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "AnnadanModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "AnnadanModel.UserID",
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
                    "localField": "AnnadanModel.BhagID",
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
                    "localField": "AnnadanModel.NagarID",
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
                    "localField": "AnnadanModel.VastiID",
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
                    "localField": "AnnadanModel.SocietyID",
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
            // {
            //     "$lookup": {
            //         "localField": "AnnadanModel.ItemTypeID",
            //         "from": "ItemType",
            //         "foreignField": "_id",
            //         "as": "ItemType"
            //     }
            // },
            // {
            //     "$unwind": {
            //         "path": "$ItemType",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AnnadanModel._id",
                    "from": "AnnadanItemDetail",
                    "foreignField": "AnnadanID",
                    "as": "AnnadanItemDetail",
                    "pipeline": [
                        {
                            "$match": { 'IsActive': { '$eq': true } },
                        }]
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$AnnadanItemDetail",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },
            // {
            //     "$lookup": {
            //         "localField": "AnnadanItemDetail.ItemTypeID",
            //         "from": "AnnadanItemDetail",
            //         "foreignField": "_id",
            //         "as": "ItemTypeID",
            //         // "pipeline": [
            //         //     {
            //         //         "$match": { 'IsActive': { '$eq': true } },
            //         //     }]
            //     }
            // },
            // {
            //     "$lookup": {
            //         "localField": "AnnadanItemDetail.ItemTypeID",
            //         "from": "ItemType",
            //         "foreignField": "_id",
            //         "as": "ItemType",
            //         "pipeline": [
            //             {
            //                 "$match": { 'IsActive': { '$eq': true } },
            //             }]
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AnnadanItemDetail.ItemTypeID",
                    "from": "ItemType",
                    "foreignField": "_id",
                    "as": "ItemType",
                }
            },
            {
                "$unwind": {
                    "path": "$AnnadanItemDetail",
                    "preserveNullAndEmptyArrays": true
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$ItemType",
            //         "preserveNullAndEmptyArrays": false
            //     }
            // },

            // {
            //     "$lookup": {
            //         "localField": "UserMaster._id",
            //         "from": "UserNagarDetail",
            //         "foreignField": "UserID",
            //         "as": "UserNagarDetail"
            //     }
            // },
            // {
            //     "$lookup": {
            //         "localField": "UserNagarDetail.NagarID",
            //         "from": "Nagar",
            //         "foreignField": "_id",
            //         "as": "Nagar"
            //     }
            // },
            {
                "$lookup": {
                    "localField": "AnnadanModel.CollectionGivenUserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "CollectionUserMaster"
                }
            },
            {
                "$unwind": {
                    "path": "$CollectionUserMaster",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$match": {
                    "AnnadanModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    // "ItemType.IsActive": true,
                    "AnnadanModel._id": CheckSearchID,
                    "AnnadanModel.UserID": CheckSearchUserID,
                    "AnnadanModel.BhagID": CheckSearchBhagID,
                    "AnnadanModel.NagarID": CheckSearchNagarID,
                    "AnnadanModel.VastiID": CheckSearchVastiID,
                    "AnnadanModel.SocietyID": CheckSearchSocietyID,
                    "AnnadanModel.CharityType": CheckCharityType,
                    "AnnadanModel.ModeOfPayment": CheckModeOfPayment,
                    "AnnadanModel.TrustName": CheckTrustName,
                    "AnnadanModel.AnnadanStatus": CheckAnnadanStatus,
                    "AnnadanModel.CreatedDate": query1
                }
            },
            {
                "$sort": {
                    "AnnadanModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$AnnadanModel._id",
                    "UserID": "$AnnadanModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$AnnadanModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$AnnadanModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$AnnadanModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyID": "$AnnadanModel.SocietyID",
                    "SocietyName": "$Society.SocietyName",
                    // "ItemTypeID": "$ItemTypeModel.ItemTypeModel",
                    // "ItemType": "$ItemType.ItemType",
                    // "UserBhagDetail": "$UserBhagDetail",
                    // "UserBhagName": "$Bhag",
                    "AnnadanItemDetail": "$AnnadanItemDetail",
                    "ItemTypeDetail": "$ItemType",


                    "ItemTypeID": "$ItemType._id",
                    "ItemTypeName": "$ItemType.ItemType",
                    "ItemTypeQty": "$AnnadanItemDetail.Qty",
                    // "UserBhagName1": "$Bhag._id",
                    // "UserBhagAllName": "$Bhag.BhagName",
                    "CollectionGivenUserID": "$AnnadanModel.CollectionGivenUserID",
                    "CollectionUserName": "$CollectionUserMaster.UserName",
                    "AnnadanUserName": "$AnnadanModel.AnnadanUserName",
                    "MobileNo": "$AnnadanModel.MobileNo",
                    "Address": "$AnnadanModel.Address",
                    "CharityType": "$AnnadanModel.CharityType",
                    "ModeOfPayment": "$AnnadanModel.ModeOfPayment",
                    "Amount": "$AnnadanModel.Amount",
                    "HouseNo": "$AnnadanModel.HouseNo",
                    "Landmark": "$AnnadanModel.Landmark",
                    "DrivingLicence": "$AnnadanModel.DrivingLicence",
                    "PanCardNo": "$AnnadanModel.PanCardNo",
                    "AadharCardNo": "$AnnadanModel.AadharCardNo",
                    // "ItemTypeID": "$AnnadanModel.ItemTypeID",
                    // "Qty": "$AnnadanModel.Qty",
                    "QtyType": "$AnnadanModel.QtyType",
                    "ReceiptNo": "$AnnadanModel.ReceiptNo",
                    "Type": "$AnnadanModel.Type",
                    "Remark": "$AnnadanModel.Remark",
                    "AnnadanStatus": "$AnnadanModel.AnnadanStatus",
                    "IsActive": "$AnnadanModel.IsActive",
                    "IsDelete": "$AnnadanModel.IsDelete",
                    "CreatedDate": "$AnnadanModel.CreatedDate",
                    "Email": "$AnnadanModel.Email",
                    "BankName": "$AnnadanModel.BankName",
                    "PaymentStatus": "$AnnadanModel.PaymentStatus",
                    "TrustName": "$AnnadanModel.TrustName"
                }
            }
        ]);
    console.log("---Data---", DataResponce)
    return DataResponce;
}
exports.GetAnnadanDataV2 = [async (req, res) => {
    try {
        let AannadanData = await BindAnnadanData(req);
        if (AannadanData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", Data: AannadanData, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", Data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.ViewAnnadanData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var allamountdata = [], collectdata = [];
            var CashAmount = 0, OnlineAmount = 0, CheckCount = 0, CheckAmount = 0, CollectCashAmount = 0, CollectCheque = 0, CollectChequeAmount = 0, RemainingCash = 0, RemainingCheque = 0, RemainingChequeAmount = 0;
            let GetAnnadanData = await AnnadanModel.find({}).exec();
            if (GetAnnadanData.length > 0) {
                GetAnnadanData.forEach((doc) => {
                    if (doc.ModeOfPayment == "Cash") {
                        CashAmount = CashAmount + Number(doc.Amount)
                    }
                    else if (doc.ModeOfPayment == "Online") {
                        if (doc.ResponseresultCode == "01") {
                            OnlineAmount = OnlineAmount + Number(doc.Amount)
                        }
                    }
                    else if (doc.ModeOfPayment == "Bank") {
                        CheckCount += 1;
                        CheckAmount = CheckAmount + Number(doc.Amount)
                    }
                });
                allamountdata.push({
                    'CashAmount': CashAmount,
                    'OnlineAmount': OnlineAmount,
                    'CheckCount': CheckCount,
                    'CheckAmount': CheckAmount
                });
                // console.log("--allldata---", allamountdata)
                // console.log("--allldata---", allamountdata[0].CashAmount)
                // console.log("--allldata---", allamountdata[0].OnlineAmount)
                // console.log("--allldata---", allamountdata[0].CheckCount)
                // console.log("--allldata---", allamountdata[0].CheckAmount)
            } else {
                allamountdata.push({
                    'CashAmount': 0,
                    'OnlineAmount': 0,
                    'CheckCount': 0,
                    'CheckAmount': 0
                });
            }
            let CollectionData = await CollectionModel.find({}).exec();
            if (CollectionData.length > 0) {
                CollectionData.forEach((collected) => {
                    if (collected.CollectionStatus == "Complete" && collected.CollectionType == "MainUser Collection") {
                        CollectCashAmount = CollectCashAmount + Number(collected.Amount)
                        CollectCheque = CollectCheque + Number(collected.TotalNoOfCheque)
                        CollectChequeAmount = CollectChequeAmount + Number(collected.BankAmount)
                    }
                });
                collectdata.push({
                    'CollectCashAmount': CollectCashAmount,
                    'CollectCheque': CollectCheque,
                    'CollectChequeAmount': CollectChequeAmount
                });
                console.log("--allldata---", collectdata)
            } else {
                collectdata.push({
                    'CollectCashAmount': 0,
                    'CollectCheque': 0,
                    'CollectChequeAmount': 0
                });
            }

            RemainingCash = CashAmount - CollectCashAmount;
            RemainingCheque = CheckCount - CollectCheque;
            RemainingChequeAmount = CheckAmount - CollectChequeAmount;
            let AannadanData = await BindAnnadanData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ "_id": -1 }).exec();
            let ItemTypeData = await ItemTypeModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            console.log("---AannadanData---123", AannadanData)
            res.render('./PanelUser/ViewAnnadanDetail', {
                title: 'ViewAnnadanDetail',
                allamountdata: allamountdata,
                collectdata: collectdata,
                RemainingCash: RemainingCash,
                RemainingCheque: RemainingCheque,
                RemainingChequeAmount: RemainingChequeAmount,
                AannadanData: AannadanData, BhagData: BhagData, UserData: UserData, ItemTypeData: ItemTypeData,
                NagarData: NagarData, VastiData: VastiData, SocietyData: SocietyData, SearchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingAnnadanData = [async (req, res) => {
    try {
        var allamountdata = [], collectdata = [], dataaa = [];
        var CashAmount = 0, OnlineAmount = 0; CheckCount = 0, CheckAmount = 0, CollectCashAmount = 0, CollectCheque = 0, CollectChequeAmount = 0, RemainingCash = 0, RemainingCheque = 0, RemainingChequeAmount = 0;
        let GetAnnadanData = await AnnadanModel.find({}).exec();
        if (GetAnnadanData.length > 0) {
            GetAnnadanData.forEach((doc) => {
                if (doc.ModeOfPayment == "Cash") {
                    CashAmount = CashAmount + Number(doc.Amount)
                }
                else if (doc.ModeOfPayment == "Online") {
                    if (doc.ResponseresultCode == "01") {
                        OnlineAmount = OnlineAmount + Number(doc.Amount)
                    }
                }
                else if (doc.ModeOfPayment == "Bank") {
                    CheckCount += 1;
                    CheckAmount = CheckAmount + Number(doc.Amount)
                }
            });
            allamountdata.push({
                'CashAmount': CashAmount,
                'OnlineAmount': OnlineAmount,
                'CheckCount': CheckCount,
                'CheckAmount': CheckAmount
            });
            console.log("--allldata---", allamountdata)
            console.log("--allldata---", allamountdata[0].CashAmount)
            // console.log("--allldata---", allamountdata[0].OnlineAmount)
            // console.log("--allldata---", allamountdata[0].CheckCount)
            // console.log("--allldata---", allamountdata[0].CheckAmount)
        } else {
            allamountdata.push({
                'CashAmount': 0,
                'OnlineAmount': 0,
                'CheckCount': 0,
                'CheckAmount': 0
            });
        }
        let CollectionData = await CollectionModel.find({}).exec();
        if (CollectionData.length > 0) {
            CollectionData.forEach((collected) => {
                if (collected.CollectionStatus == "Complete" && collected.CollectionType == "MainUser Collection") {
                    CollectCashAmount = CollectCashAmount + Number(collected.Amount)
                    CollectCheque = CollectCheque + Number(collected.TotalNoOfCheque)
                    CollectChequeAmount = CollectChequeAmount + Number(collected.BankAmount)
                }
            });
            collectdata.push({
                'CollectCashAmount': CollectCashAmount,
                'CollectCheque': CollectCheque,
                'CollectChequeAmount': CollectChequeAmount
            });
            console.log("--allldata---", collectdata)
        } else {
            collectdata.push({
                'CollectCashAmount': 0,
                'CollectCheque': 0,
                'CollectChequeAmount': 0
            });
        }

        RemainingCash = CashAmount - CollectCashAmount;
        RemainingCheque = CheckCount - CollectCheque;
        RemainingChequeAmount = CheckAmount - CollectChequeAmount;
        console.log("--Remain----------------", RemainingCash)
        console.log("--RemainingCheque----------------", RemainingCheque)

        var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.CharityType + '~' + req.body.ModeOfPayment + '~' + req.body.TrustName + '~' + req.body.AnnadanStatus + '~' + req.body.StartDate + '~' + req.body.EndDate;
        let AannadanData = await BindAnnadanData(req);
        let BhagData = await BhagModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        let NagarData = await NagarModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        let VastiData = await VastiModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        let UserData = await UserMasterModel.find({ IsActive: true }).sort({ "_id": -1 }).exec();
        let ItemTypeData = await ItemTypeModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        res.render('./PanelUser/ViewAnnadanDetail', {
            title: 'ViewAnnadanDetail',
            // CashAmountCollected: CashAmountCollected, 
            // TotalAmount: TotalAmount, 
            // CashAmount: CashAmount, 
            // BankAmount: BankAmount, 
            // OnlineAmount: OnlineAmount,
            allamountdata: allamountdata,
            collectdata: collectdata,
            RemainingCash: RemainingCash,
            RemainingCheque: RemainingCheque,
            RemainingChequeAmount: RemainingChequeAmount,
            AannadanData: AannadanData, BhagData: BhagData, UserData: UserData, ItemTypeData: ItemTypeData,
            NagarData: NagarData, VastiData: VastiData, SocietyData: SocietyData, SearchData: SearchData, cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportsAnnadanData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let AannadanData = await BindAnnadanData(req);
            var Result = [];
            var count = 1;
            AannadanData.forEach((sdata) => {
                Result.push({
                    "Sr.No": count++,
                    "ReceiptNo": sdata.ReceiptNo,
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,
                    "ItemType": sdata.ItemTypeName.toString() ? sdata.ItemTypeName.toString() : '',
                    "Qty": sdata.ItemTypeQty.toString() ? sdata.ItemTypeQty.toString() : '',
                    "AnnadanUserName": sdata.AnnadanUserName,
                    "MobileNo": sdata.MobileNo,
                    "CharityType": sdata.CharityType,
                    "Amount": sdata.Amount,
                    "ModeOfPayment": sdata.ModeOfPayment,
                    "CollectionUserName": sdata.CollectionUserName ? sdata.CollectionUserName : '',
                    "PaymentStatus": sdata.PaymentStatus,
                    "Email": sdata.Email,
                    "BankName": sdata.BankName,
                    "AnnadanStatus": sdata.AnnadanStatus,
                    "DrivingLicence": sdata.DrivingLicence,
                    "PanCardNo": sdata.PanCardNo,
                    "AadharCardNo": sdata.AadharCardNo,
                    "Remark": sdata.Remark,
                    "TrustName": sdata.TrustName,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Annadan Detail");

            worksheet.columns = [
                { header: "Count.No", key: "Sr.No", width: 9 },
                { header: "Receipt No", key: "ReceiptNo", width: 10 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Bhag Name", key: "BhagName", width: 14 },
                { header: "Nagar Name", key: "NagarName", width: 14 },
                { header: "Vasti Name", key: "VastiName", width: 14 },
                { header: "Society Name", key: "SocietyName", width: 18 },
                { header: "Item Type", key: "ItemType", width: 18 },
                { header: "Quantity", key: "Qty", width: 18 },
                { header: "Annadan User Name", key: "AnnadanUserName", width: 18 },
                { header: "Mobile No", key: "MobileNo", width: 18 },
                { header: "Trust Name", key: "TrustName", width: 22 },
                { header: "Charity Type", key: "CharityType", width: 14 },
                { header: "Amount", key: "Amount", width: 12 },
                { header: "Mode Of Payment", key: "ModeOfPayment", width: 20 },
                { header: "Collection UserName", key: "CollectionUserName", width: 20 },
                { header: "Payment Status", key: "PaymentStatus", width: 16 },
                { header: "Email", key: "Email", width: 20 },
                { header: "Bank Name", key: "BankName", width: 20 },
                { header: "Annadan Status", key: "AnnadanStatus", width: 17 },
                { header: "Driving Licence", key: "DrivingLicence", width: 20 },
                { header: "PanCard No", key: "PanCardNo", width: 20 },
                { header: "AadharCard No", key: "AadharCardNo", width: 20 },
                { header: "Remarks", key: "Remark", width: 20 },
                { header: "Entry Date", key: "CreatedDate", width: 16 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Annadan Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:X1')
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
                "attachment; filename=" + "AnnadanDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewOrderInvoice = [async (req, res) => {
    try {
        var GetAllData = [];
        let annadanData = await AnnadanModel.find({ _id: req.params.ID })
            .populate({ path: 'ItemTypeID', select: 'ItemType' })
            .populate({
                path: 'AnnadanItemDetail', select: '_id AnnadanID ItemTypeID Qty',
                populate: { path: 'ItemTypeID', select: 'ItemType Qty', match: { IsActive: true } }
            }).exec();
        if (annadanData.length > 0) {
            annadanData.forEach((doc) => {
                var ItemData = [];
                var QtyData = [];
                doc.AnnadanItemDetail.forEach((cb) => {
                    ItemData.push(cb.ItemTypeID.ItemType)
                    QtyData.push(cb.Qty)
                });
                GetAllData.push({
                    _id: doc._id,
                    UserID: doc.UserID,
                    BhagID: doc.BhagID,
                    NagarID: doc.NagarID,
                    VastiID: doc.VastiID,
                    SocietyID: doc.SocietyID,
                    AnnadanUserName: doc.AnnadanUserName,
                    MobileNo: doc.MobileNo,
                    Address: doc.Address,
                    CharityType: doc.CharityType,
                    ModeOfPayment: doc.ModeOfPayment,
                    Amount: doc.Amount,
                    HouseNo: doc.HouseNo,
                    Landmark: doc.Landmark,
                    DrivingLicence: doc.DrivingLicence,
                    PanCardNo: doc.PanCardNo,
                    AadharCardNo: doc.AadharCardNo,
                    // ItemType: doc.ItemTypeID ? doc.ItemTypeID.ItemType : "",
                    ItemType: ItemData.toString(),
                    QtyData: QtyData.toString(),
                    // Qty: doc.Qty,
                    QtyType: doc.QtyType,
                    ReceiptNo: doc.ReceiptNo,
                    ChequeNo: doc.ChequeNo,
                    Type: doc.Type,
                    Remark: doc.Remark,
                    AnnadanStatus: doc.AnnadanStatus,
                    OrderID: doc.OrderID,
                    PaymentStatus: doc.PaymentStatus,
                    IsActive: true,
                    IsDelete: false,
                    CreatedDate: moment(doc.CreatedDate).format('DD-MM-yyyy'),
                    Date: moment(Date.now()).format('DD-MM-yyyy'),
                    BankName: doc.BankName,
                    TrustName: doc.TrustName,
                    Email: ""
                });
            });
            // console.log("---getAllData----", GetAllData)
            var AnnadanURL;
            await TinyURL.shorten('http://localhost:9999/Invoice/' + req.params.ID).then(function (result) {
                AnnadanURL = result;
            }, function (err) {
                console.log(err)
            });
            console.log("-----------AnnadanURL--------", AnnadanURL);

            // Jimp.read(fileName)
            //     .then(function (image) {
            //         loadedImage = image;
            //         return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            //     })
            //     .then(function (font) {
            //         loadedImage.print(font, 10, 10, imageCaption)
            //             .write(fileName);
            //     })
            //     .then(function (font1) {
            //         loadedImage.print(font1, 20, 20, imageCaption1)
            //             .write(fileName);
            //     })
            //     .catch(function (err) {
            //         console.error(err);
            //     });

            Canvas.registerFont(fontFile('arial.ttf'), { family: 'arial' })
            let canvas = Canvas.createCanvas(7100, 3500)
            let options = { colorSpace: "display-p3" };
            const ctx = canvas.getContext("2d", options);

            var Image = Canvas.Image;
            var img = new Image();

            var saveFile, saveFileName;
            if (GetAllData.length > 0) {
                if (GetAllData[0].TrustName == "डॉ. आंबेडकर बनारसी कल्याण ट्रस्ट") {
                    if (GetAllData[0].ModeOfPayment == "Bank") {
                        // img.src = fileName;
                        // ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // ctx.fillStyle = 'Black';
                        // ctx.textAlign = 'center';

                        // ctx.font = '90px arial'
                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 800, 1635)
                        // ctx.fillText(GetAllData[0].Address, 600, 1770)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)
                        // // ctx.fillText('Mode Of Payment :', 680, 2270)
                        // ctx.fillText(GetAllData[0].ModeOfPayment, 1330, 2270)
                        // ctx.fillText(GetAllData[0].BankName, 3980, 2420)

                        // saveFileName = 'Invoice_' + uuidv4() + '.png';
                        // saveFile = canvas.createPNGStream().pipe(fs.createWriteStream(path.join(DIR1, saveFileName)))

                        const image = await Jimp.read(fileName);
                        // Defining the text font
                        //const font = await Jimp.loadFont(Jimp, './public/SmartCollection/GFonts/aakar-medium.ttf')

                        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 130, 322, GetAllData[0].ReceiptNo);
                        image.print(font, 900, 322, GetAllData[0].CreatedDate);
                        image.print(font, 130, 383, GetAllData[0].AnnadanUserName);
                        image.print(font, 90, 423, GetAllData[0].Address);
                        image.print(font, 135, 460, GetAllData[0].MobileNo);
                        image.print(font, 210, 504, GetAllData[0].Amount);
                        image.print(font, 210, 545, GetAllData[0].ModeOfPayment);
                        image.print(font, 290, 582, GetAllData[0].ChequeNo);
                        image.print(font, 635, 582, GetAllData[0].BankName);
                        image.print(font, 890, 582, GetAllData[0].Date);

                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 1080, 1635)
                        // ctx.fillText(GetAllData[0].Address, 1150, 1770)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)

                        // image.print(font, 100, 371, GetAllData[0].AnnadanUserName);
                        // Writing image after processing
                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                    } else if (GetAllData[0].ModeOfPayment == "Cash" || GetAllData[0].ModeOfPayment == "Online") {
                        const image = await Jimp.read(fileName1);
                        // Defining the text font
                        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 130, 322, GetAllData[0].ReceiptNo);
                        image.print(font, 900, 322, GetAllData[0].CreatedDate);
                        image.print(font, 130, 384, GetAllData[0].AnnadanUserName);
                        image.print(font, 90, 423, GetAllData[0].Address);
                        image.print(font, 135, 460, GetAllData[0].MobileNo);
                        image.print(font, 210, 504, GetAllData[0].Amount);
                        image.print(font, 205, 540, GetAllData[0].ModeOfPayment);
                        image.print(font, 635, 582, GetAllData[0].BankName);

                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 1080, 1635)
                        // ctx.fillText(GetAllData[0].Address, 1150, 1770)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)

                        // image.print(font, 100, 371, GetAllData[0].AnnadanUserName);
                        // Writing image after processing
                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);


                        // img.src = fileName1;
                        // ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // ctx.fillStyle = 'Black';
                        // ctx.textAlign = 'center';

                        // ctx.font = '90px arial'
                        // ctxmode.font = 'bold 80px Verdana'
                        // ctx.fillText('क्रमांक:', 400, 1300)
                        // ctx.fillText('Date:', 5400, 1500)
                        // ctx.fillText('Name:', 400, 1500)
                        // // ctx.fillText(GetAllData[0].AnnadanUserName, 980, 1635)
                        // ctx.fillText('Address:', 400, 1700)
                        // ctx.fillText('MobileNo:', 400, 1900)
                        // ctx.fillText('Aap ki or se Rs.:', 400, 2100)
                        // ctx.fillText('Cheque / Transection No.:', 400, 2300)
                        // ctx.fillText('Bank Name.:', 400, 2500)
                        // ctx.fillText('Date:', 400, 2700)

                        // var txt = GetAllData[0].Address;
                        // ctx.fillText("width:" + ctx.measureText(txt).width, 10, 50);
                        // ctx.fillText(txt, 1150, 1770);

                        // const metrics = ctx.measureText(txt);
                        // canvas.width = metrics.width;
                        // canvas.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                        // ctx.fillText(txt, 1150, 1770);

                        // console.log("a---txt--------->", txt)
                        //console.log("a------txt------>", a)
                        // console.log("b----txt-------->", b)

                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 1080, 1635)
                        // ctx.fillText(GetAllData[0].Address, 100, 1770)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)


                        // ctx.fillText(GetAllData[0].AnnadanUserName, 980, 1635)
                        // ctx.fillText(GetAllData[0].Address, 1150, 1800)
                        // ctx.fillText(GetAllData[0].MobileNo, 1200, 1950)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)
                        // ctx.fillText(GetAllData[0].ModeOfPayment, 1350, 2260)
                        // ctx.fillText(GetAllData[0].BankName, 3980, 2420)

                        // saveFileName = 'Invoice_' + uuidv4() + '.png';
                        // saveFile = canvas.createPNGStream().pipe(fs.createWriteStream(path.join(DIR1, saveFileName)))
                        //var b = canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(DIR1, '/font.jpg')))

                        // console.log("a------------>", a)
                        //console.log("b------------>", b)

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                    } else if (GetAllData[0].CharityType == "By Item") {
                        const image = await Jimp.read(fileName2);
                        // Defining the text font

                        // const font = await Jimp.loadFont('./public/fonts/shruti.ttf')
                        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 130, 322, GetAllData[0].ReceiptNo);
                        image.print(font, 900, 322, GetAllData[0].CreatedDate);
                        image.print(font, 127, 383, GetAllData[0].AnnadanUserName);
                        image.print(font, 90, 423, GetAllData[0].Address);
                        image.print(font, 135, 460, GetAllData[0].MobileNo);
                        image.print(font, 153, 500, GetAllData[0].ItemType);
                        // image.print(font, 210, 540, GetAllData[0].ModeOfPayment);
                        // image.print(font, 635, 582, GetAllData[0].BankName);

                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 1080, 1635)
                        // ctx.fillText(GetAllData[0].Address, 1150, 1770)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // ctx.fillText(GetAllData[0].Amount, 1350, 2100)

                        // image.print(font, 100, 371, GetAllData[0].AnnadanUserName);
                        // Writing image after processing
                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                        // img.src = fileName2;
                        // ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // ctx.fillStyle = 'Black';
                        // ctx.textAlign = 'center';

                        // ctx.font = '90px arial'
                        // // ctxmode.font = 'bold 80px Verdana'
                        // ctx.fillText(GetAllData[0].SrNo, 800, 1368)
                        // ctx.fillText(GetAllData[0].CreatedDate, 5800, 1368)
                        // // ctx.fillText(GetAllData[0].AnnadanUserName, 800, 1635)
                        // ctx.fillText(GetAllData[0].AnnadanUserName, 820, 1624)
                        // ctx.fillText(GetAllData[0].Address, 800, 1775)
                        // ctx.fillText(GetAllData[0].MobileNo, 1050, 1935)
                        // // ctx.fillText(GetAllData[0].Amount, 1350, 2100)


                        // // ctx.fillText(GetAllData[0].AnnadanUserName, 980, 1635)
                        // // ctx.fillText(GetAllData[0].Address, 1150, 1800)
                        // // ctx.fillText(GetAllData[0].MobileNo, 1200, 1950)
                        // ctx.fillText(GetAllData[0].ItemType, 1210, 2090)

                        // saveFileName = 'Invoice_' + uuidv4() + '.png';
                        // saveFile = canvas.createPNGStream().pipe(fs.createWriteStream(path.join(DIR1, saveFileName)))
                        //var b = canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(DIR1, '/font.jpg')))

                        // console.log("a------------>", a)
                        //console.log("b------------>", b)
                    } else {
                        res.render('./PanelUser/Invoice', {
                            title: 'Invoice', alertTitle: '', alertMessage: '',
                            AannadanData: annadanData, moment: moment1,
                        });
                    }
                } else if (GetAllData[0].TrustName == "डॉ. हेडगेवार स्मृति सेवा समिति-सुरत") {
                    if (GetAllData[0].ModeOfPayment == "Bank") {

                        const image = await Jimp.read(fileName3);
                        // Defining the text font
                        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 182, 268, GetAllData[0].CreatedDate);
                        image.print(font, 980, 255, GetAllData[0].ReceiptNo);
                        image.print(font, 187, 333, GetAllData[0].AnnadanUserName);
                        image.print(font, 150, 378, GetAllData[0].Address);
                        image.print(font, 199, 420, GetAllData[0].MobileNo);
                        image.print(font, 267, 460, GetAllData[0].Amount);
                        image.print(font, 270, 495, GetAllData[0].ModeOfPayment);
                        image.print(font, 182, 534, GetAllData[0].ChequeNo);
                        image.print(font, 649, 535, GetAllData[0].BankName);
                        image.print(font, 1010, 539, GetAllData[0].Date);

                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                    } else if (GetAllData[0].ModeOfPayment == "Cash" || GetAllData[0].ModeOfPayment == "Online") {
                        const image = await Jimp.read(fileName4);
                        // Defining the text font
                        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 182, 268, GetAllData[0].CreatedDate);
                        image.print(font, 980, 255, GetAllData[0].ReceiptNo);
                        image.print(font, 187, 335, GetAllData[0].AnnadanUserName);
                        image.print(font, 150, 378, GetAllData[0].Address);
                        image.print(font, 199, 420, GetAllData[0].MobileNo);
                        image.print(font, 267, 460, GetAllData[0].Amount);
                        image.print(font, 270, 502, GetAllData[0].ModeOfPayment);

                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                    } else if (GetAllData[0].CharityType == "By Item") {
                        const image = await Jimp.read(fileName5);
                        // Defining the text font
                        console.log("----------->pth", path.join);
                        //Jimp.loadFont(path.join(__dirname, 'font.fnt')).then(function(font) {
                        // const font = await Jimp.loadFont(path.join('./public/SmartCollection/FontNew/shruti-18.fnt'))
                        // const font = await Jimp.loadFont('./public/SmartCollection/FontNew/aakar-medium.ttf/fIW6XyTfGwrry7FQw93go2oX.ttf.fnt')
                        // const font = await Jimp.loadFont('./public/SmartCollection/Baloo_Bhai_2/static/BalooBhai2-Regular.ttf')
                        const font = await Jimp.loadFont('./public/SmartCollection/akshar.ttf')
                        // console.log("font", font)
                        // const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                        image.print(font, 182, 268, GetAllData[0].CreatedDate);
                        image.print(font, 980, 255, GetAllData[0].ReceiptNo);
                        image.print(font, 187, 333, GetAllData[0].AnnadanUserName);
                        image.print(font, 150, 378, GetAllData[0].Address);
                        image.print(font, 199, 420, GetAllData[0].MobileNo);
                        image.print(font, 220, 462, GetAllData[0].ItemType);
                        // image.print(font, 270, 495, GetAllData[0].ModeOfPayment);
                        // image.print(font, 182, 534, GetAllData[0].ChequeNo);
                        // image.print(font, 649, 535, GetAllData[0].BankName);

                        var saveFileName = 'Invoice_' + uuidv4() + '.png';
                        var pathhhh = DIR1 + saveFileName;
                        await image.writeAsync("./public/SmartCollection/Slips/" + saveFileName);

                        const dwnimage = "./public/SmartCollection/Slips/" + saveFileName;
                        res.download(dwnimage);

                    } else {
                        res.render('./PanelUser/Invoice', {
                            title: 'Invoice', alertTitle: '', alertMessage: '',
                            AannadanData: annadanData, moment: moment1,
                        });
                    }
                } else {
                    res.render('./PanelUser/Invoice', {
                        title: 'Invoice', alertTitle: '', alertMessage: '',
                        AannadanData: annadanData, moment: moment1,
                    });
                }
                // console.log("-----------saveFile--------", saveFile);
                // //const downloadFile = saveFile.path.toString();
                // var dnfile = './public/SmartCollection/Slips' + saveFileName;
                // const downloadFile = dnfile;
                // console.log("-----------downloadFile--------", downloadFile);
                // res.download(downloadFile);

                // axios({
                //     method: "get",
                //     url: './public/SmartCollection/Slips',
                //     responseType: "stream"
                // }).then(function (response) {
                //     response.data.pipe(fs.createWriteStream(saveFileName));
                // });


                // res.render('./PanelUser/Invoice', {
                //     title: 'Invoice', alertTitle: '', alertMessage: '',
                //     AannadanData: annadanData, moment: moment1,

                // });
            } else {
                res.render('./PanelUser/Invoice', {
                    title: 'Invoice', alertTitle: '', alertMessage: '',
                    AannadanData: annadanData, moment: moment1,
                });
            }
        } else {
            res.render('./PanelUser/Invoice', {
                title: 'Invoice', alertTitle: '', alertMessage: '',
                AannadanData: annadanData, moment: moment1,
            });
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.PageNotFound = [async (req, res) => {
    try {
        res.render('./PanelUser/404', { layout: false })
    } catch (err) { return res.status(500).json({ status: 0, Message: err.message, data: null }); }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}