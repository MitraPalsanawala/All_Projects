var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.getDepot = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Depot/bindDepot`,
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

exports.getDepotForPanel = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.block_id) {
            sendParam["block_id"] = params.block_id
        }
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.status) {
            sendParam["status"] = params.status
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Depot/getDepotForPanel`,
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

exports.setDepotDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.address1) {
            sendParam["address1"] = params.address1
        }
        if (params.address2) {
            sendParam["address2"] = params.address2
        }
        if (params.address3) {
            sendParam["address3"] = params.address3
        }
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.depot_code) {
            sendParam["depot_code"] = params.depot_code
        }
        if (params.depot_name) {
            sendParam["depot_name"] = params.depot_name
        }
        if (params.gstin) {
            sendParam["gstin"] = params.gstin
        }
        if (params.block_id) {
            sendParam["block_id"] = params.block_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.city) {
            sendParam["city"] = params.city
        }
        if (params.pincode) {
            sendParam["pincode"] = params.pincode
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Depot/setDepot`,
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

exports.updateDepotDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.address1) {
            sendParam["address1"] = params.address1
        }
        if (params.address2) {
            sendParam["address2"] = params.address2
        }
        if (params.address3) {
            sendParam["address3"] = params.address3
        }
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.depot_code) {
            sendParam["depot_code"] = params.depot_code
        }
        if (params.depot_name) {
            sendParam["depot_name"] = params.depot_name
        }
        if (params.gstin) {
            sendParam["gstin"] = params.gstin
        }
        if (params.block_id) {
            sendParam["block_id"] = params.block_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.city) {
            sendParam["city"] = params.city
        }
        if (params.pincode) {
            sendParam["pincode"] = params.pincode
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Depot/updateDepot`,
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