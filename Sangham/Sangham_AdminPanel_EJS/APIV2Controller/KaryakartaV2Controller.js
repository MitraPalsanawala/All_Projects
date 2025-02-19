const KaryakartaModel = require("../Model/KaryakartaModel");
const SocietyModel = require("../Model/SocietyModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const UserMasterModel = require("../Model/UserMasterModel");
const TypeMasterModel = require("../Model/TypeMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
const DIR = "./public/upload";
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook();

exports.ViewKaryakartaDataV2 = [async (req, res) => {
    try {
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
        var CheckTypeID = ((req.body.TypeID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeID)] }) : { $nin: [] });
        var CheckTypeDetailID = ((req.body.TypeDetailID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeDetailID)] }) : { $nin: [] });
        var CheckUserRole = ((req.body.UserRole) ? ({ $in: [(req.body.UserRole)] }) : { $nin: [] });
        let karyakartadata = await KaryakartaModel.find({
            "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID,
            "VastiID": CheckVastiID, "SocietyID": CheckSocietyID, "TypeID": CheckTypeID,
            "TypeDetailID": CheckTypeDetailID
        }).populate({ path: 'UserID', select: 'UserName', match: { "UserRole": CheckUserRole } })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .populate({ path: 'VastiID', select: 'VastiName' })
            .populate({ path: 'SocietyID', select: 'SocietyName' })
            .populate({ path: 'TypeID', select: 'Type' })
            .populate({ path: 'TypeDetailID', select: 'TypeDetail' })
            .sort({ '_id': -1 }).exec();
        if (karyakartadata.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", karyakartadata: karyakartadata, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", karyakartadata: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.SetKaryakartaV2 = [async (req, res) => {
    try {
        var TypeDetailID = ((req.body.TypeDetailID) ? (req.body.TypeDetailID) : null);
        if (!req.body.UserID) {
            res.json({ status: 0, message: "Please Select User!", data: null, error: null });
        } else if (!req.body.BhagID) {
            res.json({ status: 0, message: "Please Select Bhag!", data: null, error: null });
        } else if (!req.body.NagarID) {
            res.json({ status: 0, message: "Please Select Nagar!", data: null, error: null });
        } else if (!req.body.VastiID) {
            res.json({ status: 0, message: "Please Select Vasti!", data: null, error: null });
        } else if (!req.body.SocietyID) {
            res.json({ status: 0, message: "Please Select Society!", data: null, error: null });
        } else if (!req.body.Name) {
            res.json({ status: 0, message: "Please Enter Name!", data: null, error: null });
        } else if (!req.body.TypeID) {
            res.json({ status: 0, message: "Please Select Type!", data: null, error: null });
        } else {
            if (!req.body.ID) {
                let CheckKaryakartaData = await KaryakartaModel.findOne({
                    IsActive: true,
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    TypeID: mongoose.Types.ObjectId(req.body.TypeID),
                    // TypeDetailID: mongoose.Types.ObjectId(req.body.TypeDetailID),
                    Name: req.body.Name
                }).exec();
                if (CheckKaryakartaData) {
                    return res.status(200).json({ status: 1, message: "Karyakarta Name Already Exist.", data: CheckKaryakartaData, error: null });
                } else {
                    var Karyakarta = await KaryakartaModel({
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyID: req.body.SocietyID,
                        TypeID: req.body.TypeID,
                        TypeDetailID: TypeDetailID,
                        Name: req.body.Name,
                        MobileNo: req.body.MobileNo,
                        Address: req.body.Address,
                        EmailID: req.body.EmailID,
                        IsActive: true,
                    }).save();
                    return res.status(200).json({ status: 1, message: "Karyakarta Successfully Inserted.", data: Karyakarta, error: null });
                }
            }
            else {
                let CheckKaryakartaData = await KaryakartaModel.findOne({
                    IsActive: true, _id: { $nin: mongoose.Types.ObjectId(req.body.ID) },
                    UserID: mongoose.Types.ObjectId(req.body.UserID),
                    BhagID: mongoose.Types.ObjectId(req.body.BhagID),
                    NagarID: mongoose.Types.ObjectId(req.body.NagarID),
                    VastiID: mongoose.Types.ObjectId(req.body.VastiID),
                    SocietyID: mongoose.Types.ObjectId(req.body.SocietyID),
                    TypeID: mongoose.Types.ObjectId(req.body.TypeID),
                    // TypeDetailID: mongoose.Types.ObjectId(req.body.TypeDetailID),
                    Name: req.body.Name
                }).exec();
                if (CheckKaryakartaData) {
                    return res.status(200).json({ status: 1, message: "Karyakarta Name Already Exist.", data: CheckKaryakartaData, error: null });
                }
                else {
                    var UpdateKaryakartaData = {};
                    UpdateKaryakartaData["UserID"] = req.body.UserID;
                    UpdateKaryakartaData["BhagID"] = req.body.BhagID;
                    UpdateKaryakartaData["NagarID"] = req.body.NagarID;
                    UpdateKaryakartaData["VastiID"] = req.body.VastiID;
                    UpdateKaryakartaData["SocietyID"] = req.body.SocietyID;
                    UpdateKaryakartaData["Name"] = req.body.Name;
                    UpdateKaryakartaData["MobileNo"] = req.body.MobileNo;
                    UpdateKaryakartaData["Address"] = req.body.Address;
                    UpdateKaryakartaData["EmailID"] = req.body.EmailID;
                    UpdateKaryakartaData["TypeID"] = req.body.TypeID;
                    UpdateKaryakartaData["TypeDetailID"] = TypeDetailID;
                    UpdateKaryakartaData["ModifiedDate"] = new Date();
                    KaryakartaModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.ID) }, UpdateKaryakartaData, { new: true }).exec((error, result) => {
                        if (error) {
                            return res.status(200).json({ status: 0, message: "Error.", data: null, error: error });
                        } else {
                            return res.status(200).json({ status: 1, message: "Karyakarta Successfully Updated.", data: result, error: null });
                        }
                    })
                }
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}