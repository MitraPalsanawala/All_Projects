const UserMasterModel = require("../Model/UserMasterModel");
const AnnadanModel = require("../Model/AnnadanModel");
const AnnadanItemDetailModel = require("../Model/AnnadanItemDetailModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const axios = require('axios')
var mongoose = require('mongoose')

const dotenv = require('dotenv')
const https = require('https');
const PaytmChecksum = require('./PaytmChecksum');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const moment1 = require('moment');
const otpGenerator = require('otp-generator')

const crypto = require("crypto");
const { db } = require("../Model/UserMasterModel");

var _LocalTrustDetailsArray = [];
console.log("_LocalTrustDetailsArray========>", _LocalTrustDetailsArray);

dotenv.config();

//06-01-2023 New
exports.SetAnnadanDataV2 = [async (req, res) => {
    try {
        var ArrItemData = ((req.body.ArrItemData) ? (req.body.ArrItemData) : null);
        var ItemTypeID = ((req.body.ItemTypeID) ? (req.body.ItemTypeID) : null);
        if (!req.body.TrustName) {
            res.json({ status: 0, message: "Please Enter Trust Name", data: null, error: null });
        }
        else {
            if (!req.body.ID) {
                newMobile = req.body.MobileNo;

                var Amount;
                if (req.body.Amount) {
                    Amount = parseFloat(req.body.Amount).toFixed(2);
                }

                var OrderID = "";
                if (req.body.ModeOfPayment == "Online") {
                    OrderID = moment().format("DDMMYYYYHHmmssSSS").toString() + "_" + crypto.randomBytes(5).toString("hex")
                }
                if (req.body.CharityType == 'By Payment') {
                    var receiptnumber = "";
                    if (req.body.ModeOfPayment == 'Cash' || req.body.ModeOfPayment == 'Bank') {
                        receiptnumber = (await generatereceiptnumber(req.body.TrustName)).toString()
                    }

                    var data___ = {
                        UserID: req.body.UserID,
                        BhagID: req.body.BhagID,
                        NagarID: req.body.NagarID,
                        VastiID: req.body.VastiID,
                        SocietyID: req.body.SocietyID,
                        AnnadanUserName: req.body.AnnadanUserName,
                        MobileNo: newMobile,
                        Address: req.body.Address,
                        CharityType: req.body.CharityType,
                        ModeOfPayment: req.body.ModeOfPayment,
                        Amount: req.body.Amount,
                        HouseNo: req.body.HouseNo,
                        Landmark: req.body.Landmark,
                        DrivingLicence: req.body.DrivingLicence,
                        PanCardNo: req.body.PanCardNo,
                        AadharCardNo: req.body.AadharCardNo,
                        ItemTypeID: null,
                        Qty: '',
                        QtyType: '',
                        Remark: req.body.Remark,
                        //ReceiptNo: receiptnumber,
                        ReceiptNo: receiptnumber,
                        ChequeNo: (req.body.ChequeNo) ? (req.body.ChequeNo) : '',
                        AnnadanStatus: 'Pending',
                        Type: 'App',
                        Email: (req.body.Email) ? (req.body.Email) : '',
                        BankName: (req.body.BankName) ? (req.body.BankName) : '',
                        TrustName: req.body.TrustName
                    }

                    //console.log(data___)
                    var annadanuserdata = await AnnadanModel(data___).save();

                    if (annadanuserdata) {
                        if (newMobile) {
                            if (req.body.ModeOfPayment == "Cash" || req.body.ModeOfPayment == "Bank") {
                                axios
                                    .get('http://173.45.76.227/send.aspx?username=smtech1&pass=smtech123&route=trans1&senderid=SMTCPL&numbers=' + newMobile + '&source=SMTCPL&message=' + "Thank you for your contribution. Your contribution is " + req.body.Amount + ". SM Techno Consultants")
                                    .then(res => {
                                        console.log(`statusCode: ${res.status}`)
                                    })
                                    .catch(error => {
                                        console.error(error)
                                    });
                            }
                        }
                        if (req.body.ModeOfPayment == "Online") {
                            var paytmParams = {};
                            paytmParams.body = {
                                "mid": process.env.mid,
                                "orderId": OrderID,
                                "amount": Amount,
                                "businessType": process.env.businessType,
                                "posId": process.env.posId,
                                "contactPhoneNo": newMobile
                            };

                            //merchantkey
                            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.merchantkey).then(function (checksum) {
                                paytmParams.head = {
                                    "clientId": "C11",
                                    "version": "v1",
                                    "signature": checksum
                                };

                                var post_data = JSON.stringify(paytmParams);

                                var options = {

                                    /* for Staging */
                                    //hostname: 'securegw-stage.paytm.in',

                                    /* for Production */
                                    hostname: process.env.hostname,

                                    port: 443,
                                    path: '/paymentservices/qr/create',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Content-Length': post_data.length
                                    }
                                };

                                var response = "";
                                var post_req = https.request(options, function (post_res) {
                                    post_res.on('data', function (chunk) {
                                        response += chunk;
                                    });

                                    post_res.on('end', async function () {
                                        var qrresponse = JSON.parse(response)

                                        var qrdata = JSON.stringify({
                                            'OrderID': OrderID,
                                            'signature': (qrresponse.head.signature) ? (qrresponse.head.signature) : '',
                                            'QRCoderesultStatus': (qrresponse.body.resultInfo.resultStatus) ? (qrresponse.body.resultInfo.resultStatus) : '',
                                            'QRCoderesultCode': (qrresponse.body.resultInfo.resultCode) ? (qrresponse.body.resultInfo.resultCode) : '',
                                            'QRCoderesultMsg': (qrresponse.head.signature) ? (qrresponse.head.signature) : '',
                                            'QRCodeqrData': (qrresponse.body.qrData) ? (qrresponse.body.qrData) : '',
                                            'image': (qrresponse.body.image) ? (qrresponse.body.image) : ''
                                        });

                                        var UpdateData = {};
                                        UpdateData["QRCodesignature"] = (qrresponse.head.signature) ? (qrresponse.head.signature) : '';
                                        UpdateData["QRCoderesultStatus"] = (qrresponse.body.resultInfo.resultStatus) ? (qrresponse.body.resultInfo.resultStatus) : '';
                                        UpdateData["QRCoderesultCode"] = (qrresponse.body.resultInfo.resultCode) ? (qrresponse.body.resultInfo.resultCode) : '';
                                        UpdateData["QRCoderesultMsg"] = (qrresponse.head.signature) ? (qrresponse.head.signature) : '';
                                        UpdateData["QRCodeqrData"] = (qrresponse.body.qrData) ? (qrresponse.body.qrData) : '';
                                        UpdateData["PaymentStatus"] = 'Pending';
                                        let updatedata = await AnnadanModel.updateOne({ _id: annadanuserdata._id }, UpdateData).exec();

                                        return res.status(200).json({ status: 1, message: "Succesfully Inserted.", data: annadanuserdata, qrdata: JSON.parse(qrdata), error: null });
                                    });
                                });

                                // return res.status(200).json({ status: 1, message: "Succesfully Inserted.", data: response, error: null });
                                post_req.write(post_data);
                                post_req.end();
                            });
                        } else {
                            return res.status(200).json({ status: 1, message: "Succesfully Inserted.", data: null, error: null });
                        }
                    } else {
                        return res.status(200).json({ status: 1, message: "Not Inserted.", data: null, error: null });
                    }
                } else if (req.body.CharityType == 'By Item') {
                    if (ArrItemData) {
                        var receiptnumber = (await generatereceiptnumber(req.body.TrustName)).toString()
                        var annadanuserdata = await AnnadanModel({
                            UserID: req.body.UserID,
                            BhagID: req.body.BhagID,
                            NagarID: req.body.NagarID,
                            VastiID: req.body.VastiID,
                            SocietyID: req.body.SocietyID,
                            AnnadanUserName: req.body.AnnadanUserName,
                            MobileNo: newMobile,
                            Address: req.body.Address,
                            CharityType: req.body.CharityType,
                            ModeOfPayment: req.body.ModeOfPayment,
                            Amount: req.body.Amount,
                            HouseNo: req.body.HouseNo,
                            Landmark: req.body.Landmark,
                            DrivingLicence: req.body.DrivingLicence,
                            PanCardNo: req.body.PanCardNo,
                            AadharCardNo: req.body.AadharCardNo,
                            ItemTypeID: null,//ArrUserID[0],
                            Qty: '',//ArrUserID[1],
                            QtyType: '',//req.body.QtyType,
                            Remark: req.body.Remark,
                            //ReceiptNo: receiptnumber,
                            ReceiptNo: receiptnumber,
                            ChequeNo: (req.body.ChequeNo) ? (req.body.ChequeNo) : '',
                            AnnadanStatus: 'Pending',
                            Type: 'App',
                            Email: (req.body.Email) ? (req.body.Email) : '',
                            BankName: (req.body.BankName) ? (req.body.BankName) : '',
                            TrustName: req.body.TrustName
                        }).save();
                        //console.log("annadanuserdata=========>", annadanuserdata)
                        if (annadanuserdata) {
                            ArrItemData = ArrItemData.split('~');
                            for (let i = 0; i < ArrItemData.length; i++) {
                                var ArrUserID = ArrItemData[i].split('@');
                                //console.log('======ArrUserID=====', ArrUserID)

                                var annadanitemdata = await AnnadanItemDetailModel({
                                    AnnadanID: annadanuserdata._id,
                                    ItemTypeID: ArrUserID[0],
                                    Qty: ArrUserID[1],
                                    QtyType: '',
                                }).save();

                                //console.log("annadanitemdata=========>", annadanitemdata)
                            }
                            return res.status(200).json({ status: 1, message: "Succesfully Inserted.", data: null, error: null });
                        }
                        else {
                            return res.status(200).json({ status: 1, message: "Not Inserted.", data: null, error: null });
                        }
                    }
                    else {
                        return res.status(200).json({ status: 1, message: "Item Data Not Passed.", data: null, error: null });
                    }
                }
                else {
                    return res.status(200).json({ status: 1, message: "Wrong Charity Type Passed.", data: null, error: null });
                }
            } else {
                let anndanuserData = await AnnadanModel.findOne({ _id: { $nin: req.body.ID }, AnnadanStatus: true }).exec();
                if (anndanuserData) {
                    return res.status(200).json({ status: 1, message: "Annadan Alreday Complete.", data: null, error: null });
                } else {
                    if (req.body.MobileNo) {
                        if (req.body.ModeOfPayment == "Cash" || req.body.ModeOfPayment == "Online" || req.body.ModeOfPayment == "Bank") {
                            axios
                                .get('http://173.45.76.227/send.aspx?username=smtech1&pass=smtech123&route=trans1&senderid=SMTCPL&numbers=' + req.body.MobileNo + '&source=SMTCPL&message=' + "Thank you for your contribution. Your contribution is " + req.body.Amount + ". SM Techno Consultants")
                                .then(res => {
                                    console.log(`statusCode: ${res.status}`)
                                })
                                .catch(error => {
                                    console.error(error)
                                });
                        }
                    }

                    var UpdateData = {};
                    UpdateData["BhagID"] = req.body.BhagID;
                    UpdateData["NagarID"] = req.body.NagarID;
                    UpdateData["VastiID"] = req.body.VastiID;
                    UpdateData["SocietyID"] = req.body.SocietyID;
                    UpdateData["AnnadanUserName"] = req.body.AnnadanUserName;
                    UpdateData["MobileNo"] = req.body.MobileNo;
                    UpdateData["Address"] = req.body.Address;
                    UpdateData["CharityType"] = req.body.CharityType;
                    UpdateData["ModeOfPayment"] = req.body.ModeOfPayment;
                    UpdateData["Amount"] = req.body.Amount;
                    UpdateData["HouseNo"] = req.body.HouseNo;
                    UpdateData["Landmark"] = req.body.Landmark;
                    UpdateData["DrivingLicence"] = req.body.DrivingLicence;
                    UpdateData["PanCardNo"] = req.body.PanCardNo;
                    UpdateData["AadharCardNo"] = req.body.AadharCardNo;
                    // UpdateData["ItemTypeID"] = ItemTypeID;
                    // UpdateData["Qty"] = req.body.Qty;
                    UpdateData["ItemTypeID"] = (req.body.ItemTypeID) ? (req.body.ItemTypeID) : null;
                    UpdateData["Qty"] = (req.body.Qty) ? (req.body.Qty) : '';
                    UpdateData["QtyType"] = req.body.QtyType;
                    UpdateData["Remark"] = req.body.Remark;
                    UpdateData["ChequeNo"] = (req.body.ChequeNo) ? (req.body.ChequeNo) : '';
                    UpdateData["Email"] = (req.body.Email) ? (req.body.Email) : '';
                    UpdateData["BankName"] = (req.body.BankName) ? (req.body.BankName) : '';
                    await AnnadanModel.updateOne({ _id: req.body.ID }, UpdateData).exec();
                    return res.status(200).json({ status: 1, message: "Succesfully Updated.", data: null, error: null });
                }
            }
        }
    } catch (err) {
        // console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];


//06-01-2023 New
exports.GetAnnadanDataV2 = [async (req, res) => {
    try {
        var CheckID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        var CheckUserID = ((req.body.UserID) ? ({ $in: [mongoose.Types.ObjectId(req.body.UserID)] }) : { $nin: [] });
        var CheckBhagID = ((req.body.BhagID) ? ({ $in: [mongoose.Types.ObjectId(req.body.BhagID)] }) : { $nin: [] });
        var CheckNagarID = ((req.body.NagarID) ? ({ $in: [mongoose.Types.ObjectId(req.body.NagarID)] }) : { $nin: [] });
        var CheckVastiID = ((req.body.VastiID) ? ({ $in: [mongoose.Types.ObjectId(req.body.VastiID)] }) : { $nin: [] });
        var CheckSocietyID = ((req.body.SocietyID) ? ({ $in: [mongoose.Types.ObjectId(req.body.SocietyID)] }) : { $nin: [] });
        var CheckMobileNo = ((req.body.MobileNo) ? ({ $in: [(req.body.MobileNo)] }) : { $nin: [] });
        var CheckUserRole = ((req.body.UserRole) ? ({ $in: [(req.body.UserRole)] }) : { $nin: [] });
        let AnnadanUserData = await AnnadanModel.find({
            "_id": CheckID, "UserID": CheckUserID, "BhagID": CheckBhagID, "NagarID": CheckNagarID,
            "VastiID": CheckVastiID, "SocietyID": CheckSocietyID, IsActive: true
        }).populate({ path: 'UserID', select: 'UserName MobileNo UserRole', match: { "MobileNo": CheckMobileNo, "UserRole": CheckUserRole } })
            .populate({ path: 'BhagID', select: 'BhagName' })
            .populate({ path: 'NagarID', select: 'NagarName' })
            .populate({ path: 'VastiID', select: 'VastiName' })
            .populate({ path: 'SocietyID', select: 'SocietyName' })
            .populate({ path: 'ItemTypeID', select: 'ItemType' })
            .populate({ path: 'CollectionGivenUserID', select: 'UserName MobileNo' })
            .populate({ path: 'AnnadanItemDetail', select: '_id AnnadanID ItemTypeID Qty', populate: { path: 'ItemDetail', select: 'ItemType', match: { IsActive: true } } })
            .sort({ '_id': -1 }).exec();
        var CashAmount = 0;
        var OnlineAmount = 0;
        var CheckCount = 0;
        var CheckAmount = 0;
        if (AnnadanUserData.length > 0) {
            var AllCount = [];
            // for (i = 0; i < useramtcount.length; i++) {
            //     Amount = Amount[i];
            // }
            AnnadanUserData.forEach((doc) => {
                // AllCount.push({
                //     Amount: doc.Amount,
                // })
                //Sum = Sum + Number(doc.Amount)

                // if (doc.ModeOfPayment == "Cash") {
                //     Sum = Sum + Number(doc.Amount)
                // }

                if (doc.ModeOfPayment == "Cash") {
                    CashAmount = CashAmount + Number(doc.Amount)
                }
                else if (doc.ModeOfPayment == "Online") {
                    if (doc.ResponseresultCode == "01") {
                        OnlineAmount = OnlineAmount + Number(doc.Amount)
                    }
                }
                else if (doc.ModeOfPayment == "Bank") {
                    CheckCount += 1;
                    CheckAmount = CheckAmount + Number(doc.Amount)
                }
            });

            var allamountdata = JSON.stringify({
                'CashAmount': CashAmount,
                'OnlineAmount': OnlineAmount,
                'CheckCount': CheckCount,
                'CheckAmount': CheckAmount
            });

            return res.status(200).json({ status: 1, message: "Success.", data: AnnadanUserData, AllAmountData: JSON.parse(allamountdata), error: null });
        } else {
            return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, TotalAmount: null, AllAmountData: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

async function generatereceiptnumber(TrustName) {
    try {

        console.table(_LocalTrustDetailsArray)
        if (_LocalTrustDetailsArray.length == 0) {

        } else {
            var Index = _LocalTrustDetailsArray.findIndex((element) => {
                return element.TrustName === TrustName
            })
            if (Index > -1) {
                var number = _LocalTrustDetailsArray[Index]["SRNo"] + 1
                _LocalTrustDetailsArray[Index]["SRNo"] = number
                return number
            }
        }

        console.log("called==>")
        let annadandata = await AnnadanModel.findOne({
            IsActive: true,
            TrustName: TrustName,
            ReceiptNo: { $ne: '' }
        }).sort({ '_id': -1 }).exec();
        if (annadandata) {
            var receiptnumber = parseInt(annadandata.ReceiptNo)
            receiptnumber += 1;
            _LocalTrustDetailsArray.push({
                "TrustName": TrustName,
                "SRNo": receiptnumber
            })
            return receiptnumber;
        }
        else {
            var receiptnumber = parseInt(1);
            _LocalTrustDetailsArray.push({
                "TrustName": TrustName,
                "SRNo": receiptnumber
            })
            return receiptnumber;
        }
    } catch (error) {
        console.log("error===>", error)
    }
}

exports.CheckPaymentStatus = [async (req, res) => {
    try {
        if (!req.body.ID) {
            res.json({ status: 0, message: "Please Enter Anndan ID", data: null, error: null });
        } else if (!req.body.OrderID) {
            res.json({ status: 0, message: "Please Enter OrderID", data: null, error: null });
        } else if (!req.body.checksum) {
            res.json({ status: 0, message: "Please Enter checksum", data: null, error: null });
        } else if (!req.body.TrustName) {
            res.json({ status: 0, message: "Please Enter Trust Name", data: null, error: null });
        } else {
            var checksum = req.body.checksum;
            var paytmParams = {};

            paytmParams.body = {
                "mid": process.env.mid,
                "orderId": req.body.OrderID,
            };
            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "lR_vF&371I5Fu7Y4").then(function (checksum) {
                /* head parameters */
                paytmParams.head = {

                    /* put generated checksum value here */
                    "signature": checksum
                };

                /* prepare JSON string for request */
                var post_data = JSON.stringify(paytmParams);

                var options = {

                    /* for Staging */
                    //hostname: 'securegw-stage.paytm.in',

                    /* for Production */
                    hostname: 'securegw.paytm.in',

                    port: 443,
                    path: '/v3/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                // Set up the request
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });

                    post_res.on('end', async function () {
                        //console.log('Response: ', response);

                        var paytmresponse = JSON.parse(response);
                        var returnresponsedata = JSON.stringify({
                            'signature': (paytmresponse.head.signature) ? (paytmresponse.head.signature) : '',
                            'resultStatus': (paytmresponse.body.resultInfo.resultStatus) ? (paytmresponse.body.resultInfo.resultStatus) : '',
                            'resultCode': (paytmresponse.body.resultInfo.resultCode) ? (paytmresponse.body.resultInfo.resultCode) : '',
                            'resultMsg': (paytmresponse.body.resultInfo.resultMsg) ? (paytmresponse.body.resultInfo.resultMsg) : '',
                            'txnId': (paytmresponse.body.txnId) ? (paytmresponse.body.txnId) : '',
                            'bankTxnId': (paytmresponse.body.bankTxnId) ? (paytmresponse.body.bankTxnId) : '',
                            'orderId': (paytmresponse.body.orderId) ? (paytmresponse.body.orderId) : '',
                            'txnAmount': (paytmresponse.body.txnAmount) ? (paytmresponse.body.txnAmount) : '',
                            'txnType': (paytmresponse.body.txnType) ? (paytmresponse.body.txnType) : '',
                            'gatewayName': (paytmresponse.body.gatewayName) ? (paytmresponse.body.gatewayName) : '',
                            'paymentMode': (paytmresponse.body.paymentMode) ? (paytmresponse.body.paymentMode) : '',
                            'txnDate': (paytmresponse.body.txnDate) ? (paytmresponse.body.txnDate) : '',
                            'posId': (paytmresponse.body.posId) ? (paytmresponse.body.posId) : '',
                            'udf1': (paytmresponse.body.udf1) ? (paytmresponse.body.udf1) : ''
                        });

                        var UpdateData = {};
                        UpdateData["Responsesignature"] = (paytmresponse.head.signature) ? (paytmresponse.head.signature) : '';
                        UpdateData["ResponseresultStatus"] = (paytmresponse.body.resultInfo.resultStatus) ? (paytmresponse.body.resultInfo.resultStatus) : '';
                        UpdateData["ResponseresultCode"] = (paytmresponse.body.resultInfo.resultCode) ? (paytmresponse.body.resultInfo.resultCode) : '';
                        UpdateData["ResponseresultMsg"] = (paytmresponse.body.resultInfo.resultMsg) ? (paytmresponse.body.resultInfo.resultMsg) : '';
                        UpdateData["ResponsetxnId"] = (paytmresponse.body.txnId) ? (paytmresponse.body.txnId) : '';
                        UpdateData["ResponsebankTxnId"] = (paytmresponse.body.bankTxnId) ? (paytmresponse.body.bankTxnId) : '';
                        UpdateData["ResponsetxnType"] = (paytmresponse.body.txnType) ? (paytmresponse.body.txnType) : '';
                        UpdateData["ResponsegatewayName"] = (paytmresponse.body.gatewayName) ? (paytmresponse.body.gatewayName) : '';
                        UpdateData["ResponsepaymentMode"] = (paytmresponse.body.paymentMode) ? (paytmresponse.body.paymentMode) : '';
                        UpdateData["ResponsetxnDate"] = (paytmresponse.body.txnDate) ? (paytmresponse.body.txnDate) : '';
                        UpdateData["ResponseposId"] = (paytmresponse.body.posId) ? (paytmresponse.body.posId) : '';
                        UpdateData["Responseudf1"] = (paytmresponse.body.udf1) ? (paytmresponse.body.udf1) : '';
                        UpdateData["PaymentStatus"] = (paytmresponse.body.resultInfo.resultStatus) ? (paytmresponse.body.resultInfo.resultStatus) : '';

                        let updatedata = await AnnadanModel.updateOne({
                            _id: req.body.ID
                        }, UpdateData).exec();
                        // console.log("updatedata============>", updatedata)

                        if (updatedata.modifiedCount == 1) {
                            if (paytmresponse.body.resultInfo.resultCode == "01") {
                                var receiptnumber = (await generatereceiptnumber(req.body.TrustName)).toString();
                                var UpdateReceiptData = {};
                                UpdateReceiptData["ReceiptNo"] = receiptnumber;
                                let updatereceiptdata = await AnnadanModel.updateOne({
                                    _id: req.body.ID
                                }, UpdateReceiptData).exec();

                                if (req.body.MobileNo) {
                                    axios
                                        .get('http://173.45.76.227/send.aspx?username=smtech1&pass=smtech123&route=trans1&senderid=SMTCPL&numbers=' + newMobile + '&source=SMTCPL&message=' + "Thank you for your contribution. Your contribution is " + req.body.Amount + ". SM Techno Consultants")
                                        .then(res => {
                                            console.log(`statusCode: ${res.status}`)
                                        })
                                        .catch(error => {
                                            console.error(error)
                                        });
                                }
                            }

                            return res.status(200).json({ status: 1, message: "Success.", data: JSON.parse(returnresponsedata), error: null });
                        } else {
                            return res.status(200).json({ status: 0, message: "Data Not Update.", data: JSON.parse(returnresponsedata), error: null });
                        }
                    });
                });

                // post the data
                post_req.write(post_data);
                post_req.end();
            });
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.ResendQRCode = [async (req, res) => {
    try {
        var OrderID = '';
        if (!req.body.ID) {
            res.json({ status: 0, message: "Please Enter Anndan ID", data: null, error: null });
        }
        else if (!req.body.Amount) {
            res.json({ status: 0, message: "Please Enter Amount", data: null, error: null });
        }
        else if (!req.body.MobileNo) {
            res.json({ status: 0, message: "Please Enter Mobile No", data: null, error: null });
        }
        else {
            OrderID = moment().format("DDMMYYYYHHmmssSSS").toString() + "_" + crypto.randomBytes(5).toString("hex")

            var Amount;
            if (req.body.Amount) {
                Amount = parseFloat(req.body.Amount).toFixed(2);
            }

            var paytmParams = {};
            paytmParams.body = {
                "mid": process.env.mid,
                "orderId": OrderID,
                "amount": Amount,
                "businessType": process.env.businessType,
                "posId": process.env.posId,
                "contactPhoneNo": req.body.MobileNo
            };

            //merchantkey
            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.merchantkey).then(function (checksum) {
                paytmParams.head = {
                    "clientId": "C11",
                    "version": "v1",
                    "signature": checksum
                };

                var post_data = JSON.stringify(paytmParams);

                var options = {

                    /* for Staging */
                    //hostname: 'securegw-stage.paytm.in',

                    /* for Production */
                    hostname: process.env.hostname,

                    port: 443,
                    path: '/paymentservices/qr/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });

                    post_res.on('end', async function () {
                        var qrresponse = JSON.parse(response)

                        var qrdata = JSON.stringify({
                            '_id': req.body.ID,
                            'OrderID': OrderID,
                            'signature': (qrresponse.head.signature) ? (qrresponse.head.signature) : '',
                            'QRCoderesultStatus': (qrresponse.body.resultInfo.resultStatus) ? (qrresponse.body.resultInfo.resultStatus) : '',
                            'QRCoderesultCode': (qrresponse.body.resultInfo.resultCode) ? (qrresponse.body.resultInfo.resultCode) : '',
                            'QRCoderesultMsg': (qrresponse.head.signature) ? (qrresponse.head.signature) : '',
                            'QRCodeqrData': (qrresponse.body.qrData) ? (qrresponse.body.qrData) : '',
                            'image': (qrresponse.body.image) ? (qrresponse.body.image) : ''
                        });

                        var UpdateData = {};

                        UpdateData["OrderID"] = OrderID;
                        UpdateData["QRCodesignature"] = (qrresponse.head.signature) ? (qrresponse.head.signature) : '';
                        UpdateData["QRCoderesultStatus"] = (qrresponse.body.resultInfo.resultStatus) ? (qrresponse.body.resultInfo.resultStatus) : '';
                        UpdateData["QRCoderesultCode"] = (qrresponse.body.resultInfo.resultCode) ? (qrresponse.body.resultInfo.resultCode) : '';
                        UpdateData["QRCoderesultMsg"] = (qrresponse.head.signature) ? (qrresponse.head.signature) : '';
                        UpdateData["QRCodeqrData"] = (qrresponse.body.qrData) ? (qrresponse.body.qrData) : '';
                        let updatedata = await AnnadanModel.updateOne({ _id: req.body.ID }, UpdateData).exec();

                        if (updatedata.modifiedCount == 1) {
                            return res.status(200).json({ status: 1, message: "Success.", data: JSON.parse(qrdata), error: null });
                        } else {
                            return res.status(200).json({ status: 0, message: "Data Not Update.", data: JSON.parse(qrdata), error: null });
                        }
                    });
                });

                post_req.write(post_data);
                post_req.end();
            });
        }
    } catch (err) {
        // console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.RemoveAnnadanV2 = [async (req, res) => {
    try {
        if (!req.body.ID) {
            return res.status(200).json({ status: 1, message: "Please Enter ID.", data: null, error: null });
        } else {
            var updateData = {};
            updateData["IsActive"] = false;
            updateData["IsDelete"] = true;
            await AnnadanModel.updateOne({ _id: req.body.ID }, updateData).exec();
            return res.status(200).json({ status: 1, message: "Succesfully Deleted.", data: null, error: null });
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}
