const express = require('express')
// const fetch = require('node-fetch');

const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const axios = require('axios');

var request = require('request');

const CryptoJS = require("crypto-js");
const helper = require('../helpers/utility.js');
const LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

const Imageurl = process.env.ItemImagePATH
const UniqueId = () => {
    // abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
    var i, key = "", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (i = 0; i < 12; i++) {
        key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }
    return key;
};

// var OwnerAsagaID = 'folkbells@gmail.com'
// var OwnerAsagaID = 'krutika@smtechno.com'
var OwnerAsagaID = 'mitra@smtechno.com'

exports.getCheckOut = [async (req, res) => {
    try {
        await Connection.connect();

        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let mainCategoryData, AboutUsData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }

        let Country = "India";
        let URL = "https://countriesnow.space/api/v0.1/countries/states";

        const payload = { country: Country };
        // const response = await fetch(URL, {
        //     method: 'POST',
        //     body: JSON.stringify(payload),
        //     headers: { 'Content-Type': 'application/json' },
        // });

        const response = await axios.post(URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseDataArray = Object.values(response.data);

        let stateData = responseDataArray[2].states;
        let localStorageCartData = [];

        let userData = [];

        if (req.cookies.browserId) {
            const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];

            if (localStoragecart.length > 0) {

                // bindlocalStorageKey.forEach(async (data, i) => {
                for (var i = 0; i < localStoragecart.length; i++) {

                    const resultitemData = await dataAccess.execute(`SP_Item`, [
                        { name: 'Query', value: "SelectAll2" },
                        { name: 'ItemID', value: localStoragecart[i].ItemID }
                    ]);

                    if (resultitemData.recordset && resultitemData.recordset[0]) {

                        let discountInformation;
                        if (resultitemData.recordset[0].DiscountDetail) {
                            discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
                        }

                        if (discountInformation) {
                            if (discountInformation.length > 0) {
                                var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));

                                if (ActualAmt > discountInformation[0].MinAmount || ActualAmt == discountInformation[0].MinAmount) {
                                    let findDiscountAmount = parseFloat(ActualAmt) * parseFloat(discountInformation[0].Discount) / 100;
                                    let DiscountAmt = parseFloat(ActualAmt * localStoragecart[i].Qty) - parseFloat(findDiscountAmount * localStoragecart[i].Qty);

                                    localStorageCartData.push({
                                        ItemID: localStoragecart[i].ItemID,
                                        ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                        Amount: ActualAmt * localStoragecart[i].Qty,
                                        Quantity: localStoragecart[i].Qty,
                                        FinalPrice: DiscountAmt,
                                        ItemSize: localStoragecart[i].Size,
                                        DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                        DiscountName: discountInformation[0].DiscountName,
                                        DiscountID: discountInformation[0].DiscountID
                                    });

                                } else {
                                    localStorageCartData.push({
                                        ItemID: localStoragecart[i].ItemID,
                                        ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                        Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                        Quantity: localStoragecart[i].Qty,
                                        FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                        ItemSize: localStoragecart[i].Size,
                                        DiscountPrice: '',
                                        DiscountName: '',
                                        DiscountID: ''
                                    });
                                }
                            } else {
                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                    FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    ItemSize: localStoragecart[i].Size,
                                    DiscountPrice: '',
                                    DiscountName: '',
                                    DiscountID: ''
                                });
                            }
                        } else {
                            localStorageCartData.push({
                                ItemID: localStoragecart[i].ItemID,
                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                ItemSize: localStoragecart[i].Size,
                                DiscountPrice: '',
                                DiscountName: '',
                                DiscountID: ''
                            });
                        }
                    }
                }

                if (req.cookies.userdata) {
                    const userDataResult = await dataAccess.execute(`SP_UserAddressDetail`, [
                        { name: 'Query', value: "FetchLatestAddress" },
                        { name: 'UserID', value: req.cookies.userdata[0].UserID }
                    ]);

                    if (userDataResult.recordset && userDataResult.recordset[0]) {
                        userData = userDataResult.recordset;
                    }
                }
                res.render('./Asaga/CheckOut', { title: 'CheckOut', Menutitle: 'CheckOut', CategoryData: mainCategoryData, StateData: stateData, LocalStorageCartData: localStorageCartData, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, UserData: userData });
            }
            else {
                res.redirect('/Splash');
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.checkCouponCode = [async (req, res) => {
    try {

        await Connection.connect();
        var bodyCouponCode = req.body.coupon_code;
        var bodyUserEmailID = req.body.txtEmailID;

        const result = await dataAccess.execute(`SP_Discount`, [
            { name: 'Query', value: "SelectAll2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
            { name: 'DiscountName', value: bodyCouponCode }
        ]);

        let couponCodeData;
        if (result.recordset && result.recordset[0]) {
            couponCodeData = result.recordset[0];

            if (couponCodeData.DiscountType == "Item Discount" && couponCodeData.SubCategoryID != '') {

                const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
                // bindlocalStorageKey.forEach(async (data, i) => {
                let codeStatus = false;
                let localStorageCartData = [];
                for (var i = 0; i < localStoragecart.length; i++) {

                    const resultitemData = await dataAccess.execute(`SP_Item`, [
                        { name: 'Query', value: "SelectAll2" },
                        { name: 'ItemID', value: localStoragecart[i].ItemID }
                    ]);

                    if (resultitemData.recordset && resultitemData.recordset[0]) {
                        if (resultitemData.recordset[0].SubCategoryID == couponCodeData.SubCategoryID) {
                            codeStatus = true;

                            var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));
                            if (ActualAmt > couponCodeData.MinAmount || ActualAmt == couponCodeData.MinAmount) {

                                let findDiscountAmount = parseFloat(ActualAmt) * parseFloat(couponCodeData.Discount) / 100;
                                // let DiscountAmt = ((ActualAmt * localStoragecart[i].Qty) - (findDiscountAmount * localStoragecart[i].Qty)).toFixed(2);
                                let DiscountAmt = (parseFloat(ActualAmt * localStoragecart[i].Qty) - parseFloat(findDiscountAmount * localStoragecart[i].Qty)).toFixed(2);

                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    Amount: ActualAmt * localStoragecart[i].Qty,
                                    Quantity: localStoragecart[i].Qty,
                                    FinalPrice: DiscountAmt,
                                    ItemSize: localStoragecart[i].Size,
                                    DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                    DiscountName: couponCodeData.DiscountName,
                                    DiscountID: couponCodeData.DiscountID
                                });
                            } else {
                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Quantity: localStoragecart[i].Qty,
                                    FinalPrice: ((resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0)).toFixed(2),
                                    ItemSize: localStoragecart[i].Size,
                                    DiscountPrice: '',
                                    DiscountName: '',
                                    DiscountID: ''
                                });
                            }
                        } else {
                            localStorageCartData.push({
                                ItemID: localStoragecart[i].ItemID,
                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                Quantity: localStoragecart[i].Qty,
                                FinalPrice: ((resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0)).toFixed(2),
                                ItemSize: localStoragecart[i].Size,
                                DiscountPrice: '',
                                DiscountName: '',
                                DiscountID: ''
                            });
                        }
                    } else {
                        return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
                    }
                }
                if (codeStatus == true) {
                    return res.status(200).json({ status: 1, Message: "true", data: localStorageCartData });
                } else {
                    return res.status(200).json({ status: 1, Message: "false", data: req.body.coupon_code });
                }
            } else if (couponCodeData.DiscountType == "User Discount" && bodyUserEmailID != '') {

                const resultitemData = await dataAccess.execute(`SP_UserDiscountDetail`, [
                    { name: 'Query', value: "chkUserCouponCode" },
                    { name: 'Email', value: bodyUserEmailID },
                    { name: 'DiscountName', value: bodyCouponCode }
                ]);

                let chkUserCode;
                if (resultitemData.recordset && resultitemData.recordset[0]) {
                    chkUserCode = resultitemData.recordset[0];

                    if (chkUserCode.CouponCodeStatus == false) {
                        return res.status(200).json({ status: 1, Message: "UserDiscount", data: chkUserCode });
                    } else {
                        return res.status(200).json({ status: 1, Message: "AlreadyApplyCouponCode", data: null });
                    }
                } else {
                    return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
                }
            } else {
                return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
            }
        } else {
            return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getOrderSuccess = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let mainCategoryData, AboutUsData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }
        var updateOrderStatus = [
            { name: 'Query', value: 'Update' },
            { name: 'OrderMasterID', value: req.params.OrderMasterID },
            { name: 'OrderStatus', value: 'Confirm' }
        ]
        await dataAccess.execute(`SP_OrderMaster`, updateOrderStatus);

        const OrderData = await dataAccess.execute(`SP_OrderMaster`, [
            { name: 'Query', value: "SelectAll" },
            { name: 'OrderMasterID', value: req.params.OrderMasterID },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let bindOrderData;
        if (OrderData.recordset && OrderData.recordset[0]) {
            bindOrderData = OrderData.recordset;
        }
        localStorage.removeItem(`cart_${req.cookies.browserId}`);
        res.render('./Asaga/OrderSuccess', { title: 'OrderSuccess', Menutitle: 'OrderSuccess', CategoryData: mainCategoryData, OrderData: bindOrderData, LocalStorageCartData: null, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.bindCity = [async (req, res) => {
    try {
        await Connection.connect();
        let Country = "India";
        let State = req.params.StateName;
        let URL = "https://countriesnow.space/api/v0.1/countries/state/cities";

        const payload = { country: Country, state: State };
        const response = await axios.post(URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseDataArray = Object.values(response.data);
        let cityData = responseDataArray[2];
        return res.status(200).json({ status: 1, message: 'Success', CityData: cityData, error: null })
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setPlaceOrder = [async (req, res) => {
    try {
        var bodyEmailID = req.body.txtEmailID;
        var bodyOfferandDiscountConfirmation = req.body.chkConfirmation ? 'Yes' : 'No';
        var bodyFirstName = req.body.txtFirstName;
        var bodyMiddleName = req.body.txtMiddleName;
        var bodyLastName = req.body.txtLastName;
        var bodyCompanyName = req.body.txtCompanyName;
        var bodyAddress1 = req.body.txtAddress1;
        var bodyAddress2 = req.body.txtAddress2;
        var bodyCountry = req.body.txtCountryName;
        var bodyState = req.body.ddlState;
        var bodyCityData = req.body.ddlCity;
        var bodyPincode = req.body.txtPinCode;
        var bodyMobileNo = req.body.txtMobileNo;
        var bodySaveAddressStatus = req.body.chkAddressConfirmation ? 'Yes' : 'No';
        var bodyOverallFinalTotal = req.body.txtOverallFinalTotal;

        var bodyItemID = req.body.lblItemID;
        var bodyItemName = req.body.lblItemName;
        var bodyQuantity = req.body.lblQuantity;
        var bodyDiscountID = req.body.lblDiscountID;
        var bodyDiscountName = req.body.lblDiscountName;
        var bodyDiscountPrice = req.body.lblDiscountPrice;
        var bodyAmount = req.body.lblAmount;
        var bodyFinalPrice = req.body.lblFinalPrice;
        var bodyItemSize = req.body.lblItemSize;
        var bodyUserCouponCode = req.body.txtUserCouponCode;
        var bodyUserCouponCodeID = req.body.txtUserCouponCodeID;
        var bodyFinalActualAmount = req.body.txtFinalActualAmount;

        var UserID = "";
        if (req.cookies.userData) {
            UserID = req.cookies.userData.UserID;
        } else {
            if (req.cookies.browserId) {
                const chkUserData = await dataAccess.execute(`SP_UserMaster`, [
                    { name: 'Query', value: "chkUserEmailIDWise" },
                    { name: 'EmailID', value: bodyEmailID }
                ]);
                await Connection.connect();
                if (chkUserData.recordset && chkUserData.recordset[0]) {
                    UserID = chkUserData.recordset[0].UserID;
                } else {
                    var pwd = helper.generatePassword(6);
                    //var originalText = CryptoJS.AES.encrypt(pwd, process.env.SEC_CODE).toString();

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'EmailID', value: bodyEmailID },
                        //{ name: 'Password', value: originalText },
                        { name: 'Password', value: pwd },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'RegistrationType', value: 'Panel' },
                        { name: 'UserActivationStatus', value: 'Yes' },
                        { name: 'UserOfferStatus', value: bodyOfferandDiscountConfirmation }
                    ]

                    const result = await dataAccess.execute(`SP_UserMaster`, data);
                    if (result.recordset && result.recordset[0]) {
                        UserID = result.recordset[0].UserID;
                    }
                }
            }
        }

        if (UserID != "") {
            if (bodySaveAddressStatus == 'Yes') {

                var data = [
                    { name: 'Query', value: 'Insert' },
                    //{ name: 'UserID', value: result.recordset[0].UserID },
                    { name: 'UserID', value: UserID },
                    { name: 'FirstName', value: bodyFirstName },
                    { name: 'MiddleName', value: bodyMiddleName },
                    { name: 'LastName', value: bodyLastName },
                    { name: 'MobileNo', value: bodyMobileNo },
                    { name: 'Company', value: bodyCompanyName },
                    { name: 'Address1', value: bodyAddress1 },
                    { name: 'Address2', value: bodyAddress2 },
                    { name: 'CountryName', value: bodyCountry },
                    { name: 'StateName', value: bodyState },
                    { name: 'CityName', value: bodyCityData },
                    { name: 'Pincode', value: bodyPincode },
                    { name: 'EmailID', value: bodyEmailID }
                ]
                await dataAccess.execute(`SP_UserAddressDetail`, data);
            }

            const fetchMaxOrderNo = await dataAccess.execute(`SP_OrderMaster`, [
                { name: 'Query', value: "SelectMAXOrderCode" }
            ]);
            let newOrderNumber;
            if (fetchMaxOrderNo.recordset && fetchMaxOrderNo.recordset[0]) {
                if (fetchMaxOrderNo.recordset[0].OrderNo != null) {
                    const orderCode = parseInt(fetchMaxOrderNo.recordset[0].OrderNo.substring(2)) + 1;
                    newOrderNumber = "OD" + orderCode.toString().padStart(5, "0");
                } else {
                    newOrderNumber = 'OD00001';
                }
            }
            else {
                newOrderNumber = 'OD00001';
            }

            var orderData = [
                { name: 'Query', value: 'Insert' },
                //{ name: 'UserID', value: result.recordset[0].UserID },
                { name: 'UserID', value: UserID },
                { name: 'OrderNo', value: newOrderNumber },
                { name: 'DiscountID', value: bodyUserCouponCodeID ? bodyUserCouponCodeID : null },
                { name: 'DiscountAmount', value: bodyUserCouponCode ? bodyUserCouponCode : null },
                { name: 'TotalAmount', value: bodyFinalActualAmount ? bodyFinalActualAmount : bodyOverallFinalTotal },
                { name: 'ShippingCharge', value: '0' },
                { name: 'FinalAmount', value: bodyOverallFinalTotal },
                { name: 'PaymentMode', value: 'COD' },
            ]
            const OrderMasterResult = await dataAccess.execute(`SP_OrderMaster`, orderData);

            if (OrderMasterResult.recordset && OrderMasterResult.recordset[0]) {

                var shippingAddressdata = [
                    { name: 'Query', value: 'Insert' },
                    { name: 'UserID', value: UserID },
                    { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                    { name: 'FirstName', value: bodyFirstName },
                    { name: 'MiddleName', value: bodyMiddleName },
                    { name: 'LastName', value: bodyLastName },
                    { name: 'MobileNo', value: bodyMobileNo },
                    { name: 'Company', value: bodyCompanyName },
                    { name: 'Address1', value: bodyAddress1 },
                    { name: 'Address2', value: bodyAddress2 },
                    { name: 'CountryName', value: bodyCountry },
                    { name: 'StateName', value: bodyState },
                    { name: 'CityName', value: bodyCityData },
                    { name: 'Pincode', value: bodyPincode },
                    { name: 'EmailID', value: bodyEmailID }
                ]
                await dataAccess.execute(`SP_ShippingAddress`, shippingAddressdata);

                let Header, Footer, OrderDetail = '', EmailMsgDraft;

                let mailSubject = "Asaga Order Confirmation #" + newOrderNumber;

                Header = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asaga.in' target='_blank'><img src='http://asaga.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px;  margin: 30px;'>Dear " + bodyFirstName + ",<br/><br/>Thank you for your order.<br/><br/><div style='font-size:20px; font-weight: bolder; text-align: center;'>Your order details</div><br/><span style='font-size:16px;'>Order #</span>" + newOrderNumber + "<table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>";

                Footer = "<tr><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Total</td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyOverallFinalTotal + "</td></tr></table><br/><span style='font-size:16px;'>Shipping Address: </span>" + bodyAddress1 + "," + bodyAddress2 + "<br/><br/>Thanks for shopping with us.<br/>Asaga</div></td></tr></table></div>";

                if (Array.isArray(bodyItemID)) {
                    for (let index = 0; index < bodyItemID.length; index++) {
                        const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                            { name: 'Query', value: "SelectItemSizeWiseStock" },
                            { name: 'ItemID', value: bodyItemID[index] },
                            { name: 'Size', value: bodyItemSize[index] }
                        ]);

                        if (resultitemData.recordset && resultitemData.recordset[0]) {
                            let itemStock = resultitemData.recordset[0].RemainingStock;
                            let outQty = itemStock - bodyQuantity[index];

                            var updateQty = [
                                { name: 'Query', value: 'UpdateRemainingStock' },
                                { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                { name: 'RemainingStock', value: outQty }
                            ]
                            await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                            var totPrice = (Number(bodyAmount[index])) * (bodyQuantity[index]);

                            var orderDetailData = [
                                { name: 'Query', value: 'Insert' },
                                { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                { name: 'ItemID', value: bodyItemID[index] },
                                { name: 'ItemName', value: bodyItemName[index] },
                                { name: 'Quantity', value: bodyQuantity[index] },
                                { name: 'SizeName', value: bodyItemSize[index] },
                                { name: 'ItemPrice', value: bodyAmount[index] },
                                { name: 'TotalPrice', value: totPrice.toString() },
                                { name: 'DiscountID', value: bodyDiscountID[index] ? bodyDiscountID[index] : null },
                                { name: 'DiscountAmount', value: bodyDiscountPrice[index] ? bodyDiscountPrice[index] : null },
                                { name: 'FinalPrice', value: bodyFinalPrice[index] }
                            ]
                            await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                            // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName[index] + "</td><td>Rs. " + bodyFinalPrice[index] + "</td></tr>  ";

                            OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='http://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";

                            // http://asagaoffice.in:2005/UploadFiles/Item/9c42435b-d23c-4234-bf1d-10a4e36f277a-1-0711051001678102833.jpg

                            // OrderDetail += "<tr><td></td><td>" + bodyItemName[index] + "</td><td>Rs. " + bodyFinalPrice[index] + "</td></tr>"; 

                        }
                    }

                    EmailMsgDraft = Header + OrderDetail + Footer;
                    helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);

                    localStorage.removeItem(`cart_${req.cookies.browserId}`);
                } else {
                    const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                        { name: 'Query', value: "SelectItemSizeWiseStock" },
                        { name: 'ItemID', value: bodyItemID },
                        { name: 'Size', value: bodyItemSize }
                    ]);

                    if (resultitemData.recordset && resultitemData.recordset[0]) {
                        let itemStock = resultitemData.recordset[0].RemainingStock;
                        let outQty = itemStock - bodyQuantity;

                        var updateQty = [
                            { name: 'Query', value: 'UpdateRemainingStock' },
                            { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                            { name: 'RemainingStock', value: outQty }
                        ]
                        await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                        var orderDetailData = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                            { name: 'ItemID', value: bodyItemID },
                            { name: 'ItemName', value: bodyItemName },
                            { name: 'Quantity', value: bodyQuantity },
                            { name: 'SizeName', value: bodyItemSize },
                            { name: 'ItemPrice', value: resultitemData.recordset[0].Amount },
                            { name: 'TotalPrice', value: bodyAmount },
                            { name: 'DiscountID', value: bodyDiscountID ? bodyDiscountID : null },
                            { name: 'DiscountAmount', value: bodyDiscountPrice ? bodyDiscountPrice : null },
                            { name: 'FinalPrice', value: bodyFinalPrice }
                        ]
                        await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                        // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName + "</td><td>Rs. " + bodyFinalPrice + "</td></tr>";

                        OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='http://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr>";

                        EmailMsgDraft = Header + OrderDetail + Footer;
                        helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);

                        localStorage.removeItem(`cart_${req.cookies.browserId}`);
                    }
                }

                if (bodyUserCouponCodeID) {
                    var updateCouponCodeStatus = [
                        { name: 'Query', value: 'UpdateCouponCodeStatus' },
                        { name: 'UserID', value: UserID },
                        { name: 'DiscountID', value: bodyUserCouponCodeID }
                    ]
                    await dataAccess.execute(`SP_UserDiscountDetail`, updateCouponCodeStatus);
                }

                //res.redirect('/ViewCart');
                res.redirect('/OrderSuccess/' + OrderMasterResult.recordset[0].OrderMasterID);
            }
            else {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
        else {
            return res.status(500).json({ status: 0, message: "User Not Found", data: null, error: null })
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setOnlinePayment = [async (req, res) => {
    try {
        var bodyEmailID = req.body.txtEmailID;
        var bodyOfferandDiscountConfirmation = req.body.chkConfirmation ? 'Yes' : 'No';
        var bodyFirstName = req.body.txtFirstName;
        var bodyMiddleName = req.body.txtMiddleName;
        var bodyLastName = req.body.txtLastName;
        var bodyCompanyName = req.body.txtCompanyName;
        var bodyAddress1 = req.body.txtAddress1;
        var bodyAddress2 = req.body.txtAddress2;
        var bodyCountry = req.body.txtCountryName;
        var bodyState = req.body.ddlState;
        var bodyCityData = req.body.ddlCity;
        var bodyPincode = req.body.txtPinCode;
        var bodyMobileNo = req.body.txtMobileNo;
        var bodySaveAddressStatus = req.body.chkAddressConfirmation ? 'Yes' : 'No';
        var bodyOverallFinalTotal = req.body.txtOverallFinalTotal;
        var bodyItemID = req.body.lblItemID;
        var bodyItemName = req.body.lblItemName;
        var bodyQuantity = req.body.lblQuantity;
        var bodyDiscountID = req.body.lblDiscountID;
        var bodyDiscountName = req.body.lblDiscountName;
        var bodyDiscountPrice = req.body.lblDiscountPrice;
        var bodyAmount = req.body.lblAmount;
        var bodyFinalPrice = req.body.lblFinalPrice;
        var bodyItemSize = req.body.lblItemSize;
        var bodyUserCouponCode = req.body.txtUserCouponCode;
        var bodyUserCouponCodeID = req.body.txtUserCouponCodeID;
        var bodyFinalActualAmount = req.body.txtFinalActualAmount;
        var bodyItemImage = req.body.lblItemImage;
        var bodyItemDescription = req.body.lblItemDescription;

        var bodyOrderMasterID = req.body.OrderMasterID;
        var bodyUniqueID = UniqueId();
        var bodyPaymentMode = req.body.PaymentMode;
        var bodyTransactionType = req.body.TransactionType;
        if (bodyPaymentMode == 'Online' && bodyCountry == 'India') {
            var UserID = "";
            if (req.cookies.userData) {
                UserID = req.cookies.userData.UserID;
            } else {
                if (req.cookies.browserId) {
                    const chkUserData = await dataAccess.execute(`SP_UserMaster`, [
                        { name: 'Query', value: "chkUserEmailIDWise" },
                        { name: 'EmailID', value: bodyEmailID }
                    ]);

                    await Connection.connect();

                    if (chkUserData.recordset && chkUserData.recordset[0]) {
                        UserID = chkUserData.recordset[0].UserID;
                    } else {
                        var pwd = helper.generatePassword(6);
                        //var originalText = CryptoJS.AES.encrypt(pwd, process.env.SEC_CODE).toString();

                        var data = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'FirstName', value: bodyFirstName },
                            { name: 'MiddleName', value: bodyMiddleName },
                            { name: 'LastName', value: bodyLastName },
                            { name: 'EmailID', value: bodyEmailID },
                            //{ name: 'Password', value: originalText },
                            { name: 'Password', value: pwd },
                            { name: 'MobileNo', value: bodyMobileNo },
                            { name: 'RegistrationType', value: 'Panel' },
                            { name: 'UserActivationStatus', value: 'Yes' },
                            { name: 'UserOfferStatus', value: bodyOfferandDiscountConfirmation }
                        ]

                        const result = await dataAccess.execute(`SP_UserMaster`, data);
                        if (result.recordset && result.recordset[0]) {
                            UserID = result.recordset[0].UserID;
                        }
                    }
                }
            }

            if (UserID != "") {
                if (bodySaveAddressStatus == 'Yes') {

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        //{ name: 'UserID', value: result.recordset[0].UserID },
                        { name: 'UserID', value: UserID },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'Company', value: bodyCompanyName },
                        { name: 'Address1', value: bodyAddress1 },
                        { name: 'Address2', value: bodyAddress2 },
                        { name: 'CountryName', value: bodyCountry },
                        { name: 'StateName', value: bodyState },
                        { name: 'CityName', value: bodyCityData },
                        { name: 'Pincode', value: bodyPincode },
                        { name: 'EmailID', value: bodyEmailID }
                    ]
                    await dataAccess.execute(`SP_UserAddressDetail`, data);
                }

                const fetchMaxOrderNo = await dataAccess.execute(`SP_OrderMaster`, [
                    { name: 'Query', value: "SelectMAXOrderCode" }
                ]);

                let newOrderNumber;
                if (fetchMaxOrderNo.recordset && fetchMaxOrderNo.recordset[0]) {
                    if (fetchMaxOrderNo.recordset[0].OrderNo != null) {
                        const orderCode = parseInt(fetchMaxOrderNo.recordset[0].OrderNo.substring(2)) + 1;
                        newOrderNumber = "OD" + orderCode.toString().padStart(5, "0");
                    } else {
                        newOrderNumber = 'OD00001';
                    }
                }
                else {
                    newOrderNumber = 'OD00001';
                }

                var orderData = [
                    { name: 'Query', value: 'Insert' },
                    //{ name: 'UserID', value: result.recordset[0].UserID },
                    { name: 'UserID', value: UserID },
                    { name: 'OrderNo', value: newOrderNumber },
                    { name: 'DiscountID', value: bodyUserCouponCodeID ? bodyUserCouponCodeID : null },
                    { name: 'DiscountAmount', value: bodyUserCouponCode ? bodyUserCouponCode : null },
                    { name: 'TotalAmount', value: bodyFinalActualAmount ? bodyFinalActualAmount : bodyOverallFinalTotal },
                    { name: 'ShippingCharge', value: '0' },
                    { name: 'FinalAmount', value: bodyOverallFinalTotal },
                    { name: 'PaymentMode', value: 'Online' },
                    { name: 'OrderStatus', value: 'Pending' },
                    { name: 'UniqueID', value: bodyUniqueID },
                ]
                const OrderMasterResult = await dataAccess.execute(`SP_OrderMaster`, orderData);

                if (OrderMasterResult.recordset && OrderMasterResult.recordset[0]) {

                    var shippingAddressdata = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'UserID', value: UserID },
                        { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'Company', value: bodyCompanyName },
                        { name: 'Address1', value: bodyAddress1 },
                        { name: 'Address2', value: bodyAddress2 },
                        { name: 'CountryName', value: bodyCountry },
                        { name: 'StateName', value: bodyState },
                        { name: 'CityName', value: bodyCityData },
                        { name: 'Pincode', value: bodyPincode },
                        { name: 'EmailID', value: bodyEmailID }
                    ]
                    await dataAccess.execute(`SP_ShippingAddress`, shippingAddressdata);

                    let Header, Footer, OrderDetail = '', EmailMsgDraft;

                    let mailSubject = "Asaga Order Confirmation #" + newOrderNumber;

                    Header = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asagaoffice.in' target='_blank'><img src='http://asagaoffice.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px;  margin: 30px;'>Dear " + bodyFirstName + ",<br/><br/>Thank you for your order.<br/><br/><div style='font-size:20px; font-weight: bolder; text-align: center;'>Your order details</div><br/><span style='font-size:16px;'>Order #</span>" + newOrderNumber + "<table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>";

                    Footer = "<tr><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Total</td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyOverallFinalTotal + "</td></tr></table><br/><span style='font-size:16px;'>Shipping Address: </span>" + bodyAddress1 + "," + bodyAddress2 + "<br/><br/>Thanks for shopping with us.<br/>Asaga</div></td></tr></table></div>";

                    if (Array.isArray(bodyItemID)) {
                        for (let index = 0; index < bodyItemID.length; index++) {
                            const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                                { name: 'Query', value: "SelectItemSizeWiseStock" },
                                { name: 'ItemID', value: bodyItemID[index] },
                                { name: 'Size', value: bodyItemSize[index] }
                            ]);

                            if (resultitemData.recordset && resultitemData.recordset[0]) {
                                let itemStock = resultitemData.recordset[0].RemainingStock;
                                let outQty = itemStock - bodyQuantity[index];

                                var updateQty = [
                                    { name: 'Query', value: 'UpdateRemainingStock' },
                                    { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                    { name: 'RemainingStock', value: outQty }
                                ]
                                await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                                var totPrice = (Number(bodyAmount[index])) * (bodyQuantity[index]);

                                var orderDetailData = [
                                    { name: 'Query', value: 'Insert' },
                                    { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                    { name: 'ItemID', value: bodyItemID[index] },
                                    { name: 'ItemName', value: bodyItemName[index] },
                                    { name: 'Quantity', value: bodyQuantity[index] },
                                    { name: 'SizeName', value: bodyItemSize[index] },
                                    { name: 'ItemPrice', value: bodyAmount[index] },
                                    { name: 'TotalPrice', value: totPrice.toString() },
                                    { name: 'DiscountID', value: bodyDiscountID[index] ? bodyDiscountID[index] : null },
                                    { name: 'DiscountAmount', value: bodyDiscountPrice[index] ? bodyDiscountPrice[index] : null },
                                    { name: 'FinalPrice', value: bodyFinalPrice[index] }
                                ]
                                await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                                // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName[index] + "</td><td>Rs. " + bodyFinalPrice[index] + "</td></tr>  ";

                                OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='http://asagaoffice.in:2005/UploadFiles/Item/9c42435b-d23c-4234-bf1d-10a4e36f277a-1-0711051001678102833.jpg'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";

                                // http://asagaoffice.in:2005/UploadFiles/Item/9c42435b-d23c-4234-bf1d-10a4e36f277a-1-0711051001678102833.jpg


                                // OrderDetail += "<tr><td></td><td>" + bodyItemName[index] + "</td><td>Rs. " + bodyFinalPrice[index] + "</td></tr>"; 

                            }
                        }

                        // EmailMsgDraft = Header + OrderDetail + Footer;
                        // helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);

                        // localStorage.removeItem(`cart_${req.cookies.browserId}`);
                    } else {
                        const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                            { name: 'Query', value: "SelectItemSizeWiseStock" },
                            { name: 'ItemID', value: bodyItemID },
                            { name: 'Size', value: bodyItemSize }
                        ]);

                        if (resultitemData.recordset && resultitemData.recordset[0]) {
                            let itemStock = resultitemData.recordset[0].RemainingStock;
                            let outQty = itemStock - bodyQuantity;

                            var updateQty = [
                                { name: 'Query', value: 'UpdateRemainingStock' },
                                { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                { name: 'RemainingStock', value: outQty }
                            ]
                            await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                            var orderDetailData = [
                                { name: 'Query', value: 'Insert' },
                                { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                { name: 'ItemID', value: bodyItemID },
                                { name: 'ItemName', value: bodyItemName },
                                { name: 'Quantity', value: bodyQuantity },
                                { name: 'SizeName', value: bodyItemSize },
                                { name: 'ItemPrice', value: resultitemData.recordset[0].Amount },
                                { name: 'TotalPrice', value: bodyAmount },
                                { name: 'DiscountID', value: bodyDiscountID ? bodyDiscountID : null },
                                { name: 'DiscountAmount', value: bodyDiscountPrice ? bodyDiscountPrice : null },
                                { name: 'FinalPrice', value: bodyFinalPrice }
                            ]
                            await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                            // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName + "</td><td>Rs. " + bodyFinalPrice + "</td></tr>";

                            OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='http://asagaoffice.in:2005/UploadFiles/Item/9c42435b-d23c-4234-bf1d-10a4e36f277a-1-0711051001678102833.jpg'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr>";

                            // EmailMsgDraft = Header + OrderDetail + Footer;
                            // helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);

                            //localStorage.removeItem(`cart_${req.cookies.browserId}`);
                        }
                    }

                    if (bodyUserCouponCodeID) {
                        var updateCouponCodeStatus = [
                            { name: 'Query', value: 'UpdateCouponCodeStatus' },
                            { name: 'UserID', value: UserID },
                            { name: 'DiscountID', value: bodyUserCouponCodeID }
                        ]
                        await dataAccess.execute(`SP_UserDiscountDetail`, updateCouponCodeStatus);
                    }

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                        { name: 'UniqueID', value: bodyUniqueID },
                        { name: 'PaymentMode', value: bodyPaymentMode },
                        { name: 'TransactionType', value: bodyPaymentMode },
                    ]
                    const result = await dataAccess.execute(`SP_PaymentDetail`, data);
                    if (result.rowsAffected == 1) {
                        return res.status(200).json({ status: 1, message: "Success", data: null, error: null });
                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                    }
                }
                else {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
            }
            else {
                return res.status(500).json({ status: 0, message: "User Not Found", data: null, error: null })
            }
        } else {
            res.redirect('/CheckOut')
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setUserTransaction = [async (req, res) => {
    try {
        const fetchMaxUniqueID = await dataAccess.execute(`SP_OrderMaster`, [
            { name: 'Query', value: "SelectMAXUniqueID" }
        ]);
        var uid_code = fetchMaxUniqueID.recordset[0] ? fetchMaxUniqueID.recordset[0].UniqueID : ''
        var OrderMasterID = fetchMaxUniqueID.recordset[0] ? fetchMaxUniqueID.recordset[0].OrderMasterID : ''
        var uid = uid_code;
        var id = req.body.id;
        var options = {
            'method': 'POST',
            'url': 'http://103.148.165.41:9906/create',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "uid": uid,
                "id": id
            })
        };
        request(options, function (error, response) {
            if (error) {
            } else {
                var data = response.body
                if (!data) { return }
                data = JSON.parse(data)
                if (data.status == true) {
                    return res.status(200).json({ status: true, message: "Success", data: OrderMasterID, error: null })
                } else {
                    return res.status(500).json({ status: false, message: "Wrong", data: null, error: null })
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getOrderCancle = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let mainCategoryData, AboutUsData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }
        res.render('./Asaga/OrderCancle', { title: 'OrderCancle', Menutitle: 'OrderCancle', CategoryData: mainCategoryData, OrderData: '', LocalStorageCartData: null, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

//----------------------------------------------CheckOut2---------------------------------//

exports.getCheckOut2 = [async (req, res) => {
    try {
        try {
            await Connection.connect();
            const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
            const result = await dataAccess.execute(`SP_Banner`, [
                { name: 'Query', value: "FetchData2" },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false }
            ]);

            let mainCategoryData, AboutUsData;
            if (result.recordset && result.recordset[0]) {
                mainCategoryData = result.recordset[0].CategoryData.split('~');
            } else {
                bannerData = null;
                mainCategoryData = null;
            }

            let Country = "India";
            let URL = "https://countriesnow.space/api/v0.1/countries/states";

            const payload = { country: Country };
            // const response = await fetch(URL, {
            //     method: 'POST',
            //     body: JSON.stringify(payload),
            //     headers: { 'Content-Type': 'application/json' },
            // });

            const response = await axios.post(URL, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const responseDataArray = Object.values(response.data);

            let stateData = responseDataArray[2].states;
            let localStorageCartData = [];

            let userData = [];

            if (req.cookies.browserId) {
                const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];

                if (localStoragecart.length > 0) {
                    // bindlocalStorageKey.forEach(async (data, i) => {
                    for (var i = 0; i < localStoragecart.length; i++) {

                        const resultitemData = await dataAccess.execute(`SP_Item`, [
                            { name: 'Query', value: "SelectAll2" },
                            { name: 'ItemID', value: localStoragecart[i].ItemID }
                        ]);


                        if (resultitemData.recordset && resultitemData.recordset[0]) {

                            let discountInformation;
                            if (resultitemData.recordset[0].DiscountDetail) {
                                discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
                            }

                            if (discountInformation) {
                                if (discountInformation.length > 0) {
                                    // var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));
                                    var ActualAmt = (Number(localStoragecart[i].ItemAmount));

                                    if (ActualAmt > discountInformation[0].MinAmount || ActualAmt == discountInformation[0].MinAmount) {
                                        let findDiscountAmount = parseFloat(ActualAmt) * parseFloat(discountInformation[0].Discount) / 100;
                                        let DiscountAmt = parseFloat(ActualAmt * localStoragecart[i].Qty) - parseFloat(findDiscountAmount * localStoragecart[i].Qty);

                                        localStorageCartData.push({
                                            ItemID: localStoragecart[i].ItemID,
                                            ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                            Amount: ActualAmt * localStoragecart[i].Qty,
                                            Quantity: localStoragecart[i].Qty,
                                            FinalPrice: DiscountAmt,
                                            ItemSize: localStoragecart[i].Size,
                                            ItemImage: (resultitemData.recordset[0] ? (`${Imageurl}` + resultitemData.recordset[0].ItemImage) : ''),
                                            Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                            DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                            DiscountName: discountInformation[0].DiscountName,
                                            DiscountID: discountInformation[0].DiscountID
                                        });

                                    } else {
                                        localStorageCartData.push({
                                            ItemID: localStoragecart[i].ItemID,
                                            ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                            // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                            Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                            Quantity: localStoragecart[i].Qty,
                                            // FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                            FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                            ItemSize: localStoragecart[i].Size,
                                            ItemImage: (resultitemData.recordset[0] ? (`${Imageurl}` + resultitemData.recordset[0].ItemImage) : ''),
                                            Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                            DiscountPrice: '',
                                            DiscountName: '',
                                            DiscountID: ''
                                        });
                                    }
                                } else {
                                    localStorageCartData.push({
                                        ItemID: localStoragecart[i].ItemID,
                                        ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                        // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                        Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                        Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                        FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                        ItemSize: localStoragecart[i].Size,
                                        ItemImage: (resultitemData.recordset[0] ? (`${Imageurl}` + resultitemData.recordset[0].ItemImage) : ''),
                                        Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                        DiscountPrice: '',
                                        DiscountName: '',
                                        DiscountID: ''
                                    });
                                }
                            } else {
                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                    Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                    // FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    ItemSize: localStoragecart[i].Size,
                                    ItemImage: (resultitemData.recordset[0] ? (`${Imageurl}` + resultitemData.recordset[0].ItemImage) : ''),
                                    Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                    DiscountPrice: '',
                                    DiscountName: '',
                                    DiscountID: ''
                                });
                            }
                        }
                    }

                    if (req.cookies.userdata) {
                        const userDataResult = await dataAccess.execute(`SP_UserAddressDetail`, [
                            { name: 'Query', value: "FetchLatestAddress" },
                            { name: 'UserID', value: req.cookies.userdata[0].UserID }
                        ]);
                        if (userDataResult.recordset && userDataResult.recordset[0]) {
                            userData = userDataResult.recordset;
                        }
                    }
                    res.render('./Asaga/PlaceOrder', { title: 'PlaceOrder', Menutitle: 'PlaceOrder', CategoryData: mainCategoryData, StateData: stateData, LocalStorageCartData: localStorageCartData, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, UserData: userData });
                }
                else {
                    res.redirect('/Splash');
                }
            }
        } catch (error) {
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.checkCouponCode2 = [async (req, res) => {
    try {
        await Connection.connect();
        var bodyCouponCode = req.body.coupon_code;
        var bodyUserEmailID = req.body.txtEmailID;
        const result = await dataAccess.execute(`SP_Discount`, [
            { name: 'Query', value: "SelectAll2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
            { name: 'DiscountName', value: bodyCouponCode }
        ]);
        let couponCodeData;
        if (result.recordset && result.recordset[0]) {
            couponCodeData = result.recordset[0];
            if (couponCodeData.DiscountType == "Item Discount" && couponCodeData.SubCategoryID != '') {
                const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
                let codeStatus = false;
                let localStorageCartData = [];
                for (var i = 0; i < localStoragecart.length; i++) {
                    const resultitemData = await dataAccess.execute(`SP_Item`, [
                        { name: 'Query', value: "SelectAll2" },
                        { name: 'ItemID', value: localStoragecart[i].ItemID }
                    ]);
                    if (resultitemData.recordset && resultitemData.recordset[0]) {
                        if (resultitemData.recordset[0].SubCategoryID == couponCodeData.SubCategoryID) {
                            codeStatus = true;
                            var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));
                            if (ActualAmt > couponCodeData.MinAmount || ActualAmt == couponCodeData.MinAmount) {
                                let findDiscountAmount = ActualAmt * couponCodeData.Discount / 100;
                                let DiscountAmt = ((ActualAmt * localStoragecart[i].Qty) - (findDiscountAmount * localStoragecart[i].Qty)).toFixed(2);

                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : '',
                                    Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                    Amount: ActualAmt * localStoragecart[i].Qty,
                                    Quantity: localStoragecart[i].Qty,
                                    FinalPrice: DiscountAmt,
                                    ItemSize: localStoragecart[i].Size,
                                    DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                    DiscountName: couponCodeData.DiscountName,
                                    DiscountID: couponCodeData.DiscountID
                                });
                            } else {
                                localStorageCartData.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : '',
                                    Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                    Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Quantity: localStoragecart[i].Qty,
                                    FinalPrice: ((resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0)).toFixed(2),
                                    ItemSize: localStoragecart[i].Size,
                                    DiscountPrice: '',
                                    DiscountName: '',
                                    DiscountID: ''
                                });
                            }
                        } else {
                            localStorageCartData.push({
                                ItemID: localStoragecart[i].ItemID,
                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : '',
                                Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                Quantity: localStoragecart[i].Qty,
                                FinalPrice: ((resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0)).toFixed(2),
                                ItemSize: localStoragecart[i].Size,
                                DiscountPrice: '',
                                DiscountName: '',
                                DiscountID: ''
                            });
                        }
                    } else {
                        return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
                    }
                }
                if (codeStatus == true) {
                    return res.status(200).json({ status: 1, Message: "true", data: localStorageCartData });
                } else {
                    return res.status(200).json({ status: 1, Message: "false", data: req.body.coupon_code });
                }
            } else if (couponCodeData.DiscountType == "User Discount" && bodyUserEmailID != '') {

                const resultitemData = await dataAccess.execute(`SP_UserDiscountDetail`, [
                    { name: 'Query', value: "chkUserCouponCode" },
                    { name: 'Email', value: bodyUserEmailID },
                    { name: 'DiscountName', value: bodyCouponCode }
                ]);

                let chkUserCode;
                if (resultitemData.recordset && resultitemData.recordset[0]) {
                    chkUserCode = resultitemData.recordset[0];

                    if (chkUserCode.CouponCodeStatus == false) {
                        return res.status(200).json({ status: 1, Message: "UserDiscount", data: chkUserCode });
                    } else {
                        return res.status(200).json({ status: 1, Message: "AlreadyApplyCouponCode", data: null });
                    }
                } else {
                    return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
                    //return res.status(200).json({ status: 0, Message: "AlreadyApplyCouponCode", data: null });
                }
            } else if (couponCodeData.DiscountType == "Flat Discount") {
                return res.status(200).json({ status: 0, Message: "Already Apply Coupon Code", data: null });
            } else {
                return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
            }
            // return res.status(200).json({ status: 0, Message: "AlreadyApplyCouponCode", data: null });
        } else {
            return res.status(200).json({ status: 0, Message: "Enter a valid coupon code", data: null });
            //return res.status(200).json({ status: 0, Message: "exist", data: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];


exports.setPlaceOrder2 = [async (req, res) => {
    try {
        var bodyEmailID = req.body.txtEmailID;
        var bodyOfferandDiscountConfirmation = req.body.chkConfirmation ? 'Yes' : 'No';
        var bodyFirstName = req.body.txtFirstName;
        var bodyMiddleName = req.body.txtMiddleName;
        var bodyLastName = req.body.txtLastName;
        var bodyCompanyName = req.body.txtCompanyName;
        var bodyAddress1 = req.body.txtAddress1;
        var bodyAddress2 = req.body.txtAddress2;
        var bodyCountry = req.body.txtCountryName;
        var bodyState = req.body.ddlState;
        var bodyCityData = req.body.ddlCity;
        var bodyPincode = req.body.txtPinCode;
        var bodyMobileNo = req.body.txtMobileNo;
        var bodySaveAddressStatus = req.body.chkAddressConfirmation ? 'Yes' : 'No';
        var bodyOverallFinalTotal = req.body.txtOverallFinalTotal;
        var bodyItemID = req.body.lblItemID;
        var bodyItemName = req.body.lblItemName;
        var bodyQuantity = req.body.lblQuantity;
        var bodyDiscountID = req.body.lblDiscountID;
        var bodyDiscountName = req.body.lblDiscountName;
        var bodyDiscountPrice = req.body.lblDiscountPrice;
        var bodyAmount = req.body.lblAmount;
        var bodyFinalPrice = req.body.lblFinalPrice;
        var bodyItemSize = req.body.lblItemSize;
        var bodyUserCouponCode = req.body.txtUserCouponCode;
        var bodyUserCouponCodeID = req.body.txtUserCouponCodeID;
        var bodyFinalActualAmount = req.body.txtFinalActualAmount;
        var bodyItemImage = req.body.lblItemImage;
        var bodyItemDescription = req.body.lblItemDescription;

        var bodyOrderMasterID = req.body.OrderMasterID;
        var bodyUniqueID = UniqueId();
        var bodyPaymentMode = req.body.PaymentMode;
        var bodyTransactionType = req.body.TransactionType;

        if (bodyPaymentMode == 'COD') {
            var UserID = "";
            if (req.cookies.userData) {
                UserID = req.cookies.userData.UserID;
            } else {
                if (req.cookies.browserId) {
                    const chkUserData = await dataAccess.execute(`SP_UserMaster`, [
                        { name: 'Query', value: "chkUserEmailIDWise" },
                        { name: 'EmailID', value: bodyEmailID }
                    ]);
                    await Connection.connect();
                    if (chkUserData.recordset && chkUserData.recordset[0]) {
                        UserID = chkUserData.recordset[0].UserID;
                    } else {
                        var pwd = helper.generatePassword(6);
                        //var originalText = CryptoJS.AES.encrypt(pwd, process.env.SEC_CODE).toString();

                        var data = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'FirstName', value: bodyFirstName },
                            { name: 'MiddleName', value: bodyMiddleName },
                            { name: 'LastName', value: bodyLastName },
                            { name: 'EmailID', value: bodyEmailID },
                            //{ name: 'Password', value: originalText },
                            { name: 'Password', value: pwd },
                            { name: 'MobileNo', value: bodyMobileNo },
                            { name: 'RegistrationType', value: 'Panel' },
                            { name: 'UserActivationStatus', value: 'Yes' },
                            { name: 'UserOfferStatus', value: bodyOfferandDiscountConfirmation }
                        ]

                        const result = await dataAccess.execute(`SP_UserMaster`, data);
                        if (result.recordset && result.recordset[0]) {
                            UserID = result.recordset[0].UserID;
                        }
                    }
                }
            }

            if (UserID != "") {
                if (bodySaveAddressStatus == 'Yes') {

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        //{ name: 'UserID', value: result.recordset[0].UserID },
                        { name: 'UserID', value: UserID },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'Company', value: bodyCompanyName },
                        { name: 'Address1', value: bodyAddress1 },
                        { name: 'Address2', value: bodyAddress2 },
                        { name: 'CountryName', value: bodyCountry },
                        { name: 'StateName', value: bodyState },
                        { name: 'CityName', value: bodyCityData },
                        { name: 'Pincode', value: bodyPincode },
                        { name: 'EmailID', value: bodyEmailID }
                    ]
                    await dataAccess.execute(`SP_UserAddressDetail`, data);
                }

                const fetchMaxOrderNo = await dataAccess.execute(`SP_OrderMaster`, [
                    { name: 'Query', value: "SelectMAXOrderCode" }
                ]);

                // console.log("---fetchMaxOrderNo-------->", fetchMaxOrderNo);

                let newOrderNumber;
                if (fetchMaxOrderNo.recordset && fetchMaxOrderNo.recordset[0]) {
                    if (fetchMaxOrderNo.recordset[0].OrderNo != null) {
                        const orderCode = parseInt(fetchMaxOrderNo.recordset[0].OrderNo.substring(2)) + 1;
                        newOrderNumber = "OD" + orderCode.toString().padStart(5, "0");
                    } else {
                        newOrderNumber = 'OD00001';
                    }
                }
                else {
                    newOrderNumber = 'OD00001';
                }

                var CheckUniqueID = [
                    { name: 'Query', value: 'CheckUniqueID' },
                    { name: 'OrderMasterID', value: req.body.OrderMasterID },
                    // { name: 'VoterID', value: req.body.VoterID },
                    // { name: 'Type', value: req.body.Type },
                    //{ name: 'IsActive', value: true },
                    { name: 'IsDelete', value: false },
                ]
                await Connection.connect();
                const CheckOrderDetailResult = await dataAccess.execute(`SP_OrderMaster`, CheckUniqueID);
                const orderedetaildataresult = CheckOrderDetailResult.recordset;
                if (!orderedetaildataresult.length > 0) {
                    return res.status(200).json({ status: 0, message: 'Data Already Exists!', data: null, error: null })
                }
                else {
                    var orderData = [
                        { name: 'Query', value: 'Insert' },
                        //{ name: 'UserID', value: result.recordset[0].UserID },
                        { name: 'UserID', value: UserID },
                        { name: 'OrderNo', value: newOrderNumber },
                        { name: 'DiscountID', value: bodyUserCouponCodeID ? bodyUserCouponCodeID : null },
                        { name: 'DiscountAmount', value: bodyUserCouponCode ? bodyUserCouponCode : null },
                        { name: 'TotalAmount', value: bodyFinalActualAmount ? bodyFinalActualAmount : bodyOverallFinalTotal },
                        { name: 'ShippingCharge', value: '0' },
                        { name: 'FinalAmount', value: bodyOverallFinalTotal },
                        { name: 'PaymentMode', value: 'COD' },
                        { name: 'OrderStatus', value: 'Confirm' },
                        { name: 'UniqueID', value: bodyUniqueID },
                    ]
                    const OrderMasterResult = await dataAccess.execute(`SP_OrderMaster`, orderData);

                    if (OrderMasterResult.recordset && OrderMasterResult.recordset[0]) {

                        var shippingAddressdata = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'UserID', value: UserID },
                            { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                            { name: 'FirstName', value: bodyFirstName },
                            { name: 'MiddleName', value: bodyMiddleName },
                            { name: 'LastName', value: bodyLastName },
                            { name: 'MobileNo', value: bodyMobileNo },
                            { name: 'Company', value: bodyCompanyName },
                            { name: 'Address1', value: bodyAddress1 },
                            { name: 'Address2', value: bodyAddress2 },
                            { name: 'CountryName', value: bodyCountry },
                            { name: 'StateName', value: bodyState },
                            { name: 'CityName', value: bodyCityData },
                            { name: 'Pincode', value: bodyPincode },
                            { name: 'EmailID', value: bodyEmailID }
                        ]
                        await dataAccess.execute(`SP_ShippingAddress`, shippingAddressdata);

                        let Header, Footer, OrderDetail = '', EmailMsgDraft, OwnerOrderDetail = '';

                        let mailSubject = "Asaga Order Confirmation #" + newOrderNumber;

                        console.log("=====mailsunbb======", mailSubject)

                        Header = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asaga.in' target='_blank'><img src='http://asaga.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px;  margin: 30px;'>Dear " + bodyFirstName + ",<br/><br/>Thank you for your order.<br/><br/><div style='font-size:20px; font-weight: bolder; text-align: center;'>Your order details</div><br/><span style='font-size:16px;'>Order #</span>" + newOrderNumber + "<table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>";

                        Footer = "<tr><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Total</td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyOverallFinalTotal + "</td></tr></table><br/><span style='font-size:16px;'>Shipping Address: </span>" + bodyAddress1 + "," + bodyAddress2 + "<br/><br/>Thanks for shopping with us.<br/>Asaga</div></td></tr></table></div>";

                        ownerFooter = "</table></div></td></tr></table></div>"
                        var OwnerMsgDraft = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asaga.in' target='_blank'><img src='http://asaga.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px; margin: 30px;'>Customer Name: " + bodyFirstName + "<br/>Address: " + bodyAddress1 + "<br/>Order Number: " + newOrderNumber + "<br/>Mobile No: " + bodyMobileNo + "<br/>Total Amount :" + bodyOverallFinalTotal + "<br /><br /><table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>"
                        if (Array.isArray(bodyItemID)) {
                            for (let index = 0; index < bodyItemID.length; index++) {
                                const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                                    { name: 'Query', value: "SelectItemSizeWiseStock" },
                                    { name: 'ItemID', value: bodyItemID[index] },
                                    { name: 'Size', value: bodyItemSize[index] }
                                ]);

                                if (resultitemData.recordset && resultitemData.recordset[0]) {
                                    let itemStock = resultitemData.recordset[0].RemainingStock;
                                    let outQty = itemStock - bodyQuantity[index];

                                    var updateQty = [
                                        { name: 'Query', value: 'UpdateRemainingStock' },
                                        { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                        { name: 'RemainingStock', value: outQty }
                                    ]
                                    await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                                    var totPrice = (Number(bodyAmount[index])) * (bodyQuantity[index]);

                                    var orderDetailData = [
                                        { name: 'Query', value: 'Insert' },
                                        { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                        { name: 'ItemID', value: bodyItemID[index] },
                                        { name: 'ItemName', value: bodyItemName[index] },
                                        { name: 'Quantity', value: bodyQuantity[index] },
                                        { name: 'SizeName', value: bodyItemSize[index] },
                                        { name: 'ItemPrice', value: bodyAmount[index] },
                                        { name: 'TotalPrice', value: totPrice.toString() },
                                        { name: 'DiscountID', value: bodyDiscountID[index] ? bodyDiscountID[index] : null },
                                        { name: 'DiscountAmount', value: bodyDiscountPrice[index] ? bodyDiscountPrice[index] : null },
                                        { name: 'FinalPrice', value: bodyFinalPrice[index] }
                                    ]
                                    await dataAccess.execute(`SP_OrderDetail`, orderDetailData);
                                    OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";

                                    OwnerOrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";

                                }
                            }

                            EmailMsgDraft = Header + OrderDetail + Footer;
                            helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);

                            var OwnerEmailID = OwnerAsagaID;
                            var subject = 'New Order Detail';

                            allcustItemDetail = OwnerMsgDraft + OwnerOrderDetail + ownerFooter
                            helper.SendMail(OwnerEmailID, subject, allcustItemDetail);
                            // localStorage.removeItem(`cart_${req.cookies.browserId}`);
                        } else {
                            const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                                { name: 'Query', value: "SelectItemSizeWiseStock" },
                                { name: 'ItemID', value: bodyItemID },
                                { name: 'Size', value: bodyItemSize }
                            ]);

                            if (resultitemData.recordset && resultitemData.recordset[0]) {
                                let itemStock = resultitemData.recordset[0].RemainingStock;
                                let outQty = itemStock - bodyQuantity;

                                var updateQty = [
                                    { name: 'Query', value: 'UpdateRemainingStock' },
                                    { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                    { name: 'RemainingStock', value: outQty }
                                ]
                                await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                                var orderDetailData = [
                                    { name: 'Query', value: 'Insert' },
                                    { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                    { name: 'ItemID', value: bodyItemID },
                                    { name: 'ItemName', value: bodyItemName },
                                    { name: 'Quantity', value: bodyQuantity },
                                    { name: 'SizeName', value: bodyItemSize },
                                    { name: 'ItemPrice', value: resultitemData.recordset[0].Amount },
                                    { name: 'TotalPrice', value: bodyAmount },
                                    { name: 'DiscountID', value: bodyDiscountID ? bodyDiscountID : null },
                                    { name: 'DiscountAmount', value: bodyDiscountPrice ? bodyDiscountPrice : null },
                                    { name: 'FinalPrice', value: bodyFinalPrice }
                                ]
                                await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                                // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName + "</td><td>Rs. " + bodyFinalPrice + "</td></tr>";

                                OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr>";

                                OwnerOrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr></table></div></td></tr></table></div>";

                                EmailMsgDraft = Header + OrderDetail + Footer;
                                helper.SendMail(bodyEmailID, mailSubject, EmailMsgDraft);


                                var OwnerEmailID = OwnerAsagaID;
                                var subject = 'New Order Detail';

                                allcustItemDetail = OwnerMsgDraft + OwnerOrderDetail
                                console.log("jhjhhhhhhhhhhh", allcustItemDetail)

                                helper.SendMail(OwnerEmailID, subject, allcustItemDetail);
                                //localStorage.removeItem(`cart_${req.cookies.browserId}`);
                            }
                        }

                        if (bodyUserCouponCodeID) {
                            var updateCouponCodeStatus = [
                                { name: 'Query', value: 'UpdateCouponCodeStatus' },
                                { name: 'UserID', value: UserID },
                                { name: 'DiscountID', value: bodyUserCouponCodeID }
                            ]
                            await dataAccess.execute(`SP_UserDiscountDetail`, updateCouponCodeStatus);
                        }

                        var data = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                            { name: 'UniqueID', value: bodyUniqueID },
                            { name: 'PaymentMode', value: bodyPaymentMode },
                            { name: 'TransactionType', value: bodyPaymentMode },
                        ]
                        console.log("====data====", data)
                        await dataAccess.execute(`SP_PaymentDetail`, data);
                        //res.redirect('/ViewCart');
                        res.redirect('/OrderSuccess/' + OrderMasterResult.recordset[0].OrderMasterID);
                    }
                    else {
                        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                    }
                }
            }
            else {
                return res.status(500).json({ status: 0, message: "User Not Found", data: null, error: null })
            }
        }
    } catch (error) {
        console.log("---error-------->", error);
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.setCCAVRequest = [async (req, res) => {
    try {
        var bodyEmailID = req.body.txtEmailID;
        var bodyOfferandDiscountConfirmation = req.body.chkConfirmation ? 'Yes' : 'No';
        var bodyFirstName = req.body.txtFirstName;
        var bodyMiddleName = req.body.txtMiddleName;
        var bodyLastName = req.body.txtLastName;
        var bodyCompanyName = req.body.txtCompanyName;
        var bodyAddress1 = req.body.txtAddress1;
        var bodyAddress2 = req.body.txtAddress2;
        var bodyCountry = req.body.txtCountryName;
        var bodyState = req.body.ddlState;
        var bodyCityData = req.body.ddlCity;
        var bodyPincode = req.body.txtPinCode;
        var bodyMobileNo = req.body.txtMobileNo;
        var bodySaveAddressStatus = req.body.chkAddressConfirmation ? 'Yes' : 'No';
        var bodyOverallFinalTotal = req.body.txtOverallFinalTotal;
        var bodyItemID = req.body.lblItemID;
        var bodyItemName = req.body.lblItemName;
        var bodyQuantity = req.body.lblQuantity;
        var bodyDiscountID = req.body.lblDiscountID;
        var bodyDiscountName = req.body.lblDiscountName;
        var bodyDiscountPrice = req.body.lblDiscountPrice;
        var bodyAmount = req.body.lblAmount;
        var bodyFinalPrice = req.body.lblFinalPrice;
        var bodyItemSize = req.body.lblItemSize;
        var bodyUserCouponCode = req.body.txtUserCouponCode;
        var bodyUserCouponCodeID = req.body.txtUserCouponCodeID;
        var bodyFinalActualAmount = req.body.txtFinalActualAmount;
        var bodyItemImage = req.body.lblItemImage;
        var bodyItemDescription = req.body.lblItemDescription;

        var bodyOrderMasterID = req.body.OrderMasterID;
        var bodyUniqueID = UniqueId();
        var bodyPaymentMode = req.body.PaymentMode;
        var bodyTransactionType = req.body.TransactionType;

        if (bodyPaymentMode == 'Online' && bodyCountry == 'India') {
            var UserID = "";
            if (req.cookies.userData) {
                UserID = req.cookies.userData.UserID;
            } else {
                if (req.cookies.browserId) {
                    const chkUserData = await dataAccess.execute(`SP_UserMaster`, [
                        { name: 'Query', value: "chkUserEmailIDWise" },
                        { name: 'EmailID', value: bodyEmailID }
                    ]);
                    await Connection.connect();

                    if (chkUserData.recordset && chkUserData.recordset[0]) {
                        UserID = chkUserData.recordset[0].UserID;
                    } else {
                        var pwd = helper.generatePassword(6);
                        //var originalText = CryptoJS.AES.encrypt(pwd, process.env.SEC_CODE).toString();

                        var data = [
                            { name: 'Query', value: 'Insert' },
                            { name: 'FirstName', value: bodyFirstName },
                            { name: 'MiddleName', value: bodyMiddleName },
                            { name: 'LastName', value: bodyLastName },
                            { name: 'EmailID', value: bodyEmailID },
                            //{ name: 'Password', value: originalText },
                            { name: 'Password', value: pwd },
                            { name: 'MobileNo', value: bodyMobileNo },
                            { name: 'RegistrationType', value: 'Panel' },
                            { name: 'UserActivationStatus', value: 'Yes' },
                            { name: 'UserOfferStatus', value: bodyOfferandDiscountConfirmation }
                        ]

                        const result = await dataAccess.execute(`SP_UserMaster`, data);
                        if (result.recordset && result.recordset[0]) {
                            UserID = result.recordset[0].UserID;
                        }
                    }
                }
            }

            if (UserID != "") {
                if (bodySaveAddressStatus == 'Yes') {

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        //{ name: 'UserID', value: result.recordset[0].UserID },
                        { name: 'UserID', value: UserID },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'Company', value: bodyCompanyName },
                        { name: 'Address1', value: bodyAddress1 },
                        { name: 'Address2', value: bodyAddress2 },
                        { name: 'CountryName', value: bodyCountry },
                        { name: 'StateName', value: bodyState },
                        { name: 'CityName', value: bodyCityData },
                        { name: 'Pincode', value: bodyPincode },
                        { name: 'EmailID', value: bodyEmailID }
                    ]
                    await dataAccess.execute(`SP_UserAddressDetail`, data);
                }

                const fetchMaxOrderNo = await dataAccess.execute(`SP_OrderMaster`, [
                    { name: 'Query', value: "SelectMAXOrderCode" }
                ]);

                let newOrderNumber;
                if (fetchMaxOrderNo.recordset && fetchMaxOrderNo.recordset[0]) {
                    if (fetchMaxOrderNo.recordset[0].OrderNo != null) {
                        const orderCode = parseInt(fetchMaxOrderNo.recordset[0].OrderNo.substring(2)) + 1;
                        newOrderNumber = "OD" + orderCode.toString().padStart(5, "0");
                    } else {
                        newOrderNumber = 'OD00001';
                    }
                }
                else {
                    newOrderNumber = 'OD00001';
                }

                var orderData = [
                    { name: 'Query', value: 'Insert' },
                    //{ name: 'UserID', value: result.recordset[0].UserID },
                    { name: 'UserID', value: UserID },
                    { name: 'OrderNo', value: newOrderNumber },
                    { name: 'DiscountID', value: bodyUserCouponCodeID ? bodyUserCouponCodeID : null },
                    { name: 'DiscountAmount', value: bodyUserCouponCode ? bodyUserCouponCode : null },
                    { name: 'TotalAmount', value: bodyFinalActualAmount ? bodyFinalActualAmount : bodyOverallFinalTotal },
                    { name: 'ShippingCharge', value: '0' },
                    { name: 'FinalAmount', value: bodyOverallFinalTotal },
                    { name: 'PaymentMode', value: 'Online' },
                    { name: 'OrderStatus', value: 'Pending' },
                    { name: 'UniqueID', value: bodyUniqueID },
                ]
                const OrderMasterResult = await dataAccess.execute(`SP_OrderMaster`, orderData);

                if (OrderMasterResult.recordset && OrderMasterResult.recordset[0]) {

                    var shippingAddressdata = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'UserID', value: UserID },
                        { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                        { name: 'FirstName', value: bodyFirstName },
                        { name: 'MiddleName', value: bodyMiddleName },
                        { name: 'LastName', value: bodyLastName },
                        { name: 'MobileNo', value: bodyMobileNo },
                        { name: 'Company', value: bodyCompanyName },
                        { name: 'Address1', value: bodyAddress1 },
                        { name: 'Address2', value: bodyAddress2 },
                        { name: 'CountryName', value: bodyCountry },
                        { name: 'StateName', value: bodyState },
                        { name: 'CityName', value: bodyCityData },
                        { name: 'Pincode', value: bodyPincode },
                        { name: 'EmailID', value: bodyEmailID }
                    ]
                    await dataAccess.execute(`SP_ShippingAddress`, shippingAddressdata);

                    let Header, Footer, OrderDetail = '', EmailMsgDraft, OwnerOrderDetail = '';

                    let mailSubject = "Asaga Order Confirmation #" + newOrderNumber;

                    Header = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asagaoffice.in' target='_blank'><img src='http://asagaoffice.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px;  margin: 30px;'>Dear " + bodyFirstName + ",<br/><br/>Thank you for your order.<br/><br/><div style='font-size:20px; font-weight: bolder; text-align: center;'>Your order details</div><br/><span style='font-size:16px;'>Order #</span>" + newOrderNumber + "<table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>";

                    Footer = "<tr><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='width: 20%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'></td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Total</td><td style='border: 1px solid black; width: 10%; font-size: 14px !important; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyOverallFinalTotal + "</td></tr></table><br/><span style='font-size:16px;'>Shipping Address: </span>" + bodyAddress1 + "," + bodyAddress2 + "<br/><br/>Thanks for shopping with us.<br/>Asaga</div></td></tr></table></div>";

                    ownerFooter = "</table></div></td></tr></table></div>"

                    var OwnerMsgDraft = "<div style='border: 1px solid black; margin: 0px;'><table cellspacing='0' cellpadding='0' width='100%' style='font-family: 'Open Sans', sans-serif; border: 1px solid black;'><tr><td style='text-align: center;width: 100%;border-bottom: 1px solid black;'><a href='http://asaga.in' target='_blank'><img src='http://asaga.in/images/Logo.png' style='height: 100px;'></a></td></tr><tr><td><div style='font-size: 16px; margin: 30px;'>Customer Name: " + bodyFirstName + "<br/>Address: " + bodyAddress1 + "<br/>Order Number: " + newOrderNumber + "<br/>Mobile No: " + bodyMobileNo + "<br/>Total Amount :" + bodyOverallFinalTotal + "<br /><br /><table style='border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center !important; vertical-align: middle !important;'><tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger; font-family: Source Serif Pro,serif;'>Image</td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Product Name</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Size</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Quantity</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>Amount</td></tr>"

                    let localStorageCartData = [];
                    const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
                    if (localStoragecart.length > 0) {
                        for (var i = 0; i < localStoragecart.length; i++) {

                            const resultitemData = await dataAccess.execute(`SP_Item`, [
                                { name: 'Query', value: "SelectAll2" },
                                { name: 'ItemID', value: localStoragecart[i].ItemID }
                            ]);

                            if (resultitemData.recordset && resultitemData.recordset[0]) {

                                let discountInformation;
                                if (resultitemData.recordset[0].DiscountDetail) {
                                    discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
                                }

                                if (discountInformation) {
                                    if (discountInformation.length > 0) {
                                        var ActualAmt = (Number(localStoragecart[i].ItemAmount));
                                        if (ActualAmt > discountInformation[0].MinAmount || ActualAmt == discountInformation[0].MinAmount) {
                                            let findDiscountAmount = ActualAmt * discountInformation[0].Discount / 100;
                                            let DiscountAmt = (ActualAmt * localStoragecart[i].Qty) - (findDiscountAmount * localStoragecart[i].Qty);
                                            localStorageCartData.push({
                                                ItemID: localStoragecart[i].ItemID,
                                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                                Amount: ActualAmt * localStoragecart[i].Qty,
                                                Quantity: localStoragecart[i].Qty,
                                                FinalPrice: DiscountAmt,
                                                ItemSize: localStoragecart[i].Size,
                                                ItemImage: (resultitemData.recordset[0] ? ('https://asaga.in:9920/UploadFiles/Item/' + resultitemData.recordset[0].ItemImage) : ''),
                                                Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                                DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                                DiscountName: discountInformation[0].DiscountName,
                                                DiscountID: discountInformation[0].DiscountID
                                            });

                                        } else {
                                            localStorageCartData.push({
                                                ItemID: localStoragecart[i].ItemID,
                                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                                // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                                Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                                Quantity: localStoragecart[i].Qty,
                                                //FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                                FinalPrice: (rlocalStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                                ItemSize: localStoragecart[i].Size,
                                                ItemImage: (resultitemData.recordset[0] ? ('https://asaga.in:9920/UploadFiles/Item/' + resultitemData.recordset[0].ItemImage) : ''),
                                                Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                                DiscountPrice: '',
                                                DiscountName: '',
                                                DiscountID: ''
                                            });
                                        }
                                    } else {
                                        localStorageCartData.push({
                                            ItemID: localStoragecart[i].ItemID,
                                            ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                            // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                            Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                            Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                            //FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                            FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                            ItemSize: localStoragecart[i].Size,
                                            ItemImage: (resultitemData.recordset[0] ? ('https://asaga.in:9920/UploadFiles/Item/' + resultitemData.recordset[0].ItemImage) : ''),
                                            Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                            DiscountPrice: '',
                                            DiscountName: '',
                                            DiscountID: ''
                                        });
                                    }
                                } else {
                                    localStorageCartData.push({
                                        ItemID: localStoragecart[i].ItemID,
                                        ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                        // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                        Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                        Quantity: localStoragecart[i].Qty ? localStoragecart[i].Qty : 0,
                                        //FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                        FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                        ItemSize: localStoragecart[i].Size,
                                        ItemImage: (resultitemData.recordset[0] ? ('https://asaga.in:9920/UploadFiles/Item/' + resultitemData.recordset[0].ItemImage) : ''),
                                        Description: resultitemData.recordset[0] ? resultitemData.recordset[0].Description : '',
                                        DiscountPrice: '',
                                        DiscountName: '',
                                        DiscountID: ''
                                    });
                                }
                            }
                        }
                        for (let index = 0; index < localStorageCartData.length; index++) {
                            const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                                { name: 'Query', value: "SelectItemSizeWiseStock" },
                                { name: 'ItemID', value: localStorageCartData[index].ItemID },
                                { name: 'Size', value: localStorageCartData[index].ItemSize }
                            ]);
                            if (resultitemData.recordset && resultitemData.recordset[0]) {
                                let itemStock = resultitemData.recordset[0].RemainingStock;
                                let outQty = itemStock - localStorageCartData[index].Quantity;

                                var updateQty = [
                                    { name: 'Query', value: 'UpdateRemainingStock' },
                                    { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                    { name: 'RemainingStock', value: outQty }
                                ]
                                await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                                // var totPrice = (Number(localStorageCartData[index].Amount)) * (localStorageCartData[index].Quantity);
                                var totPrice = (Number(localStorageCartData[index].Amount)) * (localStorageCartData[index].Quantity);

                                var orderDetailData = [
                                    { name: 'Query', value: 'Insert' },
                                    { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                    { name: 'ItemID', value: localStorageCartData[index].ItemID },
                                    { name: 'ItemName', value: localStorageCartData[index].ItemName },
                                    { name: 'Quantity', value: localStorageCartData[index].Quantity },
                                    { name: 'SizeName', value: localStorageCartData[index].ItemSize },
                                    { name: 'ItemPrice', value: localStorageCartData[index].Amount },
                                    { name: 'TotalPrice', value: totPrice.toString() },
                                    { name: 'DiscountID', value: localStorageCartData[index].DiscountID ? localStorageCartData[index].DiscountID : null },
                                    { name: 'DiscountAmount', value: localStorageCartData[index].DiscountPrice ? localStorageCartData[index].DiscountPrice : null },
                                    { name: 'FinalPrice', value: localStorageCartData[index].FinalPrice }
                                ]
                                await dataAccess.execute(`SP_OrderDetail`, orderDetailData);
                                OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";
                                OwnerOrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize[index] + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity[index] + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice[index] + "</td></tr>";

                            }
                        }
                    } else {
                        const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                            { name: 'Query', value: "SelectItemSizeWiseStock" },
                            { name: 'ItemID', value: bodyItemID },
                            { name: 'Size', value: bodyItemSize }
                        ]);

                        if (resultitemData.recordset && resultitemData.recordset[0]) {
                            let itemStock = resultitemData.recordset[0].RemainingStock;
                            let outQty = itemStock - bodyQuantity;

                            var updateQty = [
                                { name: 'Query', value: 'UpdateRemainingStock' },
                                { name: 'ItemDetailID', value: resultitemData.recordset[0].ItemDetailID },
                                { name: 'RemainingStock', value: outQty }
                            ]
                            await dataAccess.execute(`SP_ItemSizeStockDetail`, updateQty);

                            var orderDetailData = [
                                { name: 'Query', value: 'Insert' },
                                { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                                { name: 'ItemID', value: bodyItemID },
                                { name: 'ItemName', value: bodyItemName },
                                { name: 'Quantity', value: bodyQuantity },
                                { name: 'SizeName', value: bodyItemSize },
                                { name: 'ItemPrice', value: resultitemData.recordset[0].Amount },
                                { name: 'TotalPrice', value: bodyAmount },
                                { name: 'DiscountID', value: bodyDiscountID ? bodyDiscountID : null },
                                { name: 'DiscountAmount', value: bodyDiscountPrice ? bodyDiscountPrice : null },
                                { name: 'FinalPrice', value: bodyFinalPrice }
                            ]
                            await dataAccess.execute(`SP_OrderDetail`, orderDetailData);

                            // OrderDetail += "<tr><td><img style='height:250px;padding:10px;' src='http://192.168.0.119:2005/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'</td><td>" + bodyItemName + "</td><td>Rs. " + bodyFinalPrice + "</td></tr>";

                            OrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr>";

                            OwnerOrderDetail += "<tr><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'><img style='height:200px;padding:10px;' src='https://asaga.in:9920/UploadFiles/Item/" + resultitemData.recordset[0].ItemImage + "'></td><td style='border: 1px solid black; width: 20%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemName + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyItemSize + "</td><td style='border: 1px solid black; width: 10%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyQuantity + "</td><td style='border: 1px solid black; width: 15%; font-weight: bolder; font-size: larger;font-family: Source Serif Pro,serif;'>" + bodyFinalPrice + "</td></tr></table></div></td></tr></table></div>";

                        }
                    }

                    if (bodyUserCouponCodeID) {
                        var updateCouponCodeStatus = [
                            { name: 'Query', value: 'UpdateCouponCodeStatus' },
                            { name: 'UserID', value: UserID },
                            { name: 'DiscountID', value: bodyUserCouponCodeID }
                        ]
                        await dataAccess.execute(`SP_UserDiscountDetail`, updateCouponCodeStatus);
                    }

                    var data = [
                        { name: 'Query', value: 'Insert' },
                        { name: 'OrderMasterID', value: OrderMasterResult.recordset[0].OrderMasterID },
                        { name: 'UniqueID', value: bodyUniqueID },
                        { name: 'PaymentMode', value: bodyPaymentMode },
                        { name: 'TransactionType', value: bodyPaymentMode },
                    ]
                    const result = await dataAccess.execute(`SP_PaymentDetail`, data);
                    if (result.rowsAffected == 1) {
                        return res.status(200).json({ status: 1, message: "Success", data: bodyUniqueID, error: null });
                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Not Inserted.", data: null, error: null });
                    }
                }
                else {
                    return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
                }
            }
            else {
                return res.status(500).json({ status: 0, message: "User Not Found", data: null, error: null })
            }
        } else {
            res.redirect('/CheckOut')
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];