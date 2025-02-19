var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetTrain = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_name) {
            sendParam["train_name"] = params.train_name
        }
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
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
        // 'url': `${base_url}Train/getTrain`,
        'url': `${base_url}Train/getTrain1`,
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

exports.CheckTrainName = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_name) {
            sendParam["train_name"] = params.train_name
        }
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Train/checkTrainName`,
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

exports.CheckTrainNumber = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_number) {
            sendParam["train_number"] = params.train_number
        }
        if (params.default_station_id) {
            sendParam["default_station_id"] = params.default_station_id
        }
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Train/checkTrainNumber`,
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

exports.DeleteTrain = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }

    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Train/deleteTrain`,
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