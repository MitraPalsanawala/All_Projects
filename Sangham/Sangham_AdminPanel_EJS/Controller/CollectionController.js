const UserMasterModel = require("../Model/UserMasterModel");
const AnnadanModel = require("../Model/AnnadanModel");
const AnnadanRequestModel = require("../Model/AnnadanRequestModel");
const CollectionModel = require("../Model/CollectionModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
const excelJS = require("exceljs");

async function BindCollectionData(req) {
    var CheckSearchID, CheckSearchUserID, CheckSearchCollectionUserID, query1;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchCollectionUserID = ((req.body.CollectionUserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.CollectionUserID)] }) : { $nin: [] });
    CheckSearchCollectionType = ((req.body.CollectionType) ? ({ $in: [(req.body.CollectionType)] }) : { $nin: [] });
    CheckSearchCollectionStatus = ((req.body.CollectionStatus) ? ({ $in: [(req.body.CollectionStatus)] }) : { $nin: [] });

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

    var DataResponce = await CollectionModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "CollectionModel": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    "localField": "CollectionModel.UserID",
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
                    "localField": "CollectionModel.CollectionUserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "CollectionUserMaster"
                }
            },
            {
                "$unwind": {
                    "path": "$UserMaster",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$match": {
                    "CollectionModel.IsActive": true,
                    "UserMaster.IsActive": true,
                    "CollectionModel.CollectionUserID": CheckSearchCollectionUserID,
                    "CollectionModel.CollectionType": CheckSearchCollectionType,
                    "CollectionModel.CollectionStatus": CheckSearchCollectionStatus,
                    "CollectionModel.CreatedDate": query1,
                }
            },
            {
                "$sort": {
                    "CollectionModel._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$CollectionModel._id",
                    "UserID": "$CollectionModel.UserID",
                    "UserName": "$UserMaster.UserName",
                    "CollectionUserID": "$CollectionModel.CollectionUserID",
                    "CollectionUserName": "$CollectionUserMaster.UserName",
                    "Amount": "$CollectionModel.Amount",
                    // "DeductAmount": "$CollectionModel.DeductAmount",
                    "BankAmount": "$CollectionModel.BankAmount",
                    "OnlineAmount": "$CollectionModel.OnlineAmount",
                    "TotalNoOfCheque": "$CollectionModel.TotalNoOfCheque",
                    "CollectionType": "$CollectionModel.CollectionType",
                    "CollectionStatus": "$CollectionModel.CollectionStatus",
                    "IsActive": "$CollectionModel.IsActive",
                    "IsDelete": "$CollectionModel.IsDelete",
                    "CreatedDate": "$CollectionModel.CreatedDate"
                }
            }
        ]);
    return DataResponce;
}
exports.ViewCollectionData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let collectiondata = await BindCollectionData(req);
            let UserData = await UserMasterModel.find({ "UserRole": { $nin: "NormalUser" }, IsActive: true }).sort({ "_id": -1 }).exec();
            res.render('./PanelUser/ViewCollectionDetail', {
                title: 'ViewCollectionDetail', CollectionData: collectiondata, UserData: UserData,
                SearchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingCollectionData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            console.log("===req.body====", req.body)
            var SearchData = req.body.CollectionType + '~' + req.body.CollectionUserID + '~' + req.body.CollectionStatus + '~' + req.body.StartDate + '~' + req.body.EndDate;
            let collectiondata = await BindCollectionData(req);
            let UserData = await UserMasterModel.find({ "UserRole": { $nin: "NormalUser" }, IsActive: true }).sort({ "_id": -1 }).exec();
            res.render('./PanelUser/ViewCollectionDetail', {
                title: 'ViewCollectionDetail', CollectionData: collectiondata, UserData: UserData,
                SearchData: SearchData, cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportsCollectionData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let collectiondata = await BindCollectionData(req);
            var Result = [];
            var count = 1;
            collectiondata.forEach((sdata) => {
                Result.push({
                    "Sr.No.": count++,
                    "CollectionUserName": sdata.CollectionUserName.toString(),
                    "UserName": sdata.UserName,
                    "Amount": sdata.Amount,
                    "BankAmount": sdata.BankAmount,
                    "OnlineAmount": sdata.OnlineAmount,
                    "TotalNoOfCheque": sdata.TotalNoOfCheque,
                    "DeductAmount": sdata.DeductAmount,
                    "CollectionType": sdata.CollectionType,
                    "CollectionStatus": sdata.CollectionStatus,
                    "CreatedDate": moment(sdata.CreatedDate).format('DD-MM-yyyy')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("User Collection Detail");

            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "Collection Type", key: "CollectionType", width: 18 },
                { header: "Collection User Name", key: "CollectionUserName", width: 20 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Cash Amount", key: "Amount", width: 15 },
                // { header: "Deduct Amount", key: "DeductAmount", width: 18 },
                { header: "Total No Of Cheque", key: "TotalNoOfCheque", width: 18 },
                { header: "Bank Amount", key: "BankAmount", width: 15 },
                { header: "Online Amount", key: "OnlineAmount", width: 15 },

                { header: "Collection Status", key: "CollectionStatus", width: 18 },
                { header: "Entry Date", key: "CreatedDate", width: 13 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'User Collection Detail'

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
                "attachment; filename=" + "UserCollectionDetail.xlsx"
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
//---------------------------------------  User Collection -------------------------------------------------------//

exports.GetUserCollection = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            res.render('./PanelUser/ViewUserCollectionDetail', {
                title: 'ViewUserCollectionDetail', CollectionData: '', UserData: '',
                SearchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewCollectionReportData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let CollectionReportData = await BindCollectionReportData(req);
            let UserData = await UserMasterModel.find({ "MainCollectionStatus": true, "IsActive": true },
                { _id: 1, UserName: 1, MobileNo: 1, UserRole: 1, IsActive: 1, IsDelete: 1 }).sort({ "_id": -1 }).exec();
            res.render('./PanelUser/ViewCollectionReport', {
                title: 'ViewCollectionReport', data: CollectionReportData, UserData: UserData,
                SearchData: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
async function BindCollectionReportData(req) {
    var CheckMobileNo = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    let userdata = await UserMasterModel.find({ "MobileNo": CheckMobileNo, "MainCollectionStatus": true, "IsActive": true },
        { _id: 1, UserName: 1, MobileNo: 1, UserRole: 1, IsActive: 1, IsDelete: 1 })
        .populate({ path: 'AnnadanDetail', select: 'AnnadanUserName Amount MobileNo AnnadanStatus', match: { ModeOfPayment: "Cash" } }).sort({ '_id': -1 }).exec();

    var OverAllTotalAmount = 0;
    if (userdata.length > 0) {
        for (let index = 0; index < userdata.length; index++) {
            var obj = userdata[index]
            var TotalAmount = 0;
            var Sum1 = 0;

            obj.AnnadanDetail.forEach((cb) => {
                Sum1 = Sum1 + Number(cb.Amount)
            });

            OverAllTotalAmount = OverAllTotalAmount + Number(Sum1)
            //User Anndan Amount
            obj.AnnadanDetail.push({ AnndanAmount: Sum1 });
            userdata[index] = obj

            let collectiondata = await CollectionModel.find({
                "CollectionStatus": "Complete",
                "CollectionUserID": obj._id,
                "CollectionType": "SuperUser Collection",
            }).exec();

            var CollectionSum = 0;
            if (collectiondata.length > 0) {
                collectiondata.forEach((doc) => {
                    CollectionSum = CollectionSum + Number(doc.Amount)
                });
            }

            //User Collected Anndan Amount
            obj.AnnadanDetail.push({ CollectionSum: CollectionSum });
            userdata[index] = obj

            let MainCollectiondata = await CollectionModel.find({
                "CollectionStatus": "Complete",
                "UserID": obj._id,
                "CollectionType": "MainUser Collection",
            }).exec();

            var MainCollectionSum = 0;
            if (MainCollectiondata.length > 0) {
                MainCollectiondata.forEach((doc) => {
                    MainCollectionSum = MainCollectionSum + Number(doc.Amount)
                });
            }
            //Final Collected Amount
            obj.AnnadanDetail.push({ MainCollectionSum: MainCollectionSum });
            userdata[index] = obj

            if (Sum1 != 0) {
                console.log("Sum1===>", Sum1)
            }

            if (CollectionSum != 0) {
                console.log("CollectionSum===>", CollectionSum)
            }

            var AllData = [];
            AllData.push({
                TotalBhagdata: BhagDetailData.length,
            });
        }
    }
    return userdata;
}
exports.GetCollectionReport = [async (req, res) => {
    try {

    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}