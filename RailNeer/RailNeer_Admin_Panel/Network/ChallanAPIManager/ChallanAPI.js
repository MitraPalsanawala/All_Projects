var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetChallanData = function (params, option, callback) {
    var sendParam = {
        "user_id": "",
        "key": "",
        "start_date": "",
        "end_date": "",
        "_order_by": "id",
        "id": "",
        "order_no": "",
        "order_status": "",
        "plant_id": "",
        "is_deleted": "",
        "cfa_org_id": "",
        "confirmed_by": "",
        "delivered_by": "",
        "controller_by": "",
        "collected_by": "",
        "ordered_by": "",
        "cust_org_id": "",
        "depot_id": "",
        "search_key": "",
        "search_value": "",
        "station_id": "",
        "train_id": "",
        "customer_type_id": "",
        "order_type": "",
        "challan_type": ""
    }
    if (params) {
        if (params.order_no) {
            sendParam["order_no"] = params.order_no
        }
        if (params._order_by) {
            sendParam["_order_by"] = params._order_by
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Order/getChallanList`,
        'headers': {
            'Content-Type': 'application/json',
            // 'login_user_id': '',
            'from': `${process.env.from}`,
            // 'authorization': ''
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

exports.GetChallanDataForPanel = function (params, option, callback) {
    var sendParam = {
        "user_id": "",
        "key": "",
        "start_date": "",
        "end_date": "",
        "_order_by": "id",
        "id": "",
        "order_no": "",
        "order_status": "",
        "plant_id": "",
        "is_deleted": "",
        "cfa_org_id": "",
        "confirmed_by": "",
        "delivered_by": "",
        "controller_by": "",
        "collected_by": "",
        "ordered_by": "",
        "cust_org_id": "",
        "depot_id": "",
        "search_key": "",
        "search_value": "",
        "station_id": "",
        "train_id": "",
        "customer_type_id": "",
        "order_type": "",
        "challan_type": ""
    }
    if (params) {
        if (params.order_no) {
            sendParam["order_no"] = params.order_no
        }
        if (params._order_by) {
            sendParam["_order_by"] = params._order_by
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Order/getChallanList`,
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
