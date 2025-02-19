const TrainMasterAPI = require('../../Network/TrainMasterAPIManager/TrainMasterAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { json } = require('express');
const axios = require('axios');

exports.GetTrainMasterData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getTrainMaster = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getTrainMaster) {
                res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: getTrainMaster, StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetTrainMasterData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var train_master_name = req.body.train_master_name ? req.body.train_master_name : null
            var train_master_number = req.body.train_master_number ? req.body.train_master_number : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}TrainMaster/setTrainMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "train_master_name": train_master_name,
                    "train_master_number": train_master_number,
                    "plant_id": plant_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    var jsonData = JSON.parse(data)
                    if (jsonData.status == true) {
                        res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.UpdateTrainMasterData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var train_master_id = req.body.train_master_id ? req.body.train_master_id : ""
            var train_master_name = req.body.train_master_name ? req.body.train_master_name : null
            var train_master_number = req.body.train_master_number ? req.body.train_master_number : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}TrainMaster/updateTrainMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "train_master_id": train_master_id,
                    "train_master_name": train_master_name,
                    "train_master_number": train_master_number,
                    "plant_id": plant_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    var jsonData = JSON.parse(data)
                    if (jsonData.status == true) {
                        res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_master_id });
                    } else {
                        res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.FindByTrainMasterID = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_master_id": req.params.train_master_id,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const gettrainmasterById = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainMaster = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (gettrainmasterById) {
                if (gettrainmasterById.data.length > 0) {
                    res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: getTrainMaster, StationData: '', SearchData: '', FilterData: '', FetchData: gettrainmasterById, BindFrequency: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_master_id });
                } else {
                    res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: getTrainMaster, StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_master_id });
                }
            } else {
                res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: getTrainMaster, StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_master_id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.CheckTrainMasterNumber = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_master_number": req.body.train_master_number,
                "train_master_id": req.body.train_master_id,
            }
            const checkTrainmasternumber = await new Promise((resolve, reject) => {
                TrainMasterAPI.CheckTrainMasterNumber(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkTrainmasternumber.status == 'false') {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            } else {
                return res.status(200).json({ status: 1, Message: "true", data: null, error: null });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeleteTrainMaster = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_master_id": req.params.train_master_id
            }
            const gettrainmasterById = await new Promise((resolve, reject) => {
                TrainMasterAPI.DeleteTrainMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/TrainMaster', { title: 'TrainMaster', TrainMasterData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', BindFrequency: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_master_id });

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

