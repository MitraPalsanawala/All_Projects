const NagarModel = require("../Model/NagarModel");
const BhagModel = require("../Model/BhagModel");
const VastiModel = require("../Model/VastiModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
const DIR1 = "./public/upload";
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook(); // Create a new workbook
const excel = require("exceljs");
//------------------------------------------ App ----------------------------------------------------//
exports.GetNagar1 = [async (req, res) => {
    try {
        var query = { IsActive: true }
        if (req.body.BhagID) {
            query['BhagID'] = mongoose.Types.ObjectId(req.body.BhagID)
        }
        let NagarData = await NagarModel.find(query).sort({ _id: -1 }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: NagarData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetNagar = [async (req, res) => {
    try {
        var CheckUserID, CheckBhagID, CheckSearchID;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        if (req.body.UserID) {
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
        } else {
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
        }

        console.log("==DataResponse==", DataResponse)
        return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
async function BindNagarData(req) {
    var bodybhagID = req.body.BhagName;
    var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    var CheckSearchBhagID = ((bodybhagID) ? ({ $in: [mongoose.Types.ObjectId(bodybhagID)] }) : { $nin: [] });
    var NagarData = await NagarModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "NagarModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "NagarModel.BhagID",
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
                "$match": {
                    "NagarModel.IsActive": true,
                    "Bhag.IsActive": true,
                    "NagarModel._id": CheckSearchID,
                    "NagarModel.BhagID": CheckSearchBhagID
                }
            },
            {
                "$sort": {
                    "NagarModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$NagarModel._id",
                    "BhagID": "$NagarModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarName": "$NagarModel.NagarName",
                    "MobileNo": "$NagarModel.MobileNo",
                    "Address": "$NagarModel.Address",
                    "EmailID": "$NagarModel.EmailID",
                    "SahKaryakartaName": "$NagarModel.SahKaryakartaName",
                    "SahKaryakartaMobileNo": "$NagarModel.SahKaryakartaMobileNo",
                    "SahKaryakartaAddress": "$NagarModel.SahKaryakartaAddress",
                    "SahKaryakartaEmailID": "$NagarModel.SahKaryakartaEmailID",
                    // "Type": "$NagarModel.Type",
                    "IsActive": "$NagarModel.IsActive",
                    "IsDelete": "$NagarModel.IsDelete",
                    "CreatedDate": "$NagarModel.CreatedDate",
                    "ModifiedDate": "$NagarModel.ModifiedDate"
                }
            }
        ]);
    return NagarData;
}
exports.ViewNagarData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let NagarData = await BindNagarData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/Nagar', {
                title: 'Nagar', BhagData: BhagData, SearchData: '',
                NagarData: NagarData, FetchData: '', alertTitle: '', alertMessage: '',
                cookieData: req.cookies.admindata.UserName, ID: '', moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddNagar = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let NagarData = await NagarModel.findOne({
                    IsActive: true,
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarName: req.body.NagarName
                }).exec();
                if (NagarData) {
                    res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Nagar name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    await NagarModel({
                        BhagID: req.body.BhagID,
                        NagarName: req.body.NagarName
                    }).save();
                    res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let NagarData = await NagarModel.findOne({
                    IsActive: true,
                    _id: { $nin: req.body.ID }, IsActive: true,
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarName: req.body.NagarName
                }).exec();
                if (NagarData) {
                    res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Nagar name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    var UpdateData = {};
                    UpdateData["BhagID"] = req.body.BhagID;
                    UpdateData["NagarName"] = req.body.NagarName;
                    await NagarModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.FindByNagarData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let NagarData = await BindNagarData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let fetchdata = await NagarModel.findOne({ _id: req.params.ID }).exec();
            if (req.params.ID) {
                res.render('./PanelUser/Nagar', {
                    title: 'Nagar', BhagData: BhagData, SearchData: '',
                    NagarData: NagarData, FetchData: fetchdata, alertTitle: '', alertMessage: '',
                    cookieData: req.cookies.admindata.UserName, ID: req.params.ID, moment: moment1
                });
            } else {
                res.render('./PanelUser/Nagar', {
                    title: 'Nagar', BhagData: BhagData, SearchData: '',
                    NagarData: NagarData, FetchData: fetchdata, alertTitle: '', alertMessage: '',
                    cookieData: req.cookies.admindata.UserName, ID: '', moment: moment1
                });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.DeleteNagarData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var UpdateData = {};
            UpdateData["IsActive"] = 'false';
            UpdateData["IsDelete"] = 'true';
            await NagarModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            let NagarData = await BindNagarData(req);
            res.render('./PanelUser/Nagar', {
                title: 'Nagar', BhagData: '', SearchData: '',
                NagarData: NagarData, FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted',
                cookieData: req.cookies.admindata.UserName, ID: req.params.ID, moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingNagarData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            console.log("req.body--", req.body)
            var SearchData = req.body.BhagName;
            let NagarData = await BindNagarData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/Nagar', {
                title: 'Nagar', BhagData: BhagData, SearchData: SearchData,
                NagarData: NagarData, FetchData: '', alertTitle: '', alertMessage: '',
                cookieData: req.cookies.admindata.UserName, ID: '', moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddNagarV2 = [async (req, res) => {
    try {
        if (!req.body.ID) {
            let NagarData = await NagarModel.findOne({
                IsActive: true,
                BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                NagarName: req.body.NagarName
            }).exec();
            if (NagarData) {
                return res.status(200).json({ status: 1, message: "Nagar name is already available.", data: NagarData, error: null });
                // res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Nagar name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            } else {
                await NagarModel({
                    BhagID: req.body.BhagID,
                    NagarName: req.body.NagarName
                }).save();
                return res.status(200).json({ status: 1, message: "Successfully Inserted.", data: null, error: null });
                // res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            }
        } else {
            // let NagarData = await NagarModel.findOne({
            //     IsActive: true,
            //     _id: { $nin: req.body.ID }, IsActive: true,
            //     BhagID: mongoose.Types.ObjectId(req.body.BhagID),
            //     NagarName: req.body.NagarName
            // }).exec();
            // if (NagarData) {
            //     return res.status(200).json({ status: 1, message: "Nagar name is already available.", data: NagarData, error: null });
            //     // res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Nagar name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            // } else {
            //     var UpdateData = {};
            //     UpdateData["BhagID"] = req.body.BhagID;
            //     UpdateData["NagarName"] = req.body.NagarName;
            //     await NagarModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
            //     return res.status(200).json({ status: 1, message: "Successfully Updated.", data: null, error: null });
            //     // res.render('./PanelUser/Nagar', { title: 'Nagar', NagarData: '', BhagData: '', FetchData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            // }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
async function BindVstiData(req) {
    var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });

    var VastiData = await VastiModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "VastiModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "VastiModel.BhagID",
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
                    "localField": "VastiModel.NagarID",
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
                "$match": {
                    "VastiModel.IsActive": true,
                    "Bhag.IsActive": true,
                    "Nagar.IsActive": true,
                    "VastiModel._id": CheckSearchID,
                    "VastiModel.BhagID": CheckBhagID,
                    "VastiModel.NagarID": CheckNagarID
                }
            },
            {
                "$sort": {
                    "VastiModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$VastiModel._id",
                    "BhagID": "$VastiModel.BhagID",
                    "BhagName": "$Bhag.BhagName",
                    "NagarID": "$VastiModel.NagarID",
                    "NagarName": "$Nagar.NagarName",
                    "VastiName": "$VastiModel.VastiName",
                    // "PramukhName": "$Nagar.PramukhName",
                    // "MobileNo": "$Nagar.MobileNo",
                    // "Address": "$Nagar.Address",
                    // "EmailID": "$Nagar.EmailID",
                    // "VastiVali": "$Nagar.VastiVali",
                    // "VastiToli": "$Nagar.VastiToli",
                    // "UpPramukhName": "$Nagar.UpPramukhName",
                    // "UpPramukhMobileNo": "$VastiModel.UpPramukhMobileNo",
                    // "UpPramukhAddress": "$VastiModel.UpPramukhAddress",
                    // "UpPramukhEmailID": "$VastiModel.UpPramukhEmailID",
                    "IsActive": "$VastiModel.IsActive",
                    "IsDelete": "$VastiModel.IsDelete",
                    "CreatedDate": "$VastiModel.CreatedDate",
                    "ModifiedDate": "$VastiModel.ModifiedDate"
                }
            }
        ]);
    return VastiData;
}
exports.exportnagarexcel = [async (req, res) => {
    try {
        let VastiData = await BindVstiData(req);
        console.log("GetAllData")
        var Result = [];
        UserBhagdetail = [];
        UserNagardetail = [];
        UserVastidetail = [];
        // ShakhaNamedetail = [];

        var count = 1;
        VastiData.forEach((udata) => {
            // udata.BhagName.forEach((doc) => {
            //     UserBhagdetail.push(doc.BhagName)
            // });
            // console.log("==NagarName=====", doc)
            // udata.UserNagarName.forEach((doc) => {
            //     UserNagardetail.push(doc.NagarName)
            // });
            // udata.UserVastiName.forEach((doc) => {
            //     UserVastidetail.push(doc.VastiName)
            // });
            Result.push({
                "Sr.No.": count++,
                "BhagName": udata.BhagName,
                "NagarName": udata.NagarName,
                "VastiName": udata.VastiName,
                "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
            });

        });
        // console.log("==Shakjha=====", Result)
        // console.log("==Shakjha=====", Result)
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("User Detail");

        worksheet.columns = [
            { header: "Sr.no", key: "Sr.No.", width: 6 },
            { header: "BhagName", key: "BhagName", width: 15 },
            { header: "NagarName", key: "NagarName", width: 15 },
            { header: "VastiName", key: "VastiName", width: 15 },

            // { header: "Entry Date", key: "CreatedDate", width: 18 },
            // { header: "Date", key: "EntryDate", width: 20 },
            { header: "Active/InActive", key: "IsActive", width: 15 },
        ];

        worksheet.spliceRows(1, 0, [])
        // Set title
        worksheet.getCell('A1').value = 'User Detail'

        // Optional merge and styles
        worksheet.mergeCells('A1:M1')
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
            "attachment; filename=" + "UserDetail.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}