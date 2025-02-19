const CfaOrgAPIManger = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
const BlockAPIManager = require('../../Network/BlockAPIManager/BlockAPI');

var renderPage = './RailNeer/Depot';

//-------------------------------------- Depot Detail -----------------------------------//
exports.GetDepotDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_state_id = req.body.filter_state_id ? req.body.filter_state_id : '';
            var body_block_id = req.body.filter_block_id ? req.body.filter_block_id : '';
            var body_cfa_org_id = req.body.filter_cfa_org_id ? req.body.filter_cfa_org_id : '';


            var params = {
                "plant_id": ck_plant_id,
            }

            var filter_params = {
                "plant_id": ck_plant_id,
                "state_id": body_state_id,
                "block_id": body_block_id,
                "cfa_org_id": body_cfa_org_id,
                "status": 1
            }

            var cfaparams = {
                "plant_id": ck_plant_id,
                "order_by_key": "org_name",
                "order_by": "0"
            }

            var blcokparams = {
                "plant_id": ck_plant_id,
                "order_by_key": "block_name",
                "order_by": "0"
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            var SearchData = body_cfa_org_id + "~" + body_block_id + "~" + body_state_id + "~" + bodyFilterStatus;

            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.getCfaOrgForPanel(cfaparams, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getBlock = await new Promise((resolve, reject) => {
                BlockAPIManager.getBlock(blcokparams, option, (error, data) => {
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

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(filter_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getDepotDetail) {
                res.render(renderPage, { title: 'Depot', depotDetail: getDepotDetail, cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: SearchData });
            } else {
                res.render(renderPage, { title: 'Depot', depotDetail: '', cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: SearchData });
            }

        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.AddDepotDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_depot_id = req.body.depot_id ? req.body.depot_id : '';
            var body_cfa_org_id = req.body.cfa_org_id ? req.body.cfa_org_id : '';
            var body_block_id = req.body.block_id ? req.body.block_id : '';
            var body_depot_name = req.body.depot_name ? req.body.depot_name : '';
            var body_depot_code = req.body.depot_code ? req.body.depot_code : '';
            var body_gst_no = req.body.gst_no ? req.body.gst_no : '';
            var body_state_id = req.body.state_id ? req.body.state_id : '';
            var body_city = req.body.city ? req.body.city : '';
            var body_pincode = req.body.pincode ? req.body.pincode : '';
            var body_address1 = req.body.address1 ? req.body.address1 : '';
            var body_address2 = req.body.address2 ? req.body.address2 : '';
            var body_address3 = req.body.address3 ? req.body.address3 : '';
            var body_user_id = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null;

            var params = {
                "plant_id": ck_plant_id
            }

            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.getCfaOrgForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getBlock = await new Promise((resolve, reject) => {
                BlockAPIManager.getBlock(params, option, (error, data) => {
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

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            var add_params = {
                "depot_id": body_depot_id,
                "address1": body_address1,
                "address2": body_address2,
                "address3": body_address3,
                "cfa_org_id": body_cfa_org_id,
                "depot_code": body_depot_code,
                "depot_name": body_depot_name,
                "gstin": body_gst_no,
                "block_id": body_block_id,
                "plant_id": ck_plant_id,
                "state_id": body_state_id,
                "city": body_city,
                "pincode": body_pincode,
                "user_id": body_user_id
            }

            let alertTitle, alertmsg;
            if (!body_depot_id) {

                const setDepotDetail = await new Promise((resolve, reject) => {
                    DepotAPIManager.setDepotDetail(add_params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (setDepotDetail.status == false) {
                    alertTitle = 'Invalid'
                    // alertmsg = 'Something went wrong'
                } else {
                    alertTitle = 'Success'
                    // alertmsg = setProductMappingDetail.message ? setProductMappingDetail.message : setProductMappingDetail.Message ? setProductMappingDetail.Message : 'Success'
                }
                alertmsg = setDepotDetail.message ? setDepotDetail.message : setDepotDetail.Message ? setDepotDetail.Message : 'Something went wrong';

            } else {

                const updateDepotDetail = await new Promise((resolve, reject) => {
                    DepotAPIManager.updateDepotDetail(add_params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (updateDepotDetail.status == false) {
                    alertTitle = 'Invalid'
                } else {
                    alertTitle = 'Success'
                }
                alertmsg = updateDepotDetail.message ? updateDepotDetail.message : updateDepotDetail.Message ? updateDepotDetail.Message : 'Something went wrong';

            }

            res.render(renderPage, { title: 'Depot', depotDetail: getDepotDetail, cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: alertTitle, alertMessage: alertmsg, cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {

        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.FetchDepotDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var ck_plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : '';
            var body_depot_id = req.params.depot_id;

            var params = {
                "plant_id": ck_plant_id
            }

            var fetch_params = {
                "depot_id": body_depot_id,
                "plant_id": ck_plant_id
            }

            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.getCfaOrgForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getBlock = await new Promise((resolve, reject) => {
                BlockAPIManager.getBlock(params, option, (error, data) => {
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

            const getDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const fetchDepotDetail = await new Promise((resolve, reject) => {
                DepotAPIManager.getDepotForPanel(fetch_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (fetchDepotDetail) {
                if (fetchDepotDetail.data && fetchDepotDetail.data.length > 0) {
                    res.render(renderPage, { title: 'Depot', depotDetail: getDepotDetail, cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: fetchDepotDetail, SearchData: '' });
                } else {
                    res.render(renderPage, { title: 'Depot', depotDetail: getDepotDetail, cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });
                }
            } else {
                res.render(renderPage, { title: 'Depot', depotDetail: getDepotDetail, cfaOrg: getCFAOrganization, stateDetail: getStateDetail, blockDetail: getBlock, alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: '', ID: '', FetchData: '', SearchData: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
