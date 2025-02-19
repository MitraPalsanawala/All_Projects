const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getWishList = [async (req, res) => {
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
            var data = [
                { name: 'Query', value: "SelectAll" },
                { name: 'WishListID', value: req.body.WishListID ? req.body.WishListID : null },
                { name: 'UserID', value: req.cookies.userdata[0].UserID ? req.cookies.userdata[0].UserID : null },
            ]
            const resultWishList = await dataAccess.execute(`SP_WishList`, data);
            if (resultWishList.recordset && resultWishList.recordset[0]) {
                const wishlistdata = resultWishList.recordset;
                if (wishlistdata.length > 0) {
                    // res.status(200).json({ status: 1, message: "Success.", data: orderviewdata_, error: null });
                    res.render('./Asaga/WishList', { title: 'WishList', Menutitle: 'WishList', CategoryData: mainCategoryData, WishListData: wishlistdata, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
                } else {
                    // res.redirect('/');
                    //return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
                    res.render('./Asaga/WishList', { title: 'WishList', Menutitle: 'WishList', CategoryData: mainCategoryData, WishListData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
                }
            } else {
                //res.redirect('/');
                //return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
                res.render('./Asaga/WishList', { title: 'WishList', Menutitle: 'WishList', CategoryData: mainCategoryData, WishListData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            res.redirect('/');
            // res.render('./Asaga/OrderHistory', { title: 'OrderHistory', Menutitle: 'OrderHistory', CategoryData: mainCategoryData, OrderData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userData });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];

exports.getWishList1 = [async (req, res) => {
    try {
        await Connection.connect();
        var data = [
            { name: 'Query', value: "SelectAll" },
            { name: 'WishListID', value: req.body.WishListID ? req.body.WishListID : null },
        ]
        const resultWishList = await dataAccess.execute(`SP_WishList`, data);
        if (resultWishList.recordset && resultWishList.recordset[0]) {
            const wishlistdata = resultWishList.recordset;
            if (wishlistdata.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", data: wishlistdata, error: null });
            } else {
                return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
            }
        } else {
            return res.status(200).json({ status: 0, message: "No Data Found.", data: null, error: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];

exports.removeWishList1 = [async (req, res) => {
    try {
        if (!req.body.WishListID) {
            res.json({ status: 0, message: "Please Enter ID", data: null, error: null });
        } else {
            try {
                await Connection.connect();
                var deleteitemIMGdata = [
                    { name: 'Query', value: 'Delete' },
                    { name: 'WishListID', value: req.body.WishListID }
                ]
                const result = await dataAccess.execute(`SP_WishList`, deleteitemIMGdata);
                if (result.rowsAffected == 1) {
                    res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
                } else {
                    res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                }

            } catch (error) {
                return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
            }
        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];
exports.removeWishList = [async (req, res) => {
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
        if (req.cookies.userdata) {
            await Connection.connect();
            var deleteitemIMGdata = [
                { name: 'Query', value: 'Delete' },
                { name: 'WishListID', value: req.params.WishListID }
            ]
            const result = await dataAccess.execute(`SP_WishList`, deleteitemIMGdata);
            if (result.rowsAffected == 1) {
                //res.status(200).json({ status: 1, message: "Successfully Deleted.", data: null, error: null });
                res.render('./Asaga/WishList', { title: 'WishList', Menutitle: 'WishList', CategoryData: mainCategoryData, WishListData: '', alertMessage: 'Item Removed!', alertTitle: 'Delete', cookieData: req.cookies.userdata, ID: '' });
            } else {
                //res.status(200).json({ status: 0, message: "Not Deleted.", data: null, error: null });
                res.render('./Asaga/WishList', { title: 'WishList', Menutitle: 'WishList', CategoryData: mainCategoryData, WishListData: '', alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: '' });
            }
        } else {
            res.redirect('/');
        }
        //}
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, ItemDetail: null, error: null })
    }
}];