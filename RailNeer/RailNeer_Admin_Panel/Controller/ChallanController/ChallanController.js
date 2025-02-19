const ChallanAPIManager = require('../../Network/ChallanAPIManager/ChallanAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");


exports.GetChallanDetail = [async (req, res) => {
    try {
        // var option = req.cookies.admindata;
        const order_no = req.query.order_no;
        const _order_by = "id";
        const order_type = "2";
        var params = {
            "order_no": order_no,
            "_order_by": _order_by,
            "order_type": order_type,
        }
        const getChallanDetail = await new Promise((resolve, reject) => {
            ChallanAPIManager.GetChallanData(params, null, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        if (order_no) {
            if (getChallanDetail && getChallanDetail.data && getChallanDetail.data.length > 0) {
                res.render('./RailNeer/ChallanDownload', { title: 'ChallanDownload', ChallanData: getChallanDetail });
            } else {
                res.render('./RailNeer/ChallanDownload', { title: 'ChallanDownload', ChallanData: '' });
            }
        } else {
            res.status(400).json({ error: 'Invalid URL' });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetChallanDetailForPanel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const order_no = req.query.order_no;
            const _order_by = "id";
            const order_type = "2";
            var params = {
                "order_no": order_no,
                "_order_by": _order_by,
                "order_type": order_type
            }
            const getChallanDetail = await new Promise((resolve, reject) => {
                ChallanAPIManager.GetChallanDataForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (order_no) {
                if (getChallanDetail && getChallanDetail.data && getChallanDetail.data.length > 0) {
                    res.render('./RailNeer/ChallanDownload', { title: 'ChallanDownload', ChallanData: getChallanDetail });
                } else {
                    res.render('./RailNeer/ChallanDownload', { title: 'ChallanDownload', ChallanData: '' });
                }
            } else {
                res.status(400).json({ error: 'Invalid URL' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];