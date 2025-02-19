const UserMasterModel = require("../Model/UserMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const BookletMasterModel = require("../Model/BookletMasterModel");
const BookletAssignDetailModel = require("../Model/BookletAssignDetailModel");
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
const AnnadanModel = require("../Model/AnnadanModel");

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

async function BindBhagDetailData(req) {
    var CheckUserID, CheckSearchID, DataResponse, bodyuserID, CheckSearchMobileno;
    bodyuserID = req.body.UserID;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
    CheckSearchMobileno = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });

    if (bodyuserID) {
        let UserData = await UserMasterModel.find({ "_id": CheckUserID, "MobileNo": CheckSearchMobileno }).sort({ _id: -1 }).exec();
        if (UserData[0].UserRole == "MainUser") {
            DataResponse = await BhagModel.find({ "_id": CheckSearchID }).sort({ '_id': -1 }).exec();
        } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser" || UserData[0].UserRole == "BhagUser") {
            DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID })
                .populate({ path: 'UserID', select: 'UserName' })
                .populate({ path: 'BhagID', select: 'BhagName' }).sort({ '_id': -1 }).exec();
        } else {
            return DataResponse;
        }
        return DataResponse;
    } else {
        DataResponse = await BhagModel.find({ "_id": CheckSearchID }).sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
async function BindNagarDetailData(req) {
    var CheckUserID, DataResponse, bodyuserID, CheckSearchMobileno;
    bodyuserID = req.body.UserID;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckSearchMobileno = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    if (bodyuserID) {
        let UserData = await UserMasterModel.find({ "_id": CheckUserID, "MobileNo": CheckSearchMobileno }).sort({ _id: -1 }).exec();
        if (UserData[0].UserRole == "MainUser") {
            DataResponse = await NagarModel.find({}).populate({ path: 'BhagID', select: 'BhagName' }).sort({ '_id': -1 }).exec();
        } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser") {
            DataResponse = await UserNagarDetailModel.find({ "UserID": CheckUserID })
                .populate({ path: 'UserID', select: 'UserName' })
                .populate({ path: 'BhagID', select: 'BhagName' })
                .populate({ path: 'NagarID', select: 'NagarName' }).sort({ '_id': -1 }).exec();
        } else if (UserData[0].UserRole == "BhagUser") {
            DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID })
                .populate('NagarData').sort({ '_id': -1 }).exec();
        } else {
            return DataResponse;
        }
        return DataResponse;
    } else {
        DataResponse = await NagarModel.find({}).populate({ path: 'BhagID', select: 'BhagName' }).sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
async function BindVastiDetailData(req) {
    var CheckUserID, DataResponse, bodyuserID, CheckSearchMobilenO;
    bodyuserID = req.body.UserID;
    CheckUserID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
    CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    if (bodyuserID) {
        let UserData = await UserMasterModel.find({ _id: CheckUserID }).sort({ _id: -1 }).exec();
        if (UserData[0].UserRole == "MainUser") {
            DataResponse = await VastiModel.find({})
                .populate({ path: 'BhagID', select: 'BhagName' })
                .populate({ path: 'NagarID', select: 'NagarName' })
                .sort({ '_id': -1 }).exec();
        } else if (UserData[0].UserRole == "SuperUser" || UserData[0].UserRole == "NormalUser") {
            DataResponse = await UserVastiDetailModel.find({ "UserID": CheckUserID })
                .populate({ path: 'UserID', select: 'UserName' })
                .populate({ path: 'BhagID', select: 'BhagName' })
                .populate({ path: 'NagarID', select: 'NagarName' })
                .populate({ path: 'VastiID', select: 'VastiName' })
                .sort({ '_id': -1 }).exec();
        } else if (UserData[0].UserRole == "BhagUser") {
            // DataResponse = await VastiModel.find({}).sort({ '_id': -1 }).exec();
            DataResponse = await UserBhagDetailModel.find({ "UserID": CheckUserID })
                .populate('VastiData').sort({ '_id': -1 }).exec();
        } else {
            return DataResponse;
        }
        return DataResponse;
    } else {
        DataResponse = await VastiModel.find({})
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .sort({ '_id': -1 }).exec();
        return DataResponse;
    }
}
async function BindUserDetailData(req) {
    var CheckUserID, CheckSearchMobilenO;
    CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
    CheckSearchMobilenO = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
    if (req.body.UserID) {
        userdetail = await UserMasterModel.find({ _id: CheckUserID, MobileNo: CheckSearchMobilenO })
            .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName' })
            .populate({ path: 'ShakhaMasterID', select: 'ShakhaName' })
            .sort({ '_id': -1 }).exec();
    } else {
        userdetail = await UserMasterModel.find({})
            .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName' })
            .populate({ path: 'ShakhaMasterID', select: 'ShakhaName' })
            .sort({ '_id': -1 }).exec();
    }
    return userdetail;
}
exports.NewUserView = [async (req, res) => {
    try {
        let GetAllUserData = await BindUserDetailData(req);
        let GetAllBhagData = await BindBhagDetailData(req);
        let GetAllNagarData = await BindNagarDetailData(req);
        let GetAllVastiData = await BindVastiDetailData(req);
        var AllData = [];
        AllData.push({
            AllUserDetail: GetAllUserData,
            AllBhagDetail: GetAllBhagData,
            AllNagarDetail: GetAllNagarData,
            AllVastiDetail: GetAllVastiData
        })
        return res.status(200).json({ status: 1, message: "Success.", AllData: AllData, error: null });
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.GetUserAutoSuggestionList = [async (req, res) => {
    try {
        let UserData = await UserMasterModel.find({ IsActive: true }, { _id: 1, UserName: 1, MobileNo: 1, UserRole: 1, IsActive: 1, IsDelete: 1 }).exec();
        let AnndanData = await AnnadanModel.find({}, { MobileNo: 1, AnnadanUserName: 1, Address: 1, HouseNo: 1, Landmark: 1 });
        var AllData = [];
        var data_ = [];

        if (AnndanData.length > 0) {
            for (let i = 0; i < AnndanData.length; i++) {
                const element = AnndanData[i];
                if (data_.includes(element.MobileNo)) {

                } else {
                    data_.push(element.MobileNo)
                    AllData.push({
                        'Name': element.AnnadanUserName ?? "",
                        'MobileNo': element.MobileNo,
                        'Address': element.Address ?? "",
                        'HouseNo': element.HouseNo ?? "",
                        'Landmark': element.Landmark ?? "",
                    })
                }
            }
        }

        if (UserData.length > 0) {
            for (let i = 0; i < UserData.length; i++) {
                const element = UserData[i];
                if (data_.includes(element.MobileNo)) {

                } else {
                    data_.push(element.MobileNo)
                    AllData.push({
                        'Name': element.UserName ?? "",
                        'MobileNo': element.MobileNo ?? "",
                        'Address': element.Address ?? "",
                        'HouseNo': element.HouseNo ?? "",
                        'Landmark': element.Landmark ?? "",
                    })
                }

            }
        }

        if (AllData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", AllData: AllData, error: null });
        } else {
            return res.status(200).json({ status: 1, message: "No Data Found", AllData: null, error: null });
        }
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.UserMasterViewV2 = [async (req, res) => {
    try {
        let showall = await UserMasterModel.find({})
            .populate({ path: 'UserID', select: 'UserName' })
            .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName', match: { IsActive: 'true' } })
            .populate({ path: 'ShakhaMasterID', select: 'ShakhaName', match: { IsActive: 'true' } })
            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName', match: { IsActive: 'true' } } })
            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName', match: { IsActive: 'true' } } })
            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName', match: { IsActive: 'true' } } })
            .sort({ '_id': -1 }).exec();
        if (showall.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", data: showall, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", data: showall, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.LogInUserDetailV2 = [async (req, res) => {
    try {
        if (!req.body.MobileNo) {
            return res.json({ status: 0, Message: "Please Enter MobileNo", data: null })
        } else {
            let userdata = await UserMasterModel.findOne({ MobileNo: req.body.MobileNo, IsActive: "true" })
                .populate({ path: 'UserID', select: 'UserName' })
                .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName', match: { IsActive: 'true' } })
                .populate({ path: 'ShakhaMasterID', select: 'ShakhaName', match: { IsActive: 'true' } })
                .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName', match: { IsActive: 'true' } } })
                .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName', match: { IsActive: 'true' } } })
                .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName', match: { IsActive: 'true' } } })
                .sort({ '_id': -1 }).exec();
            if (!userdata) {
                return res.status(200).json({ status: 0, message: "Mobile No is Not available.", error: null });
            } else {
                if (userdata.IsActive == false) {
                    return res.status(200).json({ status: 0, message: "User is InActive", error: null });
                } else if (userdata.UserStatus == 'Pending') {
                    return res.status(200).json({ status: 0, message: "Mobile No is Not available.", error: null });
                } else {
                    var OTPGenerat = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    var deviceid = req.body.DeviceID;
                    var Updatedata = {};
                    Updatedata["OTP"] = OTPGenerat;
                    Updatedata["LoginStatus"] = 'LogIn';
                    Updatedata["DeviceID"] = deviceid;
                    userdata.OTP = OTPGenerat;
                    userdata.DeviceID = deviceid;
                    let updateOTP = await UserMasterModel.updateOne({ MobileNo: req.body.MobileNo, IsActive: true, IsDelete: false }, Updatedata);
                    return res.status(200).json({ status: 1, message: "User Successfully Login.", data: userdata, error: null });
                }
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.SetUserMasterProfileV2 = [async (req, res) => {
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
                        if (userfind.UserStatus == 'Complete' || userfind.UserRole == 'SuperUser') {
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
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetMobileNoV2 = [async (req, res) => {
    try {
        if (req.body.ArrUserData) {
            ArrUserData = req.body.ArrUserData.split('~');
            for (let i = 0; i < ArrUserData.length; i++) {
                var ArrUserID = ArrUserData[i];
                let useradd = await UserMasterModel.findOne({
                    MobileNo: ArrUserData[i],
                    IsActive: true,
                }).exec();
                if (useradd) {
                    return res.status(200).json({ status: 0, Message: "Mobile Number Already Exit.", data: useradd, error: null });
                } else {
                    await new UserMasterModel({
                        UserID: req.body.ID,
                        MobileNo: ArrUserData[i],
                        UserRole: 'NormalUser',
                        UserStatus: 'Pending'
                    }).save();
                }
            }
            return res.status(200).json({ status: 1, Message: "Successfully Inserted.", data: null, error: null });
        }

    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetRegisterV2 = [async (req, res) => {
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
                        UserRole: req.body.UserRole ? req.body.UserRole : "",
                        UserStatus: 'Complete'
                    }).save();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
                        var ArrBhagData = req.body.ArrBhagData.split('~');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            bhagdata = await UserBhagDetailModel({
                                BhagID: ArrBhagID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrNagarData) {
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            Nagardata = await UserNagarDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: ArrNagarID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrVastiData) {
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
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
                    UpdateData["UserRole"] = req.body.UserRole ? req.body.UserRole : "";
                    let userdata = await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
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
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            if (ArrNagarID[1]) {
                                var UpdateData = {};
                                UpdateData["BhagID"] = req.body.BhagID;
                                UpdateData["NagarID"] = ArrNagarID[0];
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
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
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
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SetRegister2V2 = [async (req, res) => {
    try {
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
                            UserRole: 'NormalUser'
                        }).exec();
                        if (!userfind) {
                            return res.status(200).json({ status: 1, message: "Mobile is Not Availabele.", data: userfind, error: null });
                        } else {
                            if (userfind.UserRole == 'Complete') {
                                return res.status(200).json({ status: 1, message: "User Already Registerd.", data: userfind, error: null });
                            } else {
                                var UpdateData = {};
                                UpdateData["UserName"] = req.body.UserName;
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
                                UpdateData["UserRole"] = 'Complete';
                                let userdata = await UserMasterModel.updateOne({ _id: userfind._id }, UpdateData).exec();
                                var bhagdata, Nagardata, Vastidata;
                                await UserBhagDetailModel.deleteMany({ UserID: req.body.ID }).exec();
                                if (req.body.ArrBhagData) {
                                    var ArrBhagData = req.body.ArrBhagData.split('~');
                                    for (let i = 0; i < ArrBhagData.length; i++) {
                                        var ArrBhagID = ArrBhagData[i].split('@');
                                        bhagdata = await UserBhagDetailModel({
                                            BhagID: ArrBhagID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                    }
                                }
                                if (req.body.ArrNagarData) {
                                    var ArrNagarData = req.body.ArrNagarData.split('~');
                                    for (let i = 0; i < ArrNagarData.length; i++) {
                                        var ArrNagarID = ArrNagarData[i].split('@');
                                        Nagardata = await UserNagarDetailModel({
                                            BhagID: bhagdata.BhagID,
                                            NagarID: ArrNagarID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                    }
                                }
                                if (req.body.ArrVastiData) {
                                    var ArrVastiData = req.body.ArrVastiData.split('~');
                                    for (let i = 0; i < ArrVastiData.length; i++) {
                                        var ArrVastiID = ArrVastiData[i].split('@');
                                        Vastidata = await UserVastiDetailModel({
                                            BhagID: bhagdata.BhagID,
                                            NagarID: Nagardata.NagarID,
                                            VastiID: ArrVastiID[0],
                                            UserID: userfind._id,
                                            Type: 'App'
                                        }).save();
                                    }
                                }
                                return res.status(200).json({ status: 1, message: "Register Success.", data: userdata, error: null });
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
//-------------------------New Flow User(10-12-2022) (Application)------------------------//
exports.SetNewRegisterV2 = [async (req, res) => {
    try {
        var ResponsibilityID = ((req.body.ResponsibilityID) ? (req.body.ResponsibilityID) : null);
        var SanghShikshanID = ((req.body.SanghShikshanID) ? (req.body.SanghShikshanID) : null);
        var ShakhaMasterID = ((req.body.ShakhaMasterID) ? (req.body.ShakhaMasterID) : null);
        var UserID = ((req.body.UserID) ? (req.body.UserID) : null);
        if (req.body.UserID === '') { UserID = null }
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
                    var UniqueCollectionNumber = otpGenerator.generate(10, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    var user = await UserMasterModel({
                        UserName: req.body.UserName,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        SanghShikshanID: SanghShikshanID,
                        ResponsibilityID: ResponsibilityID,
                        UserID: UserID,
                        ShakhaMasterID: ShakhaMasterID,
                        Type: req.body.Type ? req.body.Type : "",
                        UserType: req.body.UserType ? req.body.UserType : "",
                        Star: req.body.Star,
                        Javabadari: req.body.Javabadari,
                        KaryavahType: req.body.KaryavahType,
                        SangathanType: req.body.SangathanType,
                        SangathanPramukhType: req.body.SangathanPramukhType,
                        JagranType: req.body.JagranType,
                        JagranPramukhType: req.body.JagranPramukhType,
                        GatividhiType: req.body.GatividhiType,
                        GatividhiPramukhType: req.body.GatividhiPramukhType,
                        VastiPramukhType: req.body.VastiPramukhType,
                        SakhaType: req.body.SakhaType,
                        DOB: req.body.DOB,
                        BloodGroup: req.body.BloodGroup,
                        Education: req.body.Education,
                        ProfessionType: req.body.ProfessionType,
                        Profession: req.body.Profession,
                        UserStatus: 'Complete',
                        UserRole: 'NormalUser',
                        UniqueCollectionNumber: UniqueCollectionNumber,
                    }).save();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
                        var ArrBhagData = req.body.ArrBhagData.split('~');
                        for (let i = 0; i < ArrBhagData.length; i++) {
                            var ArrBhagID = ArrBhagData[i].split('@');
                            bhagdata = await UserBhagDetailModel({
                                BhagID: ArrBhagID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrNagarData) {
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            Nagardata = await UserNagarDetailModel({
                                BhagID: bhagdata.BhagID,
                                NagarID: ArrNagarID[0],
                                UserID: user._id,
                                Type: 'App'
                            }).save();
                        }
                    }
                    if (req.body.ArrVastiData) {
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
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
                    UpdateData["DOB"] = req.body.DOB;
                    UpdateData["BloodGroup"] = req.body.BloodGroup;
                    UpdateData["Education"] = req.body.Education;
                    UpdateData["ProfessionType"] = req.body.ProfessionType;
                    UpdateData["Profession"] = req.body.Profession;
                    UpdateData["UserStatus"] = 'Complete';
                    UpdateData["UserRole"] = 'NormalUser';
                    let userdata = await UserMasterModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    var bhagdata, Nagardata, Vastidata;
                    if (req.body.ArrBhagData) {
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
                        var ArrNagarData = req.body.ArrNagarData.split('~');
                        for (let i = 0; i < ArrNagarData.length; i++) {
                            var ArrNagarID = ArrNagarData[i].split('@');
                            if (ArrNagarID[1]) {
                                var UpdateData = {};
                                UpdateData["BhagID"] = req.body.BhagID;
                                UpdateData["NagarID"] = ArrNagarID[0];
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
                        var ArrVastiData = req.body.ArrVastiData.split('~');
                        for (let i = 0; i < ArrVastiData.length; i++) {
                            var ArrVastiID = ArrVastiData[i].split('@');
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
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetNewProfileV2 = [async (req, res) => {
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
                        return res.status(200).json({ status: 1, message: "Mobile No is Not Availabele.", data: userfind, error: null });
                    } else {
                        if (userfind.UserStatus == 'Complete' || userfind.UserRole == 'SuperUser') {
                            var UpdateData = {};
                            UpdateData["UserName"] = req.body.UserName;
                            UpdateData["MobileNo"] = req.body.MobileNo;
                            UpdateData["Address"] = req.body.Address;
                            UpdateData["SanghShikshanID"] = req.body.SanghShikshanID;
                            UpdateData["ShakhaMasterID"] = req.body.ShakhaMasterID;
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
                            UpdateData["DOB"] = req.body.DOB;
                            UpdateData["BloodGroup"] = req.body.BloodGroup;
                            UpdateData["Education"] = req.body.Education;
                            UpdateData["ProfessionType"] = req.body.ProfessionType;
                            UpdateData["Profession"] = req.body.Profession;
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
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
//-------------------------Condition Check by Manthan Sir------------------------//
exports.GetAccountDeleteV2 = [async (req, res) => {
    try {
        var VersionParameter = req.body.VersionParameter ?? "";
        var Status = false;
        if (VersionParameter === "1.1") { Status = true }
        return res.status(200).json({ status: 1, message: "done", data: Status, error: null })
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.UserDeleteV2 = [async (req, res) => {
    try {
        var UpdateData = {};
        UpdateData["IsActive"] = false;
        UpdateData["IsDelete"] = true;
        await UserMasterModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
        return res.status(200).json({ status: 1, message: "Successfully Deleted.", data: UpdateData, error: null })
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

//-------------------------New Module(24-12-2022) (Bonika)------------------------//
exports.GetUserList = [async (req, res) => {
    try {
        var bodyBookletStatus = req.body.BookletStatus;
        var userData;
        if (bodyBookletStatus == "MainUser") {
            userData = await UserMasterModel.find({ UserRole: { $in: ['SuperUser'] }, IsActive: true }, 'UserName MobileNo UserRole').exec();

            if (userData.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: userData, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
            }

        } else if (bodyBookletStatus == "SuperUser") {
            userData = await UserMasterModel.find({ UserRole: { $in: ['NormalUser'] }, IsActive: true }, 'UserName MobileNo UserRole').exec();

            if (userData.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: userData, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
            }

        } else {
            return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetBookletData = [async (req, res) => {
    try {
        var bodyBookletStatus = req.body.BookletStatus;
        var bodyUserID = req.body.UserID;
        var bookletData;
        if (bodyBookletStatus == "MainUser") {
            bookletData = await BookletMasterModel.find({ Status: true }).exec();
            if (bookletData.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: bookletData, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
            }

        } else if (bodyBookletStatus == "SuperUser" && bodyUserID) {
            bookletData = await BookletAssignDetailModel.find({ BookletGivenToID: bodyUserID, Status: { $in: ['Pending'] } }).exec();

            if (bookletData.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: bookletData, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
            }

        } else if (bodyBookletStatus == "NormalUser" && bodyUserID) {
            bookletData = await BookletAssignDetailModel.find({ BookletGivenToID: bodyUserID, Status: { $in: ['Pending'] } }).exec();

            if (bookletData.length > 0) {
                return res.status(200).json({ status: 1, Message: "Success.", data: bookletData, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
            }

        } else {
            return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

//-------------------------New Module(26-12-2022) (Bonika)------------------------//
exports.SetBookletAssignMainUserToSuperUser = [async (req, res) => {
    try {
        var bodyMainUserID = req.body.MainUserID;
        var bodySuperUserID = req.body.SuperUserID;
        var bodyBookletMasterIDs = req.body.BookletMasterIDs;
        var bodyBookletMasterIDNos = req.body.BookletMasterIDNos;
        var bodyBookletMasterIDData = bodyBookletMasterIDs.split('@');
        var bodyBookletMasterIDNoData = bodyBookletMasterIDNos.split('@');
        var UpdateData = {}, UpdateData1 = {};
        var data;
        for (let i = 0; i < bodyBookletMasterIDData.length; i++) {
            await BookletAssignDetailModel({
                BookletMasterID: bodyBookletMasterIDData[i],
                Type: "SuperUser",
                BookNo: bodyBookletMasterIDNoData[i],
                Status: "Pending",
                BookletGivenByID: bodyMainUserID,
                BookletGivenToID: bodySuperUserID
            }).save();

            UpdateData["Status"] = false;
            data = await BookletMasterModel.updateOne({ _id: bodyBookletMasterIDData[i] }, UpdateData).exec();
        }

        UpdateData1["MainBookletUser"] = false;
        UpdateData1["SuperBookletUser"] = true;
        UpdateData1["NormalBookletUser"] = false;
        await UserMasterModel.updateOne({ _id: bodySuperUserID }, UpdateData1).exec();

        return res.status(200).json({ status: 1, Message: "Success.", data: null, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetBookletAssignMainUserToSuperUser = [async (req, res) => {
    try {
        var bodyMainUserID = req.body.MainUserID;
        var bodyStatus = req.body.Status ? req.body.Status : { $nin: [] };
        var superUserBookletData = await BookletAssignDetailModel.find({ BookletGivenByID: bodyMainUserID, Status: bodyStatus }).populate({ path: 'BookletGivenToID', select: 'UserName MobileNo UserRole' }).exec();
        if (superUserBookletData.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", data: superUserBookletData, error: null });
        } else {
            return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SetBookletAssignSuperUserToNormalUser = [async (req, res) => {
    try {
        var bodySuperUserID = req.body.SuperUserID;
        var bodyNormalUserID = req.body.NormalUserID;
        var bodyBookletAssignID = req.body.BookletAssignID;
        var bodyBookletMasterIDs = req.body.BookletMasterIDs;
        var bodyBookletMasterIDNos = req.body.BookletMasterIDNos;
        var bodyBookletMasterIDData = bodyBookletMasterIDs.split('@');
        var bodyBookletMasterIDNoData = bodyBookletMasterIDNos.split('@');
        var bodyBookletAssignIDData = bodyBookletAssignID.split('@');
        var UpdateData = {}, UpdateData1 = {};
        var data;
        for (let i = 0; i < bodyBookletMasterIDData.length; i++) {
            await BookletAssignDetailModel({
                BookletAssignID: bodyBookletAssignIDData[i],
                BookletMasterID: bodyBookletMasterIDData[i],
                Type: "NormalUser",
                BookNo: bodyBookletMasterIDNoData[i],
                Status: "Pending",
                BookletGivenByID: bodySuperUserID,
                BookletGivenToID: bodyNormalUserID
            }).save();

            UpdateData["Status"] = "Assign";
            await BookletAssignDetailModel.updateOne({ _id: bodyBookletAssignIDData[i] }, UpdateData).exec();
        }

        UpdateData1["MainBookletUser"] = false;
        UpdateData1["SuperBookletUser"] = false;
        UpdateData1["NormalBookletUser"] = true;
        await UserMasterModel.updateOne({ _id: bodyNormalUserID }, UpdateData1).exec();

        return res.status(200).json({ status: 1, Message: "Success.", data: null, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetBookletAssignSuperUserToNormalUser = [async (req, res) => {
    try {
        var bodySuperUserID = req.body.SuperUserID;
        var bodyStatus = req.body.Status ? req.body.Status : { $nin: [] };
        var normalUserBookletData = await BookletAssignDetailModel.find({ BookletGivenByID: bodySuperUserID, Status: bodyStatus }).populate({ path: 'BookletGivenToID', select: 'UserName MobileNo UserRole' }).exec();
        if (normalUserBookletData.length > 0) {
            return res.status(200).json({ status: 1, Message: "Success.", data: normalUserBookletData, error: null });
        } else {
            return res.status(200).json({ status: 0, Message: "No Data Found.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ReturnBookletAssignNormalUserToSuperUser = [async (req, res) => {
    try {
        var bodyBookletAssignDetailID = req.body.BookletAssignDetailID;
        var bodyBookletAssignID = req.body.BookletAssignID;
        var bodyAmount = req.body.Amount;
        var UpdateData = {}, UpdateData1 = {};
        UpdateData["Status"] = "Complete";
        UpdateData["Amount"] = bodyAmount;
        UpdateData["BookletReturnDate"] = Date.now();
        await BookletAssignDetailModel.updateOne({ _id: bodyBookletAssignDetailID }, UpdateData);
        UpdateData1["Amount"] = bodyAmount;
        await BookletAssignDetailModel.updateOne({ _id: bodyBookletAssignID }, UpdateData1);
        return res.status(200).json({ status: 1, Message: "Success.", data: null, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.ReturnBookletAssignSuperUserToMainUser = [async (req, res) => {
    try {
        var bodyBookletAssignDetailID = req.body.BookletAssignDetailID;
        var bodyBookletMasterID = req.body.BookletMasterID;
        var bodyAmount = req.body.Amount;
        var UpdateData = {}, UpdateData1 = {};
        UpdateData["Status"] = "Complete";
        UpdateData["Amount"] = bodyAmount;
        UpdateData["BookletReturnDate"] = Date.now();
        await BookletAssignDetailModel.updateOne({ _id: bodyBookletAssignDetailID }, UpdateData);
        UpdateData1["Amount"] = bodyAmount;
        await BookletMasterModel.updateOne({ _id: bodyBookletMasterID }, UpdateData1);
        return res.status(200).json({ status: 1, Message: "Success.", data: null, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}

