const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getTermsCondition = [async (req, res) => {
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
            { name: 'TermsConditionID', value: req.body.TermsConditionID ? req.body.TermsConditionID : null },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const resultTermsCondition = await dataAccess.execute(`SP_TermsAndCondition`, data);
        if (resultTermsCondition.recordset && resultTermsCondition.recordset[0]) {
            const TermsConditiondata = resultTermsCondition.recordset;
            if (TermsConditiondata.length > 0) {
                res.render('./Asaga/TermsCondition', { title: 'TermsCondition', Menutitle: 'TermsCondition', CategoryData: mainCategoryData, TermsConditionData: TermsConditiondata, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            } else {
                res.render('./Asaga/TermsCondition', { title: 'TermsCondition', Menutitle: 'TermsCondition', CategoryData: mainCategoryData, TermsConditionData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            res.render('./Asaga/TermsCondition', { title: 'TermsCondition', Menutitle: 'TermsCondition', CategoryData: mainCategoryData, TermsConditionData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });

        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];