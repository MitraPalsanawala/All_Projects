const TypeDetailMasterModel = require("../Model/TypeDetailMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetTypeDetailV2 = [async (req, res) => {
    try {
        if (!req.body.TypeID) {
            res.json({ status: 0, message: "Please Select Type!", data: null, error: null });
        } else if (!req.body.TypeDetail) {
            res.json({ status: 0, message: "Please Enter Type Detail!", data: null, error: null });
        } else {
            let TypeData = await TypeDetailMasterModel.findOne({
                IsActive: true,
                TypeID: mongoose.Types.ObjectId(req.body.TypeID),
                TypeDetail: req.body.TypeDetail
            }).exec();
            if (TypeData) {
                return res.status(200).json({ status: 0, message: "Type is already available.", data: null, error: null });
            } else {
                var types = await TypeDetailMasterModel({
                    TypeID: req.body.TypeID,
                    TypeDetail: req.body.TypeDetail
                }).save();
                return res.status(200).json({ status: 1, message: "Type Successfully Inserted.", data: types, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetTypeDetailV2 = [async (req, res) => {
    try {
        var CheckTypeID = ((req.body.TypeID) ? ({ $in: [mongoose.Types.ObjectId(req.body.TypeID)] }) : { $nin: [] });
        let TypeData = await TypeDetailMasterModel.find({ IsActive: true, "TypeID": CheckTypeID })
            .populate({ path: 'TypeID', select: 'Type' }).exec();
        if (TypeData.length > 0) {
            return res.status(200).json({ status: 1, message: "Success.", data: TypeData, error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}]
//---------------------------------------  Panel -------------------------------------------------------//

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}