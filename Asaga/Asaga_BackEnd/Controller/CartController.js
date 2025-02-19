const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')
var request = require('request');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL

const LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

exports.setCartData = [async (req, res) => {
    try {
        const bodyItemID = req.body.txtItemID;
        const bodyQty = req.body.txtquantity;
        const bodySize = req.body.ItemSize;
        const bodyAmount = req.body.txtActualPrice;
        const bodyColor = req.body.txtColor

        // Generate a unique identifier for the user's browser
        const browserId = req.cookies.browserId

        // Get the user's cart data from local storage
        const localStoragecart = localStorage.getItem(`cart_${browserId}`);
        // Add an item to the user's cart
        const ItemID = bodyItemID;
        const Size = bodySize;
        const Qty = parseInt(bodyQty);
        const ItemAmount = bodyAmount;
        const Color = bodyColor;
        const storageID = { browserId_ItemID_Size: browserId + "_" + ItemID + "_" + Size, browserId: browserId, ItemID: ItemID, Size: Size, Qty: Qty, ItemAmount: ItemAmount, Color: Color };
        // Check if the item already exists in the cart
        const cart = localStoragecart ? JSON.parse(localStoragecart) : [];

        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem.browserId_ItemID_Size === storageID.browserId_ItemID_Size);
        if (existingItem) {
            // If item exists, increase quantity
            existingItem.Qty += storageID.Qty;
        } else {
            // If item does not exist, add to cart
            cart.push(storageID);
        }

        // Store the updated cart data in local storage
        localStorage.setItem(`cart_${browserId}`, JSON.stringify(cart));

        if (req.cookies.userdata) {
            var Bind_UserID;
            var Bind_ItemID;
            var Bind_Quantity;
            var Bind_Color;
            var Bind_Size;
            for (var i = 0; i < cart.length; i++) {
                Bind_UserID = req.cookies.userdata[0].UserID
                Bind_ItemID = cart[i].ItemID
                Bind_Quantity = cart[i].Qty
                Bind_Color = cart[i].Color
                Bind_Size = cart[i].Size
            }
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
                    if (data.status == 1) {
                        res.status(200).json({ status: 1, message: 'Success', data: null, error: null });
                    } else {
                        res.status(500).json({ status: 0, message: "Wrong", data: null, error: null })
                    }
                }
            });
        } else {
            res.status(200).json({ status: 1, message: 'Success', data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.BindCartCount = [async (req, res) => {
    try {
        const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
        let ItemCount = localStoragecart.length;
        return res.status(200).json({ status: 1, message: 'Success', data: ItemCount, error: null });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.RemoveDataFromLocalStorage = [async (req, res) => {
    try {
        var paramslocalStorageKey = req.params.localStorageKey;
        var Bind_UserID;
        var Bind_ItemID;
        var Bind_Quantity;
        var Bind_Color;
        var Bind_Size;

        if (req.cookies.browserId) {
            let localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
            //delete localStoragecart[encryptStoreData];
            // Find the index of the item to remove
            let index = -1;
            for (let i = 0; i < localStoragecart.length; i++) {
                if (localStoragecart[i].browserId_ItemID_Size === paramslocalStorageKey) { // Replace 1 with the id of the item to remove
                    index = i;
                    // break;
                    // if (req.cookies.userdata) {
                    Bind_UserID = req.cookies.userdata ? req.cookies.userdata[0].UserID : ''
                    Bind_ItemID = localStoragecart[i].ItemID
                    Bind_Quantity = localStoragecart[i].Qty
                    Bind_Color = localStoragecart[i].Color
                    Bind_Size = localStoragecart[i].Size
                    var options = {
                        'method': 'POST',
                        'url': `${base_url}setCart`,
                        'headers': {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "UserID": Bind_UserID,
                            "ItemID": Bind_ItemID,
                            "Quantity": 0,
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
                    // } else {
                    //     index = i;
                    //     // break;
                    // }
                }
            }
            // Remove the item from the array
            if (index !== -1) {
                localStoragecart.splice(index, 1);
            }
            localStorage.setItem(`cart_${req.cookies.browserId}`, JSON.stringify(localStoragecart));
        }
        return res.status(200).json({ status: 1, message: 'Success', data: null, error: null });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.getCartData = [async (req, res) => {
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

        let userCart = [], bindlocalStorageKey = [], bindlocalStorageValue = [], localArray = [];
        if (req.cookies.browserId) {

            const localStoragecart = JSON.parse(localStorage.getItem(`cart_${req.cookies.browserId}`)) || [];
            // bindlocalStorageKey.forEach(async (data, i) => {
            for (var i = 0; i < localStoragecart.length; i++) {
                let QtyStatus;

                const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                    { name: 'Query', value: "SelectItemSizeWiseStock2" },
                    { name: 'ItemID', value: localStoragecart[i].ItemID },
                    { name: 'Size', value: localStoragecart[i].Size }
                ]);
                if (resultitemData.recordset && resultitemData.recordset[0]) {
                    let itemStock = resultitemData.recordset[0].RemainingStock;
                    // if (itemStock > 0) {
                    if (itemStock == localStoragecart[i].Qty) {
                        QtyStatus = 'In Stock';
                    } else if (itemStock > localStoragecart[i].Qty) {
                        QtyStatus = 'In Stock';
                    } else {
                        QtyStatus = 'Out of Stock';
                    }

                    let discountInformation;
                    if (resultitemData.recordset[0].DiscountDetail) {
                        discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
                    }
                    if (discountInformation) {
                        if (discountInformation.length > 0) {
                            // var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));
                            var ActualAmt = (Number(localStoragecart[i].ItemAmount));
                            var ActualAmt222 = localStoragecart[i].ItemAmount
                            if (ActualAmt > discountInformation[0].MinAmount || ActualAmt == discountInformation[0].MinAmount) {
                                let findDiscountAmount = parseFloat(ActualAmt) * parseFloat(discountInformation[0].Discount) / 100;
                                let DiscountAmt = parseFloat(ActualAmt * localStoragecart[i].Qty) - parseFloat(findDiscountAmount * localStoragecart[i].Qty);

                                localArray.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : 'NoImage.png',
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                    Quantity: localStoragecart[i].Qty,
                                    FinalPrice: DiscountAmt,
                                    RemainingStock: resultitemData.recordset[0] ? resultitemData.recordset[0].RemainingStock : 0,
                                    // ActualAmount: resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0,
                                    ActualAmount: localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0,
                                    LocalStorageKey: localStoragecart[i].browserId_ItemID_Size,
                                    QtyStatus: QtyStatus,
                                    Size: localStoragecart[i].Size,
                                    // AmountWithQty: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    AmountWithQty: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    DiscountPrice: findDiscountAmount * (localStoragecart[i].Qty),
                                    DiscountName: discountInformation[0].DiscountName,
                                    DiscountAmt: findDiscountAmount
                                });
                            } else {
                                localArray.push({
                                    ItemID: localStoragecart[i].ItemID,
                                    ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : 'NoImage.png',
                                    ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                    // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                    Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                    Quantity: localStoragecart[i].Qty,
                                    // FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                    Size: localStoragecart[i].Size,
                                    RemainingStock: resultitemData.recordset[0] ? resultitemData.recordset[0].RemainingStock : 0,
                                    // ActualAmount: resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0,
                                    ActualAmount: localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0,
                                    LocalStorageKey: localStoragecart[i].browserId_ItemID_Size,
                                    QtyStatus: QtyStatus,
                                    Size: localStoragecart[i].Size,
                                    DiscountPrice: '',
                                    DiscountName: '',
                                    DiscountAmt: ''
                                });
                            }
                        } else {
                            localArray.push({
                                ItemID: localStoragecart[i].ItemID,
                                ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : 'NoImage.png',
                                ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                                // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                                Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                                Quantity: localStoragecart[i].Qty,
                                FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                                Size: localStoragecart[i].Size,
                                RemainingStock: resultitemData.recordset[0] ? resultitemData.recordset[0].RemainingStock : 0,
                                // ActualAmount: resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0,
                                ActualAmount: localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0,
                                LocalStorageKey: localStoragecart[i].browserId_ItemID_Size,
                                QtyStatus: QtyStatus,
                                Size: localStoragecart[i].Size,
                                DiscountPrice: '',
                                DiscountName: '',
                                DiscountAmt: ''
                            });
                            var ActualAmt333333 = localStoragecart[i].ItemAmount
                        }
                    } else {
                        localArray.push({
                            ItemID: localStoragecart[i].ItemID,
                            ItemImage: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemImage : 'NoImage.png',
                            ItemName: resultitemData.recordset[0] ? resultitemData.recordset[0].ItemName : '',
                            // Amount: resultitemData.recordset[0] ? resultitemData.recordset[0].Amount : 0,
                            Amount: localStoragecart[i].ItemAmount ? localStoragecart[i].ItemAmount : 0,
                            Quantity: localStoragecart[i].Qty,
                            // FinalPrice: (resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                            FinalPrice: (localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0) * (localStoragecart[i].Qty ? localStoragecart[i].Qty : 0),
                            Size: localStoragecart[i].Size,
                            RemainingStock: resultitemData.recordset[0] ? resultitemData.recordset[0].RemainingStock : 0,
                            // ActualAmount: resultitemData.recordset[0] ? (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) : 0,
                            ActualAmount: localStoragecart[i].ItemAmount ? (Number(localStoragecart[i].ItemAmount)) : 0,
                            LocalStorageKey: localStoragecart[i].browserId_ItemID_Size,
                            QtyStatus: QtyStatus,
                            Size: localStoragecart[i].Size,
                            DiscountPrice: '',
                            DiscountName: '',
                            DiscountAmt: ''
                        });
                    }
                    // }
                }

                var Actualbind = localStoragecart[i].ItemAmount
            }

        }

        res.render('./Asaga/ViewCart', { title: 'Cart', Menutitle: 'Cart', CategoryData: mainCategoryData, UserCart: userCart, LocalStorageCart: localArray, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.addLocalStorageQty = [async (req, res) => {
    try {
        var paramsKey = req.params.Key;
        var Bind_UserID;
        var Bind_ItemID;
        var Bind_Quantity;
        var Bind_Color;
        var Bind_Size;
        // Generate a unique identifier for the user's browser
        const browserId = req.cookies.browserId
        // Get the user's cart data from local storage
        const localStoragecart = JSON.parse(localStorage.getItem(`cart_${browserId}`)) || [];
        const existingItem = localStoragecart.find(cartItem => cartItem.browserId_ItemID_Size === paramsKey);
        if (existingItem) {
            // If item exists, increase quantity
            existingItem.Qty += 1;

            localStorage.setItem(`cart_${browserId}`, JSON.stringify(localStoragecart));
            for (let i = 0; i < localStoragecart.length; i++) {
                Bind_UserID = req.cookies.userdata ? req.cookies.userdata[0].UserID : ''
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

            //#region Check Stock
            const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                { name: 'Query', value: "SelectItemSizeWiseStock" },
                { name: 'ItemID', value: existingItem.ItemID },
                { name: 'Size', value: existingItem.Size }
            ]);

            if (resultitemData.recordset && resultitemData.recordset[0]) {
                let itemStock = resultitemData.recordset[0].RemainingStock;
                if (parseInt(existingItem.Qty) > parseInt(itemStock)) {
                    return res.status(200).json({ status: 0, message: 'Out of stock', data: null, quantity: existingItem.Qty, error: null });
                }
                else {
                    return res.status(200).json({ status: 1, message: 'Success', data: null, quantity: existingItem.Qty, error: null });
                }
            }
            else {
                return res.status(200).json({ status: 0, message: 'Item not found', data: null, quantity: existingItem.Qty, error: null });
            }
            //#endregion
        } else {
            return res.status(200).json({ status: 0, message: 'Item not found', data: null, quantity: existingItem.Qty, error: null });
        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.removeLocalStorageQty = [async (req, res) => {
    try {
        var paramsKey = req.params.Key;
        var Bind_UserID;
        var Bind_ItemID;
        var Bind_Quantity;
        var Bind_Color;
        var Bind_Size;
        // Generate a unique identifier for the user's browser
        const browserId = req.cookies.browserId

        // Get the user's cart data from local storage
        const localStoragecart = JSON.parse(localStorage.getItem(`cart_${browserId}`)) || [];
        const existingItem = localStoragecart.find(cartItem => cartItem.browserId_ItemID_Size === paramsKey);

        if (existingItem) {
            // If item exists, increase quantity
            existingItem.Qty -= 1;
            localStorage.setItem(`cart_${browserId}`, JSON.stringify(localStoragecart));
            for (let i = 0; i < localStoragecart.length; i++) {
                Bind_UserID = req.cookies.userdata ? req.cookies.userdata[0].UserID : ''
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

            //#region Check Stock

            const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
                { name: 'Query', value: "SelectItemSizeWiseStock" },
                { name: 'ItemID', value: existingItem.ItemID },
                { name: 'Size', value: existingItem.Size }
            ]);

            if (resultitemData.recordset && resultitemData.recordset[0]) {
                let itemStock = resultitemData.recordset[0].RemainingStock;
                if (parseInt(existingItem.Qty) > parseInt(itemStock)) {
                    return res.status(200).json({ status: 0, message: 'Out of stock', data: null, quantity: existingItem.Qty, error: null });
                }
                else {
                    return res.status(200).json({ status: 1, message: 'Success', data: null, quantity: existingItem.Qty, error: null });
                }
            }
            else {
                return res.status(200).json({ status: 0, message: 'Item not found', data: null, quantity: existingItem.Qty, error: null });
            }

            //#endregion

        } else {
            return res.status(200).json({ status: 0, message: 'Item not found', data: null, quantity: existingItem.Qty, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];

exports.CheckCartData = [async (req, res) => {
    try {
        //#region Check Stock

        const resultitemData = await dataAccess.execute(`SP_ItemSizeStockDetail`, [
            { name: 'Query', value: "SelectItemSizeWiseStock" },
            { name: 'ItemID', value: req.body.ItemID },
            { name: 'Size', value: req.body.Size }
        ]);
        if (resultitemData.recordset && resultitemData.recordset[0]) {
            let itemStock = resultitemData.recordset[0].RemainingStock;
            if (parseInt(req.body.Quantity) > parseInt(itemStock)) {
                return res.status(200).json({ status: 0, message: 'Out of stock', data: null, error: null });
            }
            else {
                return res.status(200).json({ status: 1, message: 'Success', data: null, error: null });
            }
        }
        else {
            return res.status(200).json({ status: 0, message: 'Item not found', data: null, error: null });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, data: null, error: null });
    }
}];