var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.GetCustomerOrg = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.customer_type) {
            sendParam["customer_type"] = params.customer_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}CustomerOrg/getCustOrg`,
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
exports.GetCustomerType = function (params, option, callback) {
    // var sendParam = {}
    var options = {
        'method': 'POST',
        'url': `${base_url}CustomerOrg/getCustomerType`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`
        },
        // body: JSON.stringify(sendParam)
    };
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            // var CustomerTypeData = jsonData.data;
            // callback(null, CustomerTypeData);
            callback(null, jsonData);
        }
    });
}
exports.CheckCustOrgName = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.customer_name) {
            sendParam["customer_name"] = params.customer_name
        }
        if (params.customer_no) {
            sendParam["customer_no"] = params.customer_no
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}CustomerOrg/CheckCustOrgName`,
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
exports.DeleteCustOrg = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}CustomerOrg/deleteCustOrg`,
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

exports.setCustOrgStateMapping = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.customer_org_id) {
            sendParam["customer_org_id"] = params.customer_org_id
        }
        if (params.state_id) {
            sendParam["state_id"] = params.state_id
        }
        if (params.gst_no) {
            sendParam["gst_no"] = params.gst_no
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}CustomerOrg/setCustOrgStateMapping`,
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

