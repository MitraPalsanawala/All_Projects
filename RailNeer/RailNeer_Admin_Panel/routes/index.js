// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const PlantController = require("../Controller/PlantController/PlantController.js");
const UserController = require("../Controller/UserController/UserController.js");
const BlockController = require("../Controller/BlockController/BlockController.js");
const DepotController = require("../Controller/DepotController/DepotController.js");
const PlantProductionTransactionController = require("../Controller/PlantProductionTransactionController/PlantProductionTransactionController.js");
const ProductController = require("../Controller/ProductController/ProductController.js");
const UserRoleMappingController = require("../Controller/UserRoleMappingController/UserRoleMappingController.js");
const StationController = require("../Controller/StationController/StationController.js");
const TrainController = require("../Controller/TrainController/TrainController.js");
const TrainStationMaapingControlller = require("../Controller/TrainStationMappingController/TrainStationMappingController.js");
const ReportController = require("../Controller/ReportController/ReportController.js");
const OrderController = require("../Controller/OrderController/OrderController.js");
const CFAOrgController = require("../Controller/CFAOrgController/CFAOrgController.js");
const CustOrgController = require("../Controller/CustOrgController/CustOrgController.js");
const TrainMasterController = require("../Controller/TrainMasterController/TrainMasterController.js");
const StationMasterController = require("../Controller/StationMasterController/StationMasterController.js");
const StallController = require("../Controller/StallController/StallController.js");
const ChallanController = require("../Controller/ChallanController/ChallanController.js");
const TicketController = require("../Controller/TicketController/TicketController.js");

//--------------------------------------------PlantDetail---------------------------------------------//
router.get("/PlantAdd", PlantController.GetPlantDetail);
router.post("/PlantAdd", PlantController.AddPlantDetail);
router.post("/CheckPlantName", PlantController.CheckPlantName);
router.post("/PlantUpdate", PlantController.UpdatePlantDetail);
router.post("/updatePlantinMain", PlantController.updatePlantinMain);

router.get("/PlantView", PlantController.ShowPlantDetail);
router.post("/PlantView", PlantController.ShowPlantDetail);
router.get("/deletePlant/:plant_id", PlantController.DeletePlant);
router.get("/PlantfindbyId/:plant_id", PlantController.FindByIDPlant);

//--------------------------------------------Map ProductDetail-------------------------------------------//

router.get("/ProductView", ProductController.GetProductDetail);
router.get("/ProductView/:plantID", ProductController.GetProductDetail);
router.post("/ProductView", ProductController.GetProductDetail);
router.post("/AddProduct", ProductController.AddProduct);
router.get("/editProductMapping/:plantID/:unit_cost_id", ProductController.FetchProductPlanDetail);

//--------------------------------------------UserDetail----------------------------------------------//
router.get("/Splash", UserController.GetSplash);
router.post("/Splash", UserController.SetPanelLogin);
router.get("/PanelLogout", UserController.SetPanelLogout);

//--------------------------------------------BlockDetail----------------------------------------------//
router.get("/Block", BlockController.GetBlockDetail);
router.post("/Block", BlockController.GetBlockDetail);
router.post("/divAddBlock", BlockController.GetBlockDetail);
router.post("/BlockAdd", BlockController.AddBlockDetail);
router.post("/BlockUpdate", BlockController.UpdateBlockDetail);

router.post("/CheckBlockName", BlockController.CheckBlockName);
router.get("/deleteBlock/:id", BlockController.DeleteBlockDetail);
router.get("/BlockfindbyId/:id", BlockController.FindByIDBlockDetail);
router.post("/bindBlockOfCFA", BlockController.bindBlockOfCFA);

//--------------------------------------------Plant Product Transaction Detail----------------------------------------------//
router.get("/PlantProductTransaction", PlantProductionTransactionController.GetPlantProductTransaction);

//--------------------------------------------Add User Detail----------------------------------------------//
router.get("/UserAdd", UserController.GetUserAddData);
router.post("/UserAdd", UserController.SetUser);
router.post("/UpdateUser", UserController.UpdateUser);
router.get("/bindCityData/:StateName", UserController.bindCity);
router.get("/UserStatus/:Value/:id", UserController.UserStatus);
router.get("/UserfindbyId/:id", UserController.FindByUserID);
router.post("/CheckUserName", UserController.CheckUserName);
router.get('/PasswordDecrypt/:password', UserController.PasswordDecrypt);
router.post('/PasswordDecrypt', UserController.PasswordDecrypt);
router.get('/deleteUser/:id', UserController.DeleteUserData);

//--------------------------------------------View User Detail----------------------------------------------//
router.get("/UserView", UserController.ShowUserData);
router.post("/UserView", UserController.ShowUserData);

//--------------------------------------------UserRole Mapping Detail----------------------------------------------//
router.get("/UserRoleMapping", UserRoleMappingController.GetUserRoleMappingDetail);

//--------------------------------------------Plant User----------------------------------------------//
router.get("/PlantUser", UserRoleMappingController.GetPlantUserRoleMapping);
router.post("/PlantUser", UserRoleMappingController.GetPlantUserRoleMapping);
router.post("/AddPlantUser", UserRoleMappingController.AddPlantUserRoleMapping);
router.get("/PlantUserfindbyId/:id", UserRoleMappingController.FindByIDPlantUserRoleMapping);
router.post("/UpdatePlantUser", UserRoleMappingController.UpdatePlantUserRoleMapping);
//--------------------------------------------CFA User----------------------------------------------//
router.get("/CFAUser", UserRoleMappingController.GetCFAUserRoleMapping);
router.post("/CFAUser", UserRoleMappingController.GetCFAUserRoleMapping);
router.post("/AddCFAUser", UserRoleMappingController.AddCFAUserRoleMapping);
router.get("/CFAUserfindbyId/:id", UserRoleMappingController.FindByIDCFAUserRoleMapping);
router.post("/UpdateCFAUser", UserRoleMappingController.UpdateCFAUserRoleMapping);

//--------------------------------------------Customer User----------------------------------------------//
router.get("/CustomerUser", UserRoleMappingController.GetCustomerUserRoleMapping);
router.post("/CustomerUser", UserRoleMappingController.GetCustomerUserRoleMapping);
router.post("/AddCustomerUser", UserRoleMappingController.AddCustomerUserRoleMapping);
router.get("/CustomerUserfindbyId/:id", UserRoleMappingController.FindByIDCustomerUserRoleMapping);
router.post("/UpdateCustomerUser", UserRoleMappingController.UpdateCustomerUserRoleMapping);
router.post("/bindCFAUserOfDepot", UserRoleMappingController.bindCFAUserOfDepot);

//-------------------- 24-10-2023 (Bonika) --------------------//s
router.post("/getCustomerType", UserRoleMappingController.getCustomerType);

//--------------------------------------------Station----------------------------------------------//
router.get("/Station", StationController.GetStationDetail);
router.post("/Station", StationController.GetStationDetail);
router.post("/AddStation", StationController.AddStationDetail);
router.get("/editStation/:station_id", StationController.FetchStationDetail);
//-------------------------------------------- Train ----------------------------------------------//
router.get("/Train", TrainController.GetTrainData);
router.post("/Train", TrainController.GetTrainData);
router.post("/AddTrain", TrainController.SetTrainData);
router.post("/UpdateTrain", TrainController.UpdateTrainData);
router.get("/TrainfindbyId/:train_id", TrainController.FindByTrainID);
router.post("/CheckTrainName", TrainController.CheckTrainName);
router.post("/CheckTrainNumber", TrainController.CheckTrainNumber);
router.get('/deleteTrain/:train_id', TrainController.DeleteTrain);

//-------------------------------------------- Train Station Mapping ----------------------------------------------//
router.get("/TrainStationMappingView", TrainStationMaapingControlller.GetTrainStationMappingData);
router.get("/TrainStationMappingView/:train_id", TrainStationMaapingControlller.GetTrainStationMappingData);
router.post("/TrainStationMappingView", TrainStationMaapingControlller.GetTrainStationMappingData);
router.post("/AddTrainStationMapping", TrainStationMaapingControlller.SetTrainStationMapping);
router.post("/UpdateTrainStationMapping", TrainStationMaapingControlller.UpdateTrainStationMapping);
router.get("/MappingfindbyId/:train_id/:id", TrainStationMaapingControlller.FindByIDTrainStationMapping);
router.get("/deleteTrainStationMapping/:train_id/:id", TrainStationMaapingControlller.DeleteTrainStationMapping);

//--------------------------------------------Depot----------------------------------------------//
router.get("/Depot", DepotController.GetDepotDetail);
router.post("/Depot", DepotController.GetDepotDetail);
router.post("/AddDepot", DepotController.AddDepotDetail);
router.get("/editDepot/:depot_id", DepotController.FetchDepotDetail);

//-------------------------------------------- Product Master ----------------------------------------------//
router.get("/Product", ProductController.ViewProductDetail);
router.post("/Product", ProductController.ViewProductDetail);
router.post("/SetProduct", ProductController.SetProductDetail);
router.post("/UpdateProduct", ProductController.UpdateProductDetail);
router.get("/FindbyIDProductDetail/:id", ProductController.FindbyIDProductDetail);
router.get('/deleteProduct/:id', ProductController.DeleteProductDetail);
router.post("/CheckProductName", ProductController.CheckProductName);

//-------------------------------------------- Report ----------------------------------------------//
router.get("/ExceptionReport", ReportController.GetExceptionReport);
router.post("/ExceptionReport", ReportController.GetExceptionReport);
router.post("/ViewExceptionExcel", ReportController.GetExceptionExcel);

router.get("/InventoryProductionBalanceReport", ReportController.GetInventoryProductionBalanceReport);
router.post("/InventoryProductionBalanceReport", ReportController.GetInventoryProductionBalanceReport);
router.post("/ViewInventoryProductionBalanceExcel", ReportController.GetInventoryProductionBalanceExcel);

router.get("/InventoryDepotBalanceReport", ReportController.GetInventoryDepotBalanceReport);
router.post("/InventoryDepotBalanceReport", ReportController.GetInventoryDepotBalanceReport);
router.post("/ViewInventoryDepotBalanceExcel", ReportController.GetInventoryDepotBalanceExcel);

router.get("/SalesReport", ReportController.GetSalesReport);
router.post("/SalesReport", ReportController.GetSalesReport);
router.post("/ViewSalesExcel", ReportController.GetSalesExcel);

router.get("/PlantWiseOrderReport", ReportController.GetPlantWiseOrderReport);
router.post("/PlantWiseOrderReport", ReportController.GetPlantWiseOrderReport);
router.post("/ViewPlantWiseOrderExcel", ReportController.GetPlantWiseOrderExcel);

//Banti Parmar 04-10-2023 Start
router.get("/INRReport", ReportController.GetINRReport);
router.post("/INRReport", ReportController.GetINRReport);
router.post("/INRReportExcel", ReportController.GetINRReportExcel);
//Banti Parmar 04-10-2023 End

//Banti Parmar 06-10-2023 Start
router.get("/INRCorrectionReport", ReportController.GetINRCorrectionReport);
router.post("/INRCorrectionReport", ReportController.GetINRCorrectionReport);
router.post("/INRCorrectionReportExcel", ReportController.GetINRCorrectionReportExcel);

router.post("/getErrorIRNList", ReportController.GetErrorIRNList);

router.post("/getIRNForOrder", ReportController.GetIRNForOrder);
//Banti Parmar 06-10-2023 End


//-------------------------------------------- Order ----------------------------------------------//
router.get("/OrderView", OrderController.GetOrder);
router.post("/OrderView", OrderController.GetOrder);

router.post("/ViewOrderExcel", OrderController.GetOrderExcel);

//-------------------------------------------- Excel ----------------------------------------------//
router.post("/ViewPlantExcel", PlantController.ViewPlantExcel);
router.post("/ViewUserExcel", UserController.ViewUserExcel);
router.post("/ViewPlantUserExcel", UserRoleMappingController.ViewPlantUserExcel);
router.post("/ViewCFAUserExcel", UserRoleMappingController.ViewCFAUserExcel);
router.post("/ViewCustomerUserExcel", UserRoleMappingController.ViewCustomerUserExcel);
router.post("/ViewBlockExcel", BlockController.ViewBlockExcel);

router.post("/BindProdutPrice", ProductController.BindProdutPrice);

router.get("/VarianceReport", ReportController.GetVarianceReport);
router.post("/VarianceReport", ReportController.GetVarianceReport);
router.post("/VarianceReportExcel", ReportController.GetVarianceExcel);

//--------------------------------------------Cfa Org Detail---------------------------------------------//
router.get("/CfaOrg", CFAOrgController.GetCfaOrgDetail);
router.post("/CfaOrg", CFAOrgController.GetCfaOrgDetail);
router.post("/CheckCfaOrgName", CFAOrgController.CheckCfaOrgName);
router.post("/SetCfaOrgDetail", CFAOrgController.SetCfaOrgDetail);
router.get("/deleteCFAOrg/:id", CFAOrgController.DeleteCfaOrgDetail);
router.get("/CFAOrgfindbyId/:id", CFAOrgController.FindByIDCfaOrgDetail);
router.post("/UpdateCfaOrgDetail", CFAOrgController.UpdateCfaOrgDetail);

//--------------------------------------------Customer Org Detail---------------------------------------------//
router.get("/CustomerOrganization", CustOrgController.getCustOrgDetail);
router.post("/CustomerOrganization", CustOrgController.getCustOrgDetail);
router.post("/setCustOrgDetail", CustOrgController.setCustOrgDetail);
router.post("/updateCustOrgDetail", CustOrgController.updateCustOrgDetail);
router.get("/findByIDCustOrgDetail/:id", CustOrgController.findByIDCustOrgDetail);
router.get("/deleteCustOrgDetail/:id", CustOrgController.deleteCustOrgDetail);

//--------------------------------------------Train Master---------------------------------------------//
router.get("/TrainMaster", TrainMasterController.GetTrainMasterData);
router.post("/TrainMaster", TrainMasterController.GetTrainMasterData);
router.post("/AddTrainMaster", TrainMasterController.SetTrainMasterData);
router.post("/UpdateTrainMaster", TrainMasterController.UpdateTrainMasterData);
router.post("/CheckTrainMasterNumber", TrainMasterController.CheckTrainMasterNumber);
router.get("/FindByTrainMasterID/:train_master_id", TrainMasterController.FindByTrainMasterID);
router.get("/DeleteTrainMaster/:train_master_id", TrainMasterController.DeleteTrainMaster);
router.post("/BindTrainNumber", TrainController.BindTrainNumber);


router.get("/VarianceMobileUnitReport", ReportController.GetVarianceMobileUnitReport);
router.post("/VarianceMobileUnitReport", ReportController.GetVarianceMobileUnitReport);
router.post("/VarianceMobileUnitReportExcel", ReportController.GetVarianceMobileUnitReportExcel);


//--------------------------------------------Station Master---------------------------------------------//
router.get("/StationMaster", StationMasterController.GetStationDetail);
router.post("/BindStationDetail", StationMasterController.BindStationDetail);
router.post("/SetStationDetail", StationMasterController.SetStationDetail);
router.get("/FindByIDStationDetail/:id", StationMasterController.FindByIDStationDetail);
router.post("/UpdateStationDetail", StationMasterController.UpdateStationDetail);
router.get("/DeleteStationDetail/:id", StationMasterController.DeleteStationDetail);
// router.post("/CheckStationCode", StationMasterController.CheckStationCode);



router.post("/BindStationCode", StationController.BindStationCode);

//--------------------------------------------Stall Master---------------------------------------------//
//---------------Stall Add--------------------//
router.get("/StallAdd", StallController.getStallAddDetail);
router.post("/StallAdd", StallController.setStallAddDetail);
router.post("/StallUpdate", StallController.updateStallAddDetail);
router.get("/StallfindbyId/:id", StallController.findByIDStallAddDetail);
//---------------Stall View--------------------//
router.get("/StallView", StallController.viewStallDetail);
router.post("/StallView", StallController.viewStallDetail);
router.get("/deleteStall/:id", StallController.DeleteStallDetail);
//---------------Stall User--------------------//
router.get("/StallUser/:id", StallController.viewStallUser);
router.post("/AddStallUser", StallController.AddStallUser);
router.post("/UpdateStallUser", StallController.updateStallUser);
router.get("/findByIDStallUser/:id/:userid", StallController.findByIDStallUser);
router.get("/deleteStallUser/:id/:userid", StallController.deleteStallUser);

//--------------------------------------------Challan---------------------------------------------//

router.get("/ChallanDownload", ChallanController.GetChallanDetail);
router.get("/IRCTCChallan", ChallanController.GetChallanDetailForPanel);

//-------------------------------------------Import Report---------------------------------------------//
router.get("/PlantImportReport", ReportController.GetPlantToPlantImportReport);
router.post("/PlantImportReport", ReportController.GetPlantToPlantImportReport);
router.post("/PlantImportExcel", ReportController.GetPlantToPlantImportReportExcel);

//-------------------------------------------Export Report---------------------------------------------//
router.get("/PlantExportReport", ReportController.GetPlantToPlantExportReport);
router.post("/PlantExportReport", ReportController.GetPlantToPlantExportReport);
router.post("/PlantExportExcel", ReportController.GetPlantToPlantExportReportExcel);

//-------------------------------------------Challan Report---------------------------------------------//
router.get("/ChallanReport", ReportController.GetChallanReport);
router.post("/ChallanReport", ReportController.GetChallanReport);
router.post("/ChallanReportExcel", ReportController.GetChallanReportExcel);


//-------------------------------------------User Upload Download Excel---------------------------------------------//
router.get("/UploadDownload", UserController.getUploadDownload);
router.post("/DownloadUserExcel", UserController.DownloadUserExcel);

//-------------------------------------------View Ticket Module---------------------------------------------//
router.get("/ViewTicket", TicketController.viewTicketDetail);
router.post("/ViewTicket", TicketController.viewTicketDetail);
// router.get("/ViewTicket", TicketController.GetViewTicket);

//-------------------------------------------Add Ticket Module---------------------------------------------//
router.get("/AddTicket", TicketController.getTicketDetail);
router.post("/AddTicket", TicketController.setTicketDetail);


//-------------------------------------------Ticket Conversation Module---------------------------------------------//
router.get("/TicketConversation", TicketController.IDwiseTicketDetail);
router.get("/TicketConversation/:ticket_id", TicketController.IDwiseTicketDetail);
router.post("/setConversation", TicketController.setConversation);

router.get("/404", UserController.PageNotFound);

router.get("/ChangePassword", UserController.getChangePassword);
router.post("/ChangePassword", UserController.setChangePassword);


module.exports = router;

