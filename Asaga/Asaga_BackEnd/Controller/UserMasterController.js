const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
const helper = require('../helpers/utility.js');
const CryptoJS = require("crypto-js");
const axios = require('axios');
var request = require('request');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL

const LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

exports.getUserRegister = [async (req, res) => {
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
        // res.render('./Asaga/Registration', { title: 'Registration' });
        res.render('./Asaga/Registration', { title: 'Registration', Menutitle: 'Registration', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.setUserRegister = [async (req, res) => {
    try {
        await Connection.connect();
        const bodyFirstName = req.body.FirstName;
        const bodyMiddleName = req.body.MiddleName;
        const bodyLastName = req.body.LastName;
        // const bodyUserName = req.body.UserName;
        const bodyPassword = req.body.Password;
        const bodyMobileNo = req.body.MobileNo;
        const bodyEmailID = req.body.EmailID;
        var pwd = helper.generatePassword(6);
        var originalText = CryptoJS.AES.encrypt(pwd, process.env.SEC_CODE).toString();
        var data = [
            //Query,
            { name: 'Query', value: 'Insert' },
            // { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'FirstName', value: bodyFirstName ? bodyFirstName : null },
            { name: 'MiddleName', value: bodyMiddleName ? bodyMiddleName : null },
            { name: 'LastName', value: bodyLastName ? bodyLastName : null },
            // { name: 'UserName', value: bodyUserName ? bodyUserName : null },
            // { name: 'Password', value: originalText ? originalText : null },
            { name: 'Password', value: bodyPassword ? bodyPassword : null },
            { name: 'MobileNo', value: bodyMobileNo ? bodyMobileNo : null },
            { name: 'EmailID', value: bodyEmailID ? bodyEmailID : null },
            { name: 'UserActivationStatus', value: 'Yes' },
            { name: 'RegistrationType', value: 'Panel' },
        ]
        await Connection.connect();
        const result = await dataAccess.execute(`SP_UserMaster`, data);
        var bindData = result.recordset;
        var userid = bindData[0].UserID;
        var UID = Buffer.from(userid).toString('base64');
        if (result.rowsAffected == 1) {
            res.render('./Asaga/Registration', { title: 'Registration', Menutitle: 'Registration', CategoryData: '', Registration: '', alertTitle: 'Success', alertMessage: 'Successfully Registartion', cookieData: '' });
        }
        else {
            res.render('./Asaga/Registration', { title: 'Registration', Menutitle: 'Registration', CategoryData: '', Registration: '', alertTitle: 'Success', alertMessage: 'Successfully Registartion', cookieData: '' });
        }
        //}
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.getUserLogin = [async (req, res) => {
    try {
        //* Activation Status Update */
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);
        let mainCategoryData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }
        if (!req.params.UserID) {
            res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });
        } else {
            try {
                await Connection.connect();
                var logoutupdatedata = [
                    { name: 'Query', value: 'UpdateUserActivationStatus' },
                    { name: 'LogInStatus', value: 'LogIn' },
                    { name: 'UserActivationStatus', value: 'Yes' },
                    { name: 'UserID', value: req.params.UserID }
                ]
                const LogoutResult = await dataAccess.execute(`SP_UserMaster`, logoutupdatedata);
                if (LogoutResult.rowsAffected == 1) {
                    res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });
                }
                else {
                    res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });
                }
            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null })
    }
}];

exports.setUserLogin = [async (req, res) => {
    try {
        var Bind_UserID;
        var Bind_ItemID;
        var Bind_Quantity;
        var Bind_Color;
        var Bind_Size;
        await Connection.connect();
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);
        let mainCategoryData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }

        var bodyEmailID = req.body.EmailID;
        var bodyPassword = req.body.Password;
        var userdata = [];
        await Connection.connect();
        try {
            var checkEmailID = [
                { name: 'Query', value: 'CheckEmailAndPassword' },
                { name: 'EmailID', value: bodyEmailID },
                { name: 'IsDelete', value: '1' },
            ]
            const CheckEmailResult = await dataAccess.execute(`SP_UserMaster`, checkEmailID);
            const Emaildata = CheckEmailResult.recordset;
            if (!Emaildata.length > 0) {
                res.render('./Asaga/UserLogIn', { title: '0', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'EmailID Is Wrong!', alertTitle: 'Invalid', cookieData: '' });
            } else {
                var checkPassword = [
                    { name: 'Query', value: 'CheckEmailAndPassword' },
                    { name: 'Password', value: bodyPassword },
                    { name: 'IsDelete', value: '1' },
                ]
                const CheckPasswordResult = await dataAccess.execute(`SP_UserMaster`, checkPassword);
                const Passworddata = CheckPasswordResult.recordset;

                if (!Passworddata.length > 0) {
                    res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'Password Is Wrong!', alertTitle: 'Invalid', cookieData: '' });
                } else {
                    var data = [
                        { name: 'Query', value: 'UserLogin' },
                        { name: 'EmailID', value: bodyEmailID },
                        { name: 'Password', value: bodyPassword },
                    ]
                    const result = await dataAccess.execute(`SP_UserMaster`, data);
                    if (result.recordset && result.recordset[0]) {
                        const bindData = result.recordset;
                        if (bindData.length > 0) {
                            if (bindData[0].UserActivationStatus == 'No') {
                                res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'User Is InActive!', alertTitle: 'Invalid', cookieData: '' });
                            } else {
                                userdata.push({
                                    UserID: bindData[0].UserID,
                                    EmailID: bindData[0].EmailID,
                                    Password: bindData[0].Password,
                                    FirstName: bindData[0].FirstName,
                                    MiddleName: bindData[0].MiddleName,
                                    LastName: bindData[0].LastName
                                })
                                res.cookie("userdata", userdata, {
                                    maxAge: 1000 * 3600 // 1 hour
                                });
                                let localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
                                for (let i = 0; i < localStoragecart.length; i++) {
                                    Bind_UserID = bindData[0].UserID
                                    Bind_ItemID = localStoragecart[i].ItemID
                                    Bind_Quantity = localStoragecart[i].Qty
                                    Bind_Color = localStoragecart[i].Color
                                    Bind_Size = localStoragecart[i].Size
                                    // }
                                    var options = {
                                        'method': 'POST',
                                        'url': `${base_url}setCart`,
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "UserID": Bind_UserID,
                                            "ItemID": Bind_ItemID,
                                            "Quantity": Bind_Quantity,
                                            "Color": Bind_Color,
                                            "Size": Bind_Size
                                        })
                                    };
                                    request(options, function (error, response) {
                                        if (error) {
                                        } else {
                                            var data = response.body
                                            if (!data) { return }
                                            data = JSON.parse(data)
                                        }
                                    });
                                }
                                res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'Successfully Login!', alertTitle: 'Success', cookieData: userdata });
                            }
                        } else {
                            res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });
                        }
                    } else {
                        res.render('./Asaga/UserLogIn', { title: 'UserLogIn', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: '', alertTitle: '', cookieData: '' });
                    }
                }
            }
        } catch (error) {
            return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.CheckEmailID = [async (req, res) => {
    try {
        var ChkEmailID = [
            { name: 'Query', value: 'CheckUserEmailID' },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null },
            { name: 'EmailID', value: req.body.EmailID },
            { name: 'IsDelete', value: '1' },
        ]
        await Connection.connect();
        const CheckemailIDNoResult = await dataAccess.execute(`SP_UserMaster`, ChkEmailID);
        const emailIDnodata = CheckemailIDNoResult.recordset;
        if (emailIDnodata.length > 0) {
            return res.status(200).json({ status: 0, Message: "Email ID Already Exist", data: null });
        } else {
            return res.status(200).json({ status: 1, Message: "true", data: null });
        }
    } catch (err) {
        return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.CheckEmailLogIN = [async (req, res) => {
    try {
        var checkEmail = [
            { name: 'Query', value: 'CheckEmailAndPassword' },
            { name: 'EmailID', value: req.body.EmailID },
            { name: 'IsDelete', value: '1' },
        ]
        const CheckEmailResult = await dataAccess.execute(`SP_UserMaster`, checkEmail);
        const emaildata = CheckEmailResult.recordset;
        if (emaildata.length > 0) {
            return res.status(200).json({ status: 1, Message: "true", data: null });
        } else {
            return res.status(200).json({ status: 0, Message: "EmailID IS Wrong", data: null });
        }
    } catch (err) {
        return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.CheckPasswordData = [async (req, res) => {
    try {
        var checkPassword = [
            { name: 'Query', value: 'CheckEmailAndPassword' },
            { name: 'EmailID', value: req.body.EmailID },
            { name: 'Password', value: req.body.Password },
            { name: 'IsDelete', value: '1' },
        ]
        const CheckpasswordResult = await dataAccess.execute(`SP_UserMaster`, checkPassword);
        const passworddata = CheckpasswordResult.recordset;
        if (passworddata.length > 0) {
            return res.status(200).json({ status: 1, Message: "true", data: null });
        } else {
            return res.status(200).json({ status: 0, Message: "EmailID IS Wrong", data: null });
        }
        // }
    } catch (err) {
        return res.status(500).json({ status: 0, Message: err.message, data: null });
    }
}];

exports.LogOut = [async (req, res) => {
    try {
        res.clearCookie("userdata");
        res.redirect('/');
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.ForgotPasswordLogIn = [async (req, res) => {
    try {

        await Connection.connect();
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);
        let mainCategoryData;
        if (result.recordset && result.recordset[0]) {
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }

        var EmailMsgDraft = '';
        var mailSubject = 'Forgot Password';
        var checkEmailID = [
            { name: 'Query', value: 'CheckUserEmailID' },
            { name: 'EmailID', value: req.body.EmailID },
            { name: 'IsDelete', value: '1' },
        ]
        await Connection.connect();
        const CheckEmailIDResult = await dataAccess.execute(`SP_UserMaster`, checkEmailID);
        const EmailIDdata = CheckEmailIDResult.recordset;
        if (!EmailIDdata.length > 0) {
            res.render('./Asaga/UserLogIn', { title: '0', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'EmailID Is Wrong!', alertTitle: 'Invalid', cookieData: '' });
        } else {
            if (EmailIDdata[0].UserActivationStatus == 'No') {
                res.render('./Asaga/UserLogIn', { title: '0', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'User Not Registered!', alertTitle: 'Invalid', cookieData: '' });
            } else {
                EmailMsgDraft += '<h1>Asaga</h1><p style="font-weight:bold;">Forgot your Password</p><p>Hi, Your forgotten password is  ' + EmailIDdata[0].Password + '</p><span style="font-weight:bold;">'
                helper.SendMail(req.body.EmailID, mailSubject, EmailMsgDraft);
                res.render('./Asaga/UserLogIn', { title: '0', Menutitle: 'UserLogIn', CategoryData: mainCategoryData, Registration: '', alertMessage: 'Please Check Your Email', alertTitle: 'Success', cookieData: '' });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.SubscribeMail = [async (req, res) => {
    try {
        await Connection.connect();
        const bodyEmailID = req.body.EmailID;
        const bodyPassword = req.body.Password;
        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let bannerData, mainCategoryData, itemData, AboutUsData, bestSellerData, random1Data, random2Data;
        if (result.recordset && result.recordset[0]) {
            bannerData = result.recordset[0].BannerData.split('~');
            mainCategoryData = result.recordset[0].CategoryData.split('~');
        } else {
            bannerData = null;
            mainCategoryData = null;
        }

        const ItemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectItemData" }
        ]);

        if (ItemData.recordset && ItemData.recordset[0]) {
            itemData = ItemData.recordset;
        } else {
            itemData = null;
        }

        const aboutUsData = await dataAccess.execute(`SP_AboutUs`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        if (aboutUsData.recordset && aboutUsData.recordset[0]) {
            AboutUsData = aboutUsData.recordset;
        } else {
            AboutUsData = null;
        }

        const BestSellerData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectBestSellerCategoryData" }
        ]);

        if (BestSellerData.recordset && BestSellerData.recordset[0]) {
            bestSellerData = BestSellerData.recordset;
        } else {
            bestSellerData = [];
        }

        const Random1ItemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectRandom1Item" }
        ]);

        if (Random1ItemData.recordset && Random1ItemData.recordset[0]) {
            random1Data = Random1ItemData.recordset;
        } else {
            random1Data = [];
        }

        const Random2ItemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectRandom2Item" }
        ]);

        if (Random2ItemData.recordset && Random2ItemData.recordset[0]) {
            random2Data = Random2ItemData.recordset;
        } else {
            random2Data = [];
        }

        var bodypwd = Math.floor(1000 + Math.random() * 9000);

        var data = [
            //Query,
            { name: 'Query', value: 'Insert' },
            { name: 'Password', value: bodypwd ? bodypwd : null },
            { name: 'EmailID', value: bodyEmailID ? bodyEmailID : null },
            { name: 'RegistrationType', value: 'Panel' },
        ]
        const result1 = await dataAccess.execute(`SP_UserMaster`, data);
        res.render('./Asaga/Splash', {
            title: 'Splash', Menutitle: 'Spalsh', BannerData: bannerData, CategoryData: mainCategoryData, ItemData: itemData, AboutUsData: AboutUsData, BestSellerData: bestSellerData, Random1ItemData: random1Data, Random2ItemData: random2Data,
            alertMessage: 'SubscribeEmailSuccess', alertTitle: 'Success', cookieData: req.cookies.userdata
        });

        //res.render('./Asaga/Splash', { title: 'Splash', Menutitle: 'Splash', CategoryData: '', Registration: '', cookieData: '' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

//--------------------------------User Address Detail------------------//

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

exports.GetUserProfileDetail = [async (req, res) => {
    try {
        if (req.cookies.userdata) {
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Banner`, [
                { name: 'Query', value: "FetchData2" },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false }
            ]);

            let mainCategoryData;
            if (result.recordset && result.recordset[0]) {
                mainCategoryData = result.recordset[0].CategoryData.split('~');
            } else {
                bannerData = null;
                mainCategoryData = null;
            }
            let Country = "India";
            let URL = "https://countriesnow.space/api/v0.1/countries/states";

            const payload = { country: Country };
            const response = await axios.post(URL, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const responseDataArray = Object.values(response.data);
            let stateData = responseDataArray[2].states;
            var data = [
                { name: 'Query', value: "SelectAll" },
                { name: 'UserAddressID', value: req.body.UserAddressID ? req.body.UserAddressID : null },
                { name: 'UserID', value: req.cookies.userdata[0].UserID ? req.cookies.userdata[0].UserID : null },
            ]
            const resultUserAddressData = await dataAccess.execute(`SP_UserAddressDetail`, data);
            if (resultUserAddressData.recordset && resultUserAddressData.recordset[0]) {
                const UserAddressData = resultUserAddressData.recordset;
                if (UserAddressData.length > 0) {
                    res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: mainCategoryData, FetchData: '', StateData: stateData, UserAddressData: UserAddressData, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
                } else {
                    res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: mainCategoryData, FetchData: '', StateData: stateData, UserAddressData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
                }
            } else {
                res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: mainCategoryData, StateData: stateData, UserAddressData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, FetchData: '' });
            }
        } else {
            res.redirect('/');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.SetUserProfileDetail = [async (req, res) => {
    try {
        await Connection.connect();
        const bodyFirstName = req.body.FirstName;
        const bodyMiddleName = req.body.MiddleName;
        const bodyLastName = req.body.LastName;
        const bodyMobileNo = req.body.MobileNo;
        const bodyCompany = req.body.Company;
        const bodyAddress1 = req.body.Address1;
        const bodyAddress2 = req.body.Address2;
        var bodyCountry = req.body.txtCountryName;
        var bodyState = req.body.ddlState;
        var bodyCityData = req.body.ddlCity;
        const bodyPincode = req.body.Pincode;
        const bodyEmailID = req.body.EmailID;
        if (!req.body.UserAddressID) {
            var data = [
                //Query,
                { name: 'Query', value: 'Insert' },
                { name: 'UserAddressID', value: req.body.UserAddressID ? req.body.UserAddressID : null },
                { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null },
                { name: 'FirstName', value: bodyFirstName ? bodyFirstName : null },
                { name: 'MiddleName', value: bodyMiddleName ? bodyMiddleName : null },
                { name: 'LastName', value: bodyLastName ? bodyLastName : null },
                { name: 'MobileNo', value: bodyMobileNo ? bodyMobileNo : null },
                { name: 'Company', value: bodyCompany ? bodyCompany : null },
                { name: 'Address1', value: bodyAddress1 ? bodyAddress1 : null },
                { name: 'Address2', value: bodyAddress2 ? bodyAddress2 : null },
                { name: 'CountryName', value: bodyCountry ? bodyCountry : null },
                { name: 'StateName', value: bodyState ? bodyState : null },
                { name: 'CityName', value: bodyCityData ? bodyCityData : null },
                { name: 'Pincode', value: bodyPincode ? bodyPincode : null },
                { name: 'EmailID', value: bodyEmailID ? bodyEmailID : null }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_UserAddressDetail`, data);
            res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: '', StateData: '', FetchData: '', UserAddressData: '', alertMessage: 'Profile Save!', alertTitle: 'Success', cookieData: req.cookies.userdata });
        } else {
            var data = [
                //Query,
                { name: 'Query', value: 'Insert' ? 'Update' : '' },
                { name: 'UserAddressID', value: req.body.UserAddressID ? req.body.UserAddressID : null },
                { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null },
                { name: 'FirstName', value: bodyFirstName ? bodyFirstName : null },
                { name: 'MiddleName', value: bodyMiddleName ? bodyMiddleName : null },
                { name: 'LastName', value: bodyLastName ? bodyLastName : null },
                { name: 'MobileNo', value: bodyMobileNo ? bodyMobileNo : null },
                { name: 'Company', value: bodyCompany ? bodyCompany : null },
                { name: 'Address1', value: bodyAddress1 ? bodyAddress1 : null },
                { name: 'Address2', value: bodyAddress2 ? bodyAddress2 : null },
                { name: 'CountryName', value: bodyCountry ? bodyCountry : null },
                { name: 'StateName', value: bodyState ? bodyState : null },
                { name: 'CityName', value: bodyCityData ? bodyCityData : null },
                { name: 'Pincode', value: bodyPincode ? bodyPincode : null },
                { name: 'EmailID', value: bodyEmailID ? bodyEmailID : null }
            ]
            await Connection.connect();
            const result = await dataAccess.execute(`SP_UserAddressDetail`, data);
            res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: '', StateData: '', FetchData: '', UserAddressData: '', alertMessage: 'Profile Save!', alertTitle: 'Success', cookieData: req.cookies.userdata });


        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.FindbyIDUserAddress = [async (req, res) => {
    try {
        if (req.cookies.userdata) {

            let Country = "India";
            let URL = "https://countriesnow.space/api/v0.1/countries/states";

            const payload = { country: Country };
            const response = await axios.post(URL, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const responseDataArray = Object.values(response.data);
            let stateData = responseDataArray[2].states;
            await Connection.connect();
            const result = await dataAccess.execute(`SP_UserAddressDetail`, [
                { name: 'Query', value: "SelectAll" },
                // { name: 'IsActive', value: "true" },
                { name: 'UserAddressID', value: req.params.UserAddressID },
                // { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata : '' }
            ]);
            const useraddressdata = result.recordset;
            if (result.recordset) {
                if (useraddressdata.length > 0) {
                }
                else {
                    console.log("No Data")
                }
                // res.status(200).json({ status: 1, message: "Success.", data: categorydata, error: null });
                res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: '', StateData: stateData, FetchData: useraddressdata, UserAddressData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

            }
            else {
                // res.status(200).json({ status: 1, message: "Success.", data: null, error: null });
                res.render('./Asaga/UserProfile', { title: 'UserProfile', Menutitle: 'UserProfile', CategoryData: '', StateData: stateData, FetchData: '', UserAddressData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

            }


        } else {
            res.redirect('/');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];