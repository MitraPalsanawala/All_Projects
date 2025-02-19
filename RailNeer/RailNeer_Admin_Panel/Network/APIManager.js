var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.GetPlant = function (params, option, callback) {

    var sendParam = {}
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
        body: JSON.stringify({
            "": ""
        })
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            var PlantData = jsonData.data;
            callback(null, PlantData);
        }
    });
}

exports.GetProduct = function (params, option, callback) {
    var options = {
        'method': 'POST',
        'url': `${base_url}Product/getProduct`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify({
            "": ""
        })
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            var PlantData = jsonData.data;
            callback(null, PlantData);
        }
    });
}

