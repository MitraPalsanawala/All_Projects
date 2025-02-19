var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetStation = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.key) {
            sendParam["key"] = params.key
        }
        if (params.value) {
            sendParam["value"] = params.value
        }

    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Station/getStation`,
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
            // var StationData = jsonData.data;
            // callback(null, StationData);
            // console.log("========jsonData=====", jsonData)
            callback(null, jsonData);
        }
    });
}

exports.getStationForPanel = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.cost_category) {
            sendParam["cost_category"] = params.cost_category
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
        'url': `${base_url}Station/getStationForPlan`,
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

exports.setStationDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.station_name) {
            sendParam["station_name"] = params.station_name
        }
        if (params.station_code) {
            sendParam["station_code"] = params.station_code
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.state_name) {
            sendParam["state_name"] = params.state_name
        }
        if (params.controller_id) {
            sendParam["controller_id"] = params.controller_id
        }
        if (params.supplier_id) {
            sendParam["supplier_id"] = params.supplier_id
        }
        if (params.collector_id) {
            sendParam["collector_id"] = params.collector_id
        }
        if (params.target_qty) {
            sendParam["target_qty"] = params.target_qty
        }
        if (params.cost_category) {
            sendParam["cost_category"] = params.cost_category
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
        if (params.station_master_id) {
            sendParam["station_master_id"] = params.station_master_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Station/setStation`,
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

exports.updateStationDetail = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.station_name) {
            sendParam["station_name"] = params.station_name
        }
        if (params.station_code) {
            sendParam["station_code"] = params.station_code
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.state_name) {
            sendParam["state_name"] = params.state_name
        }
        if (params.controller_id) {
            sendParam["controller_id"] = params.controller_id
        }
        if (params.supplier_id) {
            sendParam["supplier_id"] = params.supplier_id
        }
        if (params.collector_id) {
            sendParam["collector_id"] = params.collector_id
        }
        if (params.target_qty) {
            sendParam["target_qty"] = params.target_qty
        }
        if (params.cost_category) {
            sendParam["cost_category"] = params.cost_category
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Station/updateStation`,
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

exports.getStationPlantWise = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
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
        'url': `${base_url}Station/getPlantWiseStationData`,
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