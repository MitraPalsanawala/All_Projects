const BhagModel = require("../Model/BhagModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
const moment = require('moment-timezone');
const moment1 = require('moment');
//------------------------------------------ App ----------------------------------------------------//
exports.SetBhag = [async (req, res) => {
    try {
        if (!req.body.BhagName) {
            res.json({ status: 0, message: "Please Enter Bhag Name!", data: null, error: null });
        } else {
            let BhagData = await BhagModel.findOne({ IsActive: true, BhagName: req.body.BhagName }).exec();
            if (BhagData) {
                return res.status(200).json({ status: 1, message: "Bhag name is already available.", data: BhagData, error: null });
            } else {
                var Bhag = await BhagModel({
                    BhagName: req.body.BhagName,
                    KaryavahName: req.body.KaryavahName,
                    MobileNo: req.body.MobileNo,
                    Address: req.body.Address,
                    EmailID: req.body.EmailID,
                    SahKaryakartaName: req.body.SahKaryakartaName,
                    SahKaryakartaMobileNo: req.body.SahKaryakartaMobileNo,
                    SahKaryakartaAddress: req.body.SahKaryakartaAddress,
                    SahKaryakartaEmailID: req.body.SahKaryakartaEmailID
                }).save();
                return res.status(200).json({ status: 1, message: "Bhag Successfully Inserted.", data: Bhag, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetBhag = [async (req, res) => {
    try {
        var CheckUserID, CheckSearchID;
        CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });

        if (req.body.UserID) {

            var DataResponse = await BhagModel.aggregate(
                [
                    {
                        "$project": {
                            "_id": "_id",
                            "Bhag": "$$ROOT"
                        }
                    },
                    {
                        "$lookup": {
                            "localField": "Bhag._id",
                            "from": "UserBhagDetail",
                            "foreignField": "BhagID",
                            "as": "UserBhagDetail"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$UserBhagDetail",
                            "preserveNullAndEmptyArrays": true
                        }
                    },

                    {
                        "$match": {
                            "UserBhagDetail.UserID": CheckUserID,
                            "Bhag._id": CheckSearchID,
                            "$and": [
                                { "$or": [{ "UserBhagDetail.IsActive": { "$exists": false } }, { "UserBhagDetail.IsActive": { "$eq": true } }] },
                            ],
                            "Bhag.IsActive": true,

                        }
                    },
                    // { "$sort": { "Bhag._id": -1 } },
                    {
                        "$project": {
                            "_id": "$Bhag._id",
                            "BhagName": "$Bhag.BhagName",
                            // "UserID": "$UserBhagDetail._id",
                            "UserID": "$UserBhagDetail.UserID",
                            // "UserID": "$UserBhagDetail.UserID.UserName",
                            "KaryavahName": "$Bhag.KaryavahName",
                            "MobileNo": "$Bhag.MobileNo",
                            "Address": "$Bhag.Address",
                            "EmailID": "$Bhag.EmailID",
                            "SahKaryakartaName": "$Bhag.SahKaryakartaName",
                            "SahKaryakartaMobileNo": "$Bhag.SahKaryakartaMobileNo",
                            "SahKaryakartaAddress": "$Bhag.SahKaryakartaAddress",
                            "SahKaryakartaEmailID": "$Bhag.SahKaryakartaEmailID",
                            "IsActive": "$Bhag.IsActive",
                            "IsDelete": "$Bhag.IsDelete",
                            "ModifiedDate": "$Bhag.ModifiedDate",
                            "CreatedDate": "$Bhag.CreatedDate"
                        }
                    },
                ]).exec();
        } else {
            var DataResponse = await BhagModel.aggregate(
                [
                    {
                        "$project": {
                            "_id": "_id",
                            "Bhag": "$$ROOT"
                        }
                    },
                    {
                        "$match": {
                            "Bhag._id": CheckSearchID,
                            "Bhag.IsActive": true,

                        }
                    },
                    // { "$sort": { "Bhag._id": -1 } },
                    {
                        "$project": {
                            "_id": "$Bhag._id",
                            "BhagName": "$Bhag.BhagName",
                            // "UserID": "$UserBhagDetail._id",
                            "UserID": "",
                            // "UserID": "$UserBhagDetail.UserID.UserName",
                            "KaryavahName": "$Bhag.KaryavahName",
                            "MobileNo": "$Bhag.MobileNo",
                            "Address": "$Bhag.Address",
                            "EmailID": "$Bhag.EmailID",
                            "SahKaryakartaName": "$Bhag.SahKaryakartaName",
                            "SahKaryakartaMobileNo": "$Bhag.SahKaryakartaMobileNo",
                            "SahKaryakartaAddress": "$Bhag.SahKaryakartaAddress",
                            "SahKaryakartaEmailID": "$Bhag.SahKaryakartaEmailID",
                            "IsActive": "$Bhag.IsActive",
                            "IsDelete": "$Bhag.IsDelete",
                            "ModifiedDate": "$Bhag.ModifiedDate",
                            "CreatedDate": "$Bhag.CreatedDate"
                        }
                    },
                ]).exec();
        }
        return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
//---------------------------------------  Panel -------------------------------------------------------//
exports.ViewBhagData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).sort({ _id: -1 }).exec();
            res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AddBhagData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let BhagData = await BhagModel.findOne({ BhagName: req.body.BhagName }).exec();
                if (BhagData) {
                    res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Bhag name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    await BhagModel({
                        BhagName: req.body.BhagName,
                        // KaryavahName: req.body.KaryavahName,
                        // MobileNo: req.body.MobileNo,
                        // Address: req.body.Address,
                        // EmailID: req.body.EmailID,
                        // SahKaryakartaName: req.body.SahKaryakartaName,
                        // SahKaryakartaMobileNo: req.body.SahKaryakartaMobileNo,
                        // SahKaryakartaAddress: req.body.SahKaryakartaAddress,
                        // SahKaryakartaEmailID: req.body.SahKaryakartaEmailID
                    }).save();
                    res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let BhagData = await BhagModel.findOne({ _id: { $nin: req.body.ID }, BhagName: req.body.BhagName }).exec();
                if (BhagData) {
                    res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Bhag name is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["BhagName"] = req.body.BhagName;
                    // UpdateData["KaryavahName"] = req.body.KaryavahName;
                    // UpdateData["MobileNo"] = req.body.MobileNo;
                    // UpdateData["Address"] = req.body.Address;
                    // UpdateData["EmailID"] = req.body.EmailID;
                    // UpdateData["SahKaryakartaName"] = req.body.SahKaryakartaName;
                    // UpdateData["SahKaryakartaMobileNo"] = req.body.SahKaryakartaMobileNo;
                    // UpdateData["SahKaryakartaAddress"] = req.body.SahKaryakartaAddress;
                    // UpdateData["SahKaryakartaEmailID"] = req.body.SahKaryakartaEmailID;
                    await BhagModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.FindByBhagData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let BhagData = await BhagModel.find({ IsActive: true }).exec();
            let FetchBhagData = await BhagModel.findOne({ _id: req.params.ID }).exec();
            res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: FetchBhagData, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.DeleteBhagData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var UpdateData = {};
            UpdateData["IsActive"] = 'false';
            UpdateData["IsDelete"] = 'true';
            await BhagModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            let BhagData = await BhagModel.find({ IsActive: true }).exec();
            res.render('./PanelUser/Bhag', { title: 'Bhag', BhagData: BhagData, FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Delete', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}