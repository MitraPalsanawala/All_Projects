var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.getOrder = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.cust_org_id) {
            sendParam["cust_org_id"] = params.cust_org_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.order_no) {
            sendParam["order_no"] = params.order_no
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
        if (params.startdate) {
            sendParam["startdate"] = params.startdate
        }
        if (params.enddate) {
            sendParam["enddate"] = params.enddate
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Order/getOrder`,
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