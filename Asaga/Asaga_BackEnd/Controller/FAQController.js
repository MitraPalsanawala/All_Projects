const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getFAQ = [async (req, res) => {
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
            { name: 'FaqID', value: req.body.FaqID ? req.body.FaqID : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const resultFaq = await dataAccess.execute(`SP_FAQ`, data);
        if (resultFaq.recordset && resultFaq.recordset[0]) {
            const faqdata = resultFaq.recordset;
            if (faqdata.length > 0) {
                res.render('./Asaga/FAQ', { title: 'FAQ', Menutitle: 'FAQ', CategoryData: mainCategoryData, FAQData: faqdata, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
                // res.status(200).json({ status: 1, message: "Success.", data: faqdata, error: null });
            } else {
                // return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
                res.render('./Asaga/FAQ', { title: 'FAQ', Menutitle: 'FAQ', CategoryData: mainCategoryData, FAQData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            // return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
            res.render('./Asaga/FAQ', { title: 'FAQ', Menutitle: 'FAQ', CategoryData: mainCategoryData, FAQData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];