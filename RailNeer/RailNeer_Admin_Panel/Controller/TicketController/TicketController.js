const TicketAPIManager = require('../../Network/TicketAPIManager/TicketAPI');
var dotenv = require('dotenv');
var multer = require('multer');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');
const fs = require('fs')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
// const DIR = "http://192.168.0.233:9922/Tickets/";
// fs.unlinkSync('path/to/file');
const DIR = "./public/UploadFiles/AttachmentImg/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, DIR); },
    filename: function (req, file, cb) {
        const date = moment.utc().format();
        const filename = moment.utc(date).local().format("DDMMYYYYHHmmss") + ".png";
        cb(null, uuidv4() + "-" + filename);
    }
});


const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error(ImageError), false);
    }
    cb(null, true);
};
var ImageError = "Only .png, .jpg and .jpeg format allowed!";


//-------------------------------------- Add Ticket Detail -----------------------------------//

exports.getTicketDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            res.render('./RailNeer/AddTicket', { title: 'AddTicket', UserData: '', SearchData: '', FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
        } else {
            res.redirect('./Splash');
        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.setTicketDetail = [async (req, res) => {
    try {
        var upload = multer({ storage: storage, fileFilter: imageFilter }).array('Attechments', 3);
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                return res.status(200).json({ status: 0, Message: ImageError, data: null });
            } else {
                var bodyFiles = []; // Initialize an array to store file names
                req.files.forEach((file) => {
                    bodyFiles.push(file.filename); // Save each file's filename to the array
                });
                var bodySubject = req.body.subject;
                var bodyDescription = req.body.description ? req.body.description : '';
                var option = req.cookies.admindata;
                var params = {
                    "user_id": req.cookies.admindata ? req.cookies.admindata[0].id : '',
                    "subject": bodySubject,
                    "Attechments": bodyFiles,
                    "description": bodyDescription,
                    "from": 2
                }
                let userRegister = await new Promise((resolve, reject) => {
                    TicketAPIManager.setTicket(params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });
                if (userRegister.status == true) {
                    res.render('./RailNeer/AddTicket', { title: 'AddTicket', UserData: '', SearchData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                } else {
                    res.render('./RailNeer/AddTicket', { title: 'AddTicket', UserData: '', SearchData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

//-------------------------------------- View Ticket Detail -----------------------------------//

exports.viewTicketDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            const currentDate = moment(Date.now()).format('DD-MM-YYYY');
            var params = {
                "user_id": req.cookies.admindata ? req.cookies.admindata[0].id : '',
                "order_by_key": "ticket_id",
                "start_date": req.body.start_date ? req.body.start_date : currentDate,
                "end_date": req.body.end_date ? req.body.end_date : currentDate,
                "ticket_number": req.body.ticket_number ? req.body.ticket_number : "",
                "is_conversation": "false"
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getTicketDetail = await new Promise((resolve, reject) => {
                TicketAPIManager.GetTicket(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getTicketDetail) {
                res.render('./RailNeer/ViewTicket', { title: 'ViewTicket', TicketData: getTicketDetail, SearchData: params, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata });
            } else {
                res.render('./RailNeer/ViewTicket', { title: 'ViewTicket', TicketData: '', SearchData: params, FilterData: bodyFilterStatus, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];


//-------------------------------------- Ticket Detail -----------------------------------//

exports.IDwiseTicketDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var bodyTickedID = req.params.ticket_id ? req.params.ticket_id : req.body.ticket_id ? req.body.ticket_id : '';
            var params = {
                "user_id": req.cookies.admindata ? req.cookies.admindata[0].id : '',
                "ticket_id": bodyTickedID,
                "is_conversation": "true"
            }

            // var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getConversationTicketDetail = await new Promise((resolve, reject) => {
                TicketAPIManager.GetTicket(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            if (getConversationTicketDetail) {
                res.render('./RailNeer/TicketConversation', { title: 'TicketConversation', TicketConversationData: getConversationTicketDetail.data, SearchData: params, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: req.params.ticket_id });
            } else {
                res.render('./RailNeer/TicketConversation', { title: 'TicketConversation', TicketConversationData: '', SearchData: params, FilterData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.setConversation = [async (req, res) => {
    try {
        console.log("====req.files", req.files)
        var upload = multer({ storage: storage, fileFilter: imageFilter }).array('Attechments', 3);
        upload(req, res, async (err) => {
            if (req.fileValidationError) {
                return res.status(200).json({ status: 0, Message: ImageError, data: null });
            } else {
                var bodyFiles = []; // Initialize an array to store file names
                req.files.forEach((file) => {
                    bodyFiles.push(file.filename); // Save each file's filename to the array
                });
                console.log("====req.files", req.files)
                var ticket_id = req.body.ticket_id;
                var bodyDescription = req.body.description ? req.body.description : '';
                var option = req.cookies.admindata;
                var params = {
                    "ticket_id": req.body.ticket_id,
                    "user_id": req.cookies.admindata ? req.cookies.admindata[0].id : '',
                    "Attechments": bodyFiles,
                    "description": bodyDescription,
                    // "from": 2`
                }

                let userRegister = await new Promise((resolve, reject) => {
                    TicketAPIManager.setConversation(params, option, (error, data) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (userRegister.status == true) {
                    res.redirect('/TicketConversation/' + ticket_id);
                    // res.render('./RailNeer/AddTicket', { title: 'AddTicket', UserData: '', SearchData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                } else {
                    res.redirect('/TicketConversation/' + ticket_id);
                    // res.render('./RailNeer/AddTicket', { title: 'AddTicket', UserData: '', SearchData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong', cookieData: req.cookies.admindata, moment: moment1, ID: '' });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];