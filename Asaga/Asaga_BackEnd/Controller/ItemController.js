const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.getItemDetail = [async (req, res) => {
    try {
        let paramItemID = req.params.ItemID;
        let paramItemName = req.params.ItemName;

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

        const itemDetailData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectSingleItemNew" },
            { name: 'ItemID', value: paramItemID },
            { name: 'ItemName', value: paramItemName }
        ]);

        let ItemDetail;
        if (itemDetailData.recordset && itemDetailData.recordset[0]) {
            ItemDetail = itemDetailData.recordset;
        } else {
            ItemDetail = [];
        }

        const asagaSizeChart = await dataAccess.execute(`SP_AsagaSizeChart`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        let asgaSizeChart;
        if (asagaSizeChart.recordset && asagaSizeChart.recordset[0]) {
            asgaSizeChart = asagaSizeChart.recordset;
        } else {
            asgaSizeChart = [];
        }

        const fetchRelatedData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectRelatedData" },
            { name: 'ItemID', value: paramItemID }
        ]);

        let BindRelatedData;
        if (fetchRelatedData.recordset && fetchRelatedData.recordset[0]) {
            BindRelatedData = fetchRelatedData.recordset;
            //console.log("datatatatat", BindRelatedData);
        } else {
            BindRelatedData = [];
        }
        const asagaWishListItem = await dataAccess.execute(`SP_WishList`, [
            { name: 'Query', value: "CheckItemWishList" },
            { name: 'ItemID', value: paramItemID },
            { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null }
        ]);
        let asgaWishList;
        if (asagaWishListItem.recordset && asagaWishListItem.recordset[0]) {
            asgaWishList = asagaWishListItem.recordset;
        } else {
            asgaWishList = [];
        }

        var title = ItemDetail.length > 0 ? ItemDetail[0].SubCategoryName : 'asaga';
        var MenuTitle = ItemDetail.length > 0 ? ItemDetail[0].CategoryName : 'asaga';

        res.render('./Asaga/ItemDetail', { title: title, Menutitle: MenuTitle, ItemDetail: ItemDetail, CategoryData: mainCategoryData, AsagaSizeChart: asgaSizeChart, RelatedData: BindRelatedData, AsgaWishList: asgaWishList, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata, ID: paramItemID });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getItemSizeDetail = [async (req, res) => {
    try {
        let bodyItemID = req.body.ItemID;
        let bodySize = req.body.Size;

        //console.log("hjfhsdsj", req.body);
        await Connection.connect();

        const result = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
            { name: 'Query', value: "SelectItemSizeWiseStock" },
            { name: 'ItemID', value: bodyItemID },
            { name: 'Size', value: bodySize }
        ]);

        let itemSizeStockdetail;
        if (result.recordset && result.recordset[0]) {
            itemSizeStockdetail = result.recordset;
        } else {
            itemSizeStockdetail = [];
        }
        return res.status(200).json({ status: 1, message: 'Success', Data: itemSizeStockdetail, error: null })
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.getItemData = [async (req, res) => {
    try {
        const pageSize = 1000;//2;
        const page = req.params.NextPage || 1;
        const offset = (page - 1) * pageSize;

        let bodySubCategoryID = req.params.SubCategoryID;

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

        const resultitemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectSubCategoryWiseItem" },
            { name: 'SubCategoryID', value: bodySubCategoryID },
            { name: 'OFFSET', value: offset },
            { name: 'Limit', value: pageSize }
        ]);

        let itemData;
        let total = 1;
        let pages = 1;

        if (resultitemData.recordset && resultitemData.recordset[0]) {
            //console.log("resultitemData.recordset------>", resultitemData.recordset[0].ItemCount);
            itemData = resultitemData.recordset;
            total = resultitemData.recordset[0].ItemCount;
            pages = Math.ceil(total / pageSize);

        } else {
            itemData = [];
        }

        //console.log("itemDataadas------>", itemData);

        var title = itemData.length > 0 ? itemData[0].SubCategoryName : 'asaga';
        var MenuTitle = itemData.length > 0 ? itemData[0].CategoryName : 'asaga';
        res.render('./Asaga/Item', { title: title, Menutitle: MenuTitle, CategoryData: mainCategoryData, ItemData: itemData, currentPage: page, pages: pages, alertMessage: '', alertTitle: 'Success', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.getPaginationItemData = [async (req, res) => {
    try {
        const pageSize = 12;
        const page = 1;
        const offset = (page - 1) * pageSize;
        let bodySubCategoryID = req.params.SubCategoryID;
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

        const resultitemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectSubCategoryWiseItem" },
            { name: 'SubCategoryID', value: bodySubCategoryID },
            { name: 'OFFSET', value: offset },
            { name: 'Limit', value: pageSize }
        ]);

        let itemData;
        let total = 1;
        let pages = 1;

        if (resultitemData.recordset && resultitemData.recordset[0]) {
            //console.log("resultitemData.recordset------>", resultitemData.recordset[0].ItemCount);
            itemData = resultitemData.recordset;
            total = resultitemData.recordset[0].ItemCount;
            pages = Math.ceil(total / pageSize);
            //console.log("itemData------>", itemData);
        } else {
            itemData = [];
        }
        res.render('./Asaga/Item', { title: 'Home', Menutitle: 'Home', CategoryData: mainCategoryData, ItemData: itemData, currentPage: page, pages: pages, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null })
    }
}];

exports.SelectItemName = [async (req, res) => {
    try {
        await Connection.connect();
        var ItemName = req.body.ItemName ? req.body.ItemName : ''
        var Color = req.body.Color ? req.body.Color : ''
        var SearchItem = req.body.SearchItem ? req.body.SearchItem : ''
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
        await Connection.connect();
        var data = [
            { name: 'Query', value: "SelectItemName" },
            { name: 'ItemID', value: req.body.ItemID ? req.body.ItemID : null },
            { name: 'ItemName', value: ItemName },
            { name: 'Color', value: Color },
            { name: 'SearchItem', value: SearchItem },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false },
        ]
        const Itemresult = await dataAccess.execute(`SP_Item`, data);
        if (Itemresult.recordset && Itemresult.recordset[0]) {
            const itemData = Itemresult.recordset;
            if (itemData.length > 0) {
                res.render('./Asaga/ItemName', { title: 'ItemName', Menutitle: 'ItemName', CategoryData: mainCategoryData, ItemData: itemData, alertTitle: '', alertMessage: '', cookieData: req.cookies.userdata, SearchData: req.body.SearchItem });
            } else {
                res.render('./Asaga/ItemName', { title: 'ItemName', Menutitle: 'ItemName', CategoryData: mainCategoryData, ItemData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.userdata, SearchData: req.body.SearchItem });
            }
        } else {
            res.render('./Asaga/ItemName', { title: 'ItemName', Menutitle: 'ItemName', CategoryData: mainCategoryData, ItemData: '', alertTitle: '', alertMessage: '', cookieData: req.cookies.userdata, SearchData: req.body.SearchItem });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.ItemAddWishListOLD = [async (req, res) => {
    try {
        await Connection.connect();
        const bodyItemID = req.params.ItemID;
        let ItemDetail;
        let asgaSizeChart;
        let BindRelatedData;
        let title;
        let MenuTitle;
        let asgaWishList;
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
            const itemDetailData = await dataAccess.execute(`SP_Item`, [
                { name: 'Query', value: "SelectSingleItem" },
                { name: 'ItemID', value: bodyItemID }
            ]);

            if (itemDetailData.recordset && itemDetailData.recordset[0]) {
                ItemDetail = itemDetailData.recordset;
            } else {
                ItemDetail = [];
            }

            const asagaSizeChart = await dataAccess.execute(`SP_AsagaSizeChart`, [
                { name: 'Query', value: "SelectAll" }
            ]);


            if (asagaSizeChart.recordset && asagaSizeChart.recordset[0]) {
                asgaSizeChart = asagaSizeChart.recordset;
            } else {
                asgaSizeChart = [];
            }

            const fetchRelatedData = await dataAccess.execute(`SP_Item`, [
                { name: 'Query', value: "SelectRelatedData" },
                { name: 'ItemID', value: bodyItemID }
            ]);

            if (fetchRelatedData.recordset && fetchRelatedData.recordset[0]) {
                BindRelatedData = fetchRelatedData.recordset;
            } else {
                BindRelatedData = [];
            }

            title = ItemDetail.length > 0 ? ItemDetail[0].SubCategoryName : 'asaga';
            MenuTitle = ItemDetail.length > 0 ? ItemDetail[0].CategoryName : 'asaga';

            const asagaWishListItem = await dataAccess.execute(`SP_WishList`, [
                { name: 'Query', value: "CheckItemWishList" },
                { name: 'ItemID', value: bodyItemID },
                { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null }
            ]);

            if (asagaWishListItem.recordset && asagaWishListItem.recordset[0]) {
                asgaWishList = asagaWishListItem.recordset;
            } else {
                asgaWishList = [];
            }
            var data = [
                { name: 'Query', value: 'Insert' },
                { name: 'ItemID', value: bodyItemID ? bodyItemID : null },
                { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null },
            ]
            const result = await dataAccess.execute(`SP_WishList`, data);
            res.render('./Asaga/ItemDetail', { title: title, Menutitle: MenuTitle, ItemDetail: ItemDetail, CategoryData: mainCategoryData, AsagaSizeChart: asgaSizeChart, RelatedData: BindRelatedData, AsgaWishList: asgaWishList, alert: true, alertTitle: 'Item Add Successfully!', alertMessage: '', cookieData: req.cookies.userdata, ID: bodyItemID });
        } else {
            res.render('./Asaga/ItemDetail', { title: title, Menutitle: MenuTitle, ItemDetail: '', CategoryData: mainCategoryData, AsagaSizeChart: '', RelatedData: BindRelatedData, AsgaWishList: '', alert: true, alertTitle: 'Please Login', alertMessage: '', cookieData: '', ID: '' });

        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.ItemAddWishList = [async (req, res) => {
    try {
        await Connection.connect();
        const bodyItemID = req.params.ItemID;
        let ItemDetail;
        let asgaSizeChart;
        let BindRelatedData;
        let title;
        let MenuTitle;
        let asgaWishList;
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
        // if (req.cookies.userdata) {
        const itemDetailData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectSingleItem" },
            { name: 'ItemID', value: bodyItemID }
        ]);

        if (itemDetailData.recordset && itemDetailData.recordset[0]) {
            ItemDetail = itemDetailData.recordset;
        } else {
            ItemDetail = [];
        }

        const asagaSizeChart = await dataAccess.execute(`SP_AsagaSizeChart`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        if (asagaSizeChart.recordset && asagaSizeChart.recordset[0]) {
            asgaSizeChart = asagaSizeChart.recordset;
        } else {
            asgaSizeChart = [];
        }

        const fetchRelatedData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectRelatedData" },
            { name: 'ItemID', value: bodyItemID }
        ]);

        if (fetchRelatedData.recordset && fetchRelatedData.recordset[0]) {
            BindRelatedData = fetchRelatedData.recordset;
        } else {
            BindRelatedData = [];
        }

        title = ItemDetail.length > 0 ? ItemDetail[0].SubCategoryName : 'asaga';
        MenuTitle = ItemDetail.length > 0 ? ItemDetail[0].CategoryName : 'asaga';

        const asagaWishListItem = await dataAccess.execute(`SP_WishList`, [
            { name: 'Query', value: "CheckItemWishList" },
            { name: 'ItemID', value: bodyItemID },
            { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null }
        ]);

        if (asagaWishListItem.recordset && asagaWishListItem.recordset[0]) {
            asgaWishList = asagaWishListItem.recordset;
        } else {
            asgaWishList = [];
        }
        var data = [
            { name: 'Query', value: 'Insert' },
            { name: 'ItemID', value: bodyItemID ? bodyItemID : null },
            { name: 'UserID', value: req.cookies.userdata ? req.cookies.userdata[0].UserID : null },
        ]
        console.log("===========data==========", data)
        const result2 = await dataAccess.execute(`SP_WishList`, data);

        if (req.cookies.userdata) {
            res.render('./Asaga/ItemDetail', { title: title, Menutitle: MenuTitle, ItemDetail: ItemDetail, CategoryData: mainCategoryData, AsagaSizeChart: asgaSizeChart, RelatedData: BindRelatedData, AsgaWishList: asgaWishList, alert: true, alertTitle: 'Product Add To Wishlist', alertMessage: 'Product Add To Wishlist', cookieData: req.cookies.userdata, ID: bodyItemID });
        } else {
            res.render('./Asaga/ItemDetail', { title: title, Menutitle: MenuTitle, ItemDetail: ItemDetail, CategoryData: mainCategoryData, AsagaSizeChart: '', RelatedData: BindRelatedData, AsgaWishList: '', alert: true, alertTitle: 'Please login to save your wishlist across devices.', alertMessage: 'Please login to save your wishlist across devices.', cookieData: '', ID: bodyItemID });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.CheckItemWishList = [async (req, res) => {
    try {
        await Connection.connect();
        const result = await dataAccess.execute(`SP_WishList`, [
            { name: 'Query', value: "CheckItemWishList" },
            { name: 'ItemID', value: req.body.ItemID ? req.body.ItemID : null },
            { name: 'UserID', value: req.body.UserID ? req.body.UserID : null }
        ]);

        const wishlistdata = result.recordset;
        if (result.recordset) {
            if (wishlistdata.length > 0) {
            }
            else {
                console.log("No Data")
            }
            res.status(200).json({ status: 1, message: "Success.", data: wishlistdata, error: null });
        }
        else {
            res.status(200).json({ status: 1, message: "Success.", data: null, error: null });
        }
    } catch (error) {

    }
}];

exports.FilterData1_Old = [async (req, res) => {
    try {
        var ItemASC, ItemDESC, AmountASC, AmountDESC;
        await Connection.connect();
        let bodySubCategoryID = req.params.SubCategoryID;
        if (req.params.filterdata == 'ItemASC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'ItemName' },
                { name: 'SortDirection', value: 'ASC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]

        } else if (req.params.filterdata == 'ItemDESC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'ItemName' },
                { name: 'SortDirection', value: 'DESC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]
        } else if (req.params.filterdata == 'AmountASC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'Amount' },
                { name: 'SortDirection', value: 'ASC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]
        } else if (req.params.filterdata == 'AmountDESC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'Amount' },
                { name: 'SortDirection', value: 'DESC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
            ]
        } else {
        }
        const result = await dataAccess.execute(`SP_Item`, data);
        if (result.recordset && result.recordset[0]) {
            const ItemData = result.recordset;
            if (ItemData.length > 0) {
                res.status(200).json({ status: 1, message: "Success.", ItemData: ItemData, error: null });
            } else {
                return res.status(200).json({ status: 0, message: "No Data Found.", ItemData: null, error: null })
            }
        } else {
            return res.status(200).json({ status: 0, message: "No Data Found.", ItemData: null, error: null })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.FilterData1 = [async (req, res) => {
    try {
        const pageSize = 8;
        const page = req.params.NextPage || 1;
        const offset = (page - 1) * pageSize;
        await Connection.connect();
        let bodySubCategoryID = req.params.SubCategoryID;
        if (req.params.filterdata == 'ItemASC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'ItemName' },
                { name: 'SortDirection', value: 'ASC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
                { name: 'OFFSET', value: offset },
                { name: 'Limit', value: pageSize }
            ]

        } else if (req.params.filterdata == 'ItemDESC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'ItemName' },
                { name: 'SortDirection', value: 'DESC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
                { name: 'OFFSET', value: offset },
                { name: 'Limit', value: pageSize }
            ]
        } else if (req.params.filterdata == 'AmountASC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'Amount' },
                { name: 'SortDirection', value: 'ASC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
                { name: 'OFFSET', value: offset },
                { name: 'Limit', value: pageSize }
            ]
        } else if (req.params.filterdata == 'AmountDESC') {
            var data = [
                { name: 'Query', value: "FilterItem" },
                { name: 'SortColumn', value: 'Amount' },
                { name: 'SortDirection', value: 'DESC' },
                { name: 'SubCategoryID', value: bodySubCategoryID },
                { name: 'IsActive', value: true },
                { name: 'IsDelete', value: false },
                { name: 'OFFSET', value: offset },
                { name: 'Limit', value: pageSize }
            ]
        } else {
            console.log("----Wrong----")
        }
        let itemData;
        let total = 1;
        let pages = 1;
        const resultitemData = await dataAccess.execute(`SP_Item`, data);
        if (resultitemData.recordset && resultitemData.recordset[0]) {
            itemData = resultitemData.recordset;
            total = resultitemData.recordset[0].ItemCount;
            pages = Math.ceil(total / pageSize);
        } else {
            itemData = [];
        }
        res.status(200).json({ status: 1, message: "Success.", FetchFilter: itemData, currentPage: page, pages: pages, pageSize: pageSize, error: null });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];

exports.ItemNameTest = [async (req, res) => {
    try {
        const pageSize = 1000;//2;
        const page = req.params.NextPage || 1;
        const offset = (page - 1) * pageSize;
        let bodySubCategoryID = req.params.SubCategoryID;
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

        const resultitemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectSubCategoryWiseItem" },
            { name: 'SubCategoryID', value: bodySubCategoryID },
            { name: 'OFFSET', value: offset },
            { name: 'Limit', value: pageSize }
        ]);

        let itemData;
        let total = 1;
        let pages = 1;

        if (resultitemData.recordset && resultitemData.recordset[0]) {
            itemData = resultitemData.recordset;
            total = resultitemData.recordset[0].ItemCount;
            pages = Math.ceil(total / pageSize);
        } else {
            itemData = [];
        }
        var title = itemData.length > 0 ? itemData[0].SubCategoryName : 'asaga';
        var MenuTitle = itemData.length > 0 ? itemData[0].CategoryName : 'asaga';
        res.render('./Asaga/NewItem', { title: title, Menutitle: MenuTitle, CategoryData: mainCategoryData, ItemData: itemData, currentPage: page, pages: pages, alertMessage: '', alertTitle: 'Success', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, Data: null, error: null })
    }
}];