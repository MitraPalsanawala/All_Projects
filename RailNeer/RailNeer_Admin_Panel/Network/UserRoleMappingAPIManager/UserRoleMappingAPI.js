var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');


exports.GetUserRoleMapping = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.user_role_mapping_id) {
            sendParam["user_role_mapping_id"] = params.user_role_mapping_id
        }
        if (params.user_role_id) {
            sendParam["user_role_id"] = params.user_role_id
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.customer_type_id) {
            sendParam["customer_type_id"] = params.customer_type_id
        }
        if (params.customer_org_id) {
            sendParam["customer_org_id"] = params.customer_org_id
        }
        if (params.station_id) {
            sendParam["station_id"] = params.station_id
        }
        if (params.train_id) {
            sendParam["train_id"] = params.train_id
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.number) {
            sendParam["number"] = params.number
        }
        if (params.expiry_date) {
            sendParam["expiry_date"] = params.expiry_date
        }
        if (params.is_mobile_user_list) {
            sendParam["is_mobile_user_list"] = params.is_mobile_user_list
        }
        if (params.is_stall_user_list) {
            sendParam["is_stall_user_list"] = params.is_stall_user_list
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getUserRoleMapping`,
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

exports.GetUserRole = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.user_role_id) {
            sendParam["user_role_id"] = params.user_role_id
        }
        if (params.role_name) {
            sendParam["role_name"] = params.role_name
        }
        // if (params.id) {
        //     sendParam["id"] = params.id
        // }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getUserRole`,
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
            // var UserRoleData = jsonData.data;
            // callback(null, UserRoleData);
            callback(null, jsonData);
        }
    });
}

exports.getCFADetailofDepot = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getCFAUserofDepot`,
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

exports.getUpdateUserRoleDropdown = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.user_role_mapping_id) {
            sendParam["user_role_mapping_id"] = params.user_role_mapping_id
        }

    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getUpdateUserBindRoleMapping`,
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
            // var UserRoleData = jsonData.data;
            // callback(null, UserRoleData);
            callback(null, jsonData);
        }
    });
}
