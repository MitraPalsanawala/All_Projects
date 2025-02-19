const CfaOrgAPIManger = require('../../Network/CfaOrgAPIManger/CfaOrgAPI');
const DepotAPIManager = require('../../Network/DepotAPIManager/DepotAPI');
const StateAPIManager = require('../../Network/StateAPIManager/StateAPI');
const BlockAPIManager = require('../../Network/BlockAPIManager/BlockAPI');
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


var filename = 'CFAOrgSign/'
const DIR = `./public/UploadFiles/${filename}`
const DIR1 = `./public/UploadFiles/`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'file_name') {
            cb(null, DIR)
        }
    },
    filename: function (req, file, cb) {
        const fileName = moment().format("DD_MM_YYYY_HH_mm_ss");
        cb(null, fileName + '_' + uuidv4() + path.extname(file.originalname))

    }
});
const imageFilter = function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (file.fieldname == 'file_name') {
        if (!['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'].includes(ext)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error(ImageError), false);
        }
    } else {
        req.fileValidationError = 'Invalid file';
        return cb(new Error(fileUploadError), false);
    }
    cb(null, true)
}
var ImageError = 'Only .png, .jpg and .jpeg format allowed!';
var fileUploadError = 'Invalid file format!';

//-------------------------------------- CfaOrg Detail -----------------------------------//

exports.GetCfaOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "cfa_org_id": req.body.cfa_org_id ? req.body.cfa_org_id : null,
            }
            var bodyFilterStatus = Object.keys(req.body).length != 0 ? true : false;
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.GetCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: getState, CfaOrgData: getCFAOrganization, SearchData: params, FilterData: bodyFilterStatus, FetchData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: '' });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.SetCfaOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            let upload = multer({ storage: storage, fileFilter: imageFilter }).single("file_name");
            upload(req, res, async (err) => {
                if (err) {
                    return res.json({ status: 0, message: err.message, data: null, error: err });
                }
                if (req.fileValidationError) {
                    return res.json({ status: 0, message: req.fileValidationError, data: null, error: null });
                }
                const formData = new FormData();
                var org_name = req.body.org_name ? req.body.org_name : null
                var plant_id = req.body.plant_id ? req.body.plant_id : null
                var state_id = req.body.state_id ? req.body.state_id : null
                let filepath = req.file ? req.file.path : null;
                var file_name = req.file ? `${filename}` + req.file.filename : null
                var file_type = req.file ? path.extname(req.file.originalname) : null
                var address = req.body.address ? req.body.address : null
                var created_by = req.body.created_by ? req.body.created_by : null
                var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
                var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null

                if (filepath) {
                    const fileStream = fs.createReadStream(filepath);
                    // if (file_name) {
                    formData.append('file_name', fileStream)
                    formData.append('file_type', file_type)
                    // }
                }
                formData.append('org_name', org_name)
                formData.append('plant_id', plant_id)
                formData.append('state_id', state_id)
                formData.append('address', address ? address : '')
                formData.append('created_by', created_by)

                var options = {
                    'method': 'POST',
                    'url': `${base_url}CFAOrg/setCFAOrg`,
                    'headers': {
                        'Content-Type': 'application/json',
                        'login_user_id': `${option[0].id}`,
                        'from': `${process.env.from}`,
                        'authorization': `Bearer ${option[0].token}`,
                        ...formData.getHeaders()
                    },
                    body: formData
                };

                request(options, function (error, response) {
                    if (error) {
                    } else {
                        var data = response.body
                        if (!data) { return }
                        var jsonData = JSON.parse(data)
                        if (jsonData.status == true) {
                            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: '', CfaOrgData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Inserted', cookieData: req.cookies.admindata, ID: '' });
                        } else {
                            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: '', CfaOrgData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong', cookieData: req.cookies.admindata, ID: '' });
                        }
                    }
                })
            })
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.UpdateCfaOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            let upload = multer({ storage: storage, fileFilter: imageFilter }).single("file_name");
            upload(req, res, async (err) => {
                if (err) {
                    return res.json({ status: 0, message: err.message, data: null, error: err });
                }
                if (req.fileValidationError) {
                    return res.json({ status: 0, message: req.fileValidationError, data: null, error: null });
                }
                const formData = new FormData();
                var fileStream;
                var id = req.body.id ? req.body.id : null
                var org_name = req.body.org_name ? req.body.org_name : null
                var plant_id = req.body.plant_id ? req.body.plant_id : null
                var state_id = req.body.state_id ? req.body.state_id : null
                let filepath = req.file ? req.file.path : null;
                var file_name = '';
                var file_type = req.file ? path.extname(req.file.originalname) : null
                var Oldfile_name = req.body.Oldfile_name ? req.body.Oldfile_name : null
                var address = req.body.address ? req.body.address : null
                var created_by = req.body.created_by ? req.body.created_by : null
                var plant_id = req.cookies.admindata ? req.cookies.admindata[0].plant_id : ''
                var created_by = req.cookies.admindata[0] ? req.cookies.admindata[0].id : null
                if (req.file) {
                    file_name = req.file ? `${filename}` + req.file.filename : null
                    if (Oldfile_name) {
                        const deleteFile = DIR + "/" + Oldfile_name;
                        if (fs.existsSync(deleteFile)) {
                            fs.unlink(deleteFile, (err) => {
                                if (err) {
                                }
                            })
                        }
                    }
                    fileStream = fs.createReadStream(filepath);
                    formData.append('file_name', fileStream)
                } else {
                    file_name = Oldfile_name ? Oldfile_name : null
                }
                formData.append('id', id)
                formData.append('org_name', org_name)
                formData.append('plant_id', plant_id)
                formData.append('state_id', state_id)
                formData.append('address', address ? address : '')
                formData.append('created_by', created_by)

                var options = {
                    'method': 'POST',
                    'url': `${base_url}CFAOrg/updateCFAOrg`,
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
                request(options, function (error, response) {
                    if (error) {
                    } else {
                        var data = response.body
                        if (!data) { return }
                        var jsonData = JSON.parse(data)
                        if (jsonData.status == true) {
                            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: '', CfaOrgData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Success', alertMessage: 'Successfully Updated', cookieData: req.cookies.admindata, ID: '' });
                        } else {
                            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: '', CfaOrgData: '', SearchData: '', FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Something Went Wrong', cookieData: req.cookies.admindata, ID: '' });
                        }
                    }
                })
            })
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.FindByIDCfaOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "plant_id": req.cookies.admindata ? req.cookies.admindata[0].plant_id : '',
                "id": req.params.id ? req.params.id : null
            }
            const getCFAOrgByID = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.GetCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.GetCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (getCFAOrgByID) {
                if (getCFAOrgByID.data && getCFAOrgByID.data.length > 0) {
                    res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: getState, CfaOrgData: getCFAOrganization, SearchData: params, FilterData: '', FetchData: getCFAOrgByID, alertTitle: '', alertMessage: '', cookieData: req.cookies.admindata, ID: req.params.id });
                }
                else {
                    res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: getState, CfaOrgData: getCFAOrganization, SearchData: params, FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, ID: req.params.id });

                }
            } else {
                res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: getState, CfaOrgData: getCFAOrganization, SearchData: params, FilterData: '', FetchData: '', alertTitle: 'Invalid', alertMessage: 'Data Not Available', cookieData: req.cookies.admindata, ID: req.params.id });

            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.DeleteCfaOrgDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "id": req.params.id
            }
            const DeleteCFA = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.DeleteCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getState = await new Promise((resolve, reject) => {
                StateAPIManager.GetState(null, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const getCFAOrganization = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.GetCfaOrg(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            res.render('./RailNeer/CfaOrg', { title: 'CfaOrg', StateData: getState, CfaOrgData: getCFAOrganization, SearchData: params, FilterData: '', FetchData: '', alertTitle: 'Delete', alertMessage: 'Successfully Deleted', cookieData: req.cookies.admindata, ID: req.params.id });
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.CheckCfaOrgName = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            var option = req.cookies.admindata;
            var params = {
                "org_name": req.body.org_name,
                "id": req.body.id,
            }
            const checkCFAOrgName = await new Promise((resolve, reject) => {
                CfaOrgAPIManger.CheckCfaOrgName(params, option, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            if (checkCFAOrgName.status == 'false') {
                return res.status(200).json({ status: 0, Message: "false", data: null, error: null });
            } else {
                return res.status(200).json({ status: 1, Message: "true", data: null, error: null });
            }
        } else {
            res.redirect('./Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];
