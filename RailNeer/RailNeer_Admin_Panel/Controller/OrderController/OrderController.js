const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const ReportAPIManager = require('../../Network/ReportAPIManager/ReportAPI');
const ProductAPIManager = require('../../Network/ProductAPIManager/ProductAPI');
const CfaOrgAPIManager = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
const CustOrgAPIManger = require('../../Network/CustOrgAPIManager/CustOrgAPI');
const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const OrderAPIManager = require('../../Network/OrderAPIManager/OrderAPI');
const CustomerOrgAPIManager = require('../../Network/CustOrgAPIManager/CustOrgAPI');
const excel = require("exceljs");

var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
//-----------------------------Order-----------------------//
exports.GetOrder = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "order_no": req.body.order_no ? req.body.order_no : null,
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "product_id": req.body.product_id ? req.body.product_id : null,
                "station_id": req.body.station_id ? req.body.station_id : null,
                "order_type": req.body.order_type ? req.body.order_type : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            var depotparams = {
                "order_by": "0",
                "order_by_key": "depot_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var productparams = {
                "order_by": "0",
                "order_by_key": "product_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var stationparams = {
                "order_by": "0",
                "order_by_key": "station_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            const getOrder = await new Promise((resolve, reject) => {
                OrderAPIManager.getOrder(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getProduct = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(productparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDepot = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(depotparams, option, (error, data) => {
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

            const getCustType = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerType(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getOrder) {
                res.render('./RailNeer/OrderView', { title: 'OrderView', OrderData: getOrder, CustTypeData: getCustType, CfaOrgData: '', ProductData: getProduct, DepotData: getDepot, CustOrgData: '', StationData: getStation, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/OrderView', { title: 'OrderView', OrderData: '', CustTypeData: getCustType, CfaOrgData: '', ProductData: getProduct, DepotData: getDepot, CustOrgData: '', StationData: getStation, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetOrderExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
                "cust_org_id": req.body.cust_org_id ? req.body.cust_org_id : null,
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "order_no": req.body.order_no ? req.body.order_no : null,
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "product_id": req.body.product_id ? req.body.product_id : null,
                "station_id": req.body.station_id ? req.body.station_id : null,
                "startdate": req.body.startdate ? req.body.startdate : null,
                "enddate": req.body.enddate ? req.body.enddate : null
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const orderdata = await new Promise((resolve, reject) => {
                OrderAPIManager.getOrder(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelorderdata = [];
            if (orderdata && orderdata.data && orderdata.data.length > 0) {
                excelorderdata = orderdata.data;
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Order Details");

            worksheet.columns = [
                { header: "Cutomer Name", key: "cust_name", width: 20 },
                { header: "Amount", key: "amount", width: 10 },
                { header: "Amount Include Tax", key: "amt_incl_tax", width: 10 },
                { header: "Order No", key: "order_no", width: 10 },
                { header: "Order Status", key: "order_status_name", width: 15 },
                { header: "Licensee Type", key: "order_type_name", width: 15 },
                { header: "Depot Name", key: "depot_name", width: 15 },
                { header: "Station Name", key: "station_name", width: 15 },
                { header: "Product Name", key: "product_name", width: 20 },
                { header: "Product Code", key: "prod_hsn_number", width: 10 },
                { header: "Quantity", key: "quantity", width: 10 },
                { header: "Entry Date", key: "created_at", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Order Details'

            // Optional merge and styles
            worksheet.mergeCells('A1:L1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelorderdata);

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
                "attachment; filename=" + "OrderDetail.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];