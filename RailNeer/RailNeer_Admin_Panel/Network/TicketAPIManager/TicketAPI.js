var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const FormData = require('form-data');
const fs = require('fs');
const DIR = "./public/UploadFiles/AttachmentImg/";

exports.GetTicket = function (params, option, callback) {
    var sendParam = {}
    if (params) {
        if (params.ticket_id) {
            sendParam["ticket_id"] = params.ticket_id
        }
        if (params.ticket_number) {
            sendParam["ticket_number"] = params.ticket_number
        }
        if (params.start_date) {
            sendParam["start_date"] = params.start_date
        }
        if (params.end_date) {
            sendParam["end_date"] = params.end_date
        }
        if (params.ticket_status) {
            sendParam["ticket_status"] = params.ticket_status
        }
        if (params.user_id) {
            sendParam["user_id"] = params.user_id
        }
        // if (params.order_by) {
        //     sendParam["order_by"] = params.order_by
        // }
        if (params.order_by_key) {
            sendParam["order_by_key"] = params.order_by_key
        }
        if (params.is_conversation) {
            sendParam["is_conversation"] = params.is_conversation
        }
    }
    var options = {
        'method': 'POST',
        'url': `${base_url}Ticket/getTicket`,
        // 'headers': {
        //     'Content-Type': 'application/json'
        // },
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
            // var ticketData = jsonData.data;
            // callback(null, ticketData);
            callback(null, jsonData);
        }
    });
}

exports.setTicket = function (params, option, callback) {
    const formData = new FormData();
    if (params) {
        if (params.user_id) {
            formData.append('user_id', params.user_id);
        }
        if (params.subject) {
            formData.append('subject', params.subject);
        }
        if (params.description) {
            formData.append('description', params.description);
        }
        if (params.from) {
            formData.append('from', params.from);
        }

        if (params.Attechments && params.Attechments.length > 0) {
            params.Attechments.forEach((attachment) => {
                let filepath = DIR + attachment;
                const fileStream = fs.createReadStream(filepath);
                formData.append('Attechments', fileStream);
            });
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Ticket/setTicket`,
        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`,
            ...formData.getHeaders()
        },

        body: formData
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

exports.setConversation = function (params, option, callback) {
    const formData = new FormData();
    if (params) {
        if (params.user_id) {
            formData.append('user_id', params.user_id);
        }
        if (params.ticket_id) {
            formData.append('ticket_id', params.ticket_id);
        }
        if (params.description) {
            formData.append('description', params.description);
        }

        if (params.Attechments && params.Attechments.length > 0) {
            params.Attechments.forEach((attachment) => {
                let filepath = DIR + attachment;
                const fileStream = fs.createReadStream(filepath);
                formData.append('Attechments', fileStream);
            });
        }
    }

    var options = {
        'method': 'POST',
        'url': `${base_url}Ticket/setConversation`,
        // 'headers': {
        //     // 'Content-Type': 'application/json',
        //     ...formData.getHeaders()
        // },

        'headers': {
            'Content-Type': 'application/json',
            'login_user_id': `${option[0].id}`,
            'from': `${process.env.from}`,
            'authorization': `Bearer ${option[0].token}`,
            ...formData.getHeaders()
        },

        body: formData
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