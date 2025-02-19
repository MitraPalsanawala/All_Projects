const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getOrderHistory = [async (req, res) => {
    try {
        if (req.cookies.userdata) {
            await Connection.connect();
            const result = await dataAccess.execute(`SP_Banner`, [
                { name: 'Query', value: "FetchData" },
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
                { name: 'Query', value: "SelectAll2" },
                { name: 'UserID', value: req.cookies.userdata[0].UserID },
                { name: 'OrderStatus', value: 'Confirm' },
            ]
            const resultOrder = await dataAccess.execute(`SP_OrderDetail`, data);
            if (resultOrder.recordset && resultOrder.recordset[0]) {
                const orderviewdata = resultOrder.recordset;
                if (orderviewdata.length > 0) {
                    let orderviewdata_ = orderviewdata.map((e) => {
                        var e = e
                        if (e.OrderDetail != null && e.OrderDetail != undefined) {
                            e.OrderDetail = JSON.parse(e.OrderDetail)
                        } else {

                        }
                        return e
                    })
                    res.render('./Asaga/OrderHistory', { title: 'OrderHistory', Menutitle: 'OrderHistory', CategoryData: mainCategoryData, OrderData: orderviewdata_, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
                } else {
                    res.render('./Asaga/OrderHistory', { title: 'OrderHistory', Menutitle: 'OrderHistory', CategoryData: mainCategoryData, OrderData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
                }
            } else {
                res.render('./Asaga/OrderHistory', { title: 'OrderHistory', Menutitle: 'OrderHistory', CategoryData: mainCategoryData, OrderData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
            }
        } else {
            res.redirect('/Splash');
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];