const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const ReportAPIManager = require('../../Network/ReportAPIManager/ReportAPI');
const CfaOrgAPIManager = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
const ProductAPIManager = require('../../Network/ProductAPIManager/ProductAPI');
const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const TrainAPIManager = require('../../Network/TrainAPIManager/TrainAPI');
const CustomerOrgAPIManager = require('../../Network/CustOrgAPIManager/CustOrgAPI');
const excel = require("exceljs");
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { reject } = require('underscore');


//-----------------------------Exception Report-----------------------//
exports.GetExceptionReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
                "cust_org_id": req.body.cust_org_id ? req.body.cust_org_id : null,
                "order_status": req.body.order_status ? req.body.order_status : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            var CfaOrgparams = {
                "order_by": "0",
                "order_by_key": "org_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var custOrgparams = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            const getExceptionReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getExceptionReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getCfaOrg = await new Promise((resolve, reject) => {
                CfaOrgAPIManager.GetCfaOrg(CfaOrgparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getOrderStatus = await new Promise((resolve, reject) => {
                ReportAPIManager.getOrderStatus(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCustOrganization = await new Promise((resolve, reject) => {
                CustomerOrgAPIManager.GetCustomerOrg(custOrgparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getExceptionReport) {
                res.render('./RailNeer/ExceptionReport', { title: 'ExceptionReport', ExceptionReportData: getExceptionReport, CfaOrgData: getCfaOrg, CustOrgData: getCustOrganization, OrderStatusData: getOrderStatus, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/ExceptionReport', { title: 'ExceptionReport', ExceptionReportData: '', CfaOrgData: getCfaOrg, CustOrgData: getCustOrganization, OrderStatusData: getOrderStatus, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetExceptionExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
                "cust_org_id": req.body.cust_org_id ? req.body.cust_org_id : null,
                "order_status": req.body.order_status ? req.body.order_status : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getExceptionReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getExceptionReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelExceptionReportdata = [];
            if (getExceptionReport && getExceptionReport.data && getExceptionReport.data.length > 0) {
                excelExceptionReportdata = getExceptionReport.data[0];
            }

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Exception Report");

            worksheet.columns = [
                { header: "Order Date", key: "orderdate", width: 14 },
                { header: "Order No", key: "order_no", width: 13 },
                { header: "Station Name", key: "station_name", width: 20 },
                { header: "Station Code", key: "station_code", width: 20 },
                { header: "Order Status", key: "final_order_status", width: 18 },
                { header: "Product Name", key: "product_name", width: 18 },
                { header: "Cfa Organization", key: "org_name", width: 18 },
                { header: "Customer Type", key: "customer_type", width: 16 },
                { header: "Customer Name", key: "custorgname", width: 16 },
                { header: "Ordered Quantity", key: "ordered_qty", width: 10 },
                // { header: "Approved Quantity", key: "customer_type", width: 10 },
                { header: "Delivered Quantity", key: "delivered_qty", width: 10 },
                { header: "Delivered Date", key: "invoice_gen_dt", width: 16 },
                // { header: "Rejected Date", key: "rejected_Date", width: 16 },
                { header: "Unit Cost", key: "cost", width: 10 },
                { header: "Net Amount", key: "net_amount", width: 12 },
                { header: "GST (%)", key: "gst_tot_perc", width: 8 },
                { header: "CGST", key: "cgst", width: 8 },
                { header: "SGST", key: "sgst", width: 8 },
                { header: "IGST", key: "igst", width: 8 },
                { header: "Total Amount", key: "total_amount", width: 12 },
                { header: "Order Created By Cutomer", key: "custname", width: 20 },
                { header: "Order Created By CFA", key: "order_by_cfa_user", width: 20 },
                { header: "Controller Name", key: "controller_name", width: 13 },
                { header: "Supplier Name", key: "supplier_name", width: 15 },
                { header: "Collector Name", key: "collected_name", width: 15 },
                // { header: "Controller Comment", key: "controller_comment", width: 20 },
                // { header: "Supplier Remarks", key: "supplier_remarks", width: 20 },
                // { header: "ACK Remarks", key: "ack_remarks", width: 20 },
                // { header: "Order Remarks", key: "order_remark", width: 20 },
                { header: "Order Remark By Customer", key: "order_remark", width: 20 },
                { header: "Order Remark By CFA", key: "order_cfa_remark", width: 20 },
                { header: "Confirm Remarks", key: "confirm_remarks", width: 20 },
                { header: "Delivery Remarks", key: "delivery_remarks", width: 20 },
                { header: "Payment Remarks", key: "collect_remarks", width: 20 },
                { header: "Acknowledgment remarks", key: "ack_remark", width: 20 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Exception Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:AD1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelExceptionReportdata);

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
                "attachment; filename=" + "ExceptionReport.xlsx"
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

//----------------------------Inventory Production Balance Report-----------------------//

exports.GetInventoryProductionBalanceReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var productparams = {
                "order_by": "0",
                "order_by_key": "product_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getInventoryProduction = await new Promise((resolve, reject) => {
                ReportAPIManager.getInventoryProductionBalanceReportList(params, option, (error, data) => {
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

            if (getInventoryProduction) {
                res.render('./RailNeer/InventoryProductionBalanceReport', { title: 'InventoryProductionBalanceReport', InventoryProductionData: getInventoryProduction, ProductData: getProduct, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            } else {
                res.render('./RailNeer/InventoryProductionBalanceReport', { title: 'InventoryProductionBalanceReport', InventoryProductionData: '', ProductData: getProduct, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetInventoryProductionBalanceExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            // var params = {
            //     "product_id": req.body.product_id ? req.body.product_id : null,
            //     "startdate": req.body.startdate ? req.body.startdate : currentDate,
            //     "enddate": req.body.enddate ? req.body.enddate : currentDate,
            //     // "order_type": req.body.order_type ?? '1'
            // }

            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getInventoryProduction = await new Promise((resolve, reject) => {
                ReportAPIManager.getInventoryProductionBalanceReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelInventoryProductiondata = [];
            // excelInventoryProductiondata = getInventoryProduction[0];


            if (getInventoryProduction && getInventoryProduction.data && getInventoryProduction.data.length > 0) {
                excelInventoryProductiondata = getInventoryProduction.data[0];
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Inventory Production Report");

            worksheet.columns = [
                { header: "Date", key: "date", width: 14 },
                { header: "Product Name", key: "product_name", width: 14 },
                { header: "Opening Balance", key: "begining_bal", width: 17 },
                { header: "Production", key: "production", width: 12 },
                { header: "Rejection", key: "rejection", width: 10 },
                { header: "Adjustment", key: "adjustment", width: 20 },
                { header: "Dispatch", key: "dispatch", width: 17 },
                { header: "Closing Balance", key: "closing_bal", width: 15 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Inventory Production Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:H1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelInventoryProductiondata);

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
                "attachment; filename=" + "InventoryProductionReport.xlsx"
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

//----------------------------Inventory Production Depot Report-----------------------//

exports.GetInventoryDepotBalanceReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var productparams = {
                "order_by": "0",
                "order_by_key": "product_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            var depotparams = {
                "order_by": "0",
                "order_by_key": "depot_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getInventoryDepotBalance = await new Promise((resolve, reject) => {
                ReportAPIManager.getInventoryDepotBalanceReportList(params, option, (error, data) => {
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

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(depotparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getInventoryDepotBalance) {
                res.render('./RailNeer/InventoryDepotBalanceReport', { title: 'InventoryDepotBalanceReport', InventoryDepotBalanceData: getInventoryDepotBalance, ProductData: getProduct, DepotData: getDepotDetail, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/InventoryDepotBalanceReport', { title: 'InventoryDepotBalanceReport', InventoryDepotBalanceData: '', ProductData: getProduct, DepotData: getDepotDetail, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });

            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetInventoryDepotBalanceExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getInventoryDepotBalance = await new Promise((resolve, reject) => {
                ReportAPIManager.getInventoryDepotBalanceReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelInventoryDepotBalancedata = []
            if (getInventoryDepotBalance && getInventoryDepotBalance.data && getInventoryDepotBalance.data.length > 0) {
                excelInventoryDepotBalancedata = getInventoryDepotBalance.data[0];
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Inventory Depot Balance Report");

            worksheet.columns = [
                { header: "Date", key: "date", width: 14 },
                { header: "Depot Name", key: "depot_name", width: 17 },
                { header: "Product Name", key: "product_name", width: 17 },
                { header: "Opening Balance", key: "begining_bal", width: 17 },
                { header: "In Transit", key: "in_transit", width: 15 },
                { header: "Received", key: "received", width: 17 },
                { header: "Damages", key: "damages", width: 15 },
                { header: "Transfer", key: "transfer", width: 10 },
                { header: "Sales", key: "sales", width: 12 },
                { header: "Closing Balance", key: "closing_bal", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Inventory Depot Balance Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:J1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelInventoryDepotBalancedata);

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
                "attachment; filename=" + "InventoryDepotBalanceReport.xlsx"
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

//----------------------------Sales Report-----------------------//

exports.GetSalesReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getSalesReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getSalesReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getSalesReport) {
                res.render('./RailNeer/SalesReport', { title: 'SalesReport', SalesReportData: getSalesReport, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/SalesReport', { title: 'SalesReport', SalesReportData: '', SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetSalesExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getSalesReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getSalesReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelSalesdata = []
            if (getSalesReport && getSalesReport.data && getSalesReport.data.length > 0) {
                excelSalesdata = getSalesReport.data;
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Sales Report");

            // worksheet.columns = [
            //     { header: "Order Date", key: "orderdate", width: 20 },
            //     { header: "Order No", key: "order_no", width: 15 },
            //     { header: "Station Name", key: "station_name", width: 15 },
            //     { header: "Order Status", key: "final_order_status", width: 15 },
            //     { header: "Product Name", key: "product_name", width: 20 },
            //     { header: "Customer Type", key: "customer_type", width: 15 },
            //     { header: "Quantity", key: "quantity", width: 10 },
            //     { header: "Unit Cost", key: "cost", width: 10 },
            //     { header: "Amount", key: "amount", width: 10 },
            //     { header: "Amount Include Tax", key: "amt_incl_tax", width: 18 },
            // ];


            worksheet.columns = [
                { header: "Order Date", key: "orderdate", width: 14 },
                { header: "Order No", key: "order_no", width: 13 },
                { header: "Station Name", key: "station_name", width: 20 },
                { header: "Station Code", key: "station_code", width: 20 },
                { header: "Order Status", key: "final_order_status", width: 18 },
                { header: "Order Type", key: "order_type_name", width: 18 },
                { header: "Buyer Name", key: "Buyer_Name", width: 18 },
                { header: "Product Name", key: "product_name", width: 18 },
                { header: "Customer Type", key: "customer_type", width: 16 },
                { header: "Ordered Quantity", key: "ordered_qty", width: 10 },
                // { header: "Approved Quantity", key: "customer_type", width: 10 },
                { header: "Delivered Quantity", key: "delivered_qty", width: 10 },
                { header: "Delivered Date", key: "invoice_gen_dt", width: 16 },
                { header: "Rejected Quantity", key: "rejected_qty", width: 16 },
                { header: "GSTNO", key: "GSTNO", width: 20 },
                { header: "Unit Cost", key: "cost", width: 10 },
                { header: "Net Amount", key: "net_amount", width: 12 },
                { header: "GST (%)", key: "gst_tot_perc", width: 8 },
                { header: "CGST", key: "cgst", width: 8 },
                { header: "SGST", key: "sgst", width: 8 },
                { header: "IGST", key: "igst", width: 8 },
                { header: "Total Amount", key: "total_amount", width: 12 },
                { header: "Order Created By Cutomer", key: "custname", width: 20 },
                { header: "Order Created By CFA", key: "order_by_cfa_user", width: 20 },
                { header: "Controller Name", key: "controller_name", width: 13 },
                { header: "Supplier Name", key: "supplier_name", width: 15 },
                { header: "Collector Name", key: "collected_name", width: 15 },
                // { header: "Controller Comment", key: "controller_comment", width: 20 },
                // { header: "Supplier Remarks", key: "supplier_remarks", width: 20 },
                // { header: "ACK Remarks", key: "ack_remarks", width: 20 },
                // { header: "Order Remarks", key: "order_remark", width: 20 },
                { header: "Order Remark By Customer", key: "order_remark", width: 20 },
                { header: "Order Remark By CFA", key: "order_cfa_remark", width: 20 },
                { header: "IRN Number", key: "IRNO", width: 20 },
                { header: "IRN Generated", key: "IRNO_Generated", width: 20 },
                { header: "Confirm Remarks", key: "confirm_remarks", width: 20 },
                { header: "Delivery Remarks", key: "delivery_remarks", width: 20 },
                { header: "Payment Remarks", key: "collect_remarks", width: 20 },
                { header: "Acknowledgment remarks", key: "ack_remark", width: 20 },
            ];


            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Sales Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:AH1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelSalesdata);

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
                "attachment; filename=" + "SalesReport.xlsx"
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

//----------------------------PlantWise Order Report-----------------------//

exports.GetPlantWiseOrderReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var productparams = {
                "order_by": "0",
                "order_by_key": "product_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            var depotparams = {
                "order_by": "0",
                "order_by_key": "depot_name",
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
            }

            const getPlantOrderReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getPlantWiseOrderReportList(params, option, (error, data) => {
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

            if (getPlantOrderReport) {
                res.render('./RailNeer/PlantWiseOrderReport', { title: 'PlantWiseOrderReport', PlantOrderReportData: getPlantOrderReport, ProductData: getProduct, DepotData: getDepot, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/PlantWiseOrderReport', { title: 'PlantWiseOrderReport', PlantOrderReportData: '', ProductData: getProduct, DepotData: getDepot, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetPlantWiseOrderExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "depot_id": req.body.depot_id ? req.body.depot_id : null,
                "product_id": req.body.product_id ? req.body.product_id : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getPlantOrderReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getPlantWiseOrderReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });


            var excelPlantWiseOrderdata = []
            if (getPlantOrderReport && getPlantOrderReport.data && getPlantOrderReport.data.length > 0) {
                excelPlantWiseOrderdata = getPlantOrderReport.data[0];
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant Wise Order Report");

            worksheet.columns = [
                { header: "Depot Name", key: "depot_name", width: 20 },
                { header: "Date", key: "orderdate", width: 15 },
                { header: "Product Name", key: "product_name", width: 20 },
                { header: "Total Orders", key: "totalorder", width: 15 },
                { header: "Total Qty", key: "totalquantity", width: 15 },
                { header: "Net Amount", key: "netamount", width: 15 },
                { header: "CGST", key: "cgst", width: 10 },
                { header: "SGST", key: "sgst", width: 10 },
                { header: "IGST", key: "igst", width: 10 },
                { header: "Gross Amount", key: "grossamount", width: 18 },

                { header: "Open Orders", key: "open_orders", width: 18 },
                { header: "Open Qty", key: "open_quantity", width: 18 },
                { header: "Open Amount", key: "open_amount", width: 18 },
                { header: "Confirmed Orders", key: "confirmed_orders", width: 18 },
                { header: "Confirmed Qty", key: "confirmed_quantity", width: 18 },
                { header: "Confirmed Amount", key: "confirmed_amount", width: 18 },
                { header: "Delivered Orders", key: "delivered_orders", width: 18 },
                { header: "Delivered Qty", key: "delivered_quantity", width: 18 },
                { header: "Delivered Amount", key: "delivered_amount", width: 18 },
                { header: "Paid Orders", key: "paid_orders", width: 18 },
                { header: "Paid Qty", key: "paid_quantity", width: 18 },
                { header: "Paid Amount", key: "paid_amount", width: 18 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Plant Wise Order Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:V1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelPlantWiseOrderdata);

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
                "attachment; filename=" + "PlantWiseOrderReport.xlsx"
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

//----------------------------Variance static Report-----------------------//

exports.GetVarianceReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "StationID": req.body.StationID ? req.body.StationID : '',
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
            }

            var paramsbody = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_by": "0",
                "order_by_key": "station_name"
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            getStationName = await new Promise((resolve, reject) => {
                StationAPIManager.getStationPlantWise(paramsbody, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getVarianceReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getVarianceReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getVarianceReport) {
                res.render('./RailNeer/VarianceReport', { title: 'VarianceReport', VarianceReportData: getVarianceReport, StationData: getStationName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/VarianceReport', { title: 'VarianceReport', VarianceReportData: '', StationData: getStationName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetVarianceExcel2 = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "StationID": req.body.StationID ? req.body.StationID : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "unitkey": req.body.unitkey ?? 'static',
                "order_type": '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            getStationName = await new Promise((resolve, reject) => {
                StationAPIManager.getStationPlantWise(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getVarianceReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getVarianceReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var Result = [];
            let excelgetVarianceReport = getVarianceReport;

            excelgetVarianceReport.forEach((udata) => {
                // order_count = [];
                // total_count = [];
                _report_data_detail = [];
                _report_data_qty = [];
                udata._report_data.forEach((doc) => {
                    _report_data_detail.push(doc.created_date)
                });
                udata._report_data.forEach((doc) => {
                    _report_data_qty.push(doc.total_quantity)
                });

                var binddata = parseFloat(_report_data_qty) - parseFloat(udata.target_qty)

                Result.push({
                    // "Sr.No.": count++,
                    "station_name": udata.station_name,
                    "target_qty": udata.target_qty,
                    "created_date": _report_data_detail ? _report_data_detail.toString() : "-",
                    "target_quantity": _report_data_qty ? _report_data_qty.toString() : "-",
                    "variance": parseFloat(_report_data_qty) - parseFloat(udata.target_qty)
                    // "UserRole": udata.UserRole,
                    // "MobileNo": udata.MobileNo,
                    // "UserStatus": udata.UserStatus,
                    // "Address": udata.Address ? udata.Address : "-",
                    // "OTP": udata.OTP ? udata.OTP : "-",
                    // // "ShakhaName": udata.ShakhaName ? udata.ShakhaName : "-",
                    // "BhagName": UserBhagdetail ? UserBhagdetail.toString() : "-",
                    // "NagarName": UserNagardetail ? UserNagardetail.toString() : "-",
                    // "VastiName": UserVastidetail ? UserVastidetail.toString() : "-",
                    // "LoginStatus": udata.LoginStatus ? udata.LoginStatus : "-",
                    // // "CreatedDate": moment(udata.CreatedDate).format('DD-MM-yyyy'),
                    // "IsActive": (udata.IsActive == 0) ? ('InActive') : ('Active')
                });
            });

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant Wise Order Report");

            worksheet.columns = [
                { header: "Station Name", key: "station_name", width: 20 },
                { header: "Target Qty", key: "target_qty", width: 15 },
                { header: "Date", key: "created_date", width: 12 },
                { header: "quantity", key: "target_quantity", width: 10 },
                { header: "variance", key: "variance", width: 10 },
                // { header: "Product Name", key: "product_name", width: 20 },
                // { header: "Total Orders", key: "totalorder", width: 15 },
                // { header: "Total Qty", key: "totalquantity", width: 15 },
                // { header: "Net Amount", key: "netamount", width: 15 },
                // { header: "CGST", key: "cgst", width: 10 },
                // { header: "SGST", key: "sgst", width: 10 },
                // { header: "IGST", key: "igst", width: 10 },
                // { header: "Gross Amount", key: "grossamount", width: 18 },
            ];


            // if (getVarianceReport) {
            //     res.render('./RailNeer/VarianceReport', { title: 'VarianceReport', VarianceReportData: getVarianceReport, StationData: getStationName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            // } else {
            //     res.render('./RailNeer/VarianceReport', { title: 'VarianceReport', VarianceReportData: '', StationData: getStationName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            // }

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Variance Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:E1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(Result);

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
                "attachment; filename=" + "VarianceReport.xlsx"
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
exports.GetVarianceExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "StationID": req.body.StationID ? req.body.StationID : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                "unitkey": req.body.unitkey ?? 'static',
                // "order_type": req.body.order_type ?? '1'
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            getStationName = await new Promise((resolve, reject) => {
                StationAPIManager.getStationPlantWise(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getVarianceReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getVarianceReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var Result = [];
            // let excelgetVarianceReport = getVarianceReport;

            if (getVarianceReport && getVarianceReport.data && getVarianceReport.data.length > 0) {
                getVarianceReport.data.forEach((udata) => {
                    totalData1 = udata ? udata._report_data : null;
                    totalData1.forEach((obj) => {
                        Result.push({
                            // "Sr.No.": count++,
                            "station_name": udata.station_name,
                            "station_code": udata.station_code,
                            "created_date": obj.created_date,
                            "target_qty": udata.target_qty ? udata.target_qty : '0',
                            "total_quantity": obj.total_quantity,
                            "variance": udata.target_qty ? (parseFloat(obj.total_quantity) - parseFloat(udata.target_qty)) : '0'
                        });
                    });
                });
            }
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Variance Report");
            worksheet.columns = [
                { header: "Station Name", key: "station_name", width: 20 },
                { header: "Station Code", key: "station_code", width: 20 },
                { header: "Date", key: "created_date", width: 12 },
                { header: "Quantity", key: "total_quantity", width: 10 },
                { header: "Target Qty", key: "target_qty", width: 15 },
                { header: "variance", key: "variance", width: 10 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Variance Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:F1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(Result);

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
                "attachment; filename=" + "VarianceReport.xlsx"
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

//----------------------------Variance Mobile Unit Report-----------------------//
exports.GetVarianceMobileUnitReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "TrainID": req.body.TrainID ? req.body.TrainID : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var paramsbody = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_by": "0",
                "order_by_key": "train_name"
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var getTrainName = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(paramsbody, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var getVarianceMobileReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getVarianceMobileUnitReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getVarianceMobileReport) {
                res.render('./RailNeer/VarianceMobileUnitReport', { title: 'VarianceMobileUnitReport', VarianceMobileReportData: getVarianceMobileReport, TrainData: getTrainName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/VarianceMobileUnitReport', { title: 'VarianceMobileUnitReport', VarianceMobileReportData: '', TrainData: getTrainName, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
exports.GetVarianceMobileUnitReportExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "TrainID": req.body.TrainID ? req.body.TrainID : null,
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate,
                // "order_type": req.body.order_type ?? '1'
            }
            var paramsbody = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            getTrainName = await new Promise((resolve, reject) => {
                TrainAPIManager.GetTrain(paramsbody, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getVarianceMobileReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getVarianceMobileUnitReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var Result = [];
            var binaryString = '';
            var binaryArray;
            var count;
            var dayNamesForBinary;
            // let excelgetVarianceMobileUnitReport = getVarianceMobileReport;

            if (getVarianceMobileReport && getVarianceMobileReport.data && getVarianceMobileReport.data.length > 0) {
                getVarianceMobileReport.data.forEach((udata) => {
                    binaryString = udata.frequency
                    binaryArray = binaryString.split(',').map(Number);
                    count = binaryArray.filter(value => value === 1).length;
                    dayNamesForBinary = getDayNamesForBinary(binaryArray);
                    totalData1 = udata ? udata._report_data : null;
                    totalData1.forEach((obj) => {
                        Result.push({
                            // "Sr.No.": count++,
                            "train_name": udata.train_name,
                            "train_number": udata.train_number,
                            "station_code": udata.station_code,
                            "frequency": dayNamesForBinary.toString(),
                            "No_of_days": count,
                            "created_date": obj.created_date,
                            "target_qty": udata.target_qty ? udata.target_qty : '0',
                            "total_quantity": obj.total_quantity,
                            "variance": udata.target_qty ? (parseFloat(obj.total_quantity) - parseFloat(udata.target_qty)) : '0'
                        });
                    });
                });
            }



            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Variance MobileUnit Report");
            worksheet.columns = [
                { header: "Train Name", key: "train_name", width: 20 },
                { header: "Train Number", key: "train_number", width: 20 },
                { header: "Station Code", key: "station_code", width: 20 },
                { header: "Frequency", key: "frequency", width: 35 },
                { header: "No_of_days", key: "No_of_days", width: 20 },
                { header: "Date", key: "created_date", width: 12 },
                { header: "Quantity", key: "total_quantity", width: 10 },
                { header: "Target Qty", key: "target_qty", width: 15 },
                { header: "variance", key: "variance", width: 10 },
            ];
            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Variance MobileUnit Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:I1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(Result);

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
                "attachment; filename=" + "VarianceMobileUnitReport.xlsx"
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

//----------------------------Plant to Plant Import-----------------------//
exports.GetPlantToPlantImportReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var getPlantToPlantImportReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getPlantToPlantImport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getPlantToPlantImportReport) {
                res.render('./RailNeer/PlantImportReport', { title: 'PlantImportReport', ImportReportData: getPlantToPlantImportReport, SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/PlantImportReport', { title: 'PlantImportReport', ImportReportData: '', SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetPlantToPlantImportReportExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "startdate": req.body.startdate ? req.body.startdate : currentDate,
                "enddate": req.body.enddate ? req.body.enddate : currentDate
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var getPlantToPlantImportReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getPlantToPlantImport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            var excelImportdata = [];
            if (getPlantToPlantImportReport && getPlantToPlantImportReport.data && getPlantToPlantImportReport.data.length > 0) {
                excelImportdata = getPlantToPlantImportReport;
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant To Plant Import Report");

            worksheet.columns = [
                { header: "To Plant", key: "master_plant_name", width: 20 },
                { header: "From Plant", key: "plant_name", width: 15 },
                { header: "Product", key: "product_name", width: 15 },
                { header: "Quantity", key: "quantity", width: 15 },
                { header: "Date", key: "Date", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Plant To Plant Import Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:E1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(excelImportdata);

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
                "attachment; filename=" + "PlantToPlantImport.xlsx"
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

//----------------------------Plant to Plant Export-----------------------//
exports.GetPlantToPlantExportReport = [async (req, res) => {
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
            if (getPlantToPlantExportReport) {
                res.render('./RailNeer/PlantExportReport', { title: 'PlantExportReport', ExportReportData: getPlantToPlantExportReport, SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/PlantExportReport', { title: 'PlantExportReport', ExportReportData: '', SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetPlantToPlantExportReportExcel = [async (req, res) => {
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

            if (getPlantToPlantExportReport && getPlantToPlantExportReport.data && getPlantToPlantExportReport.data.length > 0) {
                excelExportdata = getPlantToPlantExportReport;
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Plant To Plant EXport Report");

            worksheet.columns = [
                { header: "To Plant", key: "master_plant_name", width: 20 },
                { header: "From Plant", key: "plant_name", width: 15 },
                { header: "Product", key: "product_name", width: 15 },
                { header: "Quantity", key: "quantity", width: 15 },
                { header: "Date", key: "Date", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Plant To Plant Export Report'

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
                "attachment; filename=" + "PlantToPlantExport.xlsx"
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

//----------------------------Challan Import-----------------------//
exports.GetChallanReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "_order_by": "id",
                "order_type": "2"
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var getChallanReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getChallanReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getChallanReport) {
                res.render('./RailNeer/ChallanReport', { title: 'ChallanReport', ChallanReportData: getChallanReport, SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/ChallanReport', { title: 'ChallanReport', ChallanReportData: '', SearchData: params, FilterData: bodyFilterStatus, cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetChallanReportExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "_order_by": "id",
                "order_type": "2"
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            var getChallanReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getChallanReportList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // var excelExportdata = [];
            // excelExportdata = getChallanReport;

            //if (excelorderdata.length > 0) {

            var Result = [];
            // let excelExportdata = getChallanReport;

            if (getChallanReport && getChallanReport.data && getChallanReport.data.length > 0) {
                // excelImportdata = getPlantToPlantImportReport;
                getChallanReport.data.forEach((udata) => {
                    trainnameBind = []
                    trainnumberBind = []
                    udata.train_information.forEach((doc) => {
                        trainnameBind.push(doc.train_name)
                    });
                    udata.train_information.forEach((doc) => {
                        trainnumberBind.push(doc.train_number)
                    });

                    Result.push({
                        // "Sr.No.": count++,
                        "order_no": udata.order_no,
                        "station_name": udata.station_name,
                        "station_code": udata.station_code,
                        "train_name": trainnameBind ? trainnameBind.toString() : '',
                        "train_number": trainnumberBind ? trainnumberBind.toString() : '',
                        "product_name": udata.product_name,
                        "ship_dt": moment(udata.ship_dt).format('DD-MM-yyyy'),
                        "quantity": udata.quantity,
                        "amt_incl_tax": udata.amt_incl_tax,
                        "created_at": moment(udata.created_at).format('DD-MM-yyyy')
                    });
                });
            }

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Challan Report");

            worksheet.columns = [
                { header: "Order No", key: "order_no", width: 20 },
                { header: "Station Name", key: "station_name", width: 25 },
                { header: "Station Code", key: "station_code", width: 15 },
                { header: "Train Name", key: "train_name", width: 25 },
                { header: "Train Number", key: "train_number", width: 15 },
                { header: "Product Name", key: "product_name", width: 25 },
                { header: "Shipping Date", key: "ship_dt", width: 15 },
                { header: "Quantity", key: "quantity", width: 10 },
                { header: "Amount(incl_tax)", key: "amt_incl_tax", width: 20 },
                { header: "Date", key: "created_at", width: 15 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Challan Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:J1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });

            worksheet.addRows(Result);

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
                "attachment; filename=" + "ChallanReport.xlsx"
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

var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function getDayNamesForBinary(binaryArray) {
    const dayNamesForBinary = [];
    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] === 1) {
            dayNamesForBinary.push(dayNames[i]);
        }
    }
    return dayNamesForBinary;
}

//Banti Parmar 04-10-2023 Start

//----------------------------IRN Generated Report-----------------------//
exports.GetINRReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_no": req.body.order_no ? req.body.order_no : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "key": "2",
                "_order_by": "id"
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getINRReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getINRReport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getINRReport) {
                res.render('./RailNeer/INRReport', { title: 'INRReport', INRReportData: getINRReport, SearchData: params, FilterData: bodyFilterStatus, FetchData: [], alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1 });
            } else {
                res.render('./RailNeer/INRReport', { title: 'INRReport', INRReportData: [], SearchData: params, FilterData: bodyFilterStatus, FetchData: [], alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1 });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetINRReportExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_no": req.body.order_no ? req.body.order_no : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "key": "2",
                "_order_by": "id"
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getINRReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getINRReport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelinrreportdata = [];
            // excelinrreportdata = getINRReport;

            if (getINRReport && getINRReport.data && getINRReport.data.length > 0) {
                excelinrreportdata = getINRReport.data;
            }

            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("IRN Generated Report");

            worksheet.columns = [
                // { header: "Sr. No.", key: "orderdate", width: 5 },
                { header: "Order Date", key: "ship_dt", width: 15 },
                { header: "Order No", key: "order_no", width: 15 },
                { header: "Order Status", key: "status_name", width: 20 },
                { header: "Invoice No", key: "invoice_no", width: 15 },
                { header: "IRN No", key: "Irn", width: 35 },
                { header: "Customer Type", key: "customer_type", width: 15 },
                { header: "Customer GSTIN", key: "gstno", width: 20 },
                { header: "Depot GSTIN", key: "gstin", width: 20 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'IRN Generated Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:H1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });



            var result = [];

            let srno = 1;

            if (excelinrreportdata && excelinrreportdata != null) {
                for (let index = 0; index < excelinrreportdata.length; index++) {
                    const element = excelinrreportdata[index];

                    srno = srno;

                    var ship_dt = '', order_no = '', status_name = '', invoice_no = '', Irn = '', customer_type = '', gstno = '', gstin = '';

                    ship_dt = moment(element.ship_dt).format('DD-MM-yyyy');
                    order_no = element.order_no;

                    if (element.constant_order_status && element.constant_order_status.length > 0) {
                        status_name = element.constant_order_status[0].status_name;
                    }

                    invoice_no = element.order_no;

                    if (element.irn_details && element.irn_details.length > 0) {
                        Irn = element.irn_details[0].Irn;
                    }

                    if (element.cust_org_information && element.cust_org_information.length > 0) {
                        if (element.cust_org_information[0].customer_type_information && element.cust_org_information[0].customer_type_information.length > 0) {
                            customer_type = element.cust_org_information[0].customer_type_information[0].customer_type;
                        }
                    }

                    if (element.cust_org_information && element.cust_org_information.length > 0) {
                        gstno = element.cust_org_information[0].gstno;
                    }

                    if (element.depot_information && element.depot_information.length > 0) {
                        gstin = element.depot_information[0].gstin;
                    }

                    result.push({
                        srno: srno,
                        ship_dt: ship_dt,
                        order_no: order_no,
                        status_name: status_name,
                        invoice_no: invoice_no,
                        Irn: Irn,
                        customer_type: customer_type,
                        gstno: gstno,
                        gstin: gstin
                    });

                    srno++;

                }
            }
            worksheet.addRows(result);

            // let counter = 1;
            // excelinrreportdata.forEach((inreportdata) => {
            //     inreportdata.s_no = counter;
            //     //worksheet.addRow(user); // Add data in worksheet
            //     worksheet.addRow({
            //         'Sr.No.': counter,
            //         'Order Date': inreportdata.ship_dt,
            //         'Order Status': inreportdata.constant_order_status[0].status_name
            //     });
            //     counter++;
            // });

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
                "attachment; filename=" + "IRNGeneratedReport.xlsx"
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

//Banti Parmar 04-10-2023 End

//Banti Parmar 06-10-2023 Start

//----------------------------IRN Correction Report-----------------------//
exports.GetINRCorrectionReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_no": req.body.order_no ? req.body.order_no : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "key": "1",
                "_order_by": "id"
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getINRCorrectionReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getINRCorrectionReport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getINRCorrectionReport) {
                res.render('./RailNeer/INRCorrectionReport', { title: 'INRCorrectionReport', INRCorrectionReportData: getINRCorrectionReport, SearchData: params, FilterData: bodyFilterStatus, FetchData: [], alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1 });
            } else {
                res.render('./RailNeer/INRCorrectionReport', { title: 'INRCorrectionReport', INRCorrectionReportData: [], SearchData: params, FilterData: bodyFilterStatus, FetchData: [], alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1 });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetINRCorrectionReportExcel = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "order_no": req.body.order_no ? req.body.order_no : '',
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "key": "1",
                "_order_by": "id"
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            const getINRCorrectionReport = await new Promise((resolve, reject) => {
                ReportAPIManager.getINRCorrectionReport(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var excelinrcorrectionreportdata = [];
            // excelinrcorrectionreportdata = getINRCorrectionReport;

            if (getINRCorrectionReport && getINRCorrectionReport.data && getINRCorrectionReport.data.length > 0) {
                excelinrcorrectionreportdata = getINRCorrectionReport;
            }


            //if (excelorderdata.length > 0) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("IRN Correction Report");

            worksheet.columns = [
                // { header: "Sr. No.", key: "orderdate", width: 5 },
                { header: "Order Date", key: "ship_dt", width: 15 },
                { header: "Order No", key: "order_no", width: 15 },
                { header: "Order Status", key: "status_name", width: 20 },
                { header: "Invoice No", key: "invoice_no", width: 15 },
                { header: "IRN No", key: "Irn", width: 35 },
                { header: "Customer Type", key: "customer_type", width: 15 },
                { header: "Customer GSTIN", key: "gstno", width: 20 },
                { header: "Depot GSTIN", key: "gstin", width: 20 },
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'IRN Correction Report'

            // Optional merge and styles
            worksheet.mergeCells('A1:H1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });



            var result = [];

            let srno = 1;

            if (excelinrcorrectionreportdata && excelinrcorrectionreportdata != null) {
                for (let index = 0; index < excelinrcorrectionreportdata.length; index++) {
                    const element = excelinrcorrectionreportdata[index];

                    srno = srno;

                    var ship_dt = '', order_no = '', status_name = '', invoice_no = '', Irn = '', customer_type = '', gstno = '', gstin = '';

                    ship_dt = moment(element.ship_dt).format('DD-MM-yyyy');
                    order_no = element.order_no;

                    if (element.constant_order_status && element.constant_order_status.length > 0) {
                        status_name = element.constant_order_status[0].status_name;
                    }

                    invoice_no = element.order_no;

                    if (element.irn_details && element.irn_details.length > 0) {
                        Irn = element.irn_details[0].Irn;
                    }

                    if (element.cust_org_information && element.cust_org_information.length > 0) {
                        if (element.cust_org_information[0].customer_type_information && element.cust_org_information[0].customer_type_information.length > 0) {
                            customer_type = element.cust_org_information[0].customer_type_information[0].customer_type;
                        }
                    }

                    if (element.cust_org_information && element.cust_org_information.length > 0) {
                        gstno = element.cust_org_information[0].gstno;
                    }

                    if (element.depot_information && element.depot_information.length > 0) {
                        gstin = element.depot_information[0].gstin;
                    }

                    result.push({
                        srno: srno,
                        ship_dt: ship_dt,
                        order_no: order_no,
                        status_name: status_name,
                        invoice_no: invoice_no,
                        Irn: Irn,
                        customer_type: customer_type,
                        gstno: gstno,
                        gstin: gstin
                    });

                    srno++;

                }
            }
            worksheet.addRows(result);

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
                "attachment; filename=" + "IRNCorrectionReport.xlsx"
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

exports.GetErrorIRNList = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "order_no": req.body.order_no ? req.body.order_no : ''
            }

            const getErrorIRNList = await new Promise((resolve, reject) => {
                ReportAPIManager.getErrorIRNList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // if (getErrorIRNList) {
            //     return res.status(200).json({ status: 1, message: 'Success', data: getErrorIRNList, error: null })
            // } else {
            //     return res.status(200).json({ status: 0, message: "No Data Found", data: [], error: null });
            // }

            return res.status(200).json({ status: 1, message: 'Success', data: getErrorIRNList, error: null })
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.GetIRNForOrder = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "order_no": req.body.order_no ? req.body.order_no : ''
            }

            const getIRNForOrder = await new Promise((resolve, reject) => {
                ReportAPIManager.getIRNForOrder(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // if (getIRNForOrder) {
            //     return res.status(200).json({ status: 1, message: 'Success', data: getIRNForOrder, error: null })
            // } else {
            //     return res.status(200).json({ status: 0, message: "No Data Found", data: [], error: null });
            // }

            return res.status(200).json({ status: 1, message: 'Success', data: getIRNForOrder, error: null })
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

//Banti Parmar 06-10-2023 End