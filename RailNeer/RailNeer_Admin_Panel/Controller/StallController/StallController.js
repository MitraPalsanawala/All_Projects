const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const StallAPIManager = require('../../Network/StallAPIManager/StallAPI');
const CustomerOrgAPIManager = require('../../Network/CustOrgAPIManager/CustOrgAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');

//--------------------------------------Stall Add------------------------------------//
exports.getStallAddDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            Params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            stparams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_by": "0",
                "order_by_key": "station_name",
                "key": "plant_id",
                "value": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(stparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(Params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.updateStallAddDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            // var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var id = req.body.id ? req.body.id : null
            var station_id = req.body.station_id ? req.body.station_id : null
            var cust_org_id = req.body.cust_org_id ? req.body.cust_org_id : null
            var name = req.body.name ? req.body.name : null
            var code = req.body.code ? req.body.code : null
            var gstnumber = req.body.gstnumber ? req.body.gstnumber : null
            // var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var userID = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/updateStallMaster`,
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
                        "station_id": station_id,
                        "cust_org_id": cust_org_id,
                        "name": name,
                        "code": code,
                        "gstnumber": gstnumber,
                        "is_active": true,
                        "is_delete": false,
                    }
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    // res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', Menutitle: 'PlantAdd', PlantData: getPlant, StateData: getState, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' })
                    res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: '', CustOrgData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.setStallAddDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var station_id = req.body.station_id ? req.body.station_id : null
            var cust_org_id = req.body.cust_org_id ? req.body.cust_org_id : null
            var name = req.body.name ? req.body.name : null
            var code = req.body.code ? req.body.code : null
            var gstnumber = req.body.gstnumber ? req.body.gstnumber : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';

            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/setStallMaster`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "station_id": station_id,
                    "cust_org_id": cust_org_id,
                    "name": name,
                    "code": code,
                    "gstnumber": gstnumber,
                    "created_by": created_by,
                    "plant_id": plant_id
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    // res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', Menutitle: 'PlantAdd', PlantData: getPlant, StateData: getState, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' })
                    res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: '', CustOrgData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: '', ID: '' });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.findByIDStallAddDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : '',
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            stParams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            console.log("===getStallDetail", getStallDetail)
            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(stParams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(stParams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            console.log("====getCustOrganization", getCustOrganization)

            if (getStallDetail) {
                if (getStallDetail.data.length > 0) {
                    res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: getStallDetail, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                } else {
                    res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                }
            } else {
                res.render('./RailNeer/StallAdd', { title: 'StallAdd', Menutitle: 'StallAdd', StallData: '', StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });

            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

//--------------------------------------Stall View------------------------------------//
exports.viewStallDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "is_stall_user_list": false,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "station_id": req.body.station_id ? req.body.station_id : '',
                "cust_org_id": req.body.cust_org_id ? req.body.cust_org_id : '',
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            // var stparams = {
            //     "order"
            // }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            stparams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_by": "0",
                "order_by_key": "station_name",
                "key": "plant_id",
                "value": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(stparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getStallDetail) {
                res.render('./RailNeer/StallView', { title: 'StallView', Menutitle: 'StallView', StallData: getStallDetail, StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', FilterData: bodyFilterStatus, SearchData: params, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '' });
            } else {
                res.render('./RailNeer/StallView', { title: 'StallView', Menutitle: 'StallView', StallData: '', StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', FilterData: bodyFilterStatus, SearchData: params, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeleteStallDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var id = req.params.id
            var userID = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var params = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "station_id": req.body.station_id ? req.body.station_id : '',
                "cust_org_id": req.body.cust_org_id ? req.body.cust_org_id : ''
            }

            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(stparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/updateStallMaster`,
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
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/StallView', { title: 'StallView', Menutitle: 'StallView', StallData: getStallDetail, StationData: getStationDetail, CustOrgData: getCustOrganization, FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Deleted.', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

//--------------------------------------Stall User------------------------------------//

exports.viewStallUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id ? req.params.id : '',
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            var stallparams = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : ''
            }
            const getStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(stallparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var userparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                'customer_org_id': getStallDetail.data ? getStallDetail.data[0].cust_org_id : ''
            }
            const getDropDownStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUserDropDown(userparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getStallUserDetail) {
                res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail, UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
            } else {
                res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail, UserData: '', StallUserData: '', StationData: '', StallData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.AddStallUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var stall_id = req.body.stall_id ? req.body.stall_id : null
            var user_id = req.body.user_id ? req.body.user_id : null
            var params = {
                "stall_id": req.params.id ? req.params.id : ''
            }

            var stallparams = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : ''
            }

            var plantparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(stallparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDropDownStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUserDropDown(plantparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/addStallUser`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "stall_id": stall_id,
                    "user_id": user_id
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = JSON.parse(response.body)
                    if (!data) { return }
                    if (data.status == true) {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: '', ID: stall_id });
                    } else {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: '', UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'User Already Assign', cookieData: req.cookies.admindata, moment: '', ID: stall_id });
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

exports.updateStallUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var stall_id = req.body.stall_id ? req.body.stall_id : null
            var user_id = req.body.user_id ? req.body.user_id : null

            var params = {
                "stall_id": req.params.id ? req.params.id : ''
            }
            var stallparams = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : ''
            }
            var plantparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(stallparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var plantparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                'customer_org_id': getStallDetail.data ? getStallDetail.data[0].cust_org_id : ''
            }
            const getDropDownStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUserDropDown(plantparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/updateStallUser`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "stall_id": stall_id,
                    "user_id": user_id
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = JSON.parse(response.body)
                    if (!data) { return }
                    if (data.status == true) {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: '', ID: stall_id });
                    } else {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'User Already Assign', cookieData: req.cookies.admindata, moment: '', ID: stall_id });
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

exports.findByIDStallUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;

            var params = {
                "id": req.params.id ? req.params.id : '',
                // "id": req.params.userid ? req.params.userid : '',
                // "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            var stallparams = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : ''
            }
            const getStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(stallparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const findByIDStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var plantparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                'customer_org_id': getStallDetail.data ? getStallDetail.data[0].cust_org_id : ''
            }
            const getDropDownStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUserDropDown(plantparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (findByIDStallUserDetail) {
                if (findByIDStallUserDetail.data && findByIDStallUserDetail.data.length > 0) {
                    res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: findByIDStallUserDetail, FilterData: '', SearchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                } else {
                    res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: '', StationData: '', StallData: getStallDetail, CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Data not Available', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                }
            } else {
                res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: '', StallUserData: '', StationData: '', StallData: getStallDetail, CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Data not Available', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.deleteStallUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var stall_id = req.body.stall_id ? req.body.stall_id : null
            var user_id = req.body.user_id ? req.body.user_id : null
            var params = {
                "stall_id": req.params.id ? req.params.id : '',
                // "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            var stallparams = {
                "is_stall_user_list": true,
                "is_from_admin": true,
                "is_delete": "0",
                "is_active": "1",
                "id": req.params.id ? req.params.id : ''
            }

            var plantparams = {
                'plant_id': req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            const getStallDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallMaster(stallparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDropDownStallUserDetail = await new Promise((resolve, reject) => {
                StallAPIManager.GetStallUserDropDown(plantparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var options = {
                'method': 'POST',
                'url': `${base_url}StallMaster/deleteStallUser`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    // "stall_id": stall_id,
                    // "user_id": user_id
                    "stall_id": req.params.id ? req.params.id : '',
                    "user_id": req.params.userid ? req.params.userid : ''
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = JSON.parse(response.body)
                    if (!data) { return }
                    if (data.status == true) {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: getDropDownStallUserDetail.data, UserData: getUserDetail.data, StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted.', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
                    } else {
                        res.render('./RailNeer/StallUser', { title: 'StallUser', Menutitle: 'StallUser', DropDownUserData: '', UserData: '', StallUserData: getStallUserDetail, StallData: getStallDetail, StationData: '', CustOrgData: '', FetchData: '', FilterData: '', SearchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong', cookieData: req.cookies.admindata, moment: '', ID: req.params.id });
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