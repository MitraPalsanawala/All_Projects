const StationMasterAPIManager = require('../../Network/StationMasterAPIManager/StationMasterAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");

exports.GetStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "is_nested_data": false,
                "is_from_admin": true,
                "is_like_query": true,
                "is_delete": "0",
                "is_active": "1",
                "order_by_key": "id",
                "order_by": "1",
                "per_page": "100",
            }
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.GetStationMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getStationMaster) {
                res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: getStationMaster, StateData: getState, SearchData: '', FilterData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: getState, SearchData: '', FilterData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.BindStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodylastElement = req.body.lastElement;
            var bodyPageLength = req.body.PageLength;
            var params = {
                "is_from_admin": true,
                "is_like_query": false,
                "unique_key": bodylastElement,
                "is_delete": "0",
                "is_active": "1",
                "order_by_key": "id",
                "order_by": "1",
                "per_page": bodyPageLength
            }
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.GetStationMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.json(getStationMaster);
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetStationDetail1 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            // var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var name = req.body.name ? req.body.name : null
            var code = req.body.code ? req.body.code : null
            var address = req.body.address ? req.body.address : null
            var state_id = req.body.state_id ? req.body.state_id : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            console.log("====req.body====", req.body)
            var options = {
                'method': 'POST',
                'url': `${base_url}StationMaster/setStationMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "name": name,
                    "code": code,
                    "address": address,
                    "state_id": state_id,
                    "created_by": created_by,
                    // "created_at": mysqlTimestamp,
                })
            };
            console.log("======options", options)
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    console.log("----data------------>", data);
                    // if (data.status == true) {
                    res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    // } else {
                    //     res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: '"Already Code Is Available', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    // }
                    // res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            // var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var name = req.body.name ? req.body.name : null
            var code = req.body.code ? req.body.code : null
            var address = req.body.address ? req.body.address : null
            var state_id = req.body.state_id ? req.body.state_id : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}StationMaster/setStationMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "name": name,
                    "code": code,
                    "address": address,
                    "state_id": state_id,
                    "created_by": created_by,
                    // "created_at": mysqlTimestamp,
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = JSON.parse(response.body)
                    if (!data) { return }
                    if (data.status == true) {
                        res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Already Station Code Is Available', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                    // res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: '', SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.UpdateStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            // var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var id = req.body.id ? req.body.id : null
            var name = req.body.name ? req.body.name : null
            var code = req.body.code ? req.body.code : null
            var address = req.body.address ? req.body.address : null
            var state_id = req.body.state_id ? req.body.state_id : null
            var userID = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}StationMaster/updateStationMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "user_id": userID,
                    "input_data": {
                        "name": name,
                        "code": code,
                        "address": address,
                        "state_id": state_id,
                        "is_active": true,
                        "is_delete": false,
                    }
                })
            };

            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = JSON.parse(response.body)
                    if (!data) { return }
                    console.log("----data------------>", data);
                    if (data.status == true) {
                        res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Already Station Code Is Available', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                    // res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.FindByIDStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "is_nested_data": false,
                "is_from_admin": true,
                "is_like_query": true,
                "is_delete": "0",
                "is_active": "1",
                "order_by_key": "id",
                "order_by": "1",
                "per_page": "100",
                "id": req.params.id ? req.params.id : ''
            }
            // var IDParams = {
            //     "id": req.params.id
            // }
            // console.log("===params===", params)
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.GetStationMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getByIDStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.GetStationMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getByIDStationMaster) {
                if (getByIDStationMaster.data.length > 0) {
                    res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: getStationMaster, StateData: getState, SearchData: '', FilterData: '', FetchData: getByIDStationMaster, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                } else {
                    res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: getStationMaster, StateData: getState, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            } else {
                res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: getStationMaster, StateData: getState, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeleteStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var id = req.params.id
            var userID = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}StationMaster/updateStationMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },

                body: JSON.stringify({
                    "id": id,
                    "user_id": userID,
                    "input_data": {
                        "is_active": false,
                        "is_delete": true,
                    }
                })
            };
            console.log("======options", options)
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    console.log("----data------------>", data);
                    // res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    res.render('./RailNeer/StationMaster', { title: 'StationMaster', StationMasterData: '', StateData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Deleted.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

