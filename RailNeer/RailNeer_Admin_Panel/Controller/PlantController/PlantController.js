const PlantAPIManager = require('../../Network/PlantAPIManager/PlantAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");


//--------------------------------------Plant Add------------------------------------//

exports.GetPlantDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(null, option, (error, data) => {
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

            res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', Menutitle: 'PlantAdd', PlantData: getPlant, StateData: getState, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.AddPlantDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(null, option, (error, data) => {
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
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var CSIMID = req.body.CSIMID ? req.body.CSIMID : null
            var plant_name = req.body.plant_name ? req.body.plant_name : null
            var plant_code = req.body.plant_code ? req.body.plant_code : null
            var fssai_no = req.body.fssai_no ? req.body.fssai_no : null
            var address = req.body.address ? req.body.address : null
            var state_id = req.body.state_id ? req.body.state_id : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Plant/setPlant`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "CSIMID": CSIMID,
                    "plant_name": plant_name,
                    "plant_code": plant_code,
                    "fssai_no": fssai_no,
                    "address": address,
                    "state_id": state_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                    "updated_at": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }

                    if (req.cookies.admindata[0].plant_id) {
                        res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', Menutitle: 'PlantAdd', PlantData: getPlant, StateData: getState, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' })
                    }
                    else {
                        res.redirect('./Splash');
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
exports.UpdatePlantDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(null, option, (error, data) => {
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
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var CSIMID = req.body.CSIMID ? req.body.CSIMID : null
            var plant_name = req.body.plant_name ? req.body.plant_name : null
            var plant_id = req.body.plant_id ? req.body.plant_id : null
            var plant_code = req.body.plant_code ? req.body.plant_code : null
            var fssai_no = req.body.fssai_no ? req.body.fssai_no : null
            var address = req.body.address ? req.body.address : null
            var state_id = req.body.state_id ? req.body.state_id : null
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Plant/updatePlant`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    'plant_id': plant_id,
                    "CSIMID": CSIMID,
                    "plant_name": plant_name,
                    "plant_code": plant_code,
                    "fssai_no": fssai_no,
                    "address": address,
                    "state_id": state_id,
                    "updated_by": updated_by,
                    "updated_at": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', Menutitle: 'PlantAdd', PlantData: getPlant, StateData: getState, FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.plant_id })
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.CheckPlantName = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_name": req.body.plant_name,
                "plant_id": req.body.plant_id,
            }
            const checkPlantname = await new Promise((resolve, reject) => {
                PlantAPIManager.CheckPlantName(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkPlantname.status == 'false') {
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
exports.FindByIDPlant = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.params.plant_id
            }
            const getPlantById = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(null, option, (error, data) => {
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

            if (getPlantById) {
                if (getPlantById.data && getPlantById.data.length > 0) {
                    res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', PlantData: getPlant, FetchData: getPlantById, StateData: getState, moment: moment1, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: req.params.plant_id });
                } else {
                    res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', PlantData: getPlant, FetchData: '', StateData: getState, moment: moment1, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: req.params.plant_id });
                }
            } else {
                res.render('./RailNeer/PlantAdd', { title: 'PlantAdd', PlantData: getPlant, FetchData: '', StateData: getState, moment: moment1, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: req.params.plant_id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
//--------------------------------------Plant View------------------------------------//

exports.ShowPlantDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var BindPlant = option ? option[0].user_role_name : ''
            var params;

            if (BindPlant == 'plant') {
                params = {
                    "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                    "plant_name": req.body.plant_name ? req.body.plant_name : '',
                    "state_id": req.body.state_id ? req.body.state_id : '',
                }
            } else {
                params = {
                    "plant_name": req.body.plant_name ? req.body.plant_name : '',
                    "state_id": req.body.state_id ? req.body.state_id : '',
                }
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getPlant) {
                res.render('./RailNeer/PlantView', { title: 'PlantView', PlantData: getPlant, SearchData: params, StateData: getState, moment: moment1, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
            } else {
                res.render('./RailNeer/PlantView', { title: 'PlantView', PlantData: '', SearchData: params, StateData: getState, moment: moment1, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
            }

        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.DeletePlant = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.params.plant_id
            }
            const DeletePlant = await new Promise((resolve, reject) => {
                PlantAPIManager.DeletePlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(null, option, (error, data) => {
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
            // return res.status(200).json({ status: 1, Message: "done", data: null, error: null });
            res.render('./RailNeer/PlantView', { title: 'PlantView', PlantData: getPlant, SearchData: null, StateData: getState, moment: moment1, FilterData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, ID: req.params.plant_id });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.updatePlantinMain = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyPlantID = req.body.plant_id;
            var resdata = req.cookies.admindata ? req.cookies.admindata[0] : "";
            var UserRoleName = resdata ? resdata.user_role_name : "";

            if (UserRoleName == 'admin' || UserRoleName == 'report') {
                var admindata = [];
                admindata.push({
                    id: req.cookies.admindata[0].id,
                    password: req.cookies.admindata[0].password,
                    username: req.cookies.admindata[0].username,
                    status: req.cookies.admindata[0].status,
                    user_role_id: req.cookies.admindata[0].user_role_id,
                    user_role_name: req.cookies.admindata[0].user_role_name,
                    is_report_admin: req.cookies.admindata[0].is_report_admin_status,
                    plant_id: bodyPlantID,
                    token: req.cookies.admindata[0].token
                    // LastName: jsonData.data[0].LastName
                })
                res.cookie('admindata', admindata, { maxAge: 1000 * 3600, overwrite: true });
                return res.status(200).json({ status: 1, message: 'success', error: null });
            }
            else {
                return res.status(200).json({ status: 0, message: 'data not found', error: null });
            }


        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.ViewPlantExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_name": req.body.plant_name ? req.body.plant_name : '',
                "state_id": req.body.state_id ? req.body.state_id : '',
            }
            const getPlant = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelplantdata = [];

            var excelplantdata = [];
            if (getPlant && getPlant.data && getPlant.data.length > 0) {
                // excelplantdata = getPlant.data;
                getPlant.data.forEach((plantdata) => {
                    statedata = []
                    plantdata.StateDetail.forEach((doc) => {
                        statedata.push(doc.state_name);
                    });
                    excelplantdata.push({
                        "plant_name": plantdata.plant_name,
                        "plant_code": plantdata.plant_code,
                        "fssai_no": plantdata.fssai_no ? plantdata.fssai_no : "-",
                        "CSIMID": plantdata.CSIMID ? plantdata.CSIMID : "-",
                        "address": plantdata.address ? plantdata.address : "-",
                        // "state": plantdata[0].StateDetail[0].state_name,
                        "StateName": statedata ? statedata.toString() : ""
                    });
                });
            }
            // excelplantdata = getPlant;
            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant Details");
            worksheet.columns = [
                { header: "Plant Name", key: "plant_name", width: 20 },
                { header: "Plant Code", key: "plant_code", width: 15 },
                { header: "Fssai No", key: "fssai_no", width: 10 },
                { header: "State", key: "StateName", width: 10 },
                { header: "CSIMID", key: "CSIMID", width: 20 },
                { header: "Address", key: "address", width: 32 },
                // { header: "Entry Date", key: "created_at", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Plant Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelplantdata);

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
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                // "Content-Type: application/json",
                // "login_user_id: "`${option[0].id}`,
                // "from: "`${process.env.from}`,
                // "authorization: "`Bearer ${option[0].token}`
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "PlantDetail.xlsx",
                // "Content-Type: application/json",
                // "login_user_id: "`${option[0].id}`,
                // "from: "`${process.env.from}`,
                // "authorization: "`Bearer ${option[0].token}`
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