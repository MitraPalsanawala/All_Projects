const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getAboutUsData = [async (req, res) => {
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

        const aboutUsData = await dataAccess.execute(`SP_AboutUs`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        if (aboutUsData.recordset && aboutUsData.recordset[0]) {
            // console.log("aboutUsData--->", aboutUsData.recordset)
            AboutUsData = aboutUsData.recordset;
            // console.log("bn--->", aboutUsData)
        } else {
            AboutUsData = null;
        }
        
        res.render('./Asaga/AboutUs', { title: 'AboutUs', Menutitle: 'AboutUs', CategoryData: mainCategoryData, AboutUsData: AboutUsData, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];
