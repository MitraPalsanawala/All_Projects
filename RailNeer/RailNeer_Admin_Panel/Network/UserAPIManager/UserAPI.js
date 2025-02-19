var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.GetUser = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.username) {
            sendParam["username"] = params.username
        }
        if (params.name) {
            sendParam["name"] = params.name
        }
        if (params.number) {
            sendParam["number"] = params.number
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
    request(options, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            var jsonData = JSON.parse(body);
            // var UserData = jsonData.data;
            // callback(null, UserData);
            callback(null, jsonData);
        }
    });
}

exports.GetUserDropDown = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        // if (params.block_name) {
        //     sendParam["block_name"] = params.block_name
        // }
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/getUserBindRoleMapping`,
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

exports.CheckUserName = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.username) {
            sendParam["username"] = params.username
        }
        if (params.id) {
            sendParam["id"] = params.id
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/checkUserName`,
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
            // console.log("jjjjjjjj", jsonData)
            // var PlantnameData = jsonData.data;
            callback(null, jsonData);
        }
    });
}

exports.DeleteUser = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.id) {
            sendParam["id"] = params.id
        }
        if (params.status) {
            sendParam["status"] = '0'
        }
        if (params.IsDeleted) {
            sendParam["IsDeleted"] = '1'
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/deleteUserInformationPanel`,
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
            // var PlantnameData = jsonData.data;
            callback(null, jsonData);
        }
    });
}

exports.DownloadUserExcel = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.stock_from) {
            sendParam["stock_from"] = params.stock_from
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
        'url': `${base_url}Report/get_PlantToPlant_Transaction_Export_ReportData`,
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
            callback(null, jsonData.data);
        }
    });
}

exports.ChangePassword = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.userID) {
            sendParam["userID"] = params.userID
        }
        if (params.oldPassword) {
            sendParam["oldPassword"] = params.oldPassword
        }
        if (params.newPassword) {
            sendParam["newPassword"] = params.newPassword
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}User/resetPassword`,
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



