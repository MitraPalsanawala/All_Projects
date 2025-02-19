const UserAPIManager = require('../../Network/UserAPIManager/UserAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { json } = require('express');
const axios = require('axios');
const excel = require("exceljs");
const crypto = require("crypto");
const { isNull } = require('underscore');
const ENC = process.env.ENC
const IV = process.env.IV
const ALGO = process.env.ALGO

const encrypt = (text) => {
    let cipher = crypto.createCipheriv(ALGO, ENC, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
};

const decrypt = (text) => {
    let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
    let decrypted = decipher.update(text, "base64", "utf8");
    return decrypted + decipher.final("utf8");
};
exports.GetSplash = [async (req, res) => {
    try {
        // const getUser = await new Promise((resolve, reject) => {
        //     UserAPIManager.GetUser(null, option, (error, data) => {
        //         if (error) {
        //             reject(error);
        //         } else {
        //             resolve(data);
        //         }
        //     });
        // });
        res.render('./RailNeer/Splash', { title: 'Splash', Menutitle: 'Splash', alertTitle: '', alertMessage: '', cookieData: '', moment: moment1, ID: '' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetPanelLogin = [async (req, res) => {
    try {
        var admindata = [];
        var username = req.body.username;
        var password = req.body.password;
        var options = {
            'method': 'POST',
            // 'url': `${base_url}User/userLoginPanel`,
            'url': `${base_url}User/userLogin`,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        };
        request(options, function (error, response) {
            if (error) {
            } else {
                var data = response.body
                if (!data) { return }
                var jsonData = JSON.parse(data)
                if (jsonData.status == false) {
                    res.render('./RailNeer/Splash', { title: 'Splash', Menutitle: 'Splash', alertTitle: 'Invalid', alertMessage: jsonData.message, cookieData: '', moment: moment1, ID: '' });
                } else if (jsonData.status == true) {

                    //Old Start Banti Parmar 30-10-2023
                    //let is_plant_admin_or_not = jsonData.data[0] ? jsonData.data[0].user_role_map.length > 0 ? jsonData.data[0].user_role_map[0].is_plant_admin : '' : '';
                    //Old End Banti Parmar 30-10-2023

                    //New Start Banti Parmar 30-10-2023
                    let is_plant_admin_or_not = jsonData.data[0] ? jsonData.data[0].user_role_map.length > 0 ? jsonData.data[0].user_role_map[0].is_plant_admin_web : '' : '';
                    //New End Banti Parmar 30-10-2023

                    let ck_user_role = jsonData.data[0].user_role_map[0].user_role[0].role_name;
                    let is_report_admin_status = jsonData.data[0] ? jsonData.data[0].user_role_map.length > 0 ? jsonData.data[0].user_role_map[0].is_report_admin : '' : '';
                    // if (ck_user_role == 'admin') {
                    //     ck_plant_id = jsonData.data[0].plant_detail ? jsonData.data[0].plant_detail[0].plant_id : '';
                    // } else {
                    //     ck_plant_id = jsonData.data[0].plant_detail ? jsonData.data[0].user_role_map[0].plant_id : '';
                    // }
                    let ck_plant_id;
                    var is_login_status = false;
                    if (ck_user_role == 'admin') {
                        ck_plant_id = jsonData.data[0].plant_detail ? jsonData.data[0].plant_detail[0].plant_id : '';
                        is_login_status = true;
                    } else if (ck_user_role == 'plant' && is_plant_admin_or_not == true) {
                        ck_plant_id = jsonData.data[0].plant_detail ? jsonData.data[0].user_role_map[0].plant_id : '';
                        is_login_status = true;
                    } else if (ck_user_role == 'report') {
                        ck_plant_id = jsonData.data[0].plant_detail ? jsonData.data[0].plant_detail[0].plant_id : '';
                        is_login_status = true;
                    } else {
                        is_login_status = false;
                    }

                    if (is_login_status) {
                        var token = "";
                        if (jsonData.user_login_info_data && jsonData.user_login_info_data != null && jsonData.user_login_info_data.length > 0) {
                            token = jsonData.user_login_info_data[0].token;
                        }
                        admindata.push({
                            id: jsonData.data[0].id,
                            password: jsonData.data[0].password,
                            username: jsonData.data[0].username,
                            status: jsonData.data[0].status,
                            user_role_id: jsonData.data[0].user_role_map.length > 0 ? jsonData.data[0].user_role_map[0].user_role_id : '',

                            user_role_name: jsonData.data[0].user_role_map.length > 0 ? jsonData.data[0].user_role_map[0].user_role.length > 0 ? jsonData.data[0].user_role_map[0].user_role[0].role_name.toString() : '' : '',

                            // user_role_id: '',
                            // user_role_name: '',
                            is_report_admin: is_report_admin_status,
                            plant_id: ck_plant_id,
                            token: token
                            // LastName: jsonData.data[0].LastName
                        })

                        res.cookie("admindata", admindata, {
                            maxAge: 1000 * 3600 // 1 hour
                        });

                        var option = admindata;
                        var login_user_id = option ? option[0].id : '';
                        var token = option ? option[0].token : '';

                        var sendParam = {}
                        sendParam["order_by"] = 1
                        sendParam["user_role_id"] = option ? option[0].user_role_id : ''
                        sendParam["is_report_admin"] = option ? option[0].is_report_admin : ''
                        sendParam["user_id"] = option ? option[0].id : ''
                        var options = {
                            'method': 'POST',
                            'url': `${process.env.BaseURL}Plant/getPlant`,
                            'headers': {
                                'Content-Type': 'application/json',
                                'login_user_id': `${login_user_id}`,
                                'from': `${process.env.from}`,
                                'authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(sendParam)
                        };
                        request(options, function (error, response, body) {
                            if (error) {
                                reject(error);
                            } else {
                                var jsonData = JSON.parse(body);
                                if (jsonData && jsonData.data) {
                                    req.app.locals.plantNameData = jsonData.data;
                                }
                            }
                        });

                        res.render('./RailNeer/Splash', { title: 'Splash', Menutitle: 'Splash', alertTitle: 'Success', alertMessage: jsonData.message, cookieData: admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/Splash', { title: 'Splash', Menutitle: 'Splash', alertTitle: 'Invalid', alertMessage: 'You are not authorized person', cookieData: '', moment: moment1, ID: '' });
                    }
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetPanelLogout = [async (req, res) => {
    try {
        res.clearCookie("admindata");
        res.redirect('./Splash');
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetUserAddData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/UserAdd', { title: 'UserAdd', StateData: getState, UserData: '', SearchData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.SetUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var username = req.body.username ? req.body.username : null
            var password = req.body.password ? req.body.password : null
            var gstinnumber = req.body.gstinnumber ? req.body.gstinnumber : null
            var name = req.body.name ? req.body.name : null
            var number = req.body.number ? req.body.number : null
            var address = req.body.address ? req.body.address : null
            var state = req.body.ddlState ? req.body.ddlState : null
            var city = req.body.ddlCity ? req.body.ddlCity : null
            var pincode = req.body.pincode ? req.body.pincode : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            // var user_code = req.body.user_code ? req.body.user_code : null
            // var updated_by = req.body.updated_by ? req.body.updated_by : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}User/UserAddInformationPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "gstinnumber": gstinnumber,
                    // "user_code": "",
                    // "updated_by": "",
                    "name": name,
                    "number": number,
                    "address": address,
                    "state": state,
                    "city": city,
                    "pincode": pincode,
                    "plant_id": plant_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                    // "updated_at": mysqlTimestamp
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
                        res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: '', SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Success', alertMessage: jsonData.message, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: '', SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Invalid', alertMessage: jsonData.message, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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

exports.UpdateUser = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var id = req.body.id ? req.body.id : ""
            var username = req.body.username ? req.body.username : ""
            var password = req.body.password ? req.body.password : ""
            //var HDpassword = req.body.HDpassword ? req.body.HDpassword : ""
            var new_password = req.body.new_password ? req.body.new_password : ""
            var gstinnumber = req.body.gstinnumber ? req.body.gstinnumber : ""
            var name = req.body.name ? req.body.name : ""
            var number = req.body.number ? req.body.number : ""
            var address = req.body.address ? req.body.address : ""
            var state = req.body.ddlState ? req.body.ddlState : ""
            var city = req.body.ddlCity ? req.body.ddlCity : ""
            var pincode = req.body.pincode ? req.body.pincode : ""
            var plant_id = req.body.plant_id ? req.body.plant_id : ""
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            password = encrypt(password);
            new_password = encrypt(new_password);

            var options = {
                'method': 'POST',
                'url': `${base_url}User/userUpdateInformationPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "username": username,
                    "password": password,
                    "new_password": new_password,
                    "gstinnumber": gstinnumber,
                    "name": name,
                    "number": number,
                    "address": address,
                    "state": state,
                    "city": city,
                    "pincode": pincode,
                    "plant_id": plant_id,
                    "updated_by": updated_by,
                    //"created_at": mysqlTimestamp,
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
                        res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: '', SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                    } else {
                        res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: '', SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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

exports.ShowUserData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "username": req.body.username ? req.body.username : '',
                "number": req.body.number ? req.body.number : '',
                "name": req.body.name ? req.body.name : '',
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (userData) {
                res.render('./RailNeer/UserView', { title: 'UserView', UserData: userData, SearchData: params, FilterData: bodyFilterStatus, StateData: '', moment: moment1, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/UserView', { title: 'UserView', UserData: '', SearchData: params, FilterData: bodyFilterStatus, StateData: '', moment: moment1, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.UserStatus = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var id = req.params.id ? req.params.id : null
            var UserStatus = ((req.params.Value) ? (req.params.Value) : { $nin: [] })
            var UpdateData;
            if (UserStatus == "false") {
                UpdateData = "1";
            } else {
                UpdateData = "0";
            }
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}User/updateUserStatus`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    'id': id,
                    "status": UpdateData,
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
                    res.json({ status: 0, data: jsonData });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.FindByUserID = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;

            var params = {
                "id": req.params.id,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            const getUserById = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getUserById) {
                if (getUserById.data && getUserById.data.length > 0) {
                    res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: userData, SearchData: '', FetchData: getUserById, StateData: getState, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                } else {
                    res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: userData, SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            } else {
                res.render('./RailNeer/UserAdd', { title: 'UserAdd', Menutitle: 'UserAdd', UserData: userData, SearchData: '', FetchData: '', StateData: getState, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.bindCity = [async (req, res) => {
    try {
        // await Connection.connect();

        let Country = "India";
        let State = req.params.StateName;
        let URL = "https://countriesnow.space/api/v0.1/countries/state/cities";

        const payload = { country: Country, state: State };
        const response = await axios.post(URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseDataArray = Object.values(response.data);
        let cityData = responseDataArray[2];
        return res.status(200).json({ status: 1, message: 'Success', CityData: cityData, error: null })
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.CheckUserName = [async (req, res) => {
    try {
        var option = req.cookies.admindata;

        var params = {
            "username": req.body.username,
            "id": req.body.id,
        }

        const checkUsername = await new Promise((resolve, reject) => {
            UserAPIManager.CheckUserName(params, option, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        if (checkUsername.status == 'false') {
            return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
        } else {
            return res.status(200).json({ status: 1, Message: "true", data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.PasswordDecrypt = [async (req, res) => {
    try {
        // var password = req.params.password ? req.params.password : null
        var password = req.body.password ? req.body.password : null
        if (password) {
            password = decrypt(password);
        }
        return res
            .status(200)
            .json({
                status: true,
                message: 'done',
                data: password,
                error: null
            });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeleteUserData = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var id = req.params.id ? req.params.id : ""
            var options = {
                'method': 'POST',
                'url': `${base_url}User/deleteUserInformationPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "status": '0',
                    "IsDeleted": '1',
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/UserView', { title: 'UserView', UserData: userData, SearchData: '', StateData: '', FilterData: '', moment: moment1, alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.ViewUserExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "username": req.body.username ? req.body.username : '',
                "number": req.body.number ? req.body.number : '',
                "name": req.body.name ? req.body.name : '',
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var exceluserdata = [];

            if (userData && userData.data && userData.data.length > 0) {
                userData.data.forEach((userdata) => {
                    statedata = []
                    citydata = []
                    addressdata = []
                    mobilenodata = []
                    namedata = []
                    userdata.UserDetail.forEach((doc) => {
                        statedata.push(doc.state);
                        namedata.push(doc.name);
                        mobilenodata.push(doc.number);
                        citydata.push(doc.city);
                        addressdata.push(doc.address);
                    });
                    exceluserdata.push({
                        "username": userdata.username,
                        "Name": namedata ? namedata.toString() : "",
                        "MobileNo": mobilenodata ? mobilenodata.toString() : "",
                        "StateName": statedata ? statedata.toString() : "",
                        "CityName": citydata ? citydata.toString() : "",
                        "address": addressdata ? addressdata.toString() : "",
                        "IsActive": (userdata.status == 0) ? ('InActive') : ('Active'),
                    });
                });
            }

            // excelplantdata = getPlant;
            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("User Details");
            worksheet.columns = [
                { header: "User Name", key: "username", width: 20 },
                { header: "Mobile No", key: "MobileNo", width: 15 },
                { header: "Name", key: "Name", width: 10 },
                { header: "State", key: "StateName", width: 10 },
                { header: "City", key: "CityName", width: 20 },
                { header: "Address", key: "address", width: 32 },
                { header: "Active/InActive", key: "IsActive", width: 15 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'User Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:G1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(exceluserdata);
            worksheet.eachRow(function (row, rowNumber) {
                row.eachCell((cell, colNumber) => {
                    if (rowNumber == 1) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'ff03449e' }
                        },
                            cell.font = { color: { argb: 'ffffff' }, bold: true }
                    }
                    //Set border of each cell
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };

                    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                })
                //Commit the changed row to the stream
                row.commit();
            });

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UserDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.getUploadDownload = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            // var params = {

            // }
            res.render('./RailNeer/UploadDownload', { title: 'UploadDownload', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DownloadUserExcel = [async (req, res) => {
    try {
        try {
            if (req.cookies.admindata) {
                var option = req.cookies.admindata;
                const currentDate = moment(Date.now()).format('DD-MM-YYYY');
                var params = {
                    "stock_from": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                    "startdate": req.body.startdate ? req.body.startdate : currentDate,
                    "enddate": req.body.enddate ? req.body.enddate : currentDate
                }
                var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

                var getPlantToPlantExportReport = await new Promise((resolve, reject) => {
                    ReportAPIManager.getPlantToPlantExport(params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                var excelExportdata = [];
                // excelExportdata = getPlantToPlantExportReport;

                // var excelinrcorrectionreportdata = [];
                // excelinrcorrectionreportdata = getINRCorrectionReport;

                if (getPlantToPlantExportReport && getPlantToPlantExportReport.data && getPlantToPlantExportReport.data.length > 0) {
                    excelExportdata = getPlantToPlantExportReport;
                }


                //if (excelorderdata.length > 0) {
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet("User Detail Report");

                worksheet.columns = [
                    { header: "To Plant", key: "master_plant_name", width: 20 },
                    { header: "From Plant", key: "plant_name", width: 15 },
                    { header: "Product", key: "product_name", width: 15 },
                    { header: "Quantity", key: "quantity", width: 15 },
                    { header: "Date", key: "Date", width: 15 }
                ];

                worksheet.spliceRows(1, 0, [])
                // Set title
                worksheet.getCell('A1').value = 'User Detail Report'

                // Optional merge and styles
                worksheet.mergeCells('A1:E1')
                worksheet.getCell('A1').alignment = { horizontal: 'center' }

                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true };
                });
                worksheet.getRow(2).eachCell((cell) => {
                    cell.font = { bold: true };
                });

                worksheet.addRows(excelExportdata);

                worksheet.eachRow(function (row, rowNumber) {
                    row.eachCell((cell, colNumber) => {
                        if (rowNumber == 1) {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff03449e' }
                            },
                                cell.font = { color: { argb: 'ffffff' }, bold: true }
                        }
                        //Set border of each cell
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                    })
                    //Commit the changed row to the stream
                    row.commit();
                });

                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "UserDetail.xlsx"
                );
                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            } else {
                res.redirect('./Splash');
            }
        } catch (error) {
            return res.status(500).json({ status: 0, message: error.message, error: null });
        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];


exports.PageNotFound = [async (req, res) => {
    try {
        res.render('./404', { title: 'PageNotFound' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.ChangePassword = [async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.getChangePassword = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            res.render('./RailNeer/ChangePassword', { title: 'ChangePassword', cookieData: req.cookies.admindata, alertTitle: '', alertMessage: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.setChangePassword = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var add_params = {
                "userID": option ? option[0].id : '',
                "oldPassword": req.body.oldPassword,
                "newPassword": req.body.newPassword,
                "confirmPassword": req.body.confirmPassword
            }
            const setChangePassword = await new Promise((resolve, reject) => {
                UserAPIManager.ChangePassword(add_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (setChangePassword) {
                if (setChangePassword.status) {
                    res.render('./RailNeer/ChangePassword', { title: 'ChangePassword', Menutitle: 'ChangePassword', alertTitle: 'Success', alertMessage: 'Password Reset Successfully.', cookieData: req.cookies.admindata });
                    res.clearCookie("admindata");
                }
                else {
                    res.render('./RailNeer/ChangePassword', { title: 'ChangePassword', Menutitle: 'ChangePassword', alertTitle: 'Invalid', alertMessage: 'Incorrect Old password.', cookieData: req.cookies.admindata });
                }
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];