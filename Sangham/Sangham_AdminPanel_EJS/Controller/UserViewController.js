const UserMasterModel = require("../Model/UserMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ResponsibilityModel = require("../Model/ResponsibilityModel");
const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const PanelUserModel = require("../Model/PanelUserModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
// const moment = require('moment-timezone');
const moment1 = require('moment');
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const CryptoJS = require("crypto-js");
const otpGenerator = require('otp-generator')
const axios = require('axios')
const excel = require("exceljs");
const DIR1 = "./public/upload";
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook(); // Create a new workbook
var mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");

const DIR = "./public/SmartCollection/Users";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR); },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuidv4() + "-" + fileName);
    }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error(ImageError), false);
    }
    cb(null, true);
};
var ImageError = "Only .png, .jpg and .jpeg format allowed!";

async function BindUserData(req) {

    var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    var CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    var CheckUserRole = ((req.body.UserRole) ? ({ $in: [req.body.UserRole] }) : { $nin: [] });
    var CheckUserType = ((req.body.UserType) ? ({ $in: [req.body.UserType] }) : { $nin: [] });
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
            // {
            //     "$lookup": {
            //         "localField": "UserMaster",
            //         "from": "UserMaster",
            //         "foreignField": "_id",
            //         "as": "UserMaster"
            //     }
            // },
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
                    "as": "Bhag",
                    "pipeline": [
                        {
                            "$match": { 'IsActive': { '$eq': true } },
                        }]
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
                    //"UserMaster._id": "ObjectId('637ef6f4e10350a1f9bfc3b2')",
                    //"Bhag.IsActive": true,
                    // "UserMaster.UserType": "SuperUser",
                    // "UserMaster.UserStatus": "Complete",
                    "UserMaster._id": CheckSearchID,
                    "UserMaster.MobileNo": CheckSearchMobilenO,
                    "UserMaster.UserRole": CheckUserRole,
                    "UserMaster.UserType": CheckUserType,
                    "UserBhagDetail.BhagID": CheckBhagID,
                    "UserNagarDetail.NagarID": CheckNagarID,
                }
            },
            {
                "$sort": {
                    "UserMaster._id": -1
                }
            },
            {
                "$project": {
                    "_id": "$UserMaster._id",
                    "UserName": "$UserMaster.UserName",
                    "SuperUserID": "$UserMaster.UserID",
                    // "SuperUserName": "$UserMaster.UserName",
                    "ShakhaMasterID": "$UserMaster.ShakhaMasterID",
                    "ShakhaName": "$ShakhaMaster.ShakhaName",
                    "ResponsibilityID": "$UserMaster.ResponsibilityID",
                    "ResponsibilityName": "$Responsibility.ResponsibilityName",
                    "SanghShikshanID": "$UserMaster.SanghShikshanID",
                    "SanghShikshanName": "$SanghShikshan.SanghShikshanName",
                    // "NormalUserName": "$UserMaster.UserName",
                    // "UserBhagDetail": "$UserBhagDetail",
                    // "UserBhagName": "$Bhag",
                    "UserBhagDetail": "$UserBhagDetail",
                    "UserBhagName": "$Bhag",
                    "UserNagarDetail": "$UserNagarDetail",
                    "UserNagarName": "$Nagar",
                    "UserVastiDetail": "$UserVastiDetail",
                    "UserVastiName": "$Vasti",
                    "MobileNo": "$UserMaster.MobileNo",
                    "Star": "$UserMaster.Star",
                    "Javabadari": "$UserMaster.Javabadari",
                    "KaryavahType": "$UserMaster.KaryavahType",
                    "SangathanType": "$UserMaster.SangathanType",
                    "SangathanPramukhType": "$UserMaster.SangathanPramukhType",
                    "JagranType": "$UserMaster.JagranType",
                    "JagranPramukhType": "$UserMaster.JagranPramukhType",
                    "GatividhiType": "$UserMaster.GatividhiType",
                    "GatividhiPramukhType": "$UserMaster.GatividhiPramukhType",
                    "VastiPramukhType": "$UserMaster.VastiPramukhType",
                    "SakhaType": "$UserMaster.SakhaType",
                    "Address": "$UserMaster.Address",
                    "OTP": "$UserMaster.OTP",
                    // "ShakhaName": "$UserMaster.ShakhaName",
                    "Type": "$UserMaster.Type",
                    "Photo": "$UserMaster.Photo",
                    "SubType": "$UserMaster.SubType",
                    "UserType": "$UserMaster.UserType",
                    "UserRole": "$UserMaster.UserRole",
                    "UserStatus": "$UserMaster.UserStatus",
                    "LoginStatus": "$UserMaster.LoginStatus",
                    "SubType": "$UserMaster.SubType",
                    "IsActive": "$UserMaster.IsActive",
                    "IsDelete": "$UserMaster.IsDelete",
                    "CreatedDate": "$UserMaster.CreatedDate"
                }
            }
        ]);
    // console.log("====userdata====", userdata)
    return userdata;
}

exports.ViewGetAllUserBind = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let GetAllData = await BindUserData(req);
            // let GetAllData = await UserMasterModel.find({})
            //     .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName', match: { IsActive: 'true' } } })
            //     .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName', match: { IsActive: 'true' } } })
            //     .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName', match: { IsActive: 'true' } } })
            //     .sort({ '_id': -1 }).exec();
            let BhagData = await BhagModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            // console.log();
            res.render('./PanelUser/UserDetailView', {
                title: 'UserDetailView', UserData: GetAllData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewSearchingAllUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.MobileNo + '~' + req.body.UserType + '~' + req.body.BhagID + '~' + req.body.NagarID;
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            if (req.params.ID) {
                res.render('./PanelUser/UserDetailView', { title: 'UserDetailView', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.params.ID });
            } else {
                res.render('./PanelUser/UserDetailView', { title: 'UserDetailView', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewExportAllUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.MobileNo + '~' + req.body.UserType + '~' + req.body.BhagID + '~' + req.body.NagarID;
            let GetAllData = await BindUserData(req);
            // let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            // let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            // let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            var Result = []
            var count = 1;
            GetAllData.forEach((udata) => {
                UserBhagdetail = []
                UserNagardetail = []
                udata.UserBhagName.forEach((doc) => {
                    UserBhagdetail.push(doc.BhagName)
                });
                udata.UserNagarName.forEach((doc) => {
                    UserNagardetail.push(doc.NagarName)
                });
                // console.log("==length==", GetAllData.count())

                Result.push({
                    "Sr.No.": count++,
                    "_id": udata._id,
                    "UserName": udata.UserName,
                    "MobileNo": udata.MobileNo,
                    "Address": udata.Address ? udata.Address : "-",
                    "OTP": udata.OTP ? udata.OTP : "-",
                    "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                    "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                    "LoginStatus": udata.LoginStatus ? udata.LoginStatus : "-",
                    "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                });
                //}
                console.log("bhagdb", Result)
            });
            // console.log("===getall==", GetAllData.UserBhagName);
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("User Detail");
            // for (var v = 0; v <= worksheet.length; v++) {
            //     srno = v + 1
            //     console.log("bhagdb", srno)
            // }
            // console.log("bhagdb", srno)

            worksheet.columns = [
                { header: "Sr.no", key: "Sr.No.", width: 6 },
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Mobile No", key: "MobileNo", width: 20 },
                { header: "Address", key: "Address", width: 20 },
                { header: "OTP", key: "OTP", width: 10 },
                { header: "Login Status", key: "LoginStatus", width: 18 },
                { header: "Bhag Name", key: "BhagName", width: 20 },
                { header: "Nagar Name", key: "NagarName", width: 20 },
                { header: "User Status", key: "IsActive", width: 15 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'User Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:I1')
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
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewLoginAllUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (req.cookies.admindata) {
                var SearchData = req.body.MobileNo + '~' + req.body.UserType + '~' + req.body.BhagID + '~' + req.body.NagarID;
                let GetAllData = await BindUserData(req);
                // let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
                // let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
                // let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
                var Result = [];
                var count = 1;
                GetAllData.forEach((udata) => {
                    UserBhagdetail = []
                    UserNagardetail = []
                    udata.UserBhagName.forEach((doc) => {
                        UserBhagdetail.push(doc.BhagName)
                    });
                    udata.UserNagarName.forEach((doc) => {
                        UserNagardetail.push(doc.NagarName)
                    });
                    if (udata.LoginStatus == 'LogIn') {
                        Result.push({
                            "Sr.No.": count++,
                            "UserName": udata.UserName,
                            "MobileNo": udata.MobileNo,
                            "Address": udata.Address ? udata.Address : "-",
                            "OTP": udata.OTP ? udata.OTP : "-",
                            "LoginStatus": udata.LoginStatus,
                            "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                            "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                            "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                        });
                    }
                });
                console.log("===getall==", GetAllData);
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet("User LogIn Detail");

                worksheet.columns = [
                    { header: "Sr.no", key: "Sr.No.", width: 6 },
                    { header: "User Name", key: "UserName", width: 20 },
                    { header: "Mobil eNo", key: "MobileNo", width: 20 },
                    { header: "Address", key: "Address", width: 20 },
                    { header: "OTP", key: "OTP", width: 10 },
                    { header: "Login Status", key: "LoginStatus", width: 18 },
                    { header: "Bhag Name", key: "BhagName", width: 20 },
                    { header: "Nagar Name", key: "NagarName", width: 20 },
                    // { header: "Date", key: "EntryDate", width: 20 },
                    { header: "User Status", key: "IsActive", width: 15 },
                ];

                worksheet.spliceRows(1, 0, [])
                // Set title
                worksheet.getCell('A1').value = 'User LogIn Detail'

                // Optional merge and styles
                worksheet.mergeCells('A1:I1')
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
                    "attachment; filename=" + "UserLogInDetail.xlsx"
                );
                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            } else {
                res.redirect('./Splash');
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewWithoutLoginUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (req.cookies.admindata) {
                var SearchData = req.body.MobileNo + '~' + req.body.UserType + '~' + req.body.BhagID + '~' + req.body.NagarID;
                let GetAllData = await BindUserData(req);
                // let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
                // let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
                // let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
                var Result = [];
                var count = 1;
                GetAllData.forEach((udata) => {
                    UserBhagdetail = []
                    UserNagardetail = []
                    udata.UserBhagName.forEach((doc) => {
                        UserBhagdetail.push(doc.BhagName)
                    });
                    udata.UserNagarName.forEach((doc) => {
                        UserNagardetail.push(doc.NagarName)
                    });
                    if (udata.LoginStatus == '') {
                        Result.push({
                            "Sr.No.": count++,
                            "UserName": udata.UserName,
                            "MobileNo": udata.MobileNo,
                            "Address": udata.Address ? udata.Address : "-",
                            "OTP": "-",
                            "LoginStatus": udata.LoginStatus,
                            "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                            "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                            "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                        });
                    }
                });
                console.log("===getall==", GetAllData);
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet("User WithOut LogIn Detail");

                worksheet.columns = [
                    { header: "Sr.no", key: "Sr.No.", width: 6 },
                    { header: "User Name", key: "UserName", width: 20 },
                    { header: "Mobil eNo", key: "MobileNo", width: 20 },
                    { header: "Address", key: "Address", width: 20 },
                    { header: "OTP", key: "OTP", width: 10 },
                    { header: "Login Status", key: "LoginStatus", width: 18 },
                    { header: "Bhag Name", key: "BhagName", width: 20 },
                    { header: "Nagar Name", key: "NagarName", width: 20 },
                    // { header: "Date", key: "EntryDate", width: 20 },
                    { header: "User Status", key: "IsActive", width: 15 },
                ];

                worksheet.spliceRows(1, 0, [])
                // Set title
                worksheet.getCell('A1').value = 'User WithOut LogIn Detail'

                // Optional merge and styles
                worksheet.mergeCells('A1:I1')
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
                    "attachment; filename=" + "UserWithOutLogInDetail.xlsx"
                );
                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            } else {
                res.redirect('./Splash');
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}]
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}