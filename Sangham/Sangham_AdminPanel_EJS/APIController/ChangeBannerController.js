const BannerModel = require("../Model/BannerModel");
const UserMasterModel = require("../Model/UserMasterModel");
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

exports.GetAllBannerV2 = [async (req, res) => {
    try {
        var ID = ((req.body.ID) ? (req.body.ID) : { $nin: [] });
        let registerdata = await UserMasterModel.find({ _id: ID })
            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } }).sort({ '_id': -1 }).exec();
        let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
        if (!req.body.ID) {
            return res.status(200).json({ status: 0, Message: "Please Enter User ID", data: null });
        } else {
            if (registerdata.length > 0) {
                var AllData = [], BannerImage = [], BhagID = [], NagarID = [], VastiID = [];
                bannerdata.forEach((Bannerdata) => {
                    BannerImage.push(Bannerdata.BannerImage)
                });
                registerdata.forEach((udata) => {
                    BhagID.push(udata.BhagDetail)
                });
                registerdata.forEach((udata) => {
                    NagarID.push(udata.NagarDetail)
                });
                registerdata.forEach((udata) => {
                    VastiID.push(udata.VastiDetail)
                });
                AllData.push({
                    BannerImage: BannerImage,
                    AbhiyanStatus: 'true',
                    PlayStoreLink: 'https://play.google.com/store/apps/details?id=e.cop.master',
                    PlayStoreType: 'URL',
                    IsActive: registerdata[0].IsActive,
                    UserType: registerdata[0].UserType,
                    UserRole: registerdata[0].UserRole,
                    AnnadanStatus: registerdata[0].AnnadanStatus,
                    BhagDetail: BhagID,
                    NagarDetail: NagarID,
                    VastiDetail: VastiID
                });
                return res.status(200).json({ status: 1, Message: "Success.", data: AllData });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}