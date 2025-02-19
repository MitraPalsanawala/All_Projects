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
const AnnadanRequestModel = require("../Model/AnnadanRequestModel");
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
    var CheckSearchID, CheckSearchMobilenO, CheckUserRole, CheckBhagID, CheckNagarID, CheckVastiID;
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    CheckUserRole = ((req.body.UserRole) ? ({ $in: [req.body.UserRole] }) : { $nin: [] });
    CheckUserStatus = ((req.body.UserStatus) ? ({ $in: [req.body.UserStatus] }) : { $nin: [] });
    CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
    CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
    CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
    CheckSanghShikshanID = ((req.body.SanghShikshanID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SanghShikshanID)] }) : { $nin: [] });
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
                    "localField": "UserMaster.UserID",
                    "from": "UserMaster",
                    "foreignField": "_id",
                    "as": "SuperUserMaster"
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
           
            {
                "$lookup": {
                    "localField": "UserMaster.SanghShikshanID",
                    "from": "SanghShikshan",
                    "foreignField": "_id",
                    "as": "SanghShikshan"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster._id",
                    "from": "UserBhagDetail",
                    "foreignField": "UserID",
                    "as": "UserBhagDetail"
                }
            },
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
                    "as": "Nagar",
                    "pipeline": [
                        {
                            "$match": { 'IsActive': { '$eq': true } },
                        }]
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
                    "as": "Vasti",
                    "pipeline": [
                        {
                            "$match": { 'IsActive': { '$eq': true } },
                        }]
                }
            },
            {
                "$match": {
                    "UserMaster._id": CheckSearchID,
                    "UserMaster.MobileNo": CheckSearchMobilenO,
                    "UserMaster.UserRole": CheckUserRole,
                    "UserMaster.UserStatus": CheckUserStatus,
                    "UserBhagDetail.BhagID": CheckBhagID,
                    "UserNagarDetail.NagarID": CheckNagarID,
                    "UserVastiDetail.VastiID": CheckVastiID,
                    "UserMaster.SanghShikshanID": CheckSanghShikshanID
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
                    "SuperUserName": "$SuperUserMaster.UserName",
                    "ShakhaMasterID": "$UserMaster.ShakhaMasterID",
                    "ShakhaName": "$ShakhaMaster.ShakhaName",
                    "ResponsibilityID": "$UserMaster.ResponsibilityID",
                    "ResponsibilityName": "$Responsibility.ResponsibilityName",
                    "SanghShikshanID": "$UserMaster.SanghShikshanID",
                    "SanghShikshanName": "$SanghShikshan.SanghShikshanName",
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
                    "Type": "$UserMaster.Type",
                    "Photo": "$UserMaster.Photo",
                    "SubType": "$UserMaster.SubType",
                    "UserType": "$UserMaster.UserType",
                    "UserRole": "$UserMaster.UserRole",
                    "UserStatus": "$UserMaster.UserStatus",
                    "SubType": "$UserMaster.SubType",
                    "IsActive": "$UserMaster.IsActive",
                    "IsDelete": "$UserMaster.IsDelete",
                    "CreatedDate": "$UserMaster.CreatedDate",
                    "MainAnnadanStatus": "$UserMaster.MainAnnadanStatus",
                    "MainAddUserStatus": "$UserMaster.MainAddUserStatus",
                    "MainCollectionStatus": "$UserMaster.MainCollectionStatus",
                    "MainUserCollectionStatus": "$UserMaster.MainUserCollectionStatus",
                    "UniqueCollectionNumber": "$UserMaster.UniqueCollectionNumber"
                }
            }
        ]);
    return userdata;
}
async function BindUserDataFetch(UserID) {
    var CheckSearchID = ((UserID) ? ({ $in: [mongoose.Types.ObjectId(UserID)] }) : { $nin: [] });
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
            {
                "$lookup": {
                    "localField": "UserMaster.SanghShikshanID",
                    "from": "SanghShikshan",
                    "foreignField": "_id",
                    "as": "SanghShikshan"
                }
            },
            {
                "$lookup": {
                    "localField": "UserMaster._id",
                    "from": "UserBhagDetail",
                    "foreignField": "UserID",
                    "as": "UserBhagDetail"
                }
            },
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
                    "UserMaster._id": CheckSearchID
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
                    "ShakhaMasterID": "$UserMaster.ShakhaMasterID",
                    "ShakhaName": "$ShakhaMaster.ShakhaName",
                    "ResponsibilityID": "$UserMaster.ResponsibilityID",
                    "ResponsibilityName": "$Responsibility.ResponsibilityName",
                    "SanghShikshanID": "$UserMaster.SanghShikshanID",
                    "SanghShikshanName": "$SanghShikshan.SanghShikshanName",
                    "UserBhagDetail": "$UserBhagDetail",
                    "UserBhagName": "$Bhag",
                    "UserBhagName1": "$Bhag._id",
                    "UserNagarDetail": "$UserNagarDetail",
                    "UserNagarName": "$Nagar",
                    "UserNagarName1": "$Nagar._id",
                    "UserVastiDetail": "$UserVastiDetail",
                    "UserVastiName": "$Vasti",
                    "UserVastiName1": "$Vasti._id",
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
                    "Type": "$UserMaster.Type",
                    "Photo": "$UserMaster.Photo",
                    "SubType": "$UserMaster.SubType",
                    "UserType": "$UserMaster.UserType",
                    "UserRole": "$UserMaster.UserRole",
                    "UserStatus": "$UserMaster.UserStatus",
                    "SubType": "$UserMaster.SubType",
                    "IsActive": "$UserMaster.IsActive",
                    "IsDelete": "$UserMaster.IsDelete",
                    "CreatedDate": "$UserMaster.CreatedDate"
                }
            }
        ]);
    return userdata;
}
exports.ShowAllData = [async (req, res) => {
    try {
        let showall = await UserMasterModel.find({})
            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName', match: { IsActive: 'true' } } })
            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
            .sort({ '_id': -1 }).exec();
        return res.status(200).json({ status: 0, message: "Success.", data: showall, error: null });

    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewUserDataV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/AddUserDetail', {
                title: 'AddUserDetail', UserData: GetAllData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddUserV21 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let user = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {

                    let useradd = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address ? req.body.Address : "",
                        UserID: ((req.body.UserID) ? (req.body.UserID) : null),
                        UserRole: req.body.UserRole,
                        UserStatus: 'Complete',
                        Type: 'Panel'
                    }).save();
                    var ArrBhagData = req.body.ArrBhagData;
                    var ArrNagarData = req.body.ArrNagarData;
                    var ArrVastiData = req.body.ArrVastiData;
                    if (Array.isArray(ArrBhagData)) {
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            await UserBhagDetailModel({
                                BhagID: ArrBhagData[i],
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        await UserBhagDetailModel({
                            BhagID: ArrBhagData,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    }
                    if (Array.isArray(ArrNagarData)) {
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            let nagarbind = await NagarModel.findOne({
                                _id: ArrNagarData[i],
                            }).exec();
                            await UserNagarDetailModel({
                                NagarID: ArrNagarData[i],
                                BhagID: nagarbind.BhagID[i],
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        let nagarbind = await NagarModel.findOne({
                            _id: ArrNagarData,
                        }).exec();
                        await UserNagarDetailModel({
                            NagarID: ArrNagarData,
                            BhagID: nagarbind.BhagID,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    }
                    if (Array.isArray(ArrVastiData)) {
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            let vastibind = await VastiModel.findOne({
                                _id: ArrVastiData[i]
                            }).exec();
                            await UserVastiDetailModel({
                                VastiID: ArrVastiData[i],
                                NagarID: vastibind.NagarID,
                                BhagID: vastibind.BhagID,
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        let vastibind = await VastiModel.findOne({
                            _id: ArrVastiData,
                        }).exec();
                        await UserVastiDetailModel({
                            VastiID: ArrVastiData,
                            NagarID: vastibind.NagarID,
                            BhagID: vastibind.BhagID,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    }
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Inserted', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let user = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address ? req.body.Address : "";
                    UpdateData["UserID"] = ((req.body.UserID) ? (req.body.UserID) : null);
                    UpdateData["UserRole"] = req.body.UserRole;
                    await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    await UserBhagDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrBhagData = ((req.body.ArrBhagData) ? (req.body.ArrBhagData) : null);
                    if (Array.isArray(ArrBhagData)) {
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            await UserBhagDetailModel({
                                BhagID: ArrBhagData[i],
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        await UserBhagDetailModel({
                            BhagID: ArrBhagData,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    }
                    await UserNagarDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrNagarData = ((req.body.ArrNagarData) ? (req.body.ArrNagarData) : null);
                    if (Array.isArray(ArrNagarData)) {
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            let nagarbind = await NagarModel.findOne({
                                _id: ArrNagarData[i],
                            }).exec();
                            await UserNagarDetailModel({
                                NagarID: ArrNagarData[i],
                                BhagID: nagarbind.BhagID,
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        let nagarbind = await NagarModel.findOne({
                            _id: ArrNagarData,
                        }).exec();
                        await UserNagarDetailModel({
                            NagarID: ArrNagarData,
                            BhagID: nagarbind.BhagID,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    }
                    await UserVastiDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrVastiData = ((req.body.ArrVastiData) ? (req.body.ArrVastiData) : null);
                    if (Array.isArray(ArrVastiData)) {
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            let vastibind = await VastiModel.findOne({
                                _id: ArrVastiData[i],
                            }).exec();
                            await UserVastiDetailModel({
                                VastiID: ArrVastiData[i],
                                NagarID: vastibind.NagarID,
                                BhagID: vastibind.BhagID,
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else {
                        let vastibind = await VastiModel.findOne({
                            _id: ArrVastiData,
                        }).exec();
                        await UserVastiDetailModel({
                            VastiID: ArrVastiData,
                            NagarID: vastibind.NagarID,
                            BhagID: vastibind.BhagID,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    }

                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddUserV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let user = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    var UniqueCollectionNumber = otpGenerator.generate(10, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    let useradd = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address ? req.body.Address : "",
                        UserID: ((req.body.UserID) ? (req.body.UserID) : null),
                        UserRole: req.body.UserRole,
                        UserStatus: 'Complete',
                        UniqueCollectionNumber: UniqueCollectionNumber,
                        Type: 'Panel'
                    }).save();
                    var ArrBhagData = req.body.ArrBhagData;
                    var SingleBhagData = req.body.SingleBhagData;
                    if (ArrBhagData) {
                        if (Array.isArray(ArrBhagData)) {
                            for (let i = 0; i < ArrBhagData.length; i++) {
                                await UserBhagDetailModel({
                                    BhagID: ArrBhagData[i],
                                    UserID: useradd._id,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            await UserBhagDetailModel({
                                BhagID: ArrBhagData,
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleBhagData) {
                        await UserBhagDetailModel({
                            BhagID: SingleBhagData,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    } else {

                    }
                    var ArrNagarData = req.body.ArrNagarData;
                    var SingleNagarData = req.body.SingleNagarData;
                    if (ArrNagarData) {
                        if (Array.isArray(ArrNagarData)) {
                            for (let i = 0; i < ArrNagarData.length; i++) {
                                let nagarbind = await NagarModel.findOne({
                                    _id: ArrNagarData[i],
                                }).exec();
                                await UserNagarDetailModel({
                                    NagarID: ArrNagarData[i],
                                    BhagID: nagarbind.BhagID,
                                    UserID: useradd._id,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            let nagarbind = await NagarModel.findOne({
                                _id: ArrNagarData,
                            }).exec();
                            await UserNagarDetailModel({
                                NagarID: ArrNagarData,
                                BhagID: nagarbind.BhagID,
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleNagarData) {
                        await UserNagarDetailModel({
                            NagarID: SingleNagarData,
                            BhagID: SingleBhagData,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    } else {

                    }

                    var ArrVastiData = req.body.ArrVastiData;
                    var SingleVastiData = req.body.SingleVastiData;
                    if (ArrVastiData) {
                        if (Array.isArray(ArrVastiData)) {
                            for (let i = 0; i < ArrVastiData.length; i++) {
                                let vastibind = await VastiModel.findOne({
                                    _id: ArrVastiData[i]
                                }).exec();
                                await UserVastiDetailModel({
                                    VastiID: ArrVastiData[i],
                                    NagarID: vastibind.NagarID,
                                    BhagID: vastibind.BhagID,
                                    UserID: useradd._id,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            let vastibind = await VastiModel.findOne({
                                _id: ArrVastiData,
                            }).exec();
                            await UserVastiDetailModel({
                                VastiID: ArrVastiData,
                                NagarID: vastibind.NagarID,
                                BhagID: vastibind.BhagID,
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleVastiData) {
                        await UserVastiDetailModel({
                            VastiID: SingleVastiData,
                            NagarID: SingleNagarData,
                            BhagID: SingleBhagData,
                            UserID: useradd._id,
                            Type: 'Panel'
                        }).save();
                    } else {

                    }
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Inserted', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let user = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address ? req.body.Address : "";
                    UpdateData["UserRole"] = req.body.UserRole;
                    await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    var deletebhag = await UserBhagDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrBhagData = req.body.ArrBhagData;
                    var SingleBhagData = req.body.SingleBhagData;
                    if (ArrBhagData) {
                        if (Array.isArray(ArrBhagData)) {
                            for (let i = 0; i < ArrBhagData.length; i++) {
                                await UserBhagDetailModel({
                                    BhagID: ArrBhagData[i],
                                    UserID: req.body.ID,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            await UserBhagDetailModel({
                                BhagID: ArrBhagData,
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleBhagData) {
                        await UserBhagDetailModel({
                            BhagID: SingleBhagData,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    }
                    var deletenagar = await UserNagarDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrNagarData = req.body.ArrNagarData;
                    var SingleNagarData = req.body.SingleNagarData;
                    if (ArrNagarData) {
                        if (Array.isArray(ArrNagarData)) {
                            for (let i = 0; i < ArrNagarData.length; i++) {
                                let nagarbind = await NagarModel.findOne({
                                    _id: ArrNagarData[i],
                                }).exec();
                                await UserNagarDetailModel({
                                    NagarID: ArrNagarData[i],
                                    BhagID: nagarbind.BhagID,
                                    UserID: req.body.ID,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            let nagarbind = await NagarModel.findOne({
                                _id: ArrNagarData,
                            }).exec();
                            await UserNagarDetailModel({
                                NagarID: ArrNagarData,
                                BhagID: nagarbind.BhagID,
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleNagarData) {
                        await UserNagarDetailModel({
                            NagarID: SingleNagarData,
                            BhagID: SingleBhagData,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    } 
                    await UserVastiDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                    var ArrVastiData = req.body.ArrVastiData;
                    var SingleVastiData = req.body.SingleVastiData;
                    if (ArrVastiData) {
                        if (Array.isArray(ArrVastiData)) {
                            for (let i = 0; i < ArrVastiData.length; i++) {
                                let vastibind = await VastiModel.findOne({
                                    _id: ArrVastiData[i],
                                }).exec();
                                await UserVastiDetailModel({
                                    VastiID: ArrVastiData[i],
                                    NagarID: vastibind.NagarID,
                                    BhagID: vastibind.BhagID,
                                    UserID: req.body.ID,
                                    Type: 'Panel'
                                }).save();
                            }
                        } else {
                            let vastibind = await VastiModel.findOne({
                                _id: ArrVastiData,
                            }).exec();
                            await UserVastiDetailModel({
                                VastiID: ArrVastiData,
                                NagarID: vastibind.NagarID,
                                BhagID: vastibind.BhagID,
                                UserID: req.body.ID,
                                Type: 'Panel'
                            }).save();
                        }
                    } else if (SingleVastiData) {
                        await UserVastiDetailModel({
                            VastiID: SingleVastiData,
                            NagarID: SingleNagarData,
                            BhagID: SingleBhagData,
                            UserID: req.body.ID,
                            Type: 'Panel'
                        }).save();
                    } else {

                    }
                    res.render('./PanelUser/AddUserDetail', { title: 'AddUserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.FindByIDUserV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            var UserID = req.params.ID
            let FetchData = await BindUserDataFetch(UserID);
            if (req.params.ID) {
                res.render('./PanelUser/AddUserDetail', {
                    title: 'AddUserDetail', UserData: GetAllData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: FetchData, alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.params.ID
                });
            } else {
                res.render('./PanelUser/AddUserDetail', {
                    title: 'AddUserDetail', UserData: GetAllData,
                    BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: FetchData, alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
                });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
    }
}];
exports.GetAllUserV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let SanghShikshanData = await SanghShikshanModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/ViewUser', {
                title: 'ViewUser', UserData: GetAllData, SanghShikshanData: SanghShikshanData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.PanelUserStatusV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var PanelUserStatus = ((req.params.Value) ? (req.params.Value) : { $nin: [] })
            var UpdateData = {};
            if (PanelUserStatus == 'false') {
                UpdateData["IsActive"] = "1";
            } else {
                UpdateData["IsActive"] = "0";
            }
            let AllData = await UserMasterModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            res.json({ status: 0, data: AllData });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingAllUserV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.MobileNo + '~' + req.body.UserRole + '~' + req.body.UserStatus + '~' + req.body.BhagID + '~' + req.body.NagarID + '~' + req.body.VastiID + '~' + req.body.SanghShikshanID;
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            let SanghShikshanData = await SanghShikshanModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            if (req.params.ID) {
                res.render('./PanelUser/ViewUser', { title: 'ViewUser', UserData: GetAllData, SanghShikshanData: SanghShikshanData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            } else {
                res.render('./PanelUser/ViewUser', { title: 'ViewUser', UserData: GetAllData, SanghShikshanData: SanghShikshanData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.BindNagarDropDownV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var arr = req.params.BhagID.split(',');
            var SearchBhagID = ((req.params.BhagID) ? ({ $in: arr }) : { $nin: [] });
            let NagarData = await NagarModel.find({
                IsActive: true,
                BhagID: SearchBhagID
            }).sort({ _id: -1 }).exec();
            var SearchData = req.params.BhagID;
            res.json({ status: 0, NagarData: NagarData, SearchData: SearchData });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.BindVastiDropDownV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var arr = req.params.NagarID.split(',');
            var SearchNagarID = ((req.params.NagarID) ? ({ $in: arr }) : { $nin: [] });
            let VastiData = await VastiModel.find({
                IsActive: true,
                NagarID: SearchNagarID,
            }).sort({ _id: -1 }).exec();
            var SearchData2 = req.params.NagarID;
            res.json({ status: 0, VastiData: VastiData, SearchData2: SearchData2 });
        } else {
            res.redirect('/Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.RemoveUserV2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            await UserMasterModel.deleteOne({ _id: req.params.ID }).exec();
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            let SanghShikshanData = await SanghShikshanModel.find({ IsActive: 'true' }).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/ViewUser', {
                title: 'ViewUser', UserData: GetAllData, SanghShikshanData: SanghShikshanData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: '', alertMessage: 'Successfully Delete', alertTitle: 'Delete', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportAllUserV2 = [async (req, res) => {
    try {
        let GetAllData = await BindUserData(req);
        var Result = [];
        var count = 1;
        GetAllData.forEach((udata) => {
            UserBhagdetail = [];
            UserNagardetail = [];
            UserVastidetail = [];
            udata.UserBhagName.forEach((doc) => {
                UserBhagdetail.push(doc.BhagName)
            });
            udata.UserNagarName.forEach((doc) => {
                UserNagardetail.push(doc.NagarName)
            });
            udata.UserVastiName.forEach((doc) => {
                UserVastidetail.push(doc.VastiName)
            });
            Result.push({
                "Sr.No.": count++,
                "UserName": udata.UserName,
                "UserRole": udata.UserRole,
                "MobileNo": udata.MobileNo,
                "UserStatus": udata.UserStatus,
                "Address": udata.Address ? udata.Address : "-",
                "OTP": udata.OTP ? udata.OTP : "-",
                "ShakhaName": udata.ShakhaName ? udata.ShakhaName.toString() : "-",
                "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                "VastiName": UserVastidetail ? UserVastidetail.toString() : "-",
                "LoginStatus": udata.LoginStatus ? udata.LoginStatus : "-",
                "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
            });

        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("User Detail");

        worksheet.columns = [
            { header: "Sr.no", key: "Sr.No.", width: 6 },
            { header: "User Role", key: "UserRole", width: 15 },
            { header: "User Name", key: "UserName", width: 20 },
            { header: "Mobile No", key: "MobileNo", width: 20 },
            { header: "Address", key: "Address", width: 20 },
            { header: "OTP", key: "OTP", width: 10 },
            { header: "Shakha Name", key: "ShakhaName", width: 20 },
            { header: "Bhag Name", key: "BhagName", width: 20 },
            { header: "Nagar Name", key: "NagarName", width: 20 },
            { header: "Vasti Name", key: "VastiName", width: 20 },
            { header: "User Status", key: "UserStatus", width: 20 },
            { header: "Login Status", key: "LoginStatus", width: 20 },
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
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportsUserLoginV2 = [async (req, res) => {
    try {
        let GetAllData = await BindUserData(req);
        var Result = [];
        var count = 1;
        GetAllData.forEach((udata) => {
            UserBhagdetail = [];
            UserNagardetail = [];
            UserVastidetail = [];
            // ShakhaNamedetail = [];
            udata.UserBhagName.forEach((doc) => {
                UserBhagdetail.push(doc.BhagName)
            });
            udata.UserNagarName.forEach((doc) => {
                UserNagardetail.push(doc.NagarName)
            });
            udata.UserVastiName.forEach((doc) => {
                UserVastidetail.push(doc.VastiName)
            });
            if (udata.LoginStatus == 'LogIn') {
                Result.push({
                    "Sr.No.": count++,
                    "UserName": udata.UserName,
                    "UserRole": udata.UserRole,
                    "MobileNo": udata.MobileNo,
                    "UserStatus": udata.UserStatus,
                    "Address": udata.Address ? udata.Address : "-",
                    "OTP": udata.OTP ? udata.OTP : "-",
                    // "ShakhaName": udata.ShakhaName ? udata.ShakhaName : "-",
                    "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                    "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                    "VastiName": UserVastidetail ? UserVastidetail.toString() : "-",
                    "LoginStatus": udata.LoginStatus ? udata.LoginStatus : "-",
                    // "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy'),
                    "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                });
            }
        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("User LogIn Detail");

        worksheet.columns = [
            { header: "Sr.no", key: "Sr.No.", width: 6 },
            { header: "User Role", key: "UserRole", width: 15 },
            { header: "User Name", key: "UserName", width: 20 },
            { header: "Mobile No", key: "MobileNo", width: 20 },
            { header: "Address", key: "Address", width: 20 },
            { header: "OTP", key: "OTP", width: 10 },
            { header: "Shakha Name", key: "ShakhaName", width: 20 },
            { header: "Bhag Name", key: "BhagName", width: 20 },
            { header: "Nagar Name", key: "NagarName", width: 20 },
            { header: "Vasti Name", key: "VastiName", width: 20 },
            { header: "User Status", key: "UserStatus", width: 20 },
            { header: "Login Status", key: "LoginStatus", width: 20 },

            // { header: "Entry Date", key: "CreatedDate", width: 18 },
            // { header: "Date", key: "EntryDate", width: 20 },
            { header: "Active/InActive", key: "IsActive", width: 15 },
        ];

        worksheet.spliceRows(1, 0, [])
        // Set title
        worksheet.getCell('A1').value = 'User LogIn Detail'

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
            "attachment; filename=" + "UserLoginDetail.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportsUserWithoutLoginV2 = [async (req, res) => {
    try {
        let GetAllData = await BindUserData(req);
        var Result = [];
        var count = 1;
        GetAllData.forEach((udata) => {
            UserBhagdetail = [];
            UserNagardetail = [];
            UserVastidetail = [];
            // ShakhaNamedetail = [];
            udata.UserBhagName.forEach((doc) => {
                UserBhagdetail.push(doc.BhagName)
            });
            udata.UserNagarName.forEach((doc) => {
                UserNagardetail.push(doc.NagarName)
            });
            udata.UserVastiName.forEach((doc) => {
                UserVastidetail.push(doc.VastiName)
            });
            if (udata.LoginStatus == '') {
                Result.push({
                    "Sr.No.": count++,
                    "UserName": udata.UserName,
                    "UserRole": udata.UserRole,
                    "MobileNo": udata.MobileNo,
                    "UserStatus": udata.UserStatus,
                    "Address": udata.Address ? udata.Address : "-",
                    "OTP": "-",
                    // "ShakhaName": udata.ShakhaName ? udata.ShakhaName : "-",
                    "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                    "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                    "VastiName": UserVastidetail ? UserVastidetail.toString() : "-",
                    "LoginStatus": udata.LoginStatus ? udata.LoginStatus : "-",
                    // "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy'),
                    "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                });
            }
        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("User LogIn Detail");

        worksheet.columns = [
            { header: "Sr.no", key: "Sr.No.", width: 6 },
            { header: "User Role", key: "UserRole", width: 15 },
            { header: "User Name", key: "UserName", width: 20 },
            { header: "Mobile No", key: "MobileNo", width: 20 },
            { header: "Address", key: "Address", width: 20 },
            { header: "OTP", key: "OTP", width: 10 },
            { header: "Shakha Name", key: "ShakhaName", width: 20 },
            { header: "Bhag Name", key: "BhagName", width: 20 },
            { header: "Nagar Name", key: "NagarName", width: 20 },
            { header: "Vasti Name", key: "VastiName", width: 20 },
            { header: "User Status", key: "UserStatus", width: 20 },
            { header: "Login Status", key: "LoginStatus", width: 20 },

            // { header: "Entry Date", key: "CreatedDate", width: 18 },
            // { header: "Date", key: "EntryDate", width: 20 },
            { header: "Active/InActive", key: "IsActive", width: 15 },
        ];

        worksheet.spliceRows(1, 0, [])
        // Set title
        worksheet.getCell('A1').value = 'User LogIn Detail'

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
            "attachment; filename=" + "UserLoginDetail.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UpdateUserAnnadanStatus = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var paramsUserID = req.params.UserID;
            var paramsAnnadanStatus = req.params.AnnadanStatus;

            var UpdateData = {};
            var UpdateRequest = {};
            if (paramsAnnadanStatus == 'true') {
                UpdateData["MainAnnadanStatus"] = false;
                UpdateRequest["AnnadanRequestStatus"] = "Complete";
            } else {
                UpdateData["MainAnnadanStatus"] = true;
                UpdateRequest["AnnadanRequestStatus"] = "Pending";
            }
            await UserMasterModel.updateOne({ _id: paramsUserID }, UpdateData).exec();
            // if (paramsAnnadanStatus == 'true') {
            //     UpdateRequest["AnnadanRequestStatus"] = "Pending";
            // } else {
            //     UpdateRequest["AnnadanRequestStatus"] = "Complete";
            // }
            await AnnadanRequestModel.updateMany({ UserID: paramsUserID }, UpdateRequest).exec();

            res.render('./PanelUser/ViewUser', {
                title: 'ViewUser', UserData: '', SanghShikshanData: '', BindData: '',
                BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UpdateMainCollectionStatus = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var paramsUserID = req.params.UserID;
            var paramsMainAddUserStatus = req.params.MainAddUserStatus;
            var UpdateData = {};
            if (paramsMainAddUserStatus == 'true') {
                UpdateData["MainAddUserStatus"] = false;
                UpdateData["MainCollectionStatus"] = false;
            } else {
                UpdateData["MainAddUserStatus"] = true;
                UpdateData["MainCollectionStatus"] = true;
            }
            await UserMasterModel.updateOne({ _id: paramsUserID }, UpdateData).exec();
            res.render('./PanelUser/ViewUser', {
                title: 'ViewUser', UserData: '', SanghShikshanData: '', BindData: '',
                BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
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