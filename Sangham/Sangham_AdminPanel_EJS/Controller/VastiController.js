const VastiModel = require("../Model/VastiModel");
const NagarModel = require("../Model/NagarModel");
const BhagModel = require("../Model/BhagModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const moment = require('moment-timezone');
const moment1 = require('moment');
var mongoose = require('mongoose')
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook(); // Create a new workbook
const excel = require("exceljs");
//------------------------------------------ App ----------------------------------------------------//
exports.GetVasti1 = [async (req, res) => {
    try {
        var query = { IsActive: true }
        // var query
        if (req.body.BhagID) {
            query['BhagID'] = mongoose.Types.ObjectId(req.body.BhagID)
        }
        if (req.body.NagarID) {
            query['NagarID'] = mongoose.Types.ObjectId(req.body.NagarID)
        }
        let VastiData = await VastiModel.find(query).sort({ _id: -1 }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: VastiData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetVasti = [async (req, res) => {
    try {
        var CheckUserID, CheckBhagID, CheckSearchID, CheckNagarID;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });

        if (req.body.UserID) {
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
                            // "VastiName": "$UserMaster.UserName",
                            "BhagID": "$Vasti.BhagID",
                            "BhagName": "$Bhag.BhagName",
                            "NagarID": "$Vasti.NagarID",
                            "NagarName": "$Nagar.NagarName",
                            // "KaryavahName": "$Nagar.KaryavahName",
                            // "MobileNo": "$Nagar.MobileNo",
                            // "Address": "$Nagar.Address",
                            // "EmailID": "$Nagar.EmailID",
                            // "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                            // "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                            // "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                            // "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                            // "IsActive": "$Nagar.IsActive",
                            // "IsDelete": "$Nagar.IsDelete",
                            // "ModifiedDate": "$Nagar.ModifiedDate",
                            // "CreatedDate": "$Nagar.CreatedDate"
                        }
                    },
                ]).exec();
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
                            // "VastiName": "$UserMaster.UserName",
                            "BhagID": "$Vasti.BhagID",
                            "BhagName": "$Bhag.BhagName",
                            "NagarID": "$Vasti.NagarID",
                            "NagarName": "$Nagar.NagarName",
                            // "KaryavahName": "$Nagar.KaryavahName",
                            // "MobileNo": "$Nagar.MobileNo",
                            // "Address": "$Nagar.Address",
                            // "EmailID": "$Nagar.EmailID",
                            // "SahKaryakartaName": "$Nagar.SahKaryakartaName",
                            // "SahKaryakartaMobileNo": "$Nagar.SahKaryakartaMobileNo",
                            // "SahKaryakartaAddress": "$Nagar.SahKaryakartaAddress",
                            // "SahKaryakartaEmailID": "$Nagar.SahKaryakartaEmailID",
                            // "IsActive": "$Nagar.IsActive",
                            // "IsDelete": "$Nagar.IsDelete",
                            // "ModifiedDate": "$Nagar.ModifiedDate",
                            // "CreatedDate": "$Nagar.CreatedDate"
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
async function BindVstiData(req) {
    var CheckSearchID, CheckSearchBhagID, CheckSearchNagarID;
    var bodybhagID = req.body.BhagName;
    var bodynagarID = req.body.NagarName;
    CheckSearchBhagID = ((bodybhagID) ? ({ $in: [mongoose.Types.ObjectId(bodybhagID)] }) : { $nin: [] });
    CheckSearchNagarID = ((bodynagarID) ? ({ $in: [mongoose.Types.ObjectId(bodynagarID)] }) : { $nin: [] });
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    // CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    // CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });

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
                    // "VastiModel.BhagID": CheckBhagID,
                    "VastiModel.NagarID": CheckSearchNagarID,
                    "VastiModel.BhagID": CheckSearchBhagID
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
exports.ViewVastiData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await BindVstiData(req);
            res.render('./PanelUser/Vasti', {
                title: 'Vasti', VastiData: VastiData,
                BhagData: BhagData, NagarData: NagarData,
                SearchData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddVastiData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let VastiData = await VastiModel.findOne({
                    IsActive: true,
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiName: req.body.VastiName
                }).exec();
                if (VastiData) {
                    res.render('./PanelUser/Vasti', { title: 'Vasti', VastiData: VastiData, NagarData: '', BhagData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Vasti name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    await VastiModel({
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiName: req.body.VastiName
                    }).save();
                    res.render('./PanelUser/Vasti', { title: 'Vasti', VastiData: VastiData, NagarData: '', BhagData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let VastiData = await VastiModel.findOne({
                    IsActive: true,
                    _id: { $nin: req.body.ID },
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiName: req.body.VastiName
                }).exec();
                if (VastiData) {
                    res.render('./PanelUser/Vasti', { title: 'Vasti', VastiData: VastiData, NagarData: '', BhagData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Vasti name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["BhagID"] = req.body.BhagID;
                    UpdateData["NagarID"] = req.body.NagarID;
                    UpdateData["VastiName"] = req.body.VastiName;
                    await VastiModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/Vasti', { title: 'Vasti', VastiData: VastiData, NagarData: '', BhagData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.FindByVastiData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let VastiData = await BindVstiData(req);
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let fetchdata = await VastiModel.findOne({ _id: req.params.ID }).exec();
            if (req.params.ID) {
                res.render('./PanelUser/Vasti', {
                    title: 'Vasti', BhagData: BhagData, VastiData: VastiData,
                    NagarData: NagarData, FetchData: fetchdata, alertTitle: '', alertMessage: '',
                    cookieData: req.cookies.admindata.UserName, ID: req.params.ID, moment: moment1
                });
            } else {
                res.render('./PanelUser/Vasti', {
                    title: 'Vasti', BhagData: BhagData, VastiData: VastiData,
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
exports.DeleteVastiData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var UpdateData = {};
            UpdateData["IsActive"] = 'false';
            UpdateData["IsDelete"] = 'true';
            await VastiModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            let VastiData = await BindVstiData(req);
            res.render('./PanelUser/Vasti', {
                title: 'Vasti', BhagData: '', VastiData: VastiData,
                NagarData: '', FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted',
                cookieData: req.cookies.admindata.UserName, ID: req.params.ID, moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingVastiData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            console.log("---req.body---", req.body)
            var SearchData = req.body.BhagName + '~' + req.body.NagarName;
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            let VastiData = await BindVstiData(req);
            res.render('./PanelUser/Vasti', {
                title: 'Vasti', VastiData: VastiData,
                BhagData: BhagData, NagarData: NagarData,
                SearchData: SearchData, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
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
            Result.push({
                "Sr.No.": count++,
                "BhagName": udata.BhagName,
                "NagarName": udata.NagarName,
                "VastiName": udata.VastiName,
                "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
            });

        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Vasti Detail");

        worksheet.columns = [
            { header: "Sr.no", key: "Sr.No.", width: 6 },
            { header: "Bhag Name", key: "BhagName", width: 15 },
            { header: "Nagar Name", key: "NagarName", width: 15 },
            { header: "Vasti Name", key: "VastiName", width: 15 },
            { header: "Active/InActive", key: "IsActive", width: 15 },
        ];

        worksheet.spliceRows(1, 0, [])
        // Set title
        worksheet.getCell('A1').value = 'Vasti Detail'

        // Optional merge and styles
        worksheet.mergeCells('A1:E1')
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
            "attachment; filename=" + "VastiDetail.xlsx"
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