const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')


exports.getContactUs = [async (req, res) => {
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
        var data = [
            { name: 'Query', value: "SelectAll" },
            // { name: 'ContactUsID', value: req.body.ContactUsID ? req.body.ContactUsID : null },
            // { name: 'IsActive', value: true },
            // { name: 'IsDelete', value: false },
        ]
        const resultContactUs = await dataAccess.execute(`SP_ContactUs`, data);
        if (resultContactUs.recordset && resultContactUs.recordset[0]) {
            const ContactUsdata = resultContactUs.recordset;
            if (ContactUsdata.length > 0) {
                res.render('./Asaga/ContactUs', { title: 'ContactUs', Menutitle: 'ContactUs', CategoryData: mainCategoryData, ContactUsData: ContactUsdata, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
                // res.status(200).json({ status: 1, message: "Success.", data: ContactUsdata, error: null });
            } else {
                // return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
                res.render('./Asaga/ContactUs', { title: 'ContactUs', Menutitle: 'ContactUs', CategoryData: mainCategoryData, ContactUsData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            // return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
            res.render('./Asaga/ContactUs', { title: 'ContactUs', Menutitle: 'ContactUs', CategoryData: mainCategoryData, ContactUsData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];