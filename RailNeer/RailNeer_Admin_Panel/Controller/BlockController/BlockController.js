const PlantAPIManager = require('../../Network/PlantAPIManager/PlantAPI');
const BlockAPIManager = require('../../Network/BlockAPIManager/BlockAPI');
const CfaOrgAPIManager = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const excel = require("exceljs");
//-------------------------------------- Block Detail -----------------------------------//
exports.GetBlockDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getblock = await new Promise((resolve, reject) => {
                BlockAPIManager.GetBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getblock) {
                res.render('./RailNeer/Block', { title: 'Block', BlockData: getblock, PlantData: [], CfaOrgData: getCfaOrg, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/Block', { title: 'Block', BlockData: [], PlantData: [], CfaOrgData: getCfaOrg, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.AddBlockDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            // const getCfaOrg = await new Promise((resolve, reject) => {
            //     CfaOrgAPIManager.GetCfaOrg(null, option, (error, data) => {
            //         if (error) {
            //             reject(error);
            //         } else {
            //             resolve(data);
            //         }
            //     });
            // });
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var block_name = req.body.block_name ? req.body.block_name : null
            var cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Block/setBlock`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "block_name": block_name,
                    "cfa_org_id": cfa_org_id,
                    "plant_id": plant_id,
                    "created_by": created_by,
                    "created_at": mysqlTimestamp,
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    var jsonData = JSON.parse(data)
                    if (jsonData.status == 200) {
                        res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: '', SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                    }
                    else {
                        res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: '', SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong!', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

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
exports.UpdateBlockDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
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
            var block_name = req.body.block_name ? req.body.block_name : null
            var cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : null
            var id = req.body.id ? req.body.id : null
            var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Block/updateBlock`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "block_name": block_name,
                    "cfa_org_id": cfa_org_id,
                    "plant_id": plant_id,
                    "updated_by": updated_by,
                    "updated_at": mysqlTimestamp
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/Block', { title: 'Block', BlockData: '', PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.FindByIDBlockDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var cfaparams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
            }
            const getBlockById = await new Promise((resolve, reject) => {
                BlockAPIManager.GetBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(cfaparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getblock = await new Promise((resolve, reject) => {
                BlockAPIManager.GetBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getBlockById) {
                if (getBlockById.data.length > 0) {
                    res.render('./RailNeer/Block', { title: 'Block', BlockData: getblock, PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: getBlockById, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                } else {
                    res.render('./RailNeer/Block', { title: 'Block', BlockData: getblock, PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            } else {
                res.render('./RailNeer/Block', { title: 'Block', BlockData: getblock, PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.CheckBlockName = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "is_from_admin": true,
                "is_like_query": false,
                "block_name": req.body.block_name,
                "id": req.body.id,
            }
            const checkBlockname = await new Promise((resolve, reject) => {
                BlockAPIManager.CheckBlockName(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkBlockname.status == 'false') {
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
exports.DeleteBlockDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id,
                // "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const DeleteBlock = await new Promise((resolve, reject) => {
                BlockAPIManager.DeleteBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getblock = await new Promise((resolve, reject) => {
                BlockAPIManager.GetBlock(params, option, (error, data) => {
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
            res.render('./RailNeer/Block', { title: 'Block', BlockData: getblock, PlantData: '', CfaOrgData: getCfaOrg, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.bindBlockOfCFA = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : '';

            var params = {
                "plant_id": ck_plant_id,
                "cfa_org_id": body_cfa_org_id
            }

            const getBlock = await new Promise((resolve, reject) => {
                BlockAPIManager.getBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            return res.status(200).json({ status: 1, message: 'success', data: getBlock, error: null });


        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.ViewBlockExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
            }
            const getblock = await new Promise((resolve, reject) => {
                BlockAPIManager.GetBlock(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelblockdata = [];

            // var count = 1;
            if (getblock && getblock.data) {
                if (getblock.data.length > 0) {
                    getblock.data.forEach((blockdata) => {
                        orgdata = []
                        blockdata.cfaOrgDetail.forEach((doc) => {
                            orgdata.push(doc.org_name);
                        });
                        excelblockdata.push({
                            // 'Sr.No.': count++,
                            "block_name": blockdata.block_name,
                            "CFAOrganization": orgdata ? orgdata.toString() : "",
                        });
                    });
                }
            }


            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Block Details");

            worksheet.columns = [
                { header: "Block Name", key: "block_name", width: 35 },
                { header: "CFA Organization", key: "CFAOrganization", width: 33 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Block Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:B1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelblockdata);

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
                "attachment; filename=" + "BlockDetail.xlsx"
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