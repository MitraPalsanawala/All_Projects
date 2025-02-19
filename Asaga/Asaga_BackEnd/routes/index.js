var express = require('express');
var router = express.Router();

const SplashController = require("../Controller/SplashController");
const ItemController = require("../Controller/ItemController");
const CartController = require("../Controller/CartController");
const AboutUsController = require("../Controller/AboutUsController");
const CheckOutController = require("../Controller/CheckOutController");
const UserMasterController = require("../Controller/UserMasterController");
const FAQController = require("../Controller/FAQController");
const RefundPolicyController = require("../Controller/RefundPolicyController");
const TermsConditionController = require("../Controller/TermsConditionController");
const ContactUsController = require("../Controller/ContactUsController");
const OrderController = require("../Controller/OrderController");
const WishListController = require("../Controller/WishListController");

/* GET home page. */
router.get("/", SplashController.SplashData);

router.get("/Splash", SplashController.SplashData);

router.get("/ItemDetail/:ItemID", ItemController.getItemDetail);
router.post("/ItemSizeDetail", ItemController.getItemSizeDetail);

router.get("/Items/:SubCategoryID", ItemController.getItemData);
router.get("/paginationItem/:NextPage/:SubCategoryID", ItemController.getItemData);

router.post("/addCart", CartController.setCartData);
router.get("/BindCartCount", CartController.BindCartCount);
router.get("/RemoveDataFromLocalStorage/:localStorageKey", CartController.RemoveDataFromLocalStorage);

router.get("/ViewCart", CartController.getCartData);

router.get("/AboutUs", AboutUsController.getAboutUsData);

router.get("/addLocalStorageQty/:Key", CartController.addLocalStorageQty);
router.get("/removeLocalStorageQty/:Key", CartController.removeLocalStorageQty);

router.post("/CheckCartData", CartController.CheckCartData);

router.get("/CheckOut", CheckOutController.getCheckOut);

router.get("/OrderSuccess/:OrderMasterID", CheckOutController.getOrderSuccess);

router.get("/bindCityData/:StateName", CheckOutController.bindCity);
router.post("/setPlaceOrder", CheckOutController.setPlaceOrder);

router.post("/checkCouponCode", CheckOutController.checkCouponCode);

//--------------------------User Register-------------------------//
router.get("/Registration", UserMasterController.getUserRegister);
router.post("/Registration", UserMasterController.setUserRegister);

//--------------------------User LogIn-------------------------//
router.get("/UserLogIn/:UserID", UserMasterController.getUserLogin);
router.post("/UserLogIn/:UserID", UserMasterController.setUserLogin);
router.post("/UserLogIn", UserMasterController.setUserLogin);
router.get("/UserLogIn", UserMasterController.getUserLogin);

router.post("/CheckEmailLogIN", UserMasterController.CheckEmailLogIN);
router.post("/CheckPasswordData", UserMasterController.CheckPasswordData);
router.get("/LogOut", UserMasterController.LogOut);
router.get("/OrderHistory", OrderController.getOrderHistory);

//--------------------------FAQ-------------------------//
router.get("/FAQ", FAQController.getFAQ);

//--------------------------RefundPolicy-------------------------//
router.get("/RefundPolicy", RefundPolicyController.getRefundPolicy);

//--------------------------Terms & Condition-------------------------//
router.get("/TermsCondition", TermsConditionController.getTermsCondition);

//--------------------------ContactUs-------------------------//
router.get("/ContactUs", ContactUsController.getContactUs);

//--------------------------User Addres Detail-------------------------//
router.get("/UserProfile", UserMasterController.GetUserProfileDetail);
router.post("/UserProfile", UserMasterController.SetUserProfileDetail);
router.get("/bindCityData/:StateName", UserMasterController.bindCity);
router.get("/UserProfile/:UserAddressID", UserMasterController.FindbyIDUserAddress);
router.post("/CheckEmailID", UserMasterController.CheckEmailID);
router.post("/ForgotPasswordLogIn", UserMasterController.ForgotPasswordLogIn);

//--------------------------Item-------------------------//
router.post("/ItemName", ItemController.SelectItemName);
router.get("/ItemName", ItemController.SelectItemName);
// router.get("/ItemName", ItemController.SelectItemColorName);
// router.post("/ItemName", ItemController.SelectItemColorName);

//--------------------------WishList-------------------------//
router.get("/WishList", WishListController.getWishList);
router.get("/removeWishList/:WishListID", WishListController.removeWishList);

router.post("/ItemDetail/:ItemID", ItemController.ItemAddWishList);
router.post("/addItemDetail/:ItemID", ItemController.ItemAddWishList);
router.get("/CheckItemWishList", ItemController.CheckItemWishList);

// router.get("/FilterData", ItemController.FilterData);
// router.get("/FilterData1/:SubCategoryID/:filterdata", ItemController.FilterData1);
router.get("/FilterData1/:SubCategoryID/:filterdata/:NextPage", ItemController.FilterData1);

router.get("/SubscribeMail", UserMasterController.SubscribeMail);
router.post("/SubscribeMail", UserMasterController.SubscribeMail);

router.post("/setOnlinePayment", CheckOutController.setOnlinePayment);
router.post("/setUserTransaction", CheckOutController.setUserTransaction);
router.get("/OrderCancle/:UniqueID", CheckOutController.getOrderCancle);

//--------------------------CheckOutController-------------------------//
router.get("/CheckOut2", CheckOutController.getCheckOut2);
router.get("/PlaceOrder", CheckOutController.getCheckOut2);
router.post("/checkCouponCode2", CheckOutController.checkCouponCode2);
router.post("/setPlaceOrder2", CheckOutController.setPlaceOrder2);
router.post("/setCCAVRequest", CheckOutController.setCCAVRequest);


router.get("/NewItem", ItemController.ItemNameTest);

module.exports = router;
