const ItemTypeModel = require("../Model/ItemTypeModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')

exports.SetItemType = [async (req, res) => {
    try {
        if (!req.body.ItemType) {
            res.json({ status: 0, message: "Please Enter ItemType!", data: null, error: null });
        } else {
            let TypeData = await ItemTypeModel.findOne({ IsActive: true, ItemType: req.body.ItemType }).exec();
            if (TypeData) {
                return res.status(200).json({ status: 0, message: "Item Type is already available.", data: null, error: null });
            } else {
                var types = await ItemTypeModel({
                    ItemType: req.body.ItemType
                }).save();
                return res.status(200).json({ status: 1, message: "Item Type Successfully Inserted.", data: types, error: null });
            }
        }
    } catch (err) {
        // console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.GetItemType = [async (req, res) => {
    try {
        let TypeData = await ItemTypeModel.find({ IsActive: true }).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: TypeData, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}