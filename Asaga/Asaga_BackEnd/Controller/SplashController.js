const express = require('express')
const mssql = require('mssql')
const dataAccess = require('../data-access')
const Connection = require('../Connection')

exports.SplashData = [async (req, res) => {
    try {
        await Connection.connect();

        const result = await dataAccess.execute(`SP_Banner`, [
            { name: 'Query', value: "FetchData2" },
            { name: 'IsActive', value: true },
            { name: 'IsDelete', value: false }
        ]);

        let bannerData, mainCategoryData, itemData, AboutUsData, bestSellerData, random1Data, random2Data, SubCategoryNameWiseData,
            CelebrityData, shopCategoryData, ourCollectionData, AuroraBind;
        if (result.recordset && result.recordset[0]) {
            bannerData = result.recordset[0].BannerData.split('~');
            mainCategoryData = result.recordset[0].CategoryData.split('~');
            //console.log("bn--->", mainCategoryData)
        } else {
            bannerData = null;
            mainCategoryData = null;
        }

        console.log("=====mainCategoryData=====", mainCategoryData)

        const ItemData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectItemData" }
        ]);

        if (ItemData.recordset && ItemData.recordset[0]) {
            //console.log("bn--->", ItemData.recordset)
            itemData = ItemData.recordset;
            //console.log("bn--->", itemData)
        } else {
            itemData = null;
        }

        const aboutUsData = await dataAccess.execute(`SP_AboutUs`, [
            { name: 'Query', value: "SelectAll" }
        ]);

        if (aboutUsData.recordset && aboutUsData.recordset[0]) {
            //console.log("aboutUsData--->", aboutUsData.recordset)
            AboutUsData = aboutUsData.recordset;
            // console.log("bn--->", aboutUsData)
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

        // const Random1ItemData = await dataAccess.execute(`SP_Item`, [
        //     { name: 'Query', value: "SelectRandom1Item" }
        // ]);

        // if (Random1ItemData.recordset && Random1ItemData.recordset[0]) {
        //     random1Data = Random1ItemData.recordset;
        // } else {
        //     random1Data = [];
        // }

        // const Random2ItemData = await dataAccess.execute(`SP_Item`, [
        //     { name: 'Query', value: "SelectRandom2Item" }
        // ]);

        // if (Random2ItemData.recordset && Random2ItemData.recordset[0]) {
        //     random2Data = Random2ItemData.recordset;
        // } else {
        //     random2Data = [];
        // }

        const SubCategoryNameData = await dataAccess.execute(`SP_SubCategory`, [
            { name: 'Query', value: "FetchDataSubCategoryNameWise" }
        ]);

        if (SubCategoryNameData.recordset && SubCategoryNameData.recordset[0]) {
            SubCategoryNameWiseData = SubCategoryNameData.recordset;
        } else {
            SubCategoryNameWiseData = [];
        }

        const CategoryWiseData = await dataAccess.execute(`SP_SubCategory`, [
            { name: 'Query', value: "FetchDataCategoryWise" }
        ]);

        if (CategoryWiseData.recordset && CategoryWiseData.recordset[0]) {
            shopCategoryData = CategoryWiseData.recordset;
        } else {
            shopCategoryData = [];
        }

        const CelebrityStyleData = await dataAccess.execute(`SP_Item`, [
            { name: 'Query', value: "SelectCelebrityCategoryData" }
        ]);

        if (CelebrityStyleData.recordset && CelebrityStyleData.recordset[0]) {
            CelebrityData = CelebrityStyleData.recordset;
        } else {
            CelebrityData = [];
        }

        const ourCollection = await dataAccess.execute(`SP_SubCategory`, [
            { name: 'Query', value: "FetchDataCollectionCategoryWise" }
        ]);

        if (ourCollection.recordset && ourCollection.recordset[0]) {
            ourCollectionData = ourCollection.recordset;
        } else {
            ourCollectionData = [];
        }

        const auroraData = await dataAccess.execute(`SP_SubCategory`, [
            { name: 'Query', value: "FetchDataCollection" }
        ]);

        if (auroraData.recordset && auroraData.recordset[0]) {
            AuroraBind = auroraData.recordset;
        } else {
            AuroraBind = [];
        }

        res.render('./Asaga/Splash', {
            title: 'Home', Menutitle: 'Home', SearchData: '', BannerData: bannerData, CategoryData: mainCategoryData, ItemData: itemData, AboutUsData: AboutUsData, BestSellerData: bestSellerData, ShopCategoryData: shopCategoryData, SubCategoryNameWiseData: SubCategoryNameWiseData, CelebrityStyleData: CelebrityData, OurCollectionData: ourCollectionData, AuroraBindData: AuroraBind, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata
        });
    } catch (error) {
        console.log("ItemDetailerror------------>", error);
        res.render('./Asaga/Splash', {
            title: 'Home', Menutitle: 'Home', SearchData: '', BannerData: bannerData, CategoryData: mainCategoryData, ItemData: itemData, AboutUsData: AboutUsData, BestSellerData: bestSellerData, ShopCategoryData: shopCategoryData, SubCategoryNameWiseData: SubCategoryNameWiseData, CelebrityStyleData: CelebrityData, OurCollectionData: ourCollectionData, AuroraBindData: AuroraBind, alertMessage: '', alertTitle: '', cookieData: req.cookies.userdata
        });
    }
}];