const UserRoleMappingAPIManager = require('../../Network/UserRoleMappingAPIManager/UserRoleMappingAPI');
const UserAPIManager = require('../../Network/UserAPIManager/UserAPI');
const CfaOrgAPIManager = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
const TrainAPIManager = require('../../Network/TrainAPIManager/TrainAPI');
const StationAPIManger = require('../../Network/StationAPIManager/StationAPI');
const CustOrgAPIManger = require('../../Network/CustOrgAPIManager/CustOrgAPI');
var dotenv = require('dotenv');
dotenv.config()
const excel = require("exceljs");
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');

exports.GetUserRoleMappingDetail = [async (req, res) => {
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
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const cfaOrgData = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (UserRoleMappingData) {
                res.render('./RailNeer/UserRoleMapping', { title: 'UserRoleMapping', UserData: userData, UserRoleMappingData: userrolemappingData, CfaOrgData: cfaOrgData, alertTitle: '', alertMessage: '', cookieData: '', moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/UserRoleMapping', { title: 'UserRoleMapping', UserData: userData, UserRoleMappingData: '', CfaOrgData: cfaOrgData, alertTitle: '', alertMessage: '', cookieData: '', moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.SetUserRoleMappingDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

            var options = {
                'method': 'POST',
                'url': `${base_url}User/setUserRoleMapping`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": "",
                    "user_id": "",
                    "plant_id": "",
                    "is_plant_admin": "",
                    "cfa_org_id": "",
                    "is_controller": "",
                    "is_supplier": "",
                    "is_collection": "",
                    "customer_org_id": "",
                    "station_id": "",
                    "customer_type_id": "",
                    "default_quantity": "",
                    "train_id": "",
                    "location_no": "",
                    "created_by": mysqlTimestamp,
                    "updated_by": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                    console.log("----API ERROR------------>", error);
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/UserRoleMapping', { title: 'UserRoleMapping', Menutitle: 'UserRoleMapping', UserData: '', SearchData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: '', moment: moment1, ID: '' });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
//--------------------------------------------Plant User Role-------------------------------------------------//

exports.GetPlantUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "plant",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "number": req.body.number ? req.body.number : ''
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (userrolemappingData) {
                res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, FetchData: '', SearchData: params, FilterData: bodyFilterStatus, UserRoleMappingData: userrolemappingData, CfaOrgData: '', FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, FetchData: '', SearchData: params, FilterData: bodyFilterStatus, UserRoleMappingData: '', CfaOrgData: '', FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.AddPlantUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "plant",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }


            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            // var user_role_id = userroleData[0] ? userroleData[0].user_role_id : ''
            var user_role_id = bindID;
            var user_id = req.body.user_id ? req.body.user_id : null
            var is_plant_admin = req.body.is_plant_admin === '1' ? 1 : 0
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var default_quantity = req.body.default_quantity ? req.body.default_quantity : null
            var train_id = req.body.train_id ? req.body.train_id : null
            var location_no = req.body.location_no ? req.body.location_no : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}User/updateUserRoleMappingPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    "is_plant_admin": is_plant_admin,
                    "cfa_org_id": "",
                    "is_controller": "",
                    "is_supplier": "",
                    "is_collection": "",
                    "customer_org_id": "",
                    "station_id": "",
                    "customer_type_id": "",
                    "default_quantity": default_quantity,
                    "train_id": train_id,
                    "location_no": location_no,
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
                        res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, UserRoleMappingData: '', FetchData: '', CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, UserRoleMappingData: '', FetchData: '', CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
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
exports.UpdatePlantUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "plant",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var user_id = req.body.user_id ? req.body.user_id : null
            var user_role_id = bindID
            var user_role_mapping_id = req.body.user_role_mapping_id ? req.body.user_role_mapping_id : null
            var is_plant_admin = req.body.is_plant_admin == '' ? 1 : 0;
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var default_quantity = req.body.default_quantity ? req.body.default_quantity : ''
            var train_id = req.body.train_id ? req.body.train_id : ''
            var location_no = req.body.location_no ? req.body.location_no : ''
            var updated_by = req.cookies.admindata ? req.cookies.admindata[0].id : ''

            var options = {
                'method': 'POST',
                'url': `${base_url}User/useRoleMappingUpdate`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_role_mapping_id": user_role_mapping_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    "is_plant_admin": is_plant_admin,

                    "default_quantity": default_quantity,
                    "train_id": train_id,
                    "location_no": location_no,
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
                        res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: '', UserRoleMappingData: '', FetchData: '', CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.user_role_mapping_id });
                    } else {
                        res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: '', UserRoleMappingData: '', FetchData: '', CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.FindByIDPlantUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "plant",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''
            var params = {
                "user_role_id": bindID,
                "id": req.params.id
            }

            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const fetchuserrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var fetchparams = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "user_role_mapping_id": fetchuserrolemappingData[0] ? fetchuserrolemappingData[0].user_role_mapping_id : ''
            }

            const userData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.getUpdateUserRoleDropdown(fetchparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (fetchuserrolemappingData) {
                if (fetchuserrolemappingData.data && fetchuserrolemappingData.data.length > 0) {
                    res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, FetchData: fetchuserrolemappingData, UserRoleMappingData: userrolemappingData, CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                } else {
                    res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, FetchData: '', UserRoleMappingData: userrolemappingData, CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Available', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            } else {
                res.render('./RailNeer/PlantUser', { title: 'PlantUser', UserData: userData, FetchData: '', UserRoleMappingData: userrolemappingData, CfaOrgData: '', SearchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Available', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.ViewPlantUserExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "plant",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "number": req.body.number ? req.body.number : ''
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelplantuserdata = [];

            if (userrolemappingData && userrolemappingData.data && userrolemappingData.data.length > 0) {
                userrolemappingData.data.forEach((userroledata) => {
                    statedata = []
                    mobilenodata = []
                    namedata = []
                    usernamedata = []
                    userroledata.UserDetail.forEach((doc) => {
                        statedata.push(doc.state);
                        namedata.push(doc.name);
                        mobilenodata.push(doc.number);
                        // citydata.push(doc.city);
                        // addressdata.push(doc.address);
                    });

                    userroledata.UserMainDetail.forEach((obj) => {
                        usernamedata.push(obj.username);

                    });

                    excelplantuserdata.push({
                        "username": usernamedata ? usernamedata.toString() : "",
                        "Name": namedata ? namedata.toString() : "",
                        "MobileNo": mobilenodata ? mobilenodata.toString() : "",
                        "StateName": statedata ? statedata.toString() : "",
                        // "CityName": citydata ? citydata.toString() : "",
                        // "address": addressdata ? addressdata.toString() : "",
                        "IsActive": (userroledata.is_plant_admin == 0) ? ('InActive') : ('Active')
                    });
                });
            }

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant User Details");
            worksheet.columns = [
                { header: "Name", key: "Name", width: 20 },
                { header: "User Name", key: "username", width: 20 },
                { header: "Mobile No", key: "MobileNo", width: 15 },
                { header: "State", key: "StateName", width: 15 },
                // { header: "City", key: "CityName", width: 20 },
                // { header: "Address", key: "address", width: 32 },
                { header: "Plant Admin", key: "IsActive", width: 15 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Plant User Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:E1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(excelplantuserdata);
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
                "attachment; filename=" + "PlantUserDetail.xlsx"
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
//--------------------------------------------CFA User Role-------------------------------------------------//
exports.GetCFAUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "cfa"
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }
            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : '',
                "number": req.body.number ? req.body.number : ''
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var cfa_plant_params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(cfa_plant_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userrolemappingData) {
                res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: userrolemappingData, CfaOrgData: getCfaOrg, SearchData: params, FetchData: '', FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: '', CfaOrgData: getCfaOrg, SearchData: params, FetchData: '', FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.AddCFAUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "cfa",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }


            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var user_id = req.body.user_id ? req.body.user_id : null
            // var user_role_id = userroleData[0] ? userroleData[0].user_role_id : '';
            var user_role_id = bindID;
            var is_plant_admin = req.body.is_plant_admin === '1' ? 1 : 0
            var is_collection = req.body.is_collection === '1' ? 1 : 0
            var is_controller = req.body.is_controller === '1' ? 1 : 0
            var is_supplier = req.body.is_supplier === '1' ? 1 : 0
            var is_allow_generate_order = req.body.is_allow_generate_order === '1' ? 1 : 0
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : null
            // var updated_by = req.body.updated_by ? req.body.updated_by : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}User/updateUserRoleMappingPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    "is_plant_admin": is_plant_admin,
                    "cfa_org_id": cfa_org_id,
                    "is_controller": is_controller,
                    "is_supplier": is_supplier,
                    "is_collection": is_collection,
                    "new_order": is_allow_generate_order,
                    "customer_org_id": "",
                    "station_id": "",
                    "customer_type_id": "",
                    "default_quantity": "",
                    "train_id": "",
                    "location_no": "",
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
                        res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: '', CfaOrgData: getCfaOrg, FilterData: '', SearchData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: '', CfaOrgData: getCfaOrg, FilterData: '', SearchData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Record Already Exists.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.FindByIDCFAUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "cfa",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "id": req.params.id
            }
            var cfa_plant_params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(cfa_plant_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const fetchuserrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (fetchuserrolemappingData) {
                if (fetchuserrolemappingData.data && fetchuserrolemappingData.data.length > 0) {
                    res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: userrolemappingData, CfaOrgData: getCfaOrg, SearchData: '', FetchData: fetchuserrolemappingData, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                } else {
                    res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: userrolemappingData, CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            } else {
                res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: userData, UserRoleMappingData: userrolemappingData, CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.UpdateCFAUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "cfa",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var user_id = req.body.user_id ? req.body.user_id : null
            // var user_role_id = userroleData[0] ? userroleData[0].user_role_id : ''
            var user_role_id = bindID;
            var user_role_mapping_id = req.body.user_role_mapping_id ? req.body.user_role_mapping_id : null
            // var is_plant_admin = req.body.is_plant_admin == '' ? 1 : 0
            var is_controller = req.body.is_controller == '' ? 1 : 0
            var is_supplier = req.body.is_supplier == '' ? 1 : 0
            var is_collection = req.body.is_collection == '' ? 1 : 0
            var is_allow_generate_order = req.body.is_allow_generate_order == '' ? 1 : 0
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : null
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

            var options = {
                'method': 'POST',
                'url': `${base_url}User/updateUserRoleMappingPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_role_mapping_id": user_role_mapping_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    // "is_plant_admin": is_plant_admin,
                    "cfa_org_id": cfa_org_id,
                    "is_controller": is_controller,
                    "is_supplier": is_supplier,
                    "is_collection": is_collection,
                    "new_order": is_allow_generate_order,
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
                        res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: '', UserRoleMappingData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Update.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.user_role_mapping_id });
                    } else {
                        res.render('./RailNeer/CFAUser', { title: 'CFAUser', UserData: '', UserRoleMappingData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.ViewCFAUserExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "cfa",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }
            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : '',
                "number": req.body.number ? req.body.number : ''
            }
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelCFAuserdata = [];
            if (userrolemappingData && userrolemappingData.data && userrolemappingData.data.length > 0) {
                userrolemappingData.data.forEach((userroledata) => {
                    statedata = []
                    mobilenodata = []
                    namedata = []
                    usernamedata = []
                    orgnamedata = []
                    userroledata.UserDetail.forEach((doc) => {
                        statedata.push(doc.state);
                        namedata.push(doc.name);
                        mobilenodata.push(doc.number);
                    });

                    userroledata.UserMainDetail.forEach((obj) => {
                        usernamedata.push(obj.username);
                    });

                    userroledata.CFAOrganizationDetail.forEach((org) => {
                        orgnamedata.push(org.org_name);
                    });

                    excelCFAuserdata.push({
                        "username": usernamedata ? usernamedata.toString() : "",
                        "Name": namedata ? namedata.toString() : "",
                        "MobileNo": mobilenodata ? mobilenodata.toString() : "",
                        "Organization": orgnamedata ? orgnamedata.toString() : "",
                        "Role": (userroledata.is_controller == 0) ? ('CFA_CNTR') : ('') |
                            (userroledata.is_supplier == 0) ? ('CFA-SUP') : ('') | (userroledata.is_collection == 0) ? ('CFA-COL') : (''),
                        "IsActive": (userroledata.is_plant_admin == 0) ? ('InActive') : ('Active')
                    });
                });
            }

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("CFA User Details");
            worksheet.columns = [
                { header: "Name", key: "Name", width: 20 },
                { header: "User Name", key: "username", width: 20 },
                { header: "Mobile No", key: "MobileNo", width: 15 },
                { header: "Organization", key: "Organization", width: 20 },
                { header: "Role", key: "Role", width: 20 },
                { header: "Plant Admin", key: "IsActive", width: 15 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'CFA User Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(excelCFAuserdata);
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
                "attachment; filename=" + "CFAUserDetail.xlsx"
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
//--------------------------------------------Customer User Role-------------------------------------------------//
exports.GetCustomerUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "customer",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            // var bindID = userroleData[0].user_role_id ? userroleData[0].user_role_id : ''
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "user_id": req.body.user_id ? req.body.user_id : '',
                "customer_org_id": req.body.customer_org_id ? req.body.customer_org_id : '',
                "customer_type_id": req.body.customer_type_id ? req.body.customer_type_id : '',
                "station_id": req.body.station_id ? req.body.station_id : '',
                "train_id": req.body.train_id ? req.body.train_id : '',
                "number": req.body.number ? req.body.number : '',
                "expiry_date": req.body.expiry_date ? req.body.expiry_date : '',
                "is_mobile_user_list": req.body.userType ? req.body.userType == "Mobile" ? true : null : true,
                "is_stall_user_list": req.body.userType ? req.body.userType == "Stall" ? true : null : null
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var trainstationparams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var stationparams = {
                "key": "plant_id",
                "value": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrg = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTraindata = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(trainstationparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationdata = await new Promise((resolve, reject) => {
                StationAPIManger.GetStation(stationparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getCustomerType = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });


            if (userrolemappingData) {
                res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, UserRoleMappingData: userrolemappingData, CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', SearchData: params, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, UserRoleMappingData: '', CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', SearchData: params, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.AddCustomerUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "customer",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUserDropDown(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrg = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTraindata = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationdata = await new Promise((resolve, reject) => {
                StationAPIManger.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustomerType = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var user_id = req.body.user_id ? req.body.user_id : null
            var user_role_id = bindID;
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var customer_type_id = req.body.customer_type_id ? req.body.customer_type_id : null
            var customer_org_id = req.body.customer_org_id ? req.body.customer_org_id : null
            var station_id = req.body.station_id ? req.body.station_id : null
            var train_id = req.body.train_id ? req.body.train_id : null
            var location_no = req.body.location_no ? req.body.location_no : null
            var default_quantity = req.body.default_quantity ? req.body.default_quantity : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var expiry_date = req.body.expiry_date ? req.body.expiry_date : null

            var options = {
                'method': 'POST',
                'url': `${base_url}User/updateUserRoleMappingPanel`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    // "customer_type_id": customer_type_id,
                    "customer_org_id": customer_org_id,
                    "station_id": station_id,
                    "default_quantity": default_quantity,
                    "train_id": train_id,
                    "location_no": location_no,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                    "expiry_date": expiry_date
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
                        res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, UserRoleMappingData: '', CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', SearchData: '', FilterData: '', AddFilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    } else {
                        res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, UserRoleMappingData: '', CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', SearchData: '', FilterData: '', AddFilterData: '', alertTitle: 'Invalid', alertMessage: 'Record Already Exists.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.FindByIDCustomerUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "customer",
            }
            var bindID;
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "id": req.params.id,
            }

            const fetchuserrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrg = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTraindata = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationdata = await new Promise((resolve, reject) => {
                StationAPIManger.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustomerType = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (fetchuserrolemappingData) {
                if (fetchuserrolemappingData.data && fetchuserrolemappingData.data.length > 0) {
                    res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, SearchData: '', UserRoleMappingData: userrolemappingData, CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: fetchuserrolemappingData, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                } else {
                    res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, SearchData: '', UserRoleMappingData: userrolemappingData, CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            } else {
                res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: userData, SearchData: '', UserRoleMappingData: userrolemappingData, CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, FetchData: '', FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.UpdateCustomerUserRoleMapping = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "customer",
            }
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const userData = await new Promise((resolve, reject) => {
                UserAPIManager.GetUser(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrg = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerOrg(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getTraindata = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getStationdata = await new Promise((resolve, reject) => {
                StationAPIManger.GetStation(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustomerType = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            // var user_role_id = userroleData[0] ? userroleData[0].user_role_id : ''
            var user_role_id = bindID;
            var user_role_mapping_id = req.body.user_role_mapping_id ? req.body.user_role_mapping_id : null
            var user_id = req.body.user_id ? req.body.user_id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var customer_type_id = req.body.customer_type_id ? req.body.customer_type_id : null
            var customer_org_id = req.body.customer_org_id ? req.body.customer_org_id : null
            var station_id = req.body.station_id ? req.body.station_id : null
            var train_id = req.body.train_id ? req.body.train_id : null
            var location_no = req.body.location_no ? req.body.location_no : null
            var default_quantity = req.body.default_quantity ? req.body.default_quantity : null
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var expiry_date = req.body.expiry_date ? req.body.expiry_date : null

            var options = {
                'method': 'POST',
                'url': `${base_url}User/useRoleMappingUpdate`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "user_role_id": user_role_id,
                    "user_role_mapping_id": user_role_mapping_id,
                    "user_id": user_id,
                    "plant_id": plant_id,
                    // "customer_type_id": customer_type_id,
                    "customer_org_id": customer_org_id,
                    "station_id": station_id,
                    "default_quantity": default_quantity,
                    "train_id": train_id,
                    "location_no": location_no,
                    "created_by": "",
                    "updated_by": updated_by,
                    "created_at": "",
                    "updated_at": mysqlTimestamp,
                    "expiry_date": expiry_date
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
                        res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: '', UserRoleMappingData: '', CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.user_role_mapping_id });
                    } else {
                        res.render('./RailNeer/CustomerUser', { title: 'CustomerUser', UserData: '', UserRoleMappingData: '', CustOrgData: getCustOrg, CustomerType: getCustomerType, TrainData: getTraindata, StationData: getStationdata, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
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
exports.bindCFAUserOfDepot = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_depot_id = req.body.depot_id ? req.body.depot_id : '';

            var params = {
                "plant_id": ck_plant_id,
                "depot_id": body_depot_id
            }

            const getCFADetail = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.getCFADetailofDepot(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            return res.status(200).json({ status: 1, message: 'success', data: getCFADetail, error: null });

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.ViewCustomerUserExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var paramsRole = {
                "role_name": "customer",
            }
            const userroleData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRole(paramsRole, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''

            if (userroleData && userroleData.data && userroleData.data.length > 0) {
                bindID = userroleData.data[0].user_role_id ? userroleData.data[0].user_role_id : ''
            }

            var params = {
                "user_role_id": bindID,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "user_id": req.body.user_id ? req.body.user_id : '',
                "customer_org_id": req.body.customer_org_id ? req.body.customer_org_id : '',
                "customer_type_id": req.body.customer_type_id ? req.body.customer_type_id : '',
                "station_id": req.body.station_id ? req.body.station_id : '',
                "train_id": req.body.train_id ? req.body.train_id : '',
                "number": req.body.number ? req.body.number : '',
                "expiry_date": req.body.expiry_date ? req.body.expiry_date : '',
                "is_mobile_user_list": req.body.userType ? req.body.userType == "Mobile" ? true : null : true,
                "is_stall_user_list": req.body.userType ? req.body.userType == "Stall" ? true : null : null
            }
            const userrolemappingData = await new Promise((resolve, reject) => {
                UserRoleMappingAPIManager.GetUserRoleMapping(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelCustomeruserdata = [];
            if (userrolemappingData && userrolemappingData.data && userrolemappingData.data.length > 0) {
                userrolemappingData.data.forEach((userroledata) => {
                    mobilenodata = []
                    namedata = []
                    usernamedata = []
                    stationdata = []
                    traindata = []
                    custdata = []
                    custtypedata = []
                    if (userroledata.UserDetail) {
                        userroledata.UserDetail.forEach((doc) => {
                            namedata.push(doc.name);
                            mobilenodata.push(doc.number);
                        });
                    }
                    if (userroledata.UserMainDetail) {
                        userroledata.UserMainDetail.forEach((obj) => {
                            usernamedata.push(obj.username);
                        });
                    }
                    if (userroledata.StationDetail) {
                        userroledata.StationDetail.forEach((st) => {
                            stationdata.push(st.station_name);
                        });
                    }
                    if (userroledata.TrainDetail) {
                        userroledata.TrainDetail.forEach((tns) => {
                            traindata.push(tns.train_name);
                        });
                    }
                    if (userroledata.CustomerOrganizationDetail) {
                        userroledata.CustomerOrganizationDetail.forEach((cust) => {
                            custdata.push(cust.customer_name);
                        });
                    }
                    if (userroledata.CustomerOrganizationDetail.length > 0) {
                        if (userroledata.CustomerOrganizationDetail[0].CustomerTypeDetails) {
                            if (userroledata.CustomerOrganizationDetail[0].CustomerTypeDetails.length > 0) {
                                userroledata.CustomerOrganizationDetail[0].CustomerTypeDetails.forEach((custtype) => {
                                    custtypedata.push(custtype.customer_type);
                                });
                            }
                        }
                    }
                    excelCustomeruserdata.push({
                        "username": usernamedata ? usernamedata.toString() : "",
                        "Name": namedata ? namedata.toString() : "",
                        "MobileNo": mobilenodata ? mobilenodata.toString() : "",
                        "CustomerType": custtypedata ? custtypedata.toString() : "",
                        "CustomerName": custdata ? custdata.toString() : "",
                        "Station": stationdata ? stationdata.toString() : "",
                        "Train": traindata ? traindata.toString() : "",
                        "default_quantity": userroledata.default_quantity ? userroledata.default_quantity : "",
                        "location_no": userroledata.location_no ? userroledata.location_no : "",
                        "expiry_date": userroledata.expiry_date ? userroledata.expiry_date : ""
                    });
                });
            }


            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Customer User Details");
            worksheet.columns = [
                { header: "Name", key: "Name", width: 20 },
                { header: "User Name", key: "username", width: 20 },
                { header: "Mobile No", key: "MobileNo", width: 15 },
                { header: "Customer Type", key: "CustomerType", width: 20 },
                { header: "Customer Name", key: "CustomerName", width: 20 },
                { header: "Station", key: "Station", width: 20 },
                { header: "Train", key: "Train", width: 20 },
                { header: "Qty", key: "default_quantity", width: 20 },
                { header: "Location No", key: "location_no", width: 32 },
                { header: "Expired Date", key: "expiry_date", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Customer User Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:J1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(excelCustomeruserdata);
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
                "attachment; filename=" + "CustomerUserDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.getCustomerType = [async (req, res) => {
    try {
        console.log("hdajhdak", req.body);
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.body.cust_id
            }

            const getCustOrg = await new Promise((resolve, reject) => {
                CustOrgAPIManger.GetCustomerOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            return res.json({ status: 1, message: 'success', data: getCustOrg, error: null });

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];