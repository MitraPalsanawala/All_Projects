const TrainAPIManager = require('../../Network/TrainAPIManager/TrainAPI');
const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const TrainMasterAPI = require('../../Network/TrainMasterAPIManager/TrainMasterAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { json } = require('express');
const axios = require('axios');

exports.GetTrainData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_name": req.body.train_name ? req.body.train_name : '',
                "train_id": req.body.train_id ? req.body.train_id : '',
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "station_id": req.body.station_id ? req.body.station_id : '',
                "order_type": req.body.order_type ? req.body.order_type : '',
                "order_by": "1",
                "order_by_key": "train_id"
            }

            trainmasterparams = {
                "order_by": "0",
                "order_by_key": "train_master_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            stationparams = {
                "order_by": "0",
                "order_by_key": "station_name",
                "key": "plant_id",
                "value": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            trainparams = {
                "order_by": "0",
                "order_by_key": "train_name",
                // "train_id": req.body.train_id ? req.body.train_id : '',
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getTrain = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainDropdown = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(trainparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(stationparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getTrainMaster = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(trainmasterparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: getTrainDropdown, TrainData: getTrain, TrainMasterData: getTrainMaster, StationData: getStation, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', BindFrequency: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.SetTrainData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var train_number = req.body.train_number ? req.body.train_number : null
            var train_name = req.body.train_name ? req.body.train_name : null
            var train_master_id = req.body.train_master_id ? req.body.train_master_id : null
            var target_qty = req.body.target_qty ? req.body.target_qty : null
            var frequency_value = req.body.frequency_value ? req.body.frequency_value : null
            var frequency = req.body.frequency ? req.body.frequency : null
            var default_station_id = req.body.default_station_id ? req.body.default_station_id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var ArrfrequencyData = req.body.lblfrequency ? req.body.lblfrequency : null;
            var order_type = req.body.order_type ? req.body.order_type : null;
            // var ArrfrequencyData = req.body.frequency ? req.body.frequency.toString() : null;

            var options = {
                'method': 'POST',
                'url': `${base_url}Train/setTrain`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "train_name": train_name,
                    "train_master_id": train_master_id,
                    "train_number": train_number,
                    "target_qty": target_qty,
                    "plant_id": plant_id,
                    "frequency_value": 'text',
                    "frequency": ArrfrequencyData,
                    "default_station_id": default_station_id,
                    // "train_id": train_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                    "order_type": order_type
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
                        res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: '', TrainData: '', TrainMasterData: '', StationData: getStation, SearchData: '', FetchData: '', FilterData: '', BindFrequency: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: '', TrainData: '', TrainMasterData: '', StationData: getStation, SearchData: '', FetchData: '', FilterData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.UpdateTrainData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var train_id = req.body.train_id ? req.body.train_id : ""
            var train_number = req.body.train_number ? req.body.train_number : null
            var train_name = req.body.train_name ? req.body.train_name : null
            var train_master_id = req.body.train_master_id ? req.body.train_master_id : null
            var target_qty = req.body.target_qty ? req.body.target_qty : null
            var frequency_value = req.body.frequency_value ? req.body.frequency_value : null
            var frequency = req.body.frequency ? req.body.frequency : null
            var default_station_id = req.body.default_station_id ? req.body.default_station_id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var order_type = req.body.order_type ? req.body.order_type : null;

            var ArrfrequencyData = req.body.lblfrequency ? req.body.lblfrequency : null;

            var options = {
                'method': 'POST',
                'url': `${base_url}Train/updateTrain`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "train_id": train_id,
                    "train_master_id": train_master_id,
                    "train_name": train_name,
                    "train_number": train_number,
                    "target_qty": target_qty,
                    "plant_id": plant_id,
                    "frequency_value": 'text',
                    "frequency": ArrfrequencyData,
                    "default_station_id": default_station_id,
                    // "train_id": train_id,
                    "updated_by": updated_by,
                    "updated_at": mysqlTimestamp,
                    "order_type": order_type
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
                        res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: '', TrainMasterData: '', TrainData: '', StationData: getStation, SearchData: '', FetchData: '', FilterData: '', BindFrequency: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
                    } else {
                        res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: '', TrainMasterData: '', TrainData: '', StationData: getStation, SearchData: '', FetchData: '', FilterData: '', BindFrequency: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.FindByTrainID = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var temp = new Array();
            var params = {
                "train_id": req.params.train_id,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_by": "1",
                "order_by_key": "train_id"
            }

            trainparams = {
                "order_by": "0",
                "order_by_key": "train_name",
            }
            trainmasterparams = {
                "order_by": "0",
                "order_by_key": "train_master_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            const gettrainById = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // temp = gettrainById[0].frequency.split(",");
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainMaster = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(trainmasterparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainDropdown = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(trainparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrain = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (gettrainById) {
                if (gettrainById.data.length > 0) {
                    temp = gettrainById.data[0].frequency.split(",");
                    res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: getTrainDropdown, TrainData: getTrain, TrainMasterData: getTrainMaster, BindFrequency: temp, StationData: getStation, SearchData: '', FilterData: '', FetchData: gettrainById, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
                } else {
                    res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: getTrainDropdown, TrainData: getTrain, TrainMasterData: getTrainMaster, BindFrequency: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });

                }
            } else {
                res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: getTrainDropdown, TrainData: getTrain, TrainMasterData: getTrainMaster, BindFrequency: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id })
            }

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];
exports.CheckTrainName = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_name": req.body.train_name,
                "train_id": req.body.train_id,
            }
            const checkTrainname = await new Promise((resolve, reject) => {
                TrainAPIManager.CheckTrainName(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkTrainname.status == 'false') {
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
exports.CheckTrainNumber = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_number": req.body.train_number,
                "train_id": req.body.train_id,
                "default_station_id": req.body.default_station_id,
            }

            const checkTrainnumber = await new Promise((resolve, reject) => {
                TrainAPIManager.CheckTrainNumber(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkTrainnumber.status == 'false') {
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
exports.DeleteTrain = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_id": req.params.train_id
            }
            trainparams = {
                "order_by": "0",
                "order_by_key": "train_name",
                // "train_id": req.body.train_id ? req.body.train_id : '',
            }
            const gettrainById = await new Promise((resolve, reject) => {
                TrainAPIManager.DeleteTrain(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainMaster = await new Promise((resolve, reject) => {
                TrainMasterAPI.GetTrainMaster(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainDropdown = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(trainparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // res.render('./RailNeer/Train', { title: 'Train', TrainData: gettrainById, temp: temp, StationData: getStation, SearchData: '', FilterData: '', FetchData: gettrainById, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
            res.render('./RailNeer/Train', { title: 'Train', TrainDropDown: getTrainDropdown, TrainData: '', TrainMasterData: getTrainMaster, BindFrequency: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];
exports.BindTrainNumber = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_master_name": req.body.train_master_name,
                "train_master_id": req.body.train_master_id,
            }
            const checkTrainnumber = await new Promise((resolve, reject) => {
                TrainMasterAPI.BindTrainNumber(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkTrainnumber.status == 'false') {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            } else {
                return res.status(200).json({ status: 1, Message: "true", data: checkTrainnumber, error: null });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];