var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetStationMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.code) {
            sendParam["code"] = params.code
        }
        if (params.name) {
            sendParam["name"] = params.name
        }
        if (params.is_delete) {
            sendParam["is_delete"] = params.is_delete
        }
        if (params.is_active) {
            sendParam["is_active"] = params.is_active
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.per_page) {
            sendParam["per_page"] = params.per_page
        }
        if (params.unique_key) {
            sendParam["unique_key"] = params.unique_key
        }
        if (params.is_from_admin) {
            sendParam["is_from_admin"] = params.is_from_admin
        }
        if (params.is_like_query) {
            sendParam["is_like_query"] = params.is_like_query
        }
        if (params.is_nested_data) {
            sendParam["is_nested_data"] = params.is_nested_data
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}StationMaster/getStationMaster`,
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

exports.CheckStationMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.is_nested_data) {
            sendParam["is_nested_data"] = params.is_nested_data
        }
        if (params.is_from_admin) {
            sendParam["is_from_admin"] = params.is_from_admin
        }
        if (params.is_like_query) {
            sendParam["is_like_query"] = params.is_like_query
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.code) {
            sendParam["code"] = params.code
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}StationMaster/getStationMaster`,
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

exports.DropDownStationMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.is_nested_data) {
            sendParam["is_nested_data"] = params.is_nested_data
        }
        if (params.is_delete) {
            sendParam["is_delete"] = params.is_delete
        }
        if (params.is_active) {
            sendParam["is_active"] = params.is_active
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.is_from_admin) {
            sendParam["is_from_admin"] = params.is_from_admin
        }
        if (params.is_like_query) {
            sendParam["is_like_query"] = params.is_like_query
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}StationMaster/getStationMaster`,
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
            // var stationMasterData = jsonData.data;
            callback(null, jsonData);
        }
    });
}
