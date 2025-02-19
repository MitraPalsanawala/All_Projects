const CustomerOrgAPIManager = require('../../Network/CustOrgAPIManager/CustOrgAPI');
const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
const BlockAPIManager = require('../../Network/BlockAPIManager/BlockAPI');
var dotenv = require('dotenv');
var multer = require('multer');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');

exports.getCustOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "customer_type": req.body.customer_type ? req.body.customer_type : '',
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(params, option, (error, data) => {
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
            const getCustType = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getCustOrganization) {
                res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: getCustOrganization, CustTypeData: getCustType, SearchData: '', FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
            } else {
                res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: '', CustTypeData: getCustType, SearchData: '', FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.setCustOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var address = req.body.address ? req.body.address : null
            var customer_name = req.body.customer_name ? req.body.customer_name : null
            var customer_no = req.body.customer_no ? req.body.customer_no : null
            var customer_type = req.body.customer_type ? req.body.customer_type : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var state_id = req.body.state_id ? req.body.state_id : null
            var city = req.body.city ? req.body.city : null
            var pincode = req.body.pincode ? req.body.pincode : null
            var gstno = req.body.gstno ? req.body.gstno : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}CustomerOrg/setCustOrg`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "address": address,
                    "customer_name": customer_name,
                    "customer_no": customer_no,
                    "customer_type": customer_type,
                    "plant_id": plant_id,
                    "state_id": state_id,
                    "city": city,
                    "pincode": pincode,
                    "gstno": gstno,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    var jsonData = JSON.parse(data)
                    if (jsonData.status == true) {
                        res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: '', CustOrgData: '', CustTypeData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, ID: '' });
                    } else {
                        res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: '', CustOrgData: '', CustTypeData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, ID: '' });
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

exports.updateCustOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var id = req.body.id ? req.body.id : null
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var address = req.body.address ? req.body.address : null
            var customer_name = req.body.customer_name ? req.body.customer_name : null
            var customer_no = req.body.customer_no ? req.body.customer_no : null
            var customer_type = req.body.customer_type ? req.body.customer_type : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var state_id = req.body.state_id ? req.body.state_id : null
            var city = req.body.city ? req.body.city : null
            var pincode = req.body.pincode ? req.body.pincode : null
            var gstno = req.body.gstno ? req.body.gstno : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}CustomerOrg/updateCustOrg`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "address": address,
                    "customer_name": customer_name,
                    "customer_no": customer_no,
                    "customer_type": customer_type,
                    "plant_id": plant_id,
                    "state_id": state_id,
                    "city": city,
                    "pincode": pincode,
                    "gstno": gstno,
                    "created_by": created_by,
                    "updated_at": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    var jsonData = JSON.parse(data)
                    if (jsonData.status == true) {
                        res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: '', CustOrgData: '', CustTypeData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, ID: '' });
                    } else {
                        res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: '', CustOrgData: '', CustTypeData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, ID: '' });
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

exports.findByIDCustOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id ? req.params.id : null,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getCustOrganizationFindByID = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(params, option, (error, data) => {
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
            const getCustType = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getCustOrganizationFindByID) {
                if (getCustOrganizationFindByID.data.length > 0) {
                    res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: getCustOrganization, CustTypeData: getCustType, SearchData: '', FilterData: '', FetchData: getCustOrganizationFindByID, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
                }
                res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: getCustOrganization, CustTypeData: getCustType, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, ID: '' });
            } else {
                res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: getCustOrganization, CustTypeData: getCustType, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.deleteCustOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id
            }
            const deleteCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.DeleteCustOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(params, option, (error, data) => {
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
            const getCustType = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/CustomerOrganization', { title: 'CustomerOrganization', StateData: getState, CustOrgData: getCustOrganization, CustTypeData: getCustType, SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

// exports.setCustOrgStateMappingDetail = [async (req, res) => {
//     try {
//         if (req.cookies.admindata) {
//             var option = req.cookies.admindata;
//             var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
//             var customer_org_id = req.body.customer_org_id ? req.body.customer_org_id : null
//             var state_id = req.body.state_id ? req.body.state_id : null
//             var gst_no = req.body.gst_no ? req.body.gst_no : null

//             var add_params = {
//                 "customer_org_id": customer_org_id,
//                 "state_id": state_id,
//                 "gst_no": gst_no,
//                 "address3": body_address3,
//                 "created_by": '',
//             }

//             const setCustOrgStateMapping = await new Promise((resolve, reject) => {
//                 CustomerOrgAPIManager.setCustOrgStateMapping(add_params, option, (error, data) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(data);
//                     }
//                 });
//             });
//         } else {
//             res.redirect('./Splash');
//         }
//     } catch (error) {
//         return res.status(500).json({ status: 0, message: error.message, error: null });
//     }
// }];