var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetTrainMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_master_name) {
            sendParam["train_master_name"] = params.train_master_name
        }
        if (params.train_master_id) {
            sendParam["train_master_id"] = params.train_master_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
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
        'url': `${base_url}TrainMaster/getTrainMaster`,
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
            // var TrainData = jsonData.data;
            // callback(null, TrainData);
            callback(null, jsonData);
        }
    });
}

exports.CheckTrainMasterNumber = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_master_number) {
            sendParam["train_master_number"] = params.train_master_number
        }
        if (params.train_master_id) {
            sendParam["train_master_id"] = params.train_master_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}TrainMaster/checkTrainMasterNumber`,
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

exports.DeleteTrainMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_master_id) {
            sendParam["train_master_id"] = params.train_master_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}TrainMaster/deleteTrainMaster`,
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

exports.BindTrainNumber = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.train_master_name) {
            sendParam["train_master_name"] = params.train_master_name
        }
        if (params.train_master_id) {
            sendParam["train_master_id"] = params.train_master_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}TrainMaster/BindTrainNumber`,
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