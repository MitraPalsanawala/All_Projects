var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');

exports.getExceptionReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.cfa_org_id) {
            sendParam["cfa_org_id"] = params.cfa_org_id
        }
        if (params.cust_org_id) {
            sendParam["cust_org_id"] = params.cust_org_id
        }
        if (params.order_status) {
            sendParam["order_status"] = params.order_status
        }
        if (params.startdate) {
            sendParam["startdate"] = params.startdate
        }
        if (params.enddate) {
            sendParam["enddate"] = params.enddate
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Report/GetExceptionReportData`,
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

exports.getOrderStatus = function (params, option, callback) {
    var sendParam = {}

    var options = {
        'method': 'POST',
        'url': `${base_url}Constant/getMasterAPIs`,
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

exports.getInventoryProductionBalanceReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
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
        'url': `${base_url}Report/GetInventoryProductionBalanceReportData`,
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

exports.getInventoryDepotBalanceReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
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
        'url': `${base_url}Report/GetInventoryDepotBalanceReportData`,
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

exports.getSalesReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.startdate) {
            sendParam["startdate"] = params.startdate
        }
        if (params.enddate) {
            sendParam["enddate"] = params.enddate
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Report/GetSalesReportData`,
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

exports.getPlantWiseOrderReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.product_id) {
            sendParam["product_id"] = params.product_id
        }
        if (params.depot_id) {
            sendParam["depot_id"] = params.depot_id
        }
        if (params.startdate) {
            sendParam["startdate"] = params.startdate
        }
        if (params.enddate) {
            sendParam["enddate"] = params.enddate
        }
        if (params.order_type) {
            sendParam["order_type"] = params.order_type
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Report/GetPlantWiseOrderReportData`,
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

exports.getVarianceReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.StationID) {
            sendParam["StationID"] = params.StationID
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
        'url': `${base_url}Report/get_variance_report_data`,
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

exports.getVarianceMobileUnitReportList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.TrainID) {
            sendParam["TrainID"] = params.TrainID
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
        'url': `${base_url}Report/GetVarianceMobileUnitReportData`,
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

exports.getPlantToPlantImport = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
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
        'url': `${base_url}Report/get_PlantToPlant_Transaction_Import_ReportData`,
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

exports.getPlantToPlantExport = function (params, option, callback) {
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
            callback(null, jsonData);
        }
    });
}

exports.getChallanReportList = function (params, option, callback) {
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
        if (params.start_date) {
            sendParam["start_date"] = params.start_date
        }
        if (params.end_date) {
            sendParam["end_date"] = params.end_date
        }
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
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

// Banti Parmar 04-10-2023 Start

exports.getINRReport = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.plant_id) {
            sendParam["order_no"] = params.order_no
        }
        if (params.start_date) {
            sendParam["start_date"] = params.start_date
        }
        if (params.end_date) {
            sendParam["end_date"] = params.end_date
        }
        if (params.key) {
            sendParam["key"] = params.key
        }
        if (params._order_by) {
            sendParam["_order_by"] = params._order_by
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Report/getIRNReports`,
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

// Banti Parmar 04-10-2023 End

// Banti Parmar 06-10-2023 Start

exports.getINRCorrectionReport = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.plant_id) {
            sendParam["plant_id"] = params.plant_id
        }
        if (params.plant_id) {
            sendParam["order_no"] = params.order_no
        }
        if (params.start_date) {
            sendParam["start_date"] = params.start_date
        }
        if (params.end_date) {
            sendParam["end_date"] = params.end_date
        }
        if (params.key) {
            sendParam["key"] = params.key
        }
        if (params._order_by) {
            sendParam["_order_by"] = params._order_by
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Report/getIRNReports`,
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

exports.getErrorIRNList = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.order_no) {
            sendParam["order_no"] = params.order_no
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Report/getErrorIRNList`,
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

exports.getIRNForOrder = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.order_no) {
            sendParam["order_no"] = params.order_no
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Order/getIRNForOrder`,
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

// Banti Parmar 06-10-2023 End