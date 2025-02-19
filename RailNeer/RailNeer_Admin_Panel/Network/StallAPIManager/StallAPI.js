var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetStallMaster = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.is_stall_user_list) {
            sendParam["is_stall_user_list"] = params.is_stall_user_list
        }
        if (params.is_from_admin) {
            sendParam["is_from_admin"] = params.is_from_admin
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.cust_org_id) {
            sendParam["cust_org_id"] = params.cust_org_id
        }
        if (params.gstnumber) {
            sendParam["gstnumber"] = params.gstnumber
        }
        if (params.name) {
            sendParam["name"] = params.name
        }
        if (params.code) {
            sendParam["code"] = params.code
        }
        if (params.is_delete) {
            sendParam["is_delete"] = params.is_delete
        }
        if (params.is_active) {
            sendParam["is_active"] = params.is_active
        }
        if (params.order_by) {
            sendParam["order_by"] = params.order_by
        }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.unique_key) {
            sendParam["unique_key"] = params.unique_key
        }
        if (params.per_page) {
            sendParam["per_page"] = params.per_page
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}StallMaster/getStallMaster`,
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

exports.GetStallUserOLD = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.stall_id) {
            sendParam["stall_id"] = params.stall_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getUser`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    console.log("====ID===", params)
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            // var stationMasterData = jsonData.data;
            // callback(null, stationMasterData);
            callback(null, jsonData);
        }
    });
}

exports.GetStallUserDropDown = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        // if (params.id) {
        //     sendParam["id"] = params.id
        // }
        // if (params.stall_id) {
        //     sendParam["stall_id"] = params.stall_id
        // }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.customer_org_id) {
            sendParam["customer_org_id"] = params.customer_org_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/userFilter`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };

    // console.log("=====op121212121====", options)
    // console.log("====ID===", params)
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
            // console.log("=====jsonData=====", jsonData)
        }
    });
}

exports.GetStallUser = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.stall_id) {
            sendParam["stall_id"] = params.stall_id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.is_stall_user_list) {
            sendParam["is_stall_user_list"] = params.is_stall_user_list
        }
        if (params.is_from_admin) {
            sendParam["is_from_admin"] = params.is_from_admin
        }
        if (params.is_delete) {
            sendParam["is_delete"] = params.is_delete
        }
        if (params.is_active) {
            sendParam["is_active"] = params.is_active
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}StallMaster/getStallMaster`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        body: JSON.stringify(sendParam)
    };
    console.log("====ID===", params)
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        }
    });
}