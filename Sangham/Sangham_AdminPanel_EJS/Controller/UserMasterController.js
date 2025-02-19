const UserMasterModel = require("../Model/UserMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ResponsibilityModel = require("../Model/ResponsibilityModel");
const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const PanelUserModel = require("../Model/PanelUserModel");
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
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
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
//------------------------------------------ App ----------------------------------------------------//
exports.SetUser = [async (req, res) => {
    try {
        if (!req.body.UserName) {
            res.json({ status: 0, message: "Please Enter User Name!", data: null, error: null });
        } else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No!", data: null, error: null });
        } else {
            let UserData = await UserMasterModel.findOne({ IsActive: true, MobileNo: req.body.MobileNo }).exec();
            if (UserData) {
                return res.status(200).json({ status: 1, message: "Mobile No is already Exit.", data: UserData, error: null });
            } else {
                var user = await UserMasterModel({
                    UserName: req.body.UserName,
                    MobileNo: req.body.MobileNo,
                    Address: req.body.Address,
                    Type: 'App'
                }).save();
                return res.status(200).json({ status: 1, message: "User Successfully Inserted.", data: user, error: null });
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SetRegister = [async (req, res) => {
    try {
        var ResponsibilityID = ((req.body.ResponsibilityID) ? (req.body.ResponsibilityID) : null);
        var SanghShikshanID = ((req.body.SanghShikshanID) ? (req.body.SanghShikshanID) : null);
        var UserID = ((req.body.UserID) ? (req.body.UserID) : null);
        if (!req.body.UserName) {
            res.json({ status: 0, message: "Please Enter User Name!", data: null, error: null });
        } else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let UserData = await UserMasterModel.findOne({ IsActive: true, MobileNo: req.body.MobileNo }).exec();
                if (UserData) {
                    return res.status(200).json({ status: 1, message: "Mobile No is already Exit.", data: UserData, error: null });
                } else {
                    console.log("req.body", req.body)
                    var user = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        SanghShikshanID: SanghShikshanID,
                        ResponsibilityID: ResponsibilityID,
                        UserID: UserID,
                        ShakhaName: req.body.ShakhaName,
                        Type: req.body.Type ? req.body.Type : "",
                        UserType: req.body.UserType ? req.body.UserType : "",
                        UserStatus: 'Complete'
                    }).save();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
                        console.log("ArrBhagData", req.body.ArrBhagData)
                        var ArrBhagData = req.body.ArrBhagData.split('~');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            console.log('======ArrBhagID=====', ArrBhagID)
                            bhagdata = await UserBhagDetailModel({
                                BhagID: ArrBhagID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                            console.log('======bhagdata=====', bhagdata.BhagID)
                        }
                    }
                    if (req.body.ArrNagarData) {
                        console.log("ArrNagarData", req.body.ArrNagarData)
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            console.log('======ArrNagarID=====', ArrNagarID)
                            Nagardata = await UserNagarDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: ArrNagarID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrVastiData) {
                        console.log("ArrVastiData", req.body.ArrVastiData)
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
                            console.log('======ArrVastiID=====', ArrVastiID)
                            Vastidata = await UserVastiDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: Nagardata.NagarID,
                                VastiID: ArrVastiID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    return res.status(200).json({ status: 1, message: "User Successfully Inserted.", data: user, error: null });
                }
            } else {
                let UserData = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, IsActive: true, MobileNo: req.body.MobileNo }).exec();
                if (UserData) {
                    return res.status(200).json({ status: 1, message: "Mobile No is already Exit.", data: UserData, error: null });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address;
                    UpdateData["ResponsibilityID"] = ResponsibilityID;
                    UpdateData["SanghShikshanID"] = SanghShikshanID;
                    UpdateData["UserID"] = UserID;
                    UpdateData["ShakhaName"] = req.body.ShakhaName;
                    UpdateData["Type"] = 'App';
                    UpdateData["UserType"] = req.body.UserType ? req.body.UserType : "";
                    let userdata = await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    // console.log("=======1212121212", req.body.ID);
                    console.log("=======1212121212", req.body);
                    var bhagdata, Nagardata, Vastidata;

                    if (req.body.ArrBhagData) {
                        console.log("ArrBhagData", req.body.ArrBhagData)
                        var ArrBhagData = req.body.ArrBhagData.split('~');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            if (ArrBhagID[1]) {
                                var UpdateData = {};
                                UpdateData["BhagID"] = ArrBhagID[0];
                                UpdateData["UserID"] = req.body.ID;
                                UpdateData["Type"] = 'App';
                                await UserBhagDetailModel.updateOne({ _id: ArrBhagID[1] }, UpdateData).exec();
                            }
                            else {
                                bhagdata = await UserBhagDetailModel({
                                    BhagID: ArrBhagID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                            }
                        }
                    }
                    if (req.body.ArrNagarData) {
                        console.log("ArrNagarData", req.body.ArrNagarData)
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            // console.log('======ArrNagarID=====', ArrNagarID)
                            if (ArrNagarID[1]) {
                                var UpdateData = {};
                                UpdateData["BhagID"] = req.body.BhagID;
                                UpdateData["NagarID"] = ArrNagarID[0];
                                // UpdateData["NagarID"] = req.body.ArrNagarData;
                                UpdateData["UserID"] = req.body.ID;
                                UpdateData["Type"] = 'App';
                                await UserNagarDetailModel.updateOne({ _id: ArrNagarID[1] }, UpdateData).exec();
                            } else {
                                Nagardata = await UserNagarDetailModel({
                                    BhagID: bhagdata.BhagID,
                                    NagarID: ArrNagarID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                            }
                        }
                    }

                    if (req.body.ArrVastiData) {
                        console.log("ArrVastiData", req.body.ArrVastiData)
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
                            // console.log('======ArrVastiID=====', ArrVastiID)
                            if (ArrVastiID[1]) {
                                var UpdateData = {};
                                UpdateData["BhagID"] = req.body.ArrBhagData;
                                UpdateData["NagarID"] = req.body.ArrNagarData;
                                UpdateData["VastiID"] = ArrVastiID[0];
                                UpdateData["UserID"] = req.body.ID;
                                UpdateData["Type"] = 'App';
                                await UserVastiDetailModel.updateOne({ _id: ArrVastiID[1] }, UpdateData).exec();
                            } else {
                                Vastidata = await UserVastiDetailModel({
                                    BhagID: req.body.ArrBhagData,
                                    NagarID: req.body.ArrNagarData,
                                    VastiID: ArrVastiID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                            }
                        }
                    }
                }
                return res.status(200).json({ status: 1, message: "User Successfully Updated.", data: null, error: null });
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SetRegister1 = [async (req, res) => {
    try {
        var ResponsibilityID = ((req.body.ResponsibilityID) ? (req.body.ResponsibilityID) : null);
        var SanghShikshanID = ((req.body.SanghShikshanID) ? (req.body.SanghShikshanID) : null);
        var UserID = ((req.body.UserID) ? (req.body.UserID) : null);
        if (!req.body.UserName) {
            res.json({ status: 0, message: "Please Enter User Name!", data: null, error: null });
        } else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let UserData = await UserMasterModel.findOne({ IsActive: true, MobileNo: req.body.MobileNo }).exec();
                if (UserData) {
                    return res.status(200).json({ status: 1, message: "Mobile No is already Exit.", data: UserData, error: null });
                } else {
                    console.log("req.body", req.body)
                    var user = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        SanghShikshanID: SanghShikshanID,
                        ResponsibilityID: ResponsibilityID,
                        UserID: UserID,
                        ShakhaName: req.body.ShakhaName,
                        UserType: req.body.UserType,
                        UserRole: req.body.UserRole ? req.body.UserRole : 'NormalUser',
                        UserStatus: 'Complete',
                        Type: 'App'
                    }).save();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
                        console.log("ArrBhagData", req.body.ArrBhagData)
                        var ArrBhagData = req.body.ArrBhagData.split('~');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            console.log('======ArrBhagID=====', ArrBhagID)
                            bhagdata = await UserBhagDetailModel({
                                BhagID: ArrBhagID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                            console.log('======bhagdata=====', bhagdata.BhagID)
                        }
                    }
                    if (req.body.ArrNagarData) {
                        console.log("ArrNagarData", req.body.ArrNagarData)
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            console.log('======ArrNagarID=====', ArrNagarID)
                            Nagardata = await UserNagarDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: ArrNagarID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrVastiData) {
                        console.log("ArrVastiData", req.body.ArrVastiData)
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
                            console.log('======ArrVastiID=====', ArrVastiID)
                            Vastidata = await UserVastiDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: Nagardata.NagarID,
                                VastiID: ArrVastiID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    return res.status(200).json({ status: 1, message: "User Successfully Inserted.", data: user, error: null });
                }
            } else {
                let UserData = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, IsActive: true, MobileNo: req.body.MobileNo }).exec();
                if (UserData) {
                    return res.status(200).json({ status: 1, message: "Mobile No is already Exit.", data: UserData, error: null });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address;
                    UpdateData["ResponsibilityID"] = ResponsibilityID;
                    UpdateData["SanghShikshanID"] = SanghShikshanID;
                    UpdateData["UserID"] = UserID;
                    UpdateData["ShakhaName"] = req.body.ShakhaName;
                    UpdateData["UserType"] = req.body.UserType;
                    UpdateData["UserRole"] = req.body.UserRole;
                    UpdateData["Type"] = 'App';
                    let userdata = await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    // console.log("=======1212121212", req.body.ID);
                    console.log("=======1212121212", req.body);
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ID) {
                        await UserBhagDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                        if (req.body.ArrBhagData) {
                            console.log("ArrBhagData", req.body.ArrBhagData)
                            var ArrBhagData = req.body.ArrBhagData.split('~');
                            for (let i = 0; i < ArrBhagData.length; i++) {
                                var ArrBhagID = ArrBhagData[i].split('@');
                                console.log('======ArrBhagID=====', ArrBhagID)
                                bhagdata = await UserBhagDetailModel({
                                    BhagID: ArrBhagID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                                console.log('======bhagdata=====', bhagdata.BhagID)
                            }
                        }
                        await UserNagarDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                        if (req.body.ArrNagarData) {
                            console.log("ArrNagarData", req.body.ArrNagarData)
                            var ArrNagarData = req.body.ArrNagarData.split('~');
                            for (let i = 0; i < ArrNagarData.length; i++) {
                                var ArrNagarID = ArrNagarData[i].split('@');
                                console.log('======ArrNagarID=====', ArrNagarID)
                                Nagardata = await UserNagarDetailModel({
                                    BhagID: bhagdata.BhagID,
                                    NagarID: ArrNagarID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                            }
                        }
                        await UserVastiDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                        if (req.body.ArrVastiData) {
                            console.log("ArrVastiData", req.body.ArrVastiData)
                            var ArrVastiData = req.body.ArrVastiData.split('~');
                            for (let i = 0; i < ArrVastiData.length; i++) {
                                var ArrVastiID = ArrVastiData[i].split('@');
                                console.log('======ArrVastiID=====', ArrVastiID)
                                Vastidata = await UserVastiDetailModel({
                                    BhagID: bhagdata.BhagID,
                                    NagarID: Nagardata.NagarID,
                                    VastiID: ArrVastiID[0],
                                    UserID: req.body.ID,
                                    Type: 'App'
                                }).save();
                            }
                        }
                    }
                }
                return res.status(200).json({ status: 1, message: "User Successfully Updated.", data: null, error: null });
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
async function BindUserData(req) {
    var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    var CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    // var CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    // var uBhag = await UserBhagDetailModel.find({ "UserID": mongoose.Types.ObjectId(req.body.ID) }).exec()
    // console.log(uBhag)

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
            //         "localField": "UserMaster.UserID",
            //         "from": "UserMaster",
            //         "foreignField": "_id",
            //         "as": "SuperUserMaster"
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
                    "as": "Bhag"
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
                    "UserMaster.IsActive": true,
                    "UserMaster.IsDelete": false,
                    // "UserMaster.UserType": "SuperUser",
                    // "UserMaster.UserStatus": "Complete",
                    "UserMaster._id": CheckSearchID,
                    "UserMaster.MobileNo": CheckSearchMobilenO,
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
                    // "SuperUserID": "$UserMaster.UserID",
                    // "SuperUserName": "$SuperUserMaster.UserName",
                    "ShakhaMasterID": "$UserMaster.ShakhaMasterID",
                    "ShakhaName": "$ShakhaMaster.ShakhaName",
                    "ResponsibilityID": "$UserMaster.ResponsibilityID",
                    "ResponsibilityName": "$Responsibility.ResponsibilityName",
                    "SanghShikshanID": "$UserMaster.SanghShikshanID",
                    "SanghShikshanName": "$SanghShikshan.SanghShikshanName",
                    // "NormalUserName": "$UserMaster.UserName",
                    "UserBhagDetail": "$UserBhagDetail",
                    "UserBhagName": "$Bhag",
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
                    "LoginStatus": "$UserMaster.LoginStatus",
                    // "ShakhaName": "$UserMaster.ShakhaName",
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
    // console.log("====userdata====", userdata)
    return userdata;
}
exports.GetUser = [async (req, res) => {
    try {
        let UserData = await UserMasterModel.find({ IsActive: true })
            .populate('SanghShikshanID').sort({ '_id': -1 }).exec();
        //let UserData = await BindUserData(req);
        return res.status(200).json({ status: 1, message: "Success.", data: UserData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetUser2 = [async (req, res) => {
    try {
        // let UserData = await UserMasterModel.find({ IsActive: true }).exec();
        let UserData = await BindUserData(req);
        return res.status(200).json({ status: 1, message: "Success.", data: UserData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetUser1 = [async (req, res) => {
    try {
        // let UserData = await UserMasterModel.find({ IsActive: true }).exec();
        let UserData = await BindUserData(req);
        if (UserData.length > 0) {
            var GetAllData = [], UserBhagDetail = [], UserBhagName = [], UserNagarName = [],
                UserNagarDetail = [], UserVastiDetail = [], UserVastiName = [];
            UserData[0].UserBhagDetail.forEach((doc) => {
                UserBhagDetail.push(doc._id)
            });
            UserData[0].UserBhagName.forEach((doc) => {
                UserBhagName.push(doc.BhagName)
            });
            UserData[0].UserNagarDetail.forEach((doc) => {
                UserNagarDetail.push(doc._id)
            });
            UserData[0].UserNagarName.forEach((doc) => {
                UserNagarName.push(doc.NagarName)
            });
            UserData[0].UserVastiDetail.forEach((doc) => {
                UserVastiDetail.push(doc._id)
            });
            UserData[0].UserVastiName.forEach((doc) => {
                UserVastiName.push(doc.VastiName)
            });
            GetAllData.push({
                BhagID: UserBhagDetail ? UserBhagDetail.toString() : "",
                BhagName: UserBhagName ? UserBhagName.toString() : "",
                NagarID: UserNagarDetail ? UserNagarDetail.toString() : "",
                NagarName: UserNagarName ? UserNagarName.toString() : "",
                VastiID: UserVastiDetail.length > 0 ? UserVastiDetail.toString() : "",
                VastiName: UserVastiName.length > 0 ? UserVastiName.toString() : "",
            });
            return res.status(200).json({ status: 1, message: "Success.", data: GetAllData, Userdata: UserData, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Success.", data: null, error: null });
        }
        // return res.status(200).json({ status: 1, message: "Success.", data: UserData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UserLogin1 = [async (req, res) => {
    try {
        if (!req.body.MobileNo) { return res.json({ status: 0, Message: "Please Enter MobileNo", data: null }) }
        else {
            let UserData = await BindUserData(req);
            if (!UserData) {
                return res.status(200).json({ status: 0, message: "Mobile No is Not available.", error: null });
            } else {
                // if (UserData.length > 0) {
                //     return rsses.status(200).json({ status: 0, message: "Mobile No is Not available.", error: null });
                // }
                if (UserData[0].IsActive == false && UserData[0].IsADelete == true) {
                    return res.status(200).json({ status: 0, message: "User is InActive", error: null });
                }
                else if (UserData[0].UserStatus == "Pending") {
                    return res.status(200).json({ status: 0, message: "Mobile No is Not available.", error: null });
                } else {
                    var OTPGenerat = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    var Updatedata = {};
                    Updatedata["OTP"] = OTPGenerat;
                    Updatedata["LoginStatus"] = 'LogIn';
                    UserData.OTP = OTPGenerat;
                    let updateOTP = await UserMasterModel.updateOne({ MobileNo: req.body.MobileNo, IsActive: true, IsDelete: false }, Updatedata);
                    // if (UserData[0].MobileNo) {
                    //     axios
                    //         .get('http://173.45.76.227/send.aspx?username=smtech1&pass=smtech123&route=trans1&senderid=SMTCPL&numbers=' + UserData[0].MobileNo + '&source=SMTCPL&message=' + "Thank you for the login your OTP is " + OTPGenerat + " SM Techno Consultants")
                    //         .then(res => {
                    //             console.log(`statusCode: ${res.status}`)
                    //         })
                    //         .catch(error => {
                    //             console.error(error)
                    //         });
                    // }
                    console.log('========================', OTPGenerat)
                    console.log('========================', updateOTP)
                    updateOTP = await BindUserData(req);
                    return res.status(200).json({ status: 1, message: "User Successfully Login.", data: updateOTP, error: null });
                }
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UserLogin = [async (req, res) => {
    try {
        if (!req.body.MobileNo) { return res.json({ status: 0, Message: "Please Enter MobileNo", data: null }) }
        else {
            // let UserData = await BindUserData(req);
            let UserData = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo })
                .populate({ path: 'ResponsibilityID', select: 'ResponsibilityName' })
                .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName' })
                .populate({ path: 'BhagDetail', select: 'BhagID' })
                .populate({ path: 'NagarDetail', select: 'NagarID' })
                .populate({ path: 'VastiDetail', select: 'VastiID' }).exec();
            if (!UserData) {
                return res.status(200).json({ status: 0, message: "Mobile No is Not available.", data: UserData, error: null });
            } else {
                if (UserData.IsActive == 0) {
                    return res.status(200).json({ status: 0, message: "User is InActive", error: null });
                } else {
                    var OTPGenerat = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    var Updatedata = {};
                    Updatedata["OTP"] = OTPGenerat;
                    UserData.OTP = OTPGenerat;
                    let updateOTP = await UserMasterModel.updateOne({ MobileNo: req.body.MobileNo }, Updatedata);
                    if (UserData.MobileNo) {
                        axios
                            .get('http://173.45.76.227/send.aspx?username=smtech1&pass=smtech123&route=trans1&senderid=SMTCPL&numbers=' + UserData.MobileNo + '&source=SMTCPL&message=' + "Thank you for the login your OTP is " + OTPGenerat + " SM Techno Consultants")
                            .then(res => {
                                console.log(`statusCode: ${res.status}`)
                            })
                            .catch(error => {
                                console.error(error)
                            });
                    }
                    // console.log('========================', OTPGenerat)
                    // console.log('========================', updateOTP)
                    let BhagID = UserData.BhagDetail.map(function (elem) {
                        return elem.BhagID;
                    }).join(",");
                    // let BhagName = UserData.BhagID.map(function (elem) {
                    //     return elem.BhagName;
                    // }).join(",");

                    let NagarID = UserData.NagarDetail.map(function (elem) {
                        return elem.NagarID;
                    }).join(",");

                    let VastiID = UserData.VastiDetail.map(function (elem) {
                        return elem.VastiID;
                    }).join(",");

                    var AllData = [];
                    AllData.push({
                        _id: UserData._id,
                        UserName: UserData.UserName,
                        MobileNo: UserData.MobileNo,
                        Address: UserData.Address,
                        ResponsibilityID: UserData.ResponsibilityID ? UserData.ResponsibilityID._id : "",
                        ResponsibilityName: UserData.ResponsibilityID ? UserData.ResponsibilityID.ResponsibilityName : "",
                        SanghShikshanID: UserData.SanghShikshanID ? UserData.SanghShikshanID._id : "",
                        SanghShikshanName: UserData.SanghShikshanID ? UserData.SanghShikshanID.SanghShikshanName : "",
                        ShakhaName: UserData.ShakhaName,
                        Type: UserData.Type,
                        IsActive: UserData.IsActive,
                        IsDelete: UserData.IsDelete,
                        OTP: UserData.OTP,
                        BhagID: BhagID,
                        // BhagName: BhagID.BhagName,
                        NagarID: NagarID,
                        VastiID: VastiID,
                        CreatedDate: UserData.CreatedDate
                    });
                    console.log('========================', AllData)
                    // let Usermaster = await BindUserData(req);
                    return res.status(200).json({ status: 1, message: "User Successfully Login.", data: AllData, error: null });
                }
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddUserPanel = [async (req, res) => {
    try {
        if (!req.body.UserName) {

            //var Password = CryptoJS.AES.encrypt("", "$@ff!erInd!@#6713").toString();
            //var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "$@ff!erInd!@#6713").toString();

            res.json({ status: 0, message: "Please Enter User Name!", data: null, error: null });
        } else if (!req.body.Password) {
            res.json({ status: 0, message: "Please Enter Password!", data: null, error: null });
        } else {
            let UserData = await PanelUserModel.findOne({ IsActive: true, UserName: req.body.UserName }).exec();
            if (UserData) {
                return res.status(200).json({ status: 1, message: "UserName Alreday Exit.", data: UserData, error: null });
            } else {
                var ciphertext = CryptoJS.AES.encrypt(req.body.Password, "$@ff!erInd!@#6713").toString();
                var user = await PanelUserModel({
                    UserName: req.body.UserName,
                    Password: ciphertext,
                    CodeBook: req.body.Password,
                    Type: ''
                }).save();
                return res.status(200).json({ status: 1, message: "User Successfully Inserted.", data: user, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: k0err.message, data: null, error: null });
    }
}];
exports.SetMobileNo = [async (req, res) => {
    try {
        if (req.body.ArrUserData) {
            ArrUserData = req.body.ArrUserData.split('~');
            for (let i = 0; i < ArrUserData.length; i++) {
                var ArrUserID = ArrUserData[i];
                // console.log('======ArrUserID=====', ArrUserID)
                let useradd = await UserMasterModel.findOne({
                    MobileNo: ArrUserData[i],
                    IsActive: true
                }).exec();
                if (useradd) {
                    return res.status(200).json({ status: 0, Message: "Mobile Number Already Exit.", data: useradd, error: null });
                } else {
                    await new UserMasterModel({
                        UserID: req.body.ID,
                        MobileNo: ArrUserData[i],
                        UserType: 'NormalUser',
                        // UserRole: 'NormalUser',
                        UserStatus: 'Pending'
                    }).save();
                }
            }
            return res.status(200).json({ status: 1, Message: "Successfully Inserted.", data: null, error: null });
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetRegister2 = [async (req, res) => {
    try {
        var ResponsibilityID = ((req.body.ResponsibilityID) ? (req.body.ResponsibilityID) : null);
        var SanghShikshanID = ((req.body.SanghShikshanID) ? (req.body.SanghShikshanID) : null);
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Photo");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                res.json({ status: 0, Message: ImageError, data: null, error: null });
            } else {
                if (!req.body.MobileNo) {
                    res.json({ status: 0, message: "Please Enter Mobile No!", data: null, error: null });
                } else {
                    if (req.body.MobileNo) {
                        let userfind = await UserMasterModel.findOne({
                            IsActive: true,
                            MobileNo: req.body.MobileNo,
                            UserType: 'NormalUser',
                            // UserRole: 'NormalUser',
                        }).exec();
                        if (!userfind) {
                            return res.status(200).json({ status: 1, message: "Mobile is Not Availabele.", data: userfind, error: null });
                        } else {
                            if (userfind.UserStatus == 'Complete') {
                                return res.status(200).json({ status: 1, message: "User Already Registerd.", data: userfind, error: null });
                            } else {
                                var UpdateData = {};
                                UpdateData["UserName"] = req.body.UserName;
                                // UpdateData["MobileNo"] = req.body.MobileNo;
                                UpdateData["Address"] = req.body.Address;
                                UpdateData["ResponsibilityID"] = ((req.body.ResponsibilityID) ? (req.body.ResponsibilityID) : null);
                                UpdateData["SanghShikshanID"] = ((req.body.SanghShikshanID) ? (req.body.SanghShikshanID) : null);
                                UpdateData["ShakhaMasterID"] = ((req.body.ShakhaMasterID) ? (req.body.ShakhaMasterID) : null);
                                UpdateData["Star"] = req.body.Star;
                                UpdateData["Javabadari"] = req.body.Javabadari;
                                UpdateData["KaryavahType"] = req.body.KaryavahType;
                                UpdateData["SangathanType"] = req.body.SangathanType;
                                UpdateData["SangathanPramukhType"] = req.body.SangathanPramukhType;
                                UpdateData["JagranType"] = req.body.JagranType;
                                UpdateData["JagranPramukhType"] = req.body.JagranPramukhType;
                                UpdateData["GatividhiType"] = req.body.GatividhiType;
                                UpdateData["GatividhiPramukhType"] = req.body.GatividhiPramukhType;
                                UpdateData["VastiPramukhType"] = req.body.VastiPramukhType;
                                UpdateData["SakhaType"] = req.body.SakhaType;
                                if (req.file) {
                                    UpdateData["Photo"] = req.file.filename;
                                }
                                UpdateData["Type"] = 'App';
                                UpdateData["UserStatus"] = 'Complete';
                                let userdata = await UserMasterModel.updateOne({ _id: userfind._id }, UpdateData).exec();

                                var bhagdata, Nagardata, Vastidata;
                                // if (req.body.ID) {
                                // await UserBhagDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                                if (req.body.ArrBhagData) {
                                    console.log("ArrBhagData", req.body.ArrBhagData)
                                    var ArrBhagData = req.body.ArrBhagData.split('~');
                                    for (let i = 0; i < ArrBhagData.length; i++) {
                                        var ArrBhagID = ArrBhagData[i].split('@');
                                        console.log('======ArrBhagID=====', ArrBhagID)
                                        bhagdata = await UserBhagDetailModel({
                                            BhagID: ArrBhagID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                        console.log('======bhagdata=====', bhagdata.BhagID)
                                    }
                                }
                                // await UserNagarDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                                if (req.body.ArrNagarData) {
                                    console.log("ArrNagarData", req.body.ArrNagarData)
                                    var ArrNagarData = req.body.ArrNagarData.split('~');
                                    for (let i = 0; i < ArrNagarData.length; i++) {
                                        var ArrNagarID = ArrNagarData[i].split('@');
                                        console.log('======ArrNagarID=====', ArrNagarID)
                                        Nagardata = await UserNagarDetailModel({
                                            BhagID: bhagdata.BhagID,
                                            NagarID: ArrNagarID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                    }
                                }
                                // await UserVastiDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                                if (req.body.ArrVastiData) {
                                    console.log("ArrVastiData", req.body.ArrVastiData)
                                    var ArrVastiData = req.body.ArrVastiData.split('~');
                                    for (let i = 0; i < ArrVastiData.length; i++) {
                                        var ArrVastiID = ArrVastiData[i].split('@');
                                        console.log('======ArrVastiID=====', ArrVastiID)
                                        Vastidata = await UserVastiDetailModel({
                                            BhagID: bhagdata.BhagID,
                                            NagarID: Nagardata.NagarID,
                                            VastiID: ArrVastiID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                    }
                                }
                                //}
                                return res.status(200).json({ status: 1, message: "Register Success.", data: userdata, error: null });
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetProfile = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("Photo");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                res.json({ status: 0, Message: ImageError, data: null, error: null });
            } else {
                if (req.body.ID) {
                    let userfind = await UserMasterModel.findOne({
                        IsActive: true,
                        MobileNo: req.body.MobileNo
                    }).exec();
                    if (!userfind) {
                        return res.status(200).json({ status: 1, message: "Mobile is Not Availabele.", data: userfind, error: null });
                    } else {
                        if (userfind.UserStatus == 'Complete' || userfind.UserType == 'SuperUser') {
                            var UpdateData = {};
                            UpdateData["UserName"] = req.body.UserName;
                            UpdateData["MobileNo"] = req.body.MobileNo;
                            UpdateData["Address"] = req.body.Address;
                            if (req.file) {
                                UpdateData["Photo"] = req.file.filename;
                            }
                            UpdateData["Type"] = 'App';
                            UpdateData["UserStatus"] = 'Complete';
                            let userdata = await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                            return res.status(200).json({ status: 1, message: "Profile Success Update", data: userdata, error: null });
                        } else {
                            return res.status(200).json({ status: 0, message: "Profile not Update", data: null, error: null });
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UpdateUserStatusById = [async (req, res) => {
    try {
        var query = {}
        if (req.body.UserID) {
            console.log("req.body.UserID=====>", req.body.UserID)
            query = { _id: req.body.UserID, IsActive: true }
        }
        console.log(query, req.body)
        await UserMasterModel.updateOne(query, req.body.newdata);
        return res.status(200).json({ status: 1, Message: "Succesfully saved.", error: null });
    } catch (error) {
        console.log(error)
        save(req, error.message); return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];
exports.UpdateAllUserStatus = [async (req, res) => {
    try {
        var query = {}
        if (!req.body.UserID) {
            query = { _id: req.body.UserID, IsActive: true }
        }
        console.log(req.body.newdata)
        await UserMasterModel.updateMany(query, req.body.newdata);
        return res.status(200).json({ status: 1, Message: "Succesfully saved.", error: null });
    } catch (error) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UserDeleteApp = [async (req, res) => {
    try {
        var UpdateData = {};
        UpdateData["IsActive"] = false;
        UpdateData["IsDelete"] = true;
        await UserMasterModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
        console.log("===gfh==", UpdateData)
        // let Userdetail = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
        return res.status(200).json({ status: 1, message: "Successfully Deleted.", data: UpdateData, error: null })
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetAccountDeleteV2 = [async (req, res) => {
    try {
        var VersionParameter = req.body.VersionParameter ?? "";
        var Status = false;
        //if (VersionParameter === "1.0") { Status = true }
        return res.status(200).json({ status: 1, message: "done", data: Status, error: null })
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
// MyModel.findOneAndUpdate(query, req.newData, { upsert: true }, function (err, doc) {
//     if (err) return res.send(500, { error: err });
//     return res.send('Succesfully saved.');
// });
//---------------------------------------  Panel -------------------------------------------------------//

exports.GetPanelLogin = [async (req, res) => {
    try {
        let UserData = await PanelUserModel.find().sort({ _id: 1 }).exec();
        res.render('./PanelUser/Splash', { Data: UserData, alertMessage: '', alertTitle: '', cookieData: '' });
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.PanelUserLogin = [async (req, res) => {
    try {
        let user = await PanelUserModel.findOne({ UserName: req.body.UserName }).sort({ _id: 1 }).exec();
        if (!user) {
            res.render('./PanelUser/Splash', { Data: '', alertTitle: 'Invalid', alertMessage: 'Please Enter Correct UserName!', cookieData: '' });
        } else {
            var bytes = CryptoJS.AES.decrypt(user.Password, "$@ff!erInd!@#6713");
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (originalText === req.body.Password) {
                res.cookie("admindata", user, {
                    maxAge: 1000 * 3600 // 1 hour
                });
                res.render('./PanelUser/Splash', { Data: '', alertTitle: 'Success', alertMessage: 'Login Successful!', cookieData: '' });
            } else {
                res.clearCookie("admindata");
                res.render('./PanelUser/Splash', { Data: '', alertTitle: 'Invalid', alertMessage: 'Please Enter Correct Password!', cookieData: '' });
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AdminLogout = [async (req, res) => {
    try {
        res.clearCookie("admindata");
        res.redirect('./Splash');
    } catch (err) {
        res.send(err.message);
    }
}];
exports.ViewUserData1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let Userdetail = await UserMasterModel.find({}).sort({ _id: -1 }).exec();
            if (Userdetail.length > 0) {
                let GetAllData = [];
                Userdetail.forEach((udata) => {
                    GetAllData.push({
                        _id: udata._id,
                        UserName: udata.UserName,
                        MobileNo: udata.MobileNo,
                        Address: udata.Address,
                        OTP: udata.OTP,
                        CreatedDate: moment(udata.CreatedDate).format('DD-MM-yyyy HH:mm:ss'),
                        IsActive: udata.IsActive
                    });
                });
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
            } else {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ViewUserData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/UserDetail', {
                title: 'UserDetail', UserData: GetAllData,
                BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.LoginDoneExcel = [async (req, res) => {
    try {
        let Userdetail = await UserMasterModel.find({}).sort({ _id: -1 }).exec();
        if (Userdetail.length > 0) {
            let GetAllData = [];
            Userdetail.forEach((udata) => {
                if (udata.LoginStatus == 'LogIn') {
                    GetAllData.push({
                        // _id: udata._id,
                        "UserName": udata.UserName,
                        "MobileNo": udata.MobileNo,
                        "Address": udata.Address,
                        // "OTP": udata.OTP,
                        "LoginStatus": udata.LoginStatus,
                        // "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy HH:mm:ss'),
                        "IsActive": udata.IsActive
                    });
                } else {

                }
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("User With LogIn Detail");

            worksheet.columns = [
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Mobil eNo", key: "MobileNo", width: 20 },
                { header: "Address", key: "Address", width: 18 },
                { header: "OTP", key: "OTP", width: 8 },
                { header: "Login Status", key: "LoginStatus", width: 14 },
                // { header: "Entry Date", key: "CreatedDate", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "User Status", key: "IsActive", width: 18 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'User With LogIn Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(GetAllData);
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
                "attachment; filename=" + "UserWithLogInDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

            // return res.status(200).json({ status: 1, message: "Done.", data: GetAllData, error: null });
        } else {
            res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.WithoutLoginExcel = [async (req, res) => {
    try {
        let Userdetail = await UserMasterModel.find({}).sort({ _id: -1 }).exec();
        if (Userdetail.length > 0) {
            let GetAllData = [];
            Userdetail.forEach((udata) => {
                if (udata.LoginStatus == '') {
                    GetAllData.push({
                        // _id: udata._id,
                        "UserName": udata.UserName,
                        "MobileNo": udata.MobileNo,
                        "Address": udata.Address,
                        "OTP": udata.OTP,
                        "LoginStatus": udata.LoginStatus,
                        // "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy HH:mm:ss'),
                        "IsActive": udata.IsActive
                    });
                }
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("User WithOut Login Detail");

            worksheet.columns = [
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Mobil eNo", key: "MobileNo", width: 20 },
                { header: "Address", key: "Address", width: 18 },
                { header: "OTP", key: "OTP", width: 8 },
                { header: "Login Status", key: "LoginStatus", width: 14 },
                // { header: "Entry Date", key: "CreatedDate", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "User Status", key: "IsActive", width: 18 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'User WithOut Login Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(GetAllData);
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

            // return res.status(200).json({ status: 1, message: "Done.", data: GetAllData, error: null });
        } else {
            res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, SearchData: '', FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}]
exports.AddUser1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            // let Userdetail = await UserMasterModel.find().sort({ _id: 1 }).exec();
            console.log("===req.body", req.body)
            if (!req.body.ID) {
                let user = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address ? req.body.Address : "",
                        UserID: ((req.body.UserID) ? (req.body.UserID) : null),

                        // ResponsibilityID: req.body.ResponsibilityID ? req.body.ResponsibilityID : "",
                        // SanghShikshanID: req.body.SanghShikshanID ? req.body.SanghShikshanID : "",
                        // ShakhaName: req.body.ShakhaName ? req.body.ShakhaName : "",
                        Type: 'Panel'
                    }).save();
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Inserted', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let user = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address ? req.body.Address : "";
                    UpdateData["UserID"] = ((req.body.UserID) ? (req.body.UserID) : null),
                        // UpdateData["ResponsibilityID"] = req.body.ResponsibilityID ? req.body.ResponsibilityID : "";
                        // UpdateData["SanghShikshanID"] = req.body.SanghShikshanID ? req.body.SanghShikshanID : "";
                        // UpdateData["ShakhaName"] = req.body.ShakhaName ? req.body.ShakhaName : "";
                        await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            // let Userdetail = await UserMasterModel.find().sort({ _id: 1 }).exec();
            console.log("===req.body", req.body)
            if (!req.body.ID) {
                let user = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    let useradd = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address ? req.body.Address : "",
                        UserID: ((req.body.UserID) ? (req.body.UserID) : null),
                        UserType: 'SuperUser',
                        Type: 'Panel'
                    }).save();
                    if (req.body.ArrBhagData) {
                        // console.log("ArrBhagData", req.body.ArrBhagData.toString())
                        var ArrBhagData = req.body.ArrBhagData.toString().split(',');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            // console.log('======ArrBhagID=====', ArrBhagID)
                            bhagdata = await UserBhagDetailModel({
                                BhagID: ArrBhagID[0],
                                UserID: useradd._id,
                                Type: 'Panel'
                            }).save();
                            console.log('======bhagdata=====', bhagdata.BhagID)
                        }
                    }
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Inserted', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let user = await UserMasterModel.findOne({ _id: { $nin: req.body.ID }, MobileNo: req.body.MobileNo }).exec();
                if (user) {
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Mobile No Already Exits!', alertTitle: 'Invalid', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["UserName"] = req.body.UserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address ? req.body.Address : "";
                    UpdateData["UserID"] = ((req.body.UserID) ? (req.body.UserID) : null),
                        // UpdateData["ResponsibilityID"] = req.body.ResponsibilityID ? req.body.ResponsibilityID : "";
                        // UpdateData["SanghShikshanID"] = req.body.SanghShikshanID ? req.body.SanghShikshanID : "";
                        // UpdateData["ShakhaName"] = req.body.ShakhaName ? req.body.ShakhaName : "";
                        await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Updated', alertTitle: 'Success', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.FindByIDUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            let GetAllData = await BindUserData(req);
            let FetchUserdetail = await UserMasterModel.findOne({ _id: req.params.ID }).sort({ _id: -1 }).exec();
            // res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, SearchData: '', FetchData: FetchUserdetail, alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
            if (req.params.ID) {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: FetchUserdetail, alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.params.ID });
            } else {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: '', FetchData: FetchUserdetail, alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.DeleteUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var UpdateData = {};
            UpdateData["IsActive"] = 'false';
            UpdateData["IsDelete"] = 'true';
            await UserMasterModel.updateOne({ _id: req.params.ID }, UpdateData).exec()
            console.log("===gfh==", UpdateData)
            let Userdetail = await UserMasterModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: Userdetail, BhagData: '', NagarData: '', VastiData: '', SearchData: '', FetchData: '', alertMessage: 'Successfully Delete', alertTitle: ' Delete', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.params.ID });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingUser1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var MobileNo = ((req.body.MobileNo) ? (req.body.MobileNo) : { $nin: [] });
            var query;
            query = {
                MobileNo: MobileNo
            }
            var SearchData = req.body.MobileNo;
            let Userdetail = await UserMasterModel.find(query).sort({ _id: -1 }).exec();
            if (Userdetail.length > 0) {
                let GetAllData = [];
                Userdetail.forEach((udata) => {
                    GetAllData.push({
                        _id: udata._id,
                        UserName: udata.UserName,
                        MobileNo: udata.MobileNo,
                        Address: udata.Address,
                        CreatedDate: moment(udata.CreatedDate).format('DD-MM-yyyy'),
                        IsActive: udata.IsActive
                    });
                });
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
            } else {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: '', SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var SearchData = req.body.MobileNo;
            let GetAllData = await BindUserData(req);
            let BhagData = await BhagModel.find({}).sort({ '_id': -1 }).exec();
            let NagarData = await NagarModel.find({}).sort({ '_id': -1 }).exec();
            let VastiData = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            if (req.params.ID) {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            } else {
                res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: GetAllData, BhagData: BhagData, NagarData: NagarData, VastiData: VastiData, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UserStatus = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            console.log('=====helooo Status=======');
            var UserStatus = ((req.params.Value) ? (req.params.Value) : { $nin: [] })
            var UpdateData = {};
            if (UserStatus == 'false') {
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
exports.ExportUserData1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (req.cookies.admindata) {
                var MobileNo = ((req.body.MobileNo) ? (req.body.MobileNo) : { $nin: [] });
                var query;
                query = {
                    MobileNo: MobileNo
                }
                var SearchData = req.body.MobileNo;
                let Userdetail = await UserMasterModel.find(query).sort({ _id: -1 }).exec();
                if (Userdetail.length > 0) {
                    var Result = [];
                    Userdetail.forEach((udata) => {
                        Result.push({
                            "UserName": udata.UserName,
                            "MobileNo": udata.MobileNo,
                            "Address": udata.Address,
                            "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy'),
                            "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                        });
                    });
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("UserDetail");

                    worksheet.columns = [
                        { header: "User Name", key: "UserName", width: 20 },
                        { header: "Mobil eNo", key: "MobileNo", width: 20 },
                        { header: "Address", key: "Address", width: 15 },
                        { header: "Entry Date", key: "CreatedDate", width: 18 },
                        // { header: "Date", key: "EntryDate", width: 20 },
                        { header: "User Status", key: "IsActive", width: 18 },
                    ];

                    worksheet.spliceRows(1, 0, [])
                    // Set title
                    worksheet.getCell('A1').value = 'UserDetail'

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
                        "attachment; filename=" + "UserDetail.xlsx"
                    );
                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                    });
                    // res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: Result, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
                } else {
                    res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: Result, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ExportUserData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
            var CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
            // var uBhag = await UserBhagDetailModel.find({ "UserID": mongoose.Types.ObjectId(req.body.ID) }).exec()
            // console.log(uBhag)

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
                    //         "localField": "UserMaster.UserID",
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
                            "as": "Bhag"
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
                            "UserMaster.IsActive": true,
                            "UserMaster._id": CheckSearchID,
                            "UserMaster.MobileNo": CheckSearchMobilenO,
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
                            "ShakhaMasterID": "$UserMaster.ShakhaMasterID",
                            "ShakhaName": "$ShakhaMaster.ShakhaName",
                            "ResponsibilityID": "$UserMaster.ResponsibilityID",
                            "ResponsibilityName": "$Responsibility.ResponsibilityName",
                            "SanghShikshanID": "$UserMaster.SanghShikshanID",
                            "SanghShikshanName": "$SanghShikshan.SanghShikshanName",
                            "NormalUserName": "$UserMaster.UserName",
                            "UserBhagDetail": "$UserBhagDetail",
                            "UserBhagName": "$Bhag",
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
                            "UserStatus": "$UserMaster.UserStatus",
                            "SubType": "$UserMaster.SubType",
                            "IsActive": "$UserMaster.IsActive",
                            "IsDelete": "$UserMaster.IsDelete",
                            "CreatedDate": "$UserMaster.CreatedDate"
                        }
                    }
                ]);
            var Result = [];
            userdata.forEach((udata) => {
                Result.push({
                    "UserName": udata.UserName,
                    "MobileNo": udata.MobileNo,
                    "Address": udata.Address ? udata.Address : "-",
                    "OTP": udata.OTP ? udata.OTP : "-",
                    "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy'),
                    "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("UserDetail");

            worksheet.columns = [
                { header: "User Name", key: "UserName", width: 20 },
                { header: "Mobil eNo", key: "MobileNo", width: 20 },
                { header: "OTP", key: "OTP", width: 10 },
                { header: "Address", key: "Address", width: 20 },
                { header: "Entry Date", key: "CreatedDate", width: 18 },
                // { header: "Date", key: "EntryDate", width: 20 },
                { header: "User Status", key: "IsActive", width: 15 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'UserDetail'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
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
            // res.render('./PanelUser/UserDetail', { title: 'UserDetail', UserData: Result, SearchData: SearchData, FetchData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.admindata.UserName, ID: '' });

        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetData = [async (req, res) => {
    try {
        res.render('./PanelUser/DownloadAPK', { title: 'DownloadAPK' });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.PrivacyAndPolicy = [async (req, res) => {
    try {
        res.render('./PanelUser/PrivacyAndPolicy', { title: 'PrivacyAndPolicy' });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.DownloadExcel = [async (req, res) => {
    try {
        const file = './public/SmartCollection/Sangham 0.1.apk';
        res.download(file); // Set disposition and send it.
        console.log("Download Completed");
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}

