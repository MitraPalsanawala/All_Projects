const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getRefundPolicy = [async (req, res) => {
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
            { name: 'RefundPolicyID', value: req.body.RefundPolicyID ? req.body.RefundPolicyID : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const resultRefundPolicy = await dataAccess.execute(`SP_RefundPolicy`, data);
        if (resultRefundPolicy.recordset && resultRefundPolicy.recordset[0]) {
            const RefundPolicydata = resultRefundPolicy.recordset;
            if (RefundPolicydata.length > 0) {
                res.render('./Asaga/RefundPolicy', { title: 'RefundPolicy', Menutitle: 'RefundPolicy', CategoryData: mainCategoryData, RefundPolicyData: RefundPolicydata, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            } else {
                res.render('./Asaga/RefundPolicy', { title: 'RefundPolicy', Menutitle: 'RefundPolicy', CategoryData: mainCategoryData, RefundPolicyData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            res.render('./Asaga/RefundPolicy', { title: 'RefundPolicy', Menutitle: 'RefundPolicy', CategoryData: mainCategoryData, RefundPolicyData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];