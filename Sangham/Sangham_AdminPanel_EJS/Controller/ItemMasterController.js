const ItemTypeModel = require("../Model/ItemTypeModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
exports.SetItemMaster = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            if (!req.body.ID) {
                let ItemTypeData = await ItemTypeModel.findOne({ ItemType: req.body.ItemType }).exec();
                if (ItemTypeData) {
                    res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Item is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                } else {
                    await ItemTypeModel({
                        ItemType: req.body.ItemType,
                    }).save();
                    res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            } else {
                let ItemTypeData = await ItemTypeModel.findOne({ _id: { $nin: req.body.ID }, ItemType: req.body.ItemType }).exec();
                if (ItemTypeData) {
                    res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Item is already available.', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: req.body.ID });
                } else {
                    var UpdateData = {};
                    UpdateData["ItemType"] = req.body.ItemType;
                    await ItemTypeModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.GetItemMaster = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let ItemTypeData = await ItemTypeModel.find({ IsActive: true }).exec();
            res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];

exports.FindByItemData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let ItemTypeData = await ItemTypeModel.find({ IsActive: true }).exec();
            let FetchItemData = await ItemTypeModel.findOne({ _id: req.params.ID }).exec();
            res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: FetchItemData, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.DeleteItemData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var UpdateData = {};
            UpdateData["IsActive"] = 'false';
            UpdateData["IsDelete"] = 'true';
            await ItemTypeModel.updateOne({ _id: req.params.ID }, UpdateData).exec();
            let ItemTypeData = await ItemTypeModel.find({ IsActive: true }).exec();
            res.render('./PanelUser/ItemType', { title: 'ItemType', ItemTypeData: ItemTypeData, FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Delete', cookieData: req.cookies.admindata.UserName, moment: moment1, ID: '' });
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