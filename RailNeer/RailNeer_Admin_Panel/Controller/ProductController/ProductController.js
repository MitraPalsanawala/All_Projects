const ProductAPIManager = require('../../Network/ProductAPIManager/ProductAPI');
const ConstantAPIManager = require('../../Network/ConstantAPIManager/ConstantAPI');
const PlantAPIManager = require('../../Network/PlantAPIManager/PlantAPI');

var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
var renderPage = './RailNeer/ProductView';

//--------------------------------------Product Add------------------------------------//
exports.GetProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyPlantID = req.params.plantID ? req.params.plantID : req.body.plant_id ? req.body.plant_id : '';
            // var bodyPlantID = req.params.plant_id ? req.params.plant_id : '';

            var body_product_id = req.body.filter_product_id;
            var body_cost_category_id = req.body.filter_cost_category_id;

            var params = {
                "plant_id": bodyPlantID,
                "product_id": body_product_id,
                "cost_category_id": body_cost_category_id
            }

            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;

            var SearchData = body_product_id + "~" + body_cost_category_id + "~" + bodyFilterStatus;

            const getProductList = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getProductPlantMappingData = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductPlantMappingDetail(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getPlantDetail = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getProductPlantMappingData) {
                res.render(renderPage, { title: 'Product Detail', productMappingData: getProductPlantMappingData, productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: bodyPlantID, FetchData: '', SearchData: SearchData });
            } else {
                res.render(renderPage, { title: 'Product Detail', productMappingData: '', productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: bodyPlantID, FetchData: '', SearchData: SearchData });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.AddProduct = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyunit_cost_id = req.body.unit_cost_id ? req.body.unit_cost_id : '';
            var bodyproduct_plant_mapping_id = req.body.product_plant_mapping_id ? req.body.product_plant_mapping_id : '';
            var bodyplant_id = req.body.plant_id;
            var bodyproduct_id = req.body.product_id;
            var bodycost_category_id = req.body.cost_category_id;
            var bodyQtyPerCarton = req.body.QtyPerCarton;
            var bodyGST = req.body.GST;
            // var bodyCartonCost = req.body.CartonCost;
            var bodyuser_id = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null;
            var txtPrice = req.body.txtPrice ? req.body.txtPrice : 0
            var CostCategoryExtraCharge = req.body.CostCategoryExtraCharge ? req.body.CostCategoryExtraCharge : 0
            var bodyCartonCost = parseFloat(txtPrice) * parseFloat(bodyQtyPerCarton)
            var TotalCost = parseFloat(bodyCartonCost) + parseFloat(CostCategoryExtraCharge)
            var params = {
                "plant_id": bodyplant_id,
                "product_id": bodyproduct_id,
                "cost_category_id": bodycost_category_id,
                "QtyPerCarton": bodyQtyPerCarton,
                "GST": bodyGST,
                "CartonCost": TotalCost,
                "user_id": bodyuser_id,
                "unit_cost_id": bodyunit_cost_id,
                "product_plant_mapping_id": bodyproduct_plant_mapping_id
            }

            let alertTitle, alertmsg;
            if (!bodyunit_cost_id) {
                const setProductMappingDetail = await new Promise((resolve, reject) => {
                    ProductAPIManager.setProductMappingDetail(params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });
                if (setProductMappingDetail.status == false) {
                    alertTitle = 'Invalid'
                    // alertmsg = 'Something went wrong'
                } else {
                    alertTitle = 'Success'
                    // alertmsg = setProductMappingDetail.message ? setProductMappingDetail.message : setProductMappingDetail.Message ? setProductMappingDetail.Message : 'Success'
                }
                alertmsg = setProductMappingDetail.message ? setProductMappingDetail.message : setProductMappingDetail.Message ? setProductMappingDetail.Message : 'Something went wrong';
            } else {
                const updateProductMappingDetail = await new Promise((resolve, reject) => {
                    ProductAPIManager.updateProductMappingDetail(params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (updateProductMappingDetail.status == false) {
                    alertTitle = 'Invalid'
                } else {
                    alertTitle = 'Success'
                }
                alertmsg = updateProductMappingDetail.message ? updateProductMappingDetail.message : updateProductMappingDetail.Message ? updateProductMappingDetail.Message : 'Something went wrong';
            }
            const getProductList = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getProductPlantMappingData = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductPlantMappingDetail(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getPlantDetail = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render(renderPage, { title: 'Product Detail', productMappingData: getProductPlantMappingData, productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: alertTitle, alertMessage: alertmsg, cookieData: req.cookies.admindata, moment: moment1, ID: bodyplant_id, FetchData: '', SearchData: '' });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.FetchProductPlanDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyPlantID = req.params.plantID;
            var body_unit_cost_id = req.params.unit_cost_id;

            var params = {
                "plant_id": bodyPlantID
            }

            var fetch_params = {
                "plant_id": bodyPlantID,
                "unit_cost_id": body_unit_cost_id
            }

            const getProductList = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductList(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getCostCategory = await new Promise((resolve, reject) => {
                ConstantAPIManager.getCostCategory(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getProductPlantMappingData = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductPlantMappingDetail(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const getPlantDetail = await new Promise((resolve, reject) => {
                PlantAPIManager.GetPlant(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const fetchProductPlantMappingDetail = await new Promise((resolve, reject) => {
                ProductAPIManager.getProductPlantMappingDetail(fetch_params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (fetchProductPlantMappingDetail) {
                if (fetchProductPlantMappingDetail.data && fetchProductPlantMappingDetail.data.length > 0) {
                    res.render(renderPage, { title: 'Product Detail', productMappingData: getProductPlantMappingData, productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: bodyPlantID, FetchData: fetchProductPlantMappingDetail, SearchData: '' });
                } else {
                    res.render(renderPage, { title: 'Product Detail', productMappingData: getProductPlantMappingData, productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: 'Invalid', alertMessage: 'Available', cookieData: req.cookies.admindata, moment: moment1, ID: bodyPlantID, FetchData: '', SearchData: '' });
                }
            } else {
                res.render(renderPage, { title: 'Product Detail', productMappingData: getProductPlantMappingData, productList: getProductList, costCategoryList: getCostCategory, plantDetail: getPlantDetail, alertTitle: 'Invalid', alertMessage: 'Available', cookieData: req.cookies.admindata, moment: moment1, ID: bodyPlantID, FetchData: '', SearchData: '' });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.BindProdutPrice = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                // "product_name": req.body.product_name,
                "id": req.body.id,
            }

            const GetProduct = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (GetProduct && GetProduct.data && GetProduct.data.length > 0) {
                return res.status(200).json({ status: 1, Message: "true", data: GetProduct, error: null });
            } else {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

//--------------------------------------Product Master------------------------------------//

exports.ViewProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.body.id ? req.body.id : null,
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getProduct = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getProduct) {
                res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: getProduct, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            } else {
                res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: '', SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.SetProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var product_name = req.body.product_name ? req.body.product_name : null
            var product_description = req.body.product_description ? req.body.product_description : null
            var CSIMID = req.body.CSIMID ? req.body.CSIMID : null
            var base_price = req.body.base_price ? req.body.base_price : null
            var gst = req.body.gst ? req.body.gst : null
            var hsn_code = req.body.hsn_code ? req.body.hsn_code : null
            var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Product/setProduct`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "product_name": product_name,
                    "product_description": product_description,
                    "CSIMID": CSIMID,
                    "base_price": base_price,
                    "gst": gst,
                    "hsn_code": hsn_code,
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
                    res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted.', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.UpdateProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var product_name = req.body.product_name ? req.body.product_name : null
            var product_description = req.body.product_description ? req.body.product_description : null
            var CSIMID = req.body.CSIMID ? req.body.CSIMID : null
            var base_price = req.body.base_price ? req.body.base_price : null
            var gst = req.body.gst ? req.body.gst : null
            var hsn_code = req.body.hsn_code ? req.body.hsn_code : null
            var updated_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
            var id = req.body.id ? req.body.id : null
            var options = {
                'method': 'POST',
                'url': `${base_url}Product/updateProduct`,
                //'url': `http://192.168.0.101:9922/api/CFAOrg/updateCFAOrg`,
                'headers': {
                    'Content-Type': 'application/json',
                    'login_user_id': `${option[0].id}`,
                    'from': `${process.env.from}`,
                    'authorization': `Bearer ${option[0].token}`
                },
                body: JSON.stringify({
                    "id": id,
                    "product_name": product_name,
                    "product_description": product_description,
                    "CSIMID": CSIMID,
                    "base_price": base_price,
                    "gst": gst,
                    "hsn_code": hsn_code,
                    "updated_by": updated_by,
                    "updated_at": mysqlTimestamp,
                })
            };
            request(options, function (error, response) {
                if (error) {
                } else {
                    var data = response.body
                    if (!data) { return }
                    res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated.', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                }
            });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.FindbyIDProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id,
            }
            const FindByProductData = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getProduct = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (FindByProductData && FindByProductData.data && FindByProductData.data.length > 0) {
                // if (FindByProductData.length > 0) {
                res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: getProduct, SearchData: '', FetchData: FindByProductData, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                // } else {
                //     res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: getProduct, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
                // }
            } else {
                res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: getProduct, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.DeleteProductDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id,
            }
            const deleteProductData = await new Promise((resolve, reject) => {
                ProductAPIManager.DeleteProduct(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getProduct = await new Promise((resolve, reject) => {
                ProductAPIManager.GetProduct(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/Product', { title: 'Product', Menutitle: 'Product', ProductData: getProduct, SearchData: '', FetchData: '', FilterData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, moment: moment1, ID: req.params.id });
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.CheckProductName = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "product_name": req.body.product_name,
                "id": req.body.id,
            }
            const checkproductname = await new Promise((resolve, reject) => {
                ProductAPIManager.CheckProductName(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkproductname.status == 'false') {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            } else {
                return res.status(200).json({ status: 1, Message: "true", data: null, error: null });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
