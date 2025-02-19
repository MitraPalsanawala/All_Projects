const ConstantAPIManager = require('../../Network/ConstantAPIManager/ConstantAPI');
const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
const StationAPIManager = require('../../Network/StationAPIManager/StationAPI');
const StationMasterAPIManager = require('../../Network/StationMasterAPIManager/StationMasterAPI');

var renderPage = './RailNeer/Station';

//-------------------------------------- Station Detail -----------------------------------//
exports.GetStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_state_id = req.body.filter_state_id ? req.body.filter_state_id : '';
            var body_depot_id = req.body.filter_depot_id ? req.body.filter_depot_id : '';
            var body_filter_cost_category_id = req.body.filter_cost_category_id ? req.body.filter_cost_category_id : '';

            var params = {
                "plant_id": ck_plant_id,
                "state_id": body_state_id,
                "depot_id": body_depot_id,
                "cost_category": body_filter_cost_category_id,
                // "order_by_key": "depot_name",
                // "order_by": "0"
            }
            var stParams = {
                "is_nested_data": false,
                "is_from_admin": false,
                "is_like_query": false,
                "is_delete": "0",
                "is_active": "1",
                "order_by_key": "name",
                "order_by": "0",
                "plant_id": ck_plant_id,
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            var SearchData = body_state_id + "~" + body_depot_id + "~" + body_filter_cost_category_id + "~" + bodyFilterStatus;

            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepot(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStateDetail = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.DropDownStationMaster(stParams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getStationDetail) {
                res.render(renderPage, { title: 'Station', stationDetail: getStationDetail, depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: getStationMaster, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: SearchData });
            } else {
                res.render(renderPage, { title: 'Station', stationDetail: '', depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: getStationMaster, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: SearchData });
            }

        } else {
            res.redirect('/Splash');
        }
    } catch (error) {

        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.AddStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_station_master_id = req.body.station_master_id ? req.body.station_master_id : '';
            var body_station_id = req.body.station_id ? req.body.station_id : '';
            var body_station_name = req.body.station_name ? req.body.station_name : '';
            var body_station_code = req.body.station_code ? req.body.station_code : '';
            var body_target_qty = req.body.target_qty ? req.body.target_qty : '';
            var body_cost_category_id = req.body.cost_category_id ? req.body.cost_category_id : '';
            var body_state_id = req.body.state_id ? req.body.state_id : '';
            var body_depot_id = req.body.depot_id ? req.body.depot_id : '';
            var body_controller_id = req.body.controller_id ? req.body.controller_id : '';
            var body_supplier_id = req.body.supplier_id ? req.body.supplier_id : '';
            var body_collector_id = req.body.collector_id ? req.body.collector_id : '';
            var body_user_id = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null;
            let body_state_name;

            var params = {
                "plant_id": ck_plant_id
            }

            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepot(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStateDetail = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getStateDetail && getStateDetail.data && getStateDetail.data.length > 0) {
                body_state_name = getStateDetail.data.filter(x => x.state_id == body_state_id);
            }

            var add_params = {
                "station_id": body_station_id,
                "station_master_id": body_station_master_id,
                "station_name": body_station_name,
                "station_code": body_station_code,
                "plant_id": ck_plant_id,
                "depot_id": body_depot_id,
                "state_id": body_state_id,
                "state_name": body_state_name.length > 0 ? body_state_name[0].state_name : '',
                "controller_id": body_controller_id,
                "supplier_id": body_supplier_id,
                "collector_id": body_collector_id,
                "target_qty": body_target_qty,
                "cost_category": body_cost_category_id,
                "user_id": body_user_id
            }

            let alertTitle, alertmsg;
            if (!body_station_id) {
                const setStationDetail = await new Promise((resolve, reject) => {
                    StationAPIManager.setStationDetail(add_params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (setStationDetail.status == false) {
                    alertTitle = 'Invalid'
                    // alertmsg = 'Something went wrong'
                } else {
                    alertTitle = 'Success'
                    // alertmsg = setProductMappingDetail.message ? setProductMappingDetail.message : setProductMappingDetail.Message ? setProductMappingDetail.Message : 'Success'
                }
                alertmsg = setStationDetail.message ? setStationDetail.message : setStationDetail.Message ? setStationDetail.Message : 'Something went wrong';

            } else {

                const updateStationDetail = await new Promise((resolve, reject) => {
                    StationAPIManager.updateStationDetail(add_params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (updateStationDetail.status == false) {
                    alertTitle = 'Invalid'
                } else {
                    alertTitle = 'Success'
                }
                alertmsg = updateStationDetail.message ? updateStationDetail.message : updateStationDetail.Message ? updateStationDetail.Message : 'Something went wrong';
            }
            res.render(renderPage, { title: 'Station', stationDetail: getStationDetail, depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: '', alertTitle: alertTitle, alertMessage: alertmsg, cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {

        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.FetchStationDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_station_id = req.params.station_id;

            var params = {
                "plant_id": ck_plant_id
            }

            var fetch_params = {
                "station_id": body_station_id,
                "plant_id": ck_plant_id
            }

            var stParams = {
                "is_nested_data": false,
                "is_from_admin": false,
                "is_like_query": false,
                "is_delete": "0",
                "is_active": "1",
                "order_by_key": "id",
                "order_by": "1"
            }

            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepot(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStateDetail = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const fetchStationDetail = await new Promise((resolve, reject) => {
                StationAPIManager.getStationForPanel(fetch_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getStationMaster = await new Promise((resolve, reject) => {
                StationMasterAPIManager.DropDownStationMaster(stParams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (fetchStationDetail) {
                if (fetchStationDetail.data.length > 0) {
                    res.render(renderPage, { title: 'Station', stationDetail: getStationDetail, depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: getStationMaster, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: fetchStationDetail, SearchData: '' });
                } else {
                    res.render(renderPage, { title: 'Station', stationDetail: getStationDetail, depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: getStationMaster, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });
                }
            } else {
                res.render(renderPage, { title: 'Station', stationDetail: getStationDetail, depotList: getDepotDetail, costCategoryList: getCostCategory, stateDetail: getStateDetail, stationMaster: getStationMaster, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });

            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.BindStationCode = [async (req, res) => {
    if (req.cookies.admindata) {
        var option = req.cookies.admindata;
        var params = {
            "is_nested_data": false,
            "is_from_admin": false,
            "is_like_query": false,
            "name": req.body.station_master_name,
            "id": req.body.station_master_id,
            "is_delete": "0",
            "is_active": "1"
        }
        const checkStationCode = await new Promise((resolve, reject) => {
            StationMasterAPIManager.GetStationMaster(params, option, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        if (checkStationCode) {
            if (checkStationCode && checkStationCode.data.length > 0) {
                if (checkStationCode.status == 'false') {
                    return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
                } else {
                    return res.status(200).json({ status: 1, Message: "true", data: checkStationCode, error: null });
                }
            }
            else {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            }
        }
        else {
            return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
        }

    } else {
        res.redirect('/Splash');
    }
}];