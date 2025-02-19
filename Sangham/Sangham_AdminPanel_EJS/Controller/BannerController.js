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
//------------------------------------------ App ----------------------------------------------------//
exports.SetBanner = [async (req, res) => {
    try {
        let upload = multer({ storage: storage, fileFilter: imageFilter }).single("BannerImage");
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                res.json({ status: 0, Message: ImageError, data: null, error: null });
                //return res.status(500).json({ status: 0, Message: ImageError, data: "" });
            } else {
                if (req.body.ID == undefined) {
                    var banner = await BannerModel({
                        // Title: req.body.Title,
                        BannerImage: (req.file) ? (req.file.filename) : ""
                    }).save();
                    return res.status(200).json({ status: 1, Message: "Banner Successfully Inserted.", data: banner, error: null });
                } else {
                    var UpdateData = {};
                    // UpdateData["Title"] = req.body.Title;
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
exports.GetBanner1 = [async (req, res) => {
    try {
        var BannerData = await BannerModel.aggregate(
            [
                {
                    "$project": {
                        "_id": "_id",
                        "BannerModel": "$$ROOT"
                    }
                },
                {
                    "$match": {
                        "BannerModel.IsActive": true
                    }
                },
                {
                    "$sort": {
                        "BannerModel._id": -1
                    }
                },
                {
                    "$project": {
                        "_id": "$BannerModel._id",
                        "BannerImage": "$BannerModel.BannerImage",
                        "AbhiyanStatus": "true",
                        "IsActive": "$BannerModel.IsActive",
                        "IsDelete": "$BannerModel.IsDelete",
                        "CreatedDate": "$BannerModel.CreatedDate",
                        "ModifiedDate": "$BannerModel.ModifiedDate"
                    }
                }
            ]);
        return res.status(200).json({ status: 1, message: "Success.", data: BannerData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

async function bindUserData(UserID) {

    var passUserID = ((UserID) ? ({ $in: [mongoose.Types.ObjectId(UserID)] }) : { $nin: [] });


    var userDetail = await UserMasterModel.aggregate(
        [
            {
                "$project": {
                    "_id": "_id",
                    "UserMaster": "$$ROOT"
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
                    "as": "Bhag"
                }
            },
            // {
            //     "$unwind": {
            //         "path": "$UserBhagDetail",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
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
            // {
            //     "$unwind": {
            //         "path": "$UserNagarDetail",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
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
            // {
            //     "$unwind": {
            //         "path": "$UserVastiDetail",
            //         "preserveNullAndEmptyArrays": true
            //     }
            // },
            {
                "$match": {
                    //"UserMaster.IsActive": 1,
                    "UserMaster._id": passUserID
                }
            },
            {
                "$project": {
                    "UserDetail": "$UserMaster",
                    "UserBhagDetail": "$UserBhagDetail",
                    "UserBhagName": "$Bhag",
                    "UserNagarDetail": "$UserNagarDetail",
                    "UserNagarName": "$Nagar",
                    "UserVastiDetail": "$UserVastiDetail",
                    "UserVastiName": "$Vasti",
                    "Vasti": "$Vasti"
                }
            }
        ]).sort({ Name: 1 }).exec();


    return userDetail;
}
exports.GetBanner2 = [async (req, res) => {
    try {
        // var ID = ((req.body.ID) ? (req.body.ID) : { $nin: [] });
        var UserID = ((req.body.UserID) ? (req.body.UserID) : { $nin: [] });
        //var UserID = req.body.UserID;
        let registerdata = await UserMasterModel.findOne({ _id: UserID })
            .populate({ path: 'BhagDetail', select: 'BhagID' })
            .populate({ path: 'NagarDetail', select: 'NagarID' })
            .populate({ path: 'VastiDetail', select: 'VastiID' }).sort({ '_id': -1 }).exec();
        let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
        var User = await bindUserData(UserID);
        if (User.length > 0) {
            var UserBhag = [];
            // registerdata.forEach((registerdata) => {
            //     UserBhag.push(registerdata.BhagDetail)
            // });
            if (bannerdata.length > 0) {
                var GetAllData = [], BannerData = [], PlayStoreLink = [],
                    PlayStoreType = [],
                    UserBhagDetail = [], UserBhagName = [], UserNagarName = [],
                    UserNagarDetail = [], UserVastiDetail = [], UserVastiName = [];

                bannerdata.forEach((doc) => {
                    BannerData.push(doc.BannerImage)
                });
                bannerdata.forEach((doc) => {
                    PlayStoreType.push(doc.PlayStoreType)
                });
                bannerdata.forEach((doc) => {
                    PlayStoreLink.push(doc.PlayStoreLink)
                });
                User[0].UserBhagDetail.forEach((doc) => {
                    UserBhagDetail.push(doc.BhagID)
                });
                User[0].UserBhagName.forEach((doc) => {
                    UserBhagName.push(doc.BhagName)
                });
                User[0].UserNagarDetail.forEach((doc) => {
                    UserNagarDetail.push(doc.NagarID)
                });
                User[0].UserNagarName.forEach((doc) => {
                    UserNagarName.push(doc.NagarName)
                });
                User[0].UserVastiDetail.forEach((doc) => {
                    UserVastiDetail.push(doc.VastiID)
                });
                User[0].UserVastiName.forEach((doc) => {
                    UserVastiName.push(doc.VastiName)
                });
                GetAllData.push({
                    // ID: User[0].UserDetail._id,
                    BannerImage: BannerData.toString(),
                    PlayStoreLink: 'https://play.google.com/store/apps/details?id=e.cop.master',
                    PlayStoreType: 'URL',
                    BannerImage: BannerData.toString(),
                    IsActive: User[0].UserDetail.IsActive,
                    UserType: User[0].UserDetail.UserType,
                    UserID: User[0].UserDetail ? User[0].UserDetail._id : "",
                    BhagID: UserBhagDetail ? UserBhagDetail.toString() : "",
                    BhagName: UserBhagName ? UserBhagName.toString() : "",
                    NagarID: UserNagarDetail ? UserNagarDetail.toString() : "",
                    NagarName: UserNagarName ? UserNagarName.toString() : "",
                    VastiID: UserVastiDetail.length > 0 ? UserVastiDetail.toString() : "",
                    VastiName: UserVastiName.length > 0 ? UserVastiName.toString() : "",
                    AbhiyanStatus: 'true'
                });
                var Updatedata = {};
                Updatedata["LoginStatus"] = 'LogIn';
                await UserMasterModel.updateOne({ _id: req.body.UserID }, Updatedata);
                return res.status(200).json({ status: 1, Message: "Success.", data1: GetAllData });
            } else {
                return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
            }
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.GetBanner = [async (req, res) => {
    try {
        var UserID = ((req.body.UserID) ? (req.body.UserID) : { $nin: [] });
        //var UserID = req.body.UserID;
        let registerdata = await UserMasterModel.find({ _id: UserID })
            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID' } })
            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID' } })
            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID' } }).sort({ '_id': -1 }).exec();
        let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
        if (bannerdata.length > 0) {
            var GetAllData = [];
            bannerdata.forEach((doc) => {
                GetAllData.push({
                    _id: doc._id,
                    Image: doc.BannerImage,
                    IsActive: registerdata[0].IsActive,
                    UserID: registerdata[0]._id,
                    BhagID: registerdata[0].BhagDetail[0].BhagID._id,
                    BhagName: registerdata[0].BhagDetail[0].BhagID.BhagName,
                    NagarID: registerdata[0].NagarDetail[0].NagarID._id,
                    NagarName: registerdata[0].NagarDetail[0].NagarID.NagarName,
                    VastiID: registerdata[0].VastiDetail.length > 0 ? registerdata[0].VastiDetail[0].VastiID._id : "",
                    VastiName: registerdata[0].VastiDetail.length > 0 ? registerdata[0].VastiDetail[0].VastiID.VastiName : "",
                    AbhiyanStatus: 'true'
                });
            });
            return res.status(200).json({ status: 1, Message: "Success.", data: GetAllData });
        } else {
            return res.status(200).json({ status: 0, Message: "Data Not Found.", data: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
exports.ViewBanner = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/Banner', { title: 'Banner', BannerData: bannerdata, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.AddBanner = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let upload = multer({ storage: storage, fileFilter: imageFilter }).single('BannerImage');
            upload(req, res, async (err) => {
                if (req.fileValidationError) {
                    res.render('./PanelUser/Banner', { title: 'Banner', BannerData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: '', cookieData: req.cookies.admindata.UserName });
                } else {
                    if (!req.body.ID) {
                        await BannerModel.create({ BannerImage: req.file.filename, Type: 'Panel' });
                        let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
                        res.render('./PanelUser/Banner', { title: 'Banner', BannerData: bannerdata, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata.UserName });
                    } else {
                        var UpdateData = {};
                        if (req.file) {
                            UpdateData["BannerImage"] = req.file.filename;
                        }
                        await BannerModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                        let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
                        res.render('./PanelUser/Banner', { title: 'Banner', BannerData: bannerdata, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata.UserName });
                    }
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.FindByIDBanner = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let bannerbyid = await BannerModel.findOne({ _id: req.params.ID }).exec();
            let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/Banner', { title: 'Banner', BannerData: bannerdata, FetchData: bannerbyid, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
exports.DeleteBanner = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            await BannerModel.findOneAndDelete({ _id: req.params.ID }).exec();
            let bannerdata = await BannerModel.find({}).sort({ '_id': -1 }).exec();
            res.render('./PanelUser/Banner', { title: 'Banner', BannerData: bannerdata, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Deleted.', cookieData: req.cookies.admindata.UserName });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        res.send(err.message);
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}