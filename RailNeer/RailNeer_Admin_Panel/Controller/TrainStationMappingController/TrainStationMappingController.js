const TrainAPIManager = require('../../Network/TrainAPIManager/TrainAPI');
const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const TrainStationMappingAPIManager = require('../../Network/TrainStationMappingAPIManger/TrainStationMaapingAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { json } = require('express');
const axios = require('axios');
const { connect } = require('../../routes');

exports.GetTrainStationMappingData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyTrainID = req.params.train_id ? req.params.train_id : req.body.train_id ? req.body.train_id : '';

            var params = {
                "train_id": bodyTrainID,
                "station_id": req.body.station_id
            }

            var stationparams = {
                "order_by": "0",
                "order_by_key": "station_name",
                "key": "plant_id",
                "value": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(stationparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainStationMapping = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.GetTrainStationMapping(params, option, (error, data) => {
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
            if (getTrainStationMapping) {
                res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: getTrainStationMapping, TrainData: '', StationData: getStation, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
            } else {
                res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: '', TrainData: '', StationData: getStation, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetTrainStationMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyTrainID = req.params.train_id ? req.params.train_id : req.body.train_id ? req.body.train_id : '';
            var params = {
                "train_id": bodyTrainID,
                "id": req.params.id,
            }
            const getTrainStationMapping = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.GetTrainStationMapping(params, option, (error, data) => {
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
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var train_id = req.body.train_id
            var station_id = req.body.station_id ? req.body.station_id : null
            var sequence = req.body.sequence ? req.body.sequence : null
            var time = req.body.time ? req.body.time : null
            // var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}TrainStationMapping/setTrainStationMapping`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "train_id": bodyTrainID,
                    "station_id": station_id,
                    "sequence": sequence,
                    // "plant_id": plant_id,
                    "time": time,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp
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
                        res.redirect('/TrainStationMappingView/' + bodyTrainID);
                    } else {
                        res.redirect('/TrainStationMappingView/' + bodyTrainID);
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

exports.FindByIDTrainStationMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_id": req.params.train_id,
                "id": req.params.id,
                "station_id": req.body.station_id
            }
            const getStation = await new Promise((resolve, reject) => {
                StationAPIManager.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainStationMapping = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.GetTrainStationMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainStationMappingByID = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.GetTrainStationMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getTrainStationMappingByID) {
                if (getTrainStationMappingByID.data && getTrainStationMappingByID.data.length > 0) {
                    res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: getTrainStationMapping, TrainData: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: getTrainStationMappingByID, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
                } else {
                    res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: getTrainStationMapping, TrainData: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data not Availabel', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
                }
            } else {
                res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: getTrainStationMapping, TrainData: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data not Availabel', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.UpdateTrainStationMapping = [async (req, res) => {
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
            var id = req.body.id
            var train_id = req.body.train_id
            var station_id = req.body.station_id ? req.body.station_id : null
            var sequence = req.body.sequence ? req.body.sequence : null
            var time = req.body.time ? req.body.time : null
            // var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}TrainStationMapping/updateTrainStationMapping`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "train_id": train_id,
                    "station_id": station_id,
                    "sequence": sequence,
                    // "plant_id": plant_id,
                    "time": time,
                    "updated_by": updated_by,
                    "updated_at": mysqlTimestamp
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
                        res.redirect('/TrainStationMappingView/' + train_id);
                        // res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: '', TrainData: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
                    } else {
                        res.redirect('/TrainStationMappingView/' + train_id);
                        // res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: '', TrainData: '', StationData: getStation, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Record Already Exist!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                }
            });
        } else {
            res.redirect('./Splash')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeleteTrainStationMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "train_id": req.params.train_id,
                "id": req.params.id,
            }
            const deleteTrainStationMapping = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.DeleteTrainStationMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTrainStationMapping = await new Promise((resolve, reject) => {
                TrainStationMappingAPIManager.GetTrainStationMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/TrainStationMappingView', { title: 'TrainStationMappingView', TrainStationMappingData: getTrainStationMapping, TrainData: '', StationData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.train_id });
        } else {
            res.redirect('./Splash')
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];