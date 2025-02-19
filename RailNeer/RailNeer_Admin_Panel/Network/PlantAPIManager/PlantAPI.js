var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.GetPlant = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.plant_name) {
            sendParam["plant_name"] = params.plant_name
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
    }

    sendParam["order_by"] = 1
    
    var options = {
        'method': 'POST',
        'url': `${base_url}Plant/getPlant`,
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

exports.CheckPlantName = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_name) {
            sendParam["plant_name"] = params.plant_name
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Plant/checkPlantName`,
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

exports.DeletePlant = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Plant/deletePlant`,
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