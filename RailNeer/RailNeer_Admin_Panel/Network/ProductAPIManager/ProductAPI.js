var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.getProductList = function (params, option, callback) {
    var sendParam = {}

    var options = {
        'method': 'POST',
        'url': `${base_url}Product/bindProduct`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.getProductPlantMappingDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
        }
        if (params.unit_cost_id) {
            sendParam["unit_cost_id"] = params.unit_cost_id
        }
        if (params.cost_category_id) {
            sendParam["cost_category_id"] = params.cost_category_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}ProductPlantMapping/getProductPlantMapping`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.setProductMappingDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.CartonCost) {
            sendParam["carton_price"] = params.CartonCost
        }
        if (params.QtyPerCarton) {
            sendParam["qty_per_carton"] = params.QtyPerCarton
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
        }
        if (params.cost_category_id) {
            sendParam["cost_category_id"] = params.cost_category_id
        }
        if (params.GST) {
            sendParam["gst"] = params.GST
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
        if (params.CartonCost && params.QtyPerCarton) {
            sendParam["cost_per_qty"] = parseFloat(params.CartonCost) / parseFloat(params.QtyPerCarton)
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}ProductPlantMapping/setProductPlantMapping`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.updateProductMappingDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.CartonCost) {
            sendParam["carton_price"] = params.CartonCost
        }
        if (params.QtyPerCarton) {
            sendParam["qty_per_carton"] = params.QtyPerCarton
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
        }
        if (params.cost_category_id) {
            sendParam["cost_category_id"] = params.cost_category_id
        }
        if (params.GST) {
            sendParam["gst"] = params.GST
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
        if (params.unit_cost_id) {
            sendParam["unit_cost_id"] = params.unit_cost_id
        }
        if (params.product_plant_mapping_id) {
            sendParam["product_plant_mapping_id"] = params.product_plant_mapping_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}ProductPlantMapping/UpdateProductPlantMapping`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.GetProduct = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.product_name) {
            sendParam["product_name"] = params.product_name
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Product/getProduct`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.DeleteProduct = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Product/deleteProduct`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}

exports.CheckProductName = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.product_name) {
            sendParam["product_name"] = params.product_name
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Product/checkProductName`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}