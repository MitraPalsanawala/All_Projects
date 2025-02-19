var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.GetTrainStationMapping = function (params, option, callback) {
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
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}TrainStationMapping/getTrainStationMapping`,
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
            // var TrainStationMappingData = jsonData.data;
            // callback(null, TrainStationMappingData);
            callback(null, jsonData);
        }
    });
}

exports.DeleteTrainStationMapping = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}TrainStationMapping/deleteTrainStationMapping`,
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


