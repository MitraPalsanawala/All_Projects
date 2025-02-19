const BannerModel = require("../Model/BannerModel");
const UserMasterModel = require("../Model/UserMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
const DIR = "./public/SmartCollection/Banners";
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

exports.SetBannerV2 = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("BannerImage");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                res.json({ status: 0, Message: ImageError, data: null, error: null });
            } else {
                if (req.body.ID == undefined) {
                    var banner = await BannerModel({
                        BannerImage: (req.file) ? (req.file.filename) : ""
                    }).save();
                    return res.status(200).json({ status: 1, Message: "Banner Successfully Inserted.", data: banner, error: null });
                } else {
                    var UpdateData = {};
                    if (req.file) {
                        UpdateData["BannerImage"] = req.file.filename;
                    }
                    await BannerModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, Message: "Banner Successfully Updated.", data: UpdateData, error: null });
                }
            }
        });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetBannerV2 = [async (req, res) => {
    try {
        var ID = ((req.body.ID) ? (req.body.ID) : { $nin: [] });
        var checkuserRole = ((req.body.UserRole) ? (req.body.UserRole) : { $nin: [] });
        bannerdata = await BannerModel.find({ IsActive: true }).sort({ '_id': -1 }).exec();
        let userdata = await UserMasterModel.find({ "_id": ID, "UserRole": checkuserRole })
            .populate({ path: 'UserID', select: 'UserName' })
            .populate({ path: 'SanghShikshanID', select: 'SanghShikshanName', match: { IsActive: 'true' } })
            .populate({ path: 'ShakhaMasterID', select: 'ShakhaName', match: { IsActive: 'true' } })
            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName', match: { IsActive: 'true' } } })
            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName', match: { IsActive: 'true' } } })
            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName', match: { IsActive: 'true' } } })
            .sort({ '_id': -1 }).exec();
        if (req.body.ID) {
            var AllData = [], BannerImage = [], BhagID = [], NagarID = [], VastiID = [];
            bannerdata.forEach((Bannerdata) => {
                BannerImage.push(Bannerdata.BannerImage)
            });
            userdata.forEach((udata) => {
                BhagID = (udata.BhagDetail)
            });
            userdata.forEach((udata) => {
                NagarID = (udata.NagarDetail)
            });
            userdata.forEach((udata) => {
                VastiID = (udata.VastiDetail)
            });

            AllData.push({
                BannerImage: BannerImage,
                AbhiyanStatus: 'true',
                PlayStoreLink: 'https://play.google.com/store/apps/details?id=e.cop.master',
                PlayStoreType: 'URL',
                IsActive: userdata.length > 0 ? userdata[0].IsActive : "",
                UserType: userdata.length > 0 ? userdata[0].UserType : "",
                UserRole: userdata.length > 0 ? userdata[0].UserRole : "",
                MainAnnadanStatus: (userdata.length > 0) ? (userdata[0].MainAnnadanStatus) : "",
                MainAddUserStatus: (userdata.length > 0) ? (userdata[0].MainAddUserStatus) : "",
                MainCollectionStatus: (userdata.length > 0) ? (userdata[0].MainCollectionStatus) : "",
                MainUserCollectionStatus: (userdata.length > 0) ? (userdata[0].MainUserCollectionStatus) : "",
                UniqueCollectionNumber: (userdata.length > 0 && userdata[0].UniqueCollectionNumber) ? (userdata[0].UniqueCollectionNumber) : "",
                MainBookletUser: userdata.length > 0 ? userdata[0].MainBookletUser : '',
                SuperBookletUser: userdata.length > 0 ? userdata[0].SuperBookletUser: '',
                NormalBookletUser: userdata.length > 0 ? userdata[0].NormalBookletUser: '',
                BhagDetail: BhagID,
                NagarDetail: NagarID,
                VastiDetail: VastiID
            });
            return res.status(200).json({ status: 1, Message: "Success.", data: AllData });
        } else {
            var getalldata = [], BannerImage = [], BhagID = [], NagarID = [], VastiID = [];
            bannerdata.forEach((Bannerdata) => {
                BannerImage.push(Bannerdata.BannerImage)
            });
            getalldata.push({
                BannerImage: BannerImage,
                AbhiyanStatus: 'true',
                PlayStoreLink: 'https://play.google.com/store/apps/details?id=e.cop.master',
                PlayStoreType: 'URL',
                IsActive: "",
                UserType: "",
                UserRole: "",
                MainAnnadanStatus: "",
                BhagDetail: "",
                NagarDetail: "",
                VastiDetail: ""
            });
            return res.status(200).json({ status: 1, Message: "Success.", data: getalldata });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
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
        userdetail = await UserMasterModel.find({ _id: CheckUserID, MobileNo: CheckSearchMobilenO }).sort({ '_id': -1 }).exec();
    } else {
        userdetail = await UserMasterModel.find({}).sort({ '_id': -1 }).exec();
    }
    return userdetail;
}
exports.GetBannerV3 = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID, bodyuserrole, UserStatus, query1;
        bodyuserID = req.body.ID;
        UserStatus = req.body.UserStatus;
        bodyuserrole = req.body.UserRole;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        CheckUserRole = ((bodyuserrole) ? ({ $in: [(bodyuserrole)] }) : { $nin: [] });

    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}