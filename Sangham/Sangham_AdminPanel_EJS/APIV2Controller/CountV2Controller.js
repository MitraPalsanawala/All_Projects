const UserMasterModel = require("../Model/UserMasterModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const KaryakartaModel = require("../Model/KaryakartaModel");
const AbhiyanModel = require("../Model/AbhiyanModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var underscore_ = require('underscore')
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { distinct } = require("../Model/UserMasterModel");

exports.AllCount = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID, bodyuserrole, CheckUserRole, query1;
        bodyuserID = req.body.ID;
        bodyuserrole = req.body.UserRole;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        CheckUserRole = ((bodyuserrole) ? ({ $in: [(bodyuserrole)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            query1 = {
                // '$gte': todayi.toISOString(), '$lte': todayEODi.toISOString()
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");
            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        if (!bodyuserID) {
            return res.json({ status: 0, Message: "Please Enter UserID", data: null })
        }
        else if (!bodyuserrole) {
            return res.json({ status: 0, Message: "Please Select User Role", data: null })
        }
        else {
            let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID, "UserRole": CheckUserRole })
                .populate('BhagDetail')
                .populate('NagarDetail')
                .populate('VastiDetail')
                .exec();
            if (TotalUserdata.length <= 0) {
                return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
            } else {
                var AllData = [];
                //---------------------------------***************Bhag-Use***************---------------------------------//
                if (TotalUserdata[0].UserRole == "BhagUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID }).distinct('BhagID').exec();
                    let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData } }).distinct('_id').exec();
                    let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: NagarDetail } }).distinct('_id').exec();
                    let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                    }

                    var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingUserData = [];
                    //---------------------------------***************Search-Bhag***************---------------------------------//
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    //---------------------------------***************Search-Nagar***************---------------------------------//
                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    //---------------------------------***************Search-Vasti***************---------------------------------//
                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();

                    //---------------------------------***************Search-Society, Karyakarta, Abhiyan***************---------------------------------//
                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    //---------------------------------***************Search-User Wise all detail***************---------------------------------//
                    let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();


                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        return [...set].join(',')
                    };
                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        return [...set].join(',')
                    };
                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        return [...set].join(',')
                    };

                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();
                    } else {
                        lengthSet1 = 0;
                    }
                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                    } else {
                        lengthSet2 = 0;
                    }
                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }
                    AllData.push({
                        TotalBhagdata: BhagDetailData.length,
                        TotalNagarData: NagarDetail.length,
                        TotalVastiData: VastiDetail.length,
                        TotalSocietyData: SocietyDetail.length,
                        TotalKaryakartaData: KaryakartaDetail.length,
                        TotalAbhiyanData: AbhiyanDetail.length,
                        TotalUserData: Alluserdatanormal.length,
                        SearchUserData: userdatanormal.length,
                        // SearchUserData: todayuserdata.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        SearchSocietyData: TodaySocietyDetailSearch.length,
                        SearchKaryakartaData: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length
                    });
                    return res.status(200).json({
                        status: 1, message: "Done.",
                        AllData: AllData,
                        error: null
                    });
                }
                else if (TotalUserdata[0].UserRole == "SuperUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID }).distinct('BhagID').exec();
                    let NagarDetail = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID, "BhagID": { $in: BhagDetailData } }).distinct('NagarID').exec();
                    let VastiDetail = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID, "BhagID": { $in: BhagDetailData } }).distinct('VastiID').exec();
                    let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();
                    let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();
                    let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).exec();
                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                    }
                    //---------------------------------***************Search-User wise detail***************---------------------------------//
                    let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();

                    var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                    //---------------------------------***************Search-Bhag***************---------------------------------//
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('BhagID').exec();
                    //---------------------------------***************Search-Nagar***************---------------------------------//
                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('NagarID').exec();
                    //---------------------------------***************Search-Vasti***************---------------------------------//
                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('VastiID').exec();

                    //---------------------------------***************Search-Society,Karyakarta,Abhiyan***************---------------------------------//
                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                        "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                    }).distinct('_id').exec();

                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        return [...set].join(',')
                    };


                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();
                    } else {
                        lengthSet1 = 0;
                    }

                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                    } else {
                        lengthSet2 = 0;
                    }

                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }

                    AllData.push({
                        TotalBhagdata: BhagDetailData.length,
                        TotalNagarData: NagarDetail.length,
                        TotalVastiData: VastiDetail.length,
                        TotalSocietyData: SocietyDetail.length,
                        TotalKaryakartaData: KaryakartaDetail.length,
                        TotalAbhiyanData: AbhiyanDetail.length,
                        TotalUserData: Alluserdatanormal.length,
                        SearchUserData: userdatanormal.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        SearchSocietyData: TodaySocietyDetailSearch.length,
                        SearchKaryakartaData: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length

                    })
                    return res.status(200).json({
                        status: 1, message: "Done.",
                        AllData: AllData,
                        error: null
                    });
                }
                //---------------------------------***************Main-Use***************---------------------------------//
                else if (TotalUserdata[0].UserRole == "MainUser") {
                    let BhagDetails = await BhagModel.find({ "IsActive": true }).distinct('_id').exec();
                    let NagarDetails = await NagarModel.find({ "IsActive": true }).distinct('_id').exec();
                    let VastiDetails = await VastiModel.find({ "IsActive": true }).distinct('_id').exec();
                    let SocietyDetails = await SocietyModel.find({ "IsActive": true }).distinct('_id').exec();
                    let AbhiyanDetails = await AbhiyanModel.find({ "IsActive": true }).distinct('_id').exec();
                    let KaryakartaDetails = await KaryakartaModel.find({ "IsActive": true }).distinct('_id').exec();
                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();

                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                    }
                    //---------------------------------***************Search-User wise detail***************---------------------------------//
                    let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetails }, "NagarID": { $in: NagarDetails }, "VastiID": { $in: VastiDetails }
                    }).distinct('BhagID').exec();

                    let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetails }, "NagarID": { $in: NagarDetails }, "VastiID": { $in: VastiDetails }
                    }).distinct('NagarID').exec();
                    let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                        "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetails }, "NagarID": { $in: NagarDetails }, "VastiID": { $in: VastiDetails }
                    }).distinct('VastiID').exec();

                    PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                    //---------------------------------***************Search-Bhag***************---------------------------------//
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();
                    console.log("1212mitra", SocietyDetailSearchBhag)
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();

                    //---------------------------------***************Search-Nagar***************---------------------------------//
                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    //---------------------------------***************Search-Vasti***************---------------------------------//
                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    //---------------------------------***************Search-Society, Karyakarta, Abhiyan***************---------------------------------//
                    let TodaySocietyDetailSearch = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();
                    let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();
                    let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('_id').exec();

                    var lengthSet1 = 0;
                    String.prototype.removeDuplicatebhag = function () {
                        const set = new Set(this.split(','))
                        lengthSet1 = set.size;
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        return [...set].join(',')
                    };


                    var Data;
                    PendingBhagData = SocietyDetailSearchBhag.concat(KaryakartaDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(AbhiyanDetailSearchBhag);
                    PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                    // console.log("PendingBhagData----", PendingBhagData)
                    if (PendingBhagData.length > 0) {
                        Data = PendingBhagData.toString().removeDuplicatebhag();
                        console.log("PendingBhagData----", Data)
                    } else {
                        lengthSet1 = 0;
                    }

                    var Data2;
                    PendingNagarData = SocietyDetailSearchNagar.concat(KaryakartaDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(AbhiyanDetailSearchNagar);
                    PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                    if (PendingNagarData.length > 0) {
                        Data2 = PendingNagarData.toString().removeDuplicatenagar();
                    } else {
                        lengthSet2 = 0;
                    }

                    var Data3;
                    PendingVastiData = SocietyDetailSearchVasti.concat(KaryakartaDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(AbhiyanDetailSearchVasti);
                    PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                    if (PendingVastiData.length > 0) {
                        Data3 = PendingVastiData.toString().removeDuplicatevasti();
                    } else {
                        lengthSet3 = 0;
                    }

                    AllData.push({
                        TotalBhagdata: BhagDetails.length,
                        TotalNagarData: NagarDetails.length,
                        TotalVastiData: VastiDetails.length,
                        TotalSocietyData: SocietyDetails.length,
                        TotalKaryakartaData: KaryakartaDetails.length,
                        TotalAbhiyanData: AbhiyanDetails.length,
                        TotalUserData: Alluserdatanormal.length,
                        SearchUserData: userdatanormal.length,
                        SearchBhagData: lengthSet1,
                        SearchNagarData: lengthSet2,
                        SearchVastiData: lengthSet3,
                        SearchSocietyData: TodaySocietyDetailSearch.length,
                        SearchKaryakartaData: TodayKaryakartaDetailSearch.length,
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length,
                    });
                    return res.status(200).json({
                        status: 1, message: "Done.",
                        AllData: AllData,
                        error: null
                    });
                }
                else {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                }
            }
        }
    } catch (err) {

        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.AllCountDetailView = [async (req, res) => {
    try {
        var CheckSearchID, bodyuserID, bodyuserrole, UserStatus, query1;
        bodyuserID = req.body.ID;
        UserStatus = req.body.UserStatus;
        bodyuserrole = req.body.UserRole;
        CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
        CheckUserRole = ((bodyuserrole) ? ({ $in: [(bodyuserrole)] }) : { $nin: [] });
        if ((req.body.StartDate != "" && req.body.StartDate != undefined) && (req.body.EndDate != "" && req.body.EndDate != undefined)) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.EndDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);
            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        else if (req.body.StartDate != "" && req.body.StartDate != undefined) {
            var todayi = new Date(req.body.StartDate);
            var todayEODi = new Date(req.body.StartDate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        } else {
            const date = new Date();
            const todaydate = moment.utc(date).local().format("yyyy-MM-DD");

            var todayi = new Date(todaydate);
            var todayEODi = new Date(todaydate);
            todayi.setHours(0, 0, 0, 0);
            todayEODi.setHours(23, 59, 59, 999);

            query1 = {
                '$gte': todayi, '$lte': todayEODi
            }
        }
        if (UserStatus == 'Complete') {
            if (!bodyuserID) {
                return res.json({ status: 0, Message: "Please Enter UserID", data: null })
            }
            else if (!bodyuserrole) {
                return res.json({ status: 0, Message: "Please Select User Role", data: null })
            }
            else {
                let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID, "UserRole": CheckUserRole })
                    .populate('BhagDetail')
                    .populate('NagarDetail')
                    .populate('VastiDetail')
                    .exec();
                if (TotalUserdata.length <= 0) {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                } else {
                    var AllData = [];
                    if (TotalUserdata[0].UserRole == "BhagUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: bhagid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (NagarDetail.length > 0) {
                            var nagarid = [];
                            NagarDetail.forEach((doc) => {
                                nagarid.push(doc._id)
                            });
                        }
                        let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: nagarid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (VastiDetail.length > 0) {
                            var vastiid = [];
                            VastiDetail.forEach((doc) => {
                                vastiid.push(doc._id)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        //---------------------------User Start-------------------------//
                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();


                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });

                        }
                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid },
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        })
                            .distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();

                        //---------------------------User END-------------------------//

                        //---------------------------Searching Bhag, Nagar, Vasti-------------------------//
                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingUserData = [];
                        let bhagmaster = await BhagModel.find({}).exec();
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();


                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' }).exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' })
                                .exec()
                        } else {
                            lengthSet3 = 0;
                        }
                        let TodaySocietyDetailSearch = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetail,
                            TotalVastiData: VastiDetail,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearch,
                            SearchKaryakartaData: TodayKaryakartaDetailSearch,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearch,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "SuperUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetailData = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (NagarDetailData.length > 0) {
                            var nagarid = [];
                            NagarDetailData.forEach((doc) => {
                                nagarid.push(doc.NagarID)
                            });
                        }
                        let VastiDetailData = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        if (VastiDetailData.length > 0) {
                            var vastiid = [];
                            VastiDetailData.forEach((doc) => {
                                vastiid.push(doc.VastiID)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let TodaySocietyDetailSearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let TodayKaryakartaDetailSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let TodayAbhiyanDetailSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();

                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });
                        }
                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        })
                            .distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        })

                            .distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        })
                            .distinct('VastiID').exec();


                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('NagarID').exec();

                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();

                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' })
                                .exec()
                        } else {
                            lengthSet3 = 0;
                        }

                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetailData,
                            TotalVastiData: VastiDetailData,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearchBhag,
                            SearchKaryakartaData: TodayKaryakartaDetailSearchBhag,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearchBhag,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    }
                    else if (TotalUserdata[0].UserRole == "MainUser") {
                        let bhagdataall = await BhagModel.find({}).sort({ '_id': -1 }).exec();
                        let nagardataall = await NagarModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .sort({ '_id': -1 }).exec();
                        let vastidetaall = await VastiModel.find({})
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .sort({ '_id': -1 }).exec();
                        let Societydataall = await SocietyModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .sort({ '_id': -1 }).exec();
                        let Karyakartadataall = await KaryakartaModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let Abhiyandataall = await AbhiyanModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let searchSocietydataall = await SocietyModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let searchKaryakartadataall = await KaryakartaModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let searchAbhiyandataall = await AbhiyanModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();


                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true })
                            .populate({ path: 'SanghShikshanID', name: 'SanghShikshanName' })
                            .populate({ path: 'ShakhaMasterID', name: 'ShakhaName' })
                            .populate({ path: 'BhagDetail', select: 'BhagID', populate: { path: 'BhagID', select: 'BhagName' } })
                            .populate({ path: 'NagarDetail', select: 'NagarID', populate: { path: 'NagarID', select: 'NagarName' } })
                            .populate({ path: 'VastiDetail', select: 'VastiID', populate: { path: 'VastiID', select: 'VastiName' } })
                            .exec();

                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });
                        }
                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('VastiID').exec();

                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();

                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();

                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' }).exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' })
                                .exec()
                        } else {
                            lengthSet3 = 0;
                        }

                        AllData.push({
                            TotalBhagdata: bhagdataall,
                            TotalNagarData: nagardataall,
                            TotalVastiData: vastidetaall,
                            TotalSocietyData: Societydataall,
                            TotalKaryakartaData: Karyakartadataall,
                            TotalAbhiyanData: Abhiyandataall,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: searchSocietydataall,
                            SearchKaryakartaData: searchKaryakartadataall,
                            SearchAbhiyanDetailData: searchAbhiyandataall,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });

                    }
                    else {
                        return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                    }
                }
            }
        } else if (UserStatus == 'Pending') {
            if (!bodyuserID) {
                return res.json({ status: 0, Message: "Please Enter UserID", data: null })
            } else {
                let TotalUserdata = await UserMasterModel.find({ "_id": CheckSearchID })
                    .populate('BhagDetail')
                    .populate('NagarDetail')
                    .populate('VastiDetail')
                    .exec();
                if (!TotalUserdata) {
                    return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                } else {
                    var AllData = [];
                    if (TotalUserdata[0].UserRole == "BhagUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [], bhaddatanot = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                                bhaddatanot.push(doc.BhagID._id)
                            });
                        }
                        let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: bhagid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (NagarDetail.length > 0) {
                            var nagarid = [];
                            NagarDetail.forEach((doc) => {
                                nagarid.push(doc._id)
                            });
                        }
                        let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: nagarid } })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (VastiDetail.length > 0) {
                            var vastiid = [];
                            VastiDetail.forEach((doc) => {
                                vastiid.push(doc._id)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();

                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });
                        }
                        var Pendinguser = [];
                        if (Alluserdatanormal.length != userdatanormal.length) {
                            Alluserdatanormal.forEach((user) => {
                                let data = userdatanormal.filter((ele) => {
                                    return ele._id.toString() != user._id.toString()
                                })
                                if (data.length > 0) {
                                    Pendinguser.push(user)
                                }
                            })
                        }

                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid },
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        })
                            .distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('VastiID').exec();
                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];

                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1, "UserID": CheckSearchID,
                            "BhagID": { $in: bhagid },
                            "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).distinct('BhagID').exec();


                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();


                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                            masterbhag2 = await BhagModel.find({ "_id": { $nin: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $nin: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $nin: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' }).exec()
                        } else {
                            lengthSet3 = 0;
                        }

                        var PendingBhag = [];
                        if (BhagDetailData.length != masterbhag.length) {
                            BhagDetailData.forEach((bhaguser) => {
                                let data = masterbhag.filter((ele) => {
                                    console.log("ele-----", ele._id.toString())
                                    console.log("ele12121212-----", bhaguser.BhagID._id.toString())
                                    //console.log("-----", ele._id.toString() = bhaguser.BhagID.toString())
                                    // console.log(ele.BhagID._id.toString(), bhag.BhagID._id.toString(), ele.BhagID.toString() == bhag.BhagID._id.toString())
                                    return ele._id.toString() == bhaguser.BhagID._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingBhag.push(bhaguser)
                                }
                            })
                        }

                        let TodaySocietyDetailSearch = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();

                        let TodayKaryakartaDetailSearch = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let TodayAbhiyanDetailSearch = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        var Pendingsociety = [], Pendingkaryakarta = [], PendingAbhiyan = [];
                        if (SocietyDetail.length != TodaySocietyDetailSearch.length) {
                            SocietyDetail.forEach((soc) => {
                                let data = TodaySocietyDetailSearch.filter((ele) => {
                                    return ele._id.toString() != soc._id.toString()
                                })
                                if (data.length > 0) {
                                    Pendingsociety.push(soc)
                                }
                            })
                        }

                        if (KaryakartaDetail.length != TodayKaryakartaDetailSearch.length) {
                            KaryakartaDetail.forEach((karyakarta) => {
                                let data = TodayKaryakartaDetailSearch.filter((ele) => {
                                    return ele._id.toString() != karyakarta._id.toString()
                                })
                                if (data.length > 0) {
                                    Pendingkaryakarta.push(karyakarta)
                                }
                            })
                        }

                        if (AbhiyanDetail.length != TodayAbhiyanDetailSearch.length) {
                            AbhiyanDetail.forEach((abhiyan) => {
                                let data = TodayAbhiyanDetailSearch.filter((ele) => {
                                    return ele._id.toString() != abhiyan._id.toString()
                                })
                                if (data.length > 0) {
                                    PendingAbhiyan.push(abhiyan)
                                }
                            })
                        }
                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetail,
                            TotalVastiData: VastiDetail,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearch,
                            SearchKaryakartaData: TodayKaryakartaDetailSearch,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearch,
                            Pendinguser: Pendinguser,
                            Pendingsociety: Pendingsociety,
                            Pendingkaryakarta: Pendingkaryakarta,
                            PendingAbhiyan: PendingAbhiyan,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "SuperUser") {
                        let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .exec();
                        if (BhagDetailData.length > 0) {
                            var bhagid = [];
                            BhagDetailData.forEach((doc) => {
                                bhagid.push(doc.BhagID)
                            });
                        }
                        let NagarDetailData = await UserNagarDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .exec();
                        if (NagarDetailData.length > 0) {
                            var nagarid = [];
                            NagarDetailData.forEach((doc) => {
                                nagarid.push(doc.NagarID)
                            });
                        }
                        let VastiDetailData = await UserVastiDetailModel.find({ "IsActive": true, "UserID": CheckSearchID })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        if (VastiDetailData.length > 0) {
                            var vastiid = [];
                            VastiDetailData.forEach((doc) => {
                                vastiid.push(doc.VastiID)
                            });
                        }
                        let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid } })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();
                        let TodaySocietyDetailSearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let TodayKaryakartaDetailSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let TodayAbhiyanDetailSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $in: bhagid }, "NagarID": { $in: nagarid }, "VastiID": { $in: vastiid }
                        }).populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();

                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });
                        }
                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                        }).distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                        })
                            .distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail }
                        }).distinct('VastiID').exec();


                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('NagarID').exec();




                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,
                            "BhagID": { $nin: bhagid }, "NagarID": { $nin: nagarid }, "VastiID": { $nin: vastiid }
                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $nin: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' }).exec()
                        } else {
                            lengthSet3 = 0;
                        }

                        AllData.push({
                            TotalBhagdata: BhagDetailData,
                            TotalNagarData: NagarDetailData,
                            TotalVastiData: VastiDetailData,
                            TotalSocietyData: SocietyDetail,
                            TotalKaryakartaData: KaryakartaDetail,
                            TotalAbhiyanData: AbhiyanDetail,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: TodaySocietyDetailSearchBhag,
                            SearchKaryakartaData: TodayKaryakartaDetailSearchBhag,
                            SearchAbhiyanDetailData: TodayAbhiyanDetailSearchBhag,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });
                    } else if (TotalUserdata[0].UserRole == "MainUser") {
                        let bhagdataall = await BhagModel.find({}).sort({ '_id': -1 }).distinct('_id').exec();
                        let nagardataall = await NagarModel.find({}).sort({ '_id': -1 }).distinct('_id').exec();
                        let vastidetaall = await VastiModel.find({}).sort({ '_id': -1 }).distinct('_id').exec();
                        let Societydataall = await SocietyModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' }).exec();
                        let Karyakartadataall = await KaryakartaModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let Abhiyandataall = await AbhiyanModel.find({})
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        // let searchbhagdataall = await BhagModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        // let searchnagardataall = await NagarModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        // let searchvastidetaall = await VastiModel.find({ "IsActive": true, "CreatedDate": query1, }).sort({ '_id': -1 }).exec();
                        let searchSocietydataall = await SocietyModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .exec();
                        let searchKaryakartadataall = await KaryakartaModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .populate({ path: 'TypeID', select: 'Type' })
                            .exec();
                        let searchAbhiyandataall = await AbhiyanModel.find({ "IsActive": true, "CreatedDate": query1 })
                            .populate({ path: 'UserID', select: 'UserName' })
                            .populate({ path: 'BhagID', select: 'BhagName' })
                            .populate({ path: 'NagarID', select: 'NagarName' })
                            .populate({ path: 'VastiID', select: 'VastiName' })
                            .populate({ path: 'SocietyID', select: 'SocietyName' })
                            .exec();

                        let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();
                        let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).exec();

                        if (userdatanormal.length > 0) {
                            var userid = [];
                            userdatanormal.forEach((doc) => {
                                userid.push(doc._id)
                            });
                        }
                        let TodayUserBhagDetailData = await UserBhagDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('BhagID').exec();
                        let TodayUserNagarDetailData = await UserNagarDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('NagarID').exec();
                        let TodayUserVastiDetailData = await UserVastiDetailModel.find({
                            "CreatedDate": query1, "IsActive": true, "UserID": { $in: userid }, "BhagID": { $in: bhagdataall }, "NagarID": { $in: nagardataall }, "VastiID": { $in: vastidetaall }
                        }).distinct('VastiID').exec();


                        var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [];
                        let SocietySearchBhag = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let KaryakartaSearchBhag = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();
                        let AbhiyanSearchBhag = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('BhagID').exec();

                        let SocietySearchNagar = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let KaryakartaSearchNagar = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();
                        let AbhiyanSearchNagar = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('NagarID').exec();


                        let SocietySearchVasti = await SocietyModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let KaryakartaSearchVasti = await KaryakartaModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();
                        let AbhiyanSearchVasti = await AbhiyanModel.find({
                            "IsActive": true, "CreatedDate": query1,

                        }).distinct('VastiID').exec();



                        var lengthSet1 = 0;
                        String.prototype.removeDuplicatebhag = function () {
                            const set = new Set(this.split(','))
                            lengthSet1 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet2 = 0;
                        String.prototype.removeDuplicatenagar = function () {
                            const set = new Set(this.split(','))
                            lengthSet2 = set.size;
                            return [...set].join(',')
                        };

                        var lengthSet3 = 0;
                        String.prototype.removeDuplicatevasti = function () {
                            const set = new Set(this.split(','))
                            lengthSet3 = set.size;
                            return [...set].join(',')
                        };


                        var Data, arr1, masterbhag;
                        PendingBhagData = SocietySearchBhag.concat(KaryakartaSearchBhag);
                        PendingBhagData = PendingBhagData.concat(AbhiyanSearchBhag);
                        PendingBhagData = PendingBhagData.concat(TodayUserBhagDetailData);
                        if (PendingBhagData.length > 0) {
                            Data = PendingBhagData.toString().removeDuplicatebhag();
                            arr1 = Data.split(',');
                            masterbhag = await BhagModel.find({ "_id": { $in: arr1 } }).exec()
                        } else {
                            lengthSet1 = 0;
                        }

                        var Data2, arr2, masternagar;
                        PendingNagarData = SocietySearchNagar.concat(KaryakartaSearchNagar);
                        PendingNagarData = PendingNagarData.concat(AbhiyanSearchNagar);
                        PendingNagarData = PendingNagarData.concat(TodayUserNagarDetailData);
                        if (PendingNagarData.length > 0) {
                            Data2 = PendingNagarData.toString().removeDuplicatenagar();
                            arr2 = Data2.split(',');
                            masternagar = await NagarModel.find({ "_id": { $in: arr2 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .exec();
                        } else {
                            lengthSet2 = 0;
                        }

                        var Data3, arr3, mastervasti;
                        PendingVastiData = SocietySearchVasti.concat(KaryakartaSearchVasti);
                        PendingVastiData = PendingVastiData.concat(AbhiyanSearchVasti);
                        PendingVastiData = PendingVastiData.concat(TodayUserVastiDetailData);
                        if (PendingVastiData.length > 0) {
                            Data3 = PendingVastiData.toString().removeDuplicatevasti();
                            arr3 = Data3.split(',');
                            mastervasti = await VastiModel.find({ "_id": { $in: arr3 } })
                                .populate({ path: 'BhagID', select: 'BhagName' })
                                .populate({ path: 'NagarID', select: 'NagarName' }).exec()
                        } else {
                            lengthSet3 = 0;
                        }
                        AllData.push({
                            TotalBhagdata: bhagdataall,
                            TotalNagarData: nagardataall,
                            TotalVastiData: vastidetaall,
                            TotalSocietyData: Societydataall,
                            TotalKaryakartaData: Karyakartadataall,
                            TotalAbhiyanData: Abhiyandataall,
                            TotalUserData: Alluserdatanormal,
                            SearchUserData: userdatanormal,
                            SearchBhagData: masterbhag,
                            SearchNagarData: masternagar,
                            SearchVastiData: mastervasti,
                            SearchSocietyData: searchSocietydataall,
                            SearchKaryakartaData: searchKaryakartadataall,
                            SearchAbhiyanDetailData: searchAbhiyandataall,
                        });
                        return res.status(200).json({
                            status: 1, message: "Done.",
                            AllData: AllData,
                            error: null
                        });

                    } else {
                        return res.status(200).json({ status: 0, message: "User Not available.", data: null, error: null });
                    }
                }
            }
        } else {
            return res.status(200).json({ status: 0, message: "Not available.", data: null, error: null });
        }

    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}
