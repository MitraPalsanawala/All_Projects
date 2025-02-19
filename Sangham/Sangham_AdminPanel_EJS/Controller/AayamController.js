const AayamModel = require("../Model/AayamModel");
const AayamDetailModel = require("../Model/AayamDetailModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const UserMasterModel = require("../Model/UserMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
const excelJS = require("exceljs");

//------------------------------------------ App ----------------------------------------------------//
exports.SetAayam = [async (req, res) => {
    try {
        if (!req.body.ID) {
            var adddata = await AayamModel({
                UserID: req.body.UserID,
                BhagID: req.body.BhagID,
                NagarID: req.body.NagarID,
                VastiID: req.body.VastiID,
                SocietyID: req.body.SocietyID,
                AayamType: req.body.AayamType,
                AccosiationName: req.body.AccosiationName,
                AayamDate: req.body.AayamDate,
                AayamCount: req.body.AayamCount,
                InterestSubject: req.body.InterestSubject,
                Description: req.body.Description,
                Type: 'App'
            }).save();
            if (req.body.ArrData) {
                var ArrData = req.body.ArrData.split('~');
                for (let i = 0; i < ArrData.length; i++) {
                    var ArrAayamID = ArrData[i].split('@');
                    Aadata = await AayamDetailModel({
                        AayamID: adddata._id,
                        ContactName: ArrAayamID[0],
                        ContactMobileNo: ArrAayamID[1],
                        Type: 'App'
                    }).save();
                    // }
                }
            }
            return res.status(200).json({ status: 1, message: "Aayam Successfully Inserted.", data: adddata, error: null });
        } else {
            var UpdateAayamData = {};
            UpdateAayamData["UserID"] = req.body.UserID;
            UpdateAayamData["BhagID"] = req.body.BhagID;
            UpdateAayamData["NagarID"] = req.body.NagarID;
            UpdateAayamData["VastiID"] = req.body.VastiID;
            UpdateAayamData["SocietyID"] = req.body.SocietyID;
            UpdateAayamData["AayamType"] = req.body.AayamType;
            UpdateAayamData["AccosiationName"] = req.body.AccosiationName;
            UpdateAayamData["AayamDate"] = req.body.AayamDate;
            UpdateAayamData["AayamCount"] = req.body.AayamCount;
            UpdateAayamData["InterestSubject"] = req.body.InterestSubject;
            UpdateAayamData["Description"] = req.body.Description;
            await AayamModel.updateOne({ _id: req.body.ID }, UpdateAayamData).exec();
            await AayamDetailModel.deleteMany({ AayamID: req.body.ID }).exec();

            if (req.body.ArrData) {
                var ArrData = req.body.ArrData.split('~');
                for (let i = 0; i < ArrData.length; i++) {
                    var ArrAayamID = ArrData[i].split('@');
                    // let useradd = await AayamDetailModel.findOne({
                    //     ContactMobileNo: ArrAayamID[1],
                    // }).exec();
                    // if (useradd) {
                    //     return res.status(200).json({ status: 0, Message: "Mobile Number Already Exit.", data: useradd, error: null });
                    // } else {
                    await AayamDetailModel({
                        AayamID: req.body.ID,
                        ContactName: ArrAayamID[0],
                        ContactMobileNo: ArrAayamID[1],
                        Type: 'App'
                    }).save();
                    // }
                }
            }
            return res.status(200).json({ status: 1, message: "Aayam Successfully Updated.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
async function BindAayamData(req) {
    var CheckSearchID, CheckSearchUserID, CheckSearchBhagID, CheckSearchNagarID, CheckSearchVastiID, CheckSearchSocietyID;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckSearchNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckSearchVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
    CheckSearchSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
    var DataResponce = await AayamModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "AayamModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "AayamModel.UserID",
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
                    "localField": "AayamModel.BhagID",
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
                    "localField": "AayamModel.NagarID",
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
                    "localField": "AayamModel.VastiID",
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
                    "localField": "AayamModel.SocietyID",
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
                    "localField": "AayamModel._id",
                    "from": "AayamDetail",
                    "foreignField": "AayamID",
                    "as": "AayamDetail"
                }
            },
            {
                "$match": {
                    "AayamModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    "AayamModel._id": CheckSearchID,
                    "AayamModel.UserID": CheckSearchUserID,
                    "AayamModel.BhagID": CheckSearchBhagID,
                    "AayamModel.NagarID": CheckSearchNagarID,
                    "AayamModel.VastiID": CheckSearchVastiID,
                    "AayamModel.SocietyID": CheckSearchSocietyID
                }
            },
            {
                "$sort": {
                    "AayamModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$AayamModel._id",
                    "AayamDetail": "$AayamDetail",
                    "UserID": "$AayamModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$AayamModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$AayamModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$AayamModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyID": "$AayamModel.SocietyID",
                    "SocietyName": "$Society.SocietyName",
                    "AayamType": "$AayamModel.AayamType",
                    "AccosiationName": "$AayamModel.AccosiationName",
                    "AayamDate": "$AayamModel.AayamDate",
                    "AayamCount": "$AayamModel.AayamCount",
                    "InterestSubject": "$AayamModel.InterestSubject",
                    "Description": "$AayamModel.Description",
                    "IsActive": "$AayamModel.IsActive",
                    "IsDelete": "$AayamModel.IsDelete",
                    "CreatedDate": "$AayamModel.CreatedDate"
                }
            }
        ]);
    return DataResponce;
}
exports.GetAayam = [async (req, res) => {
    try {
        let AayamData = await BindAayamData(req);
        return res.status(200).json({ status: 1, message: "Success.", data: AayamData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
async function BindPanelAayamData(req) {
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
        var todayi = new Date(todaydate);
        var todayEODi = new Date(todaydate);
        todayi.setHours(0, 0, 0, 0);
        todayEODi.setHours(23, 59, 59, 999);

        query1 = {
            '$gte': todayi, '$lte': todayEODi
        }
    }
    var DataResponce = await AayamModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "AayamModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "AayamModel.UserID",
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
                    "localField": "AayamModel.BhagID",
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
                    "localField": "AayamModel.NagarID",
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
                    "localField": "AayamModel.VastiID",
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
                    "localField": "AayamModel.SocietyID",
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
                    "localField": "AayamModel._id",
                    "from": "AayamDetail",
                    "foreignField": "AayamID",
                    "as": "AayamDetail"
                }
            },
            {
                "$match": {
                    "AayamModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "Vasti.IsActive": true,
                    "Society.IsActive": true,
                    "AayamModel._id": CheckSearchID,
                    "AayamModel.UserID": CheckSearchUserID,
                    "AayamModel.BhagID": CheckSearchBhagID,
                    "AayamModel.NagarID": CheckSearchNagarID,
                    "AayamModel.VastiID": CheckSearchVastiID,
                    "AayamModel.SocietyID": CheckSearchSocietyID,
                    "AayamModel.CreatedDate": query1
                }
            },
            {
                "$sort": {
                    "AayamModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$AayamModel._id",
                    "AayamDetail": "$AayamDetail",
                    "UserID": "$AayamModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "BhagID": "$AayamModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$AayamModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiID": "$AayamModel.VastiID",
                    "VastiName": "$Vasti.VastiName",
                    "SocietyID": "$AayamModel.SocietyID",
                    "SocietyName": "$Society.SocietyName",
                    "AayamType": "$AayamModel.AayamType",
                    "AccosiationName": "$AayamModel.AccosiationName",
                    "AayamDate": "$AayamModel.AayamDate",
                    "AayamCount": "$AayamModel.AayamCount",
                    "InterestSubject": "$AayamModel.InterestSubject",
                    "Description": "$AayamModel.Description",
                    "IsActive": "$AayamModel.IsActive",
                    "IsDelete": "$AayamModel.IsDelete",
                    "CreatedDate": "$AayamModel.CreatedDate"
                }
            }
        ]);
    return DataResponce;
}
exports.ViewAayamData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let AayamData = await BindPanelAayamData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/ViewAayamDetail', {
                title: 'ViewAayamDetail', AayamData: AayamData, BhagData: BhagData, UserData: UserData,
                NagarData: NagarData, VastiData: VastiData, SocietyData: SocietyData, SearchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingAayamData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.UserID + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SocietyID + '~' + req.body.StartDate + '~' + req.body.EndDate;
            let AayamData = await BindPanelAayamData(req);
            let BhagData = await BhagModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let SocietyData = await SocietyModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let UserData = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/ViewAayamDetail', {
                title: 'ViewAayamDetail', AayamData: AayamData, BhagData: BhagData, UserData: UserData,
                NagarData: NagarData, VastiData: VastiData, SocietyData: SocietyData, SearchData: SearchData, cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportsAayamData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let AayamData = await BindPanelAayamData(req);
            var Result = [];
            var count = 1;
            AayamData.forEach((sdata) => {

                mobilenodetail = []
                namedetail = []
                sdata.AayamDetail.forEach((doc) => {
                    mobilenodetail.push(doc.ContactName);
                    namedetail.push(doc.ContactMobileNo);
                });
                // sdata.AayamDetail.forEach((doc) => {
                //     namedetail.push(doc.ContactMobileNo)
                // });

                Result.push({
                    "Sr.No.": count++,
                    "UserName": sdata.UserName,
                    "BhagName": sdata.BhagName,
                    "NagarName": sdata.NagarName,
                    "VastiName": sdata.VastiName,
                    "SocietyName": sdata.SocietyName,
                    "AayamType": sdata.AayamType,
                    "AccosiationName": sdata.AccosiationName,
                    "AayamDate": sdata.AayamDate,
                    "AayamCount": sdata.AayamCount,
                    "InterestSubject": sdata.InterestSubject,
                    "Description": sdata.Description,
                    "ContactName": mobilenodetail ? mobilenodetail.toString() : "",
                    "ContactMobileNo": namedetail ? namedetail.toString() : "",
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Aayam Detail");

            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Bhag Name", key: "BhagName", width: 20 },
                { header: "Nagar Name", key: "NagarName", width: 15 },
                { header: "Vasti Name", key: "VastiName", width: 18 },
                { header: "Society Name", key: "SocietyName", width: 18 },
                { header: "Aayam Type", key: "AayamType", width: 18 },
                { header: "Accosiation Name", key: "AccosiationName", width: 18 },
                { header: "Aayam Date", key: "AayamDate", width: 18 },
                { header: "Aayam Count", key: "AayamCount", width: 20 },
                { header: "Interest Subject", key: "InterestSubject", width: 20 },
                { header: "Description", key: "Description", width: 20 },
                { header: "Contact Name", key: "ContactName", width: 20 },
                { header: "Contact MobileNo", key: "ContactMobileNo", width: 20 },
                { header: "Entry Date", key: "CreatedDate", width: 16 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Aayam Detail'

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
                "attachment; filename=" + "AayamDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}