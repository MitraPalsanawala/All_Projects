const UserMasterModel = require("../Model/UserMasterModel");
const BhagModel = require("../Model/BhagModel");
const NagarModel = require("../Model/NagarModel");
const VastiModel = require("../Model/VastiModel");
const SocietyModel = require("../Model/SocietyModel");
const KaryakartaModel = require("../Model/KaryakartaModel");
const AbhiyanModel = require("../Model/AbhiyanModel");

const TypeMasterModel = require("../Model/TypeMasterModel");
const UserVastiDetailModel = require("../Model/UserVastiDetailModel");
const UserNagarDetailModel = require("../Model/UserNagarDetailModel");
const UserBhagDetailModel = require("../Model/UserBhagDetailModel");
const SanghShikshanModel = require("../Model/SanghShikshanModel");
const ResponsibilityModel = require("../Model/ResponsibilityModel");
const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var underscore_ = require('underscore')
var mongoose = require('mongoose');
const moment = require('moment-timezone');
const moment1 = require('moment');
const { distinct } = require("../Model/UserMasterModel");
const helper = require("../helpers/utility");

exports.ViewReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            console.log("req.body---------->", req.body)
            var CheckSearchID, bodyuserID, query1;
            bodyuserID = req.body.UserName;
            bodyuserrole = req.body.UserRole;
            CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
            CheckSearchID = ((bodyuserID) ? ({ $in: [mongoose.Types.ObjectId(bodyuserID)] }) : { $nin: [] });
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
                //console.log("3442242424", todaydate)

                var todayi = new Date(todaydate);
                var todayEODi = new Date(todaydate);
                todayi.setHours(0, 0, 0, 0);
                todayEODi.setHours(23, 59, 59, 999);

                query1 = {
                    '$gte': todayi, '$lte': todayEODi
                }
            }
            let userall = await UserMasterModel.find({ "IsActive": true, "UserRole": { $nin: 'NormalUser' } }, '-UserType').exec();
            let AllUser = await UserMasterModel.find({ "_id": CheckSearchID }).sort({ '_id': -1 }).exec();
            var SearchData = req.body.UserName + '~' + req.body.StartDate + '~' + req.body.EndDate;
            if (AllUser.length > 0) {
                // console.log("AllUser", AllUser)
                // res.render('./PanelUser/CountReport', {
                //     title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: ''
                //     , cookieData: req.cookies.admindata.UserName, moment: moment1
                // });
                var AllData = [];
                if (AllUser[0].UserRole == "BhagUser") {
                    let BhagDetailData = await UserBhagDetailModel.find({ "IsActive": true, "UserID": CheckSearchID }).distinct('BhagID').exec();
                    let NagarDetail = await NagarModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData } }).distinct('_id').exec();
                    let VastiDetail = await VastiModel.find({ "IsActive": true, "NagarID": { $in: NagarDetail } }).distinct('_id').exec();
                    let SocietyDetail = await SocietyModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let KaryakartaDetail = await KaryakartaModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let AbhiyanDetail = await AbhiyanModel.find({ "IsActive": true, "BhagID": { $in: BhagDetailData }, "NagarID": { $in: NagarDetail }, "VastiID": { $in: VastiDetail } }).distinct('_id').exec();
                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    console.log("BhagDetailData", BhagDetailData.length)
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();

                    // console.log("", userdatanormal)
                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                        // console.log(userid)
                    }
                    var PendingBhagData = [], PendingNagarData = [], PendingVastiData = [], PendingUserData = [];
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
                    // console.log("1111SocietyDetailSearchBhag", SocietyDetailSearchBhag)
                    // console.log("2222KaryakartaSearchBhag", KaryakartaDetailSearchBhag)
                    // console.log("4444AbhiyanSearchBhag", AbhiyanDetailSearchBhag)


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
                    // console.log("mitra------------------", TotalBhagdata)
                    // console.log("mitra------------------", TotalBhagdata.length)

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
                        SearchAbhiyanDetailData: TodayAbhiyanDetailSearch.length,
                    });
                    // return res.status(200).json({
                    //     status: 1, message: "Done.",
                    //     AllData: AllData,
                    //     error: null
                    // });
                    // console.log("Bhag--------Alldata", AllData)
                    res.render('./PanelUser/CountReport', {
                        title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: AllData
                        , cookieData: req.cookies.admindata.UserName, moment: moment1
                    });
                }
                else if (AllUser[0].UserRole == "SuperUser") {
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
                    // console.log("SuperUser--------Alldata", AllData)
                    res.render('./PanelUser/CountReport', {
                        title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: AllData
                        , cookieData: req.cookies.admindata.UserName, moment: moment1
                    });
                }
                else if (AllUser[0].UserRole == "MainUser") {
                    let BhagDetails = await BhagModel.find({ "IsActive": true }).distinct('_id').exec();
                    let NagarDetails = await NagarModel.find({ "IsActive": true }).distinct('_id').exec();
                    let VastiDetails = await VastiModel.find({ "IsActive": true }).distinct('_id').exec();
                    let SocietyDetails = await SocietyModel.find({ "IsActive": true }).distinct('_id').exec();
                    let AbhiyanDetails = await AbhiyanModel.find({ "IsActive": true }).distinct('_id').exec();
                    let KaryakartaDetails = await KaryakartaModel.find({ "IsActive": true }).distinct('_id').exec();

                    let Alluserdatanormal = await UserMasterModel.find({ "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();
                    let userdatanormal = await UserMasterModel.find({ "CreatedDate": query1, "UserRole": "NormalUser", "UserStatus": "Complete", "IsActive": true }).distinct('_id').exec();

                    // console.log("", userdatanormal)
                    if (userdatanormal.length > 0) {
                        var userid = [];
                        userdatanormal.forEach((doc) => {
                            userid.push(doc._id)
                        });
                        // console.log(userid)
                    }
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
                    let SocietyDetailSearchBhag = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();
                    let KaryakartaDetailSearchBhag = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();
                    let AbhiyanDetailSearchBhag = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('BhagID').exec();


                    let SocietyDetailSearchNagar = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let KaryakartaDetailSearchNagar = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();
                    let AbhiyanDetailSearchNagar = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('NagarID').exec();


                    let SocietyDetailSearchVasti = await SocietyModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let KaryakartaDetailSearchVasti = await KaryakartaModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();
                    let AbhiyanDetailSearchVasti = await AbhiyanModel.find({
                        "IsActive": true, "CreatedDate": query1,
                    }).distinct('VastiID').exec();

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
                        console.log("set-------------------->", set);
                        // console.log("set-------------------->", lengthSet);
                        return [...set].join(',')
                    };

                    var lengthSet2 = 0;
                    String.prototype.removeDuplicatenagar = function () {
                        const set = new Set(this.split(','))
                        lengthSet2 = set.size;
                        console.log("set-------------------->", set);
                        return [...set].join(',')
                    };

                    var lengthSet3 = 0;
                    String.prototype.removeDuplicatevasti = function () {
                        const set = new Set(this.split(','))
                        lengthSet3 = set.size;
                        console.log("set-------------------->", set);
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


                    // console.log("Data2-------------------->", Data2);
                    // console.log("Data3-------------------->", Data3);

                    // return res.status(200).json({
                    //     status: 1, message: "Done.",
                    //     TotalBhagdata: BhagDetails.length,
                    //     TotalNagarData: NagarDetails.length,
                    //     TotalVastiData: VastiDetails.length,
                    //     TotalSocietyData: SocietyDetails.length,
                    //     TotalKaryakartaData: KaryakartaDetails.length,
                    //     TotalAbhiyanData: AbhiyanDetails.length,
                    //     TotalUserData: Alluserdatanormal.length,
                    //     SearchUserData: userdatanormal.length,
                    //     SearchSocietyDetailSearch: TodaySocietyDetailSearch.length,
                    //     SearchKaryakartaDetailSearch: TodayKaryakartaDetailSearch.length,
                    //     SearchAbhiyanDetailSearch: TodayAbhiyanDetailSearch.length,
                    //     SearchBhagData: lengthSet1,
                    //     SearchNagarData: lengthSet2,
                    //     SearchVastiData: lengthSet3,
                    //     error: null
                    // });
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
                    console.log("MainUser--------Alldata", AllData)
                    res.render('./PanelUser/CountReport', {
                        title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: AllData
                        , cookieData: req.cookies.admindata.UserName, moment: moment1
                    });
                }
                else {
                    res.render('./PanelUser/CountReport', {
                        title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: ''
                        , cookieData: req.cookies.admindata.UserName, moment: moment1
                    });
                }

            } else {
                // res.render('./PanelUser/CountReport', {
                //     title: 'CountReport', UserData: userall, SearchData: SearchData, AllData: ''
                //     , cookieData: req.cookies.admindata.UserName, moment: moment1
                // });
            }

        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.SearchingCountReport = [async (req, res) => {
    try {
        if (req.cookies.admindata) {
            let userall = await UserMasterModel.find({ "IsActive": true, "UserRole": { $nin: 'NormalUser' } }).exec();
            res.render('./PanelUser/CountReport', {
                title: 'CountReport', UserData: userall
                , cookieData: req.cookies.admindata.UserName, moment: moment1
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}]
exports.SentNotificationUser = [async (req, res) => {
    try {
        // if (req.cookies.admindata) {
        let userdata = await UserMasterModel.find({ "NotificationStatus": "Done", "DeviceID": { $nin: null } }).exec();
        // console.log("userdata", userdata)
        if (userdata.length > 0) {
            var GetAllNotification = [];
            await userdata.forEach((doc) => {
                if (doc.DeviceID) {
                    GetAllNotification.push(doc.DeviceID);
                    helper.send_fcm_notifications('Sangham-Notification', "Notification", GetAllNotification, '')
                    // helper.send_fcm_notifications('Notification', req.body.MobileNo, GetAllNotification, '')
                }
            });
            // console.log("GetAllNotification------------------>>>", GetAllNotification)
            // helper.send_fcm_notifications('Notification',  "Notification",GetAllNotification, '')
            res.render('./PanelUser/UserNotification', {
                title: 'UserNotification', userdata: userdata
            });
        } else {
            res.render('./PanelUser/UserNotification', {
                title: 'UserNotification', userdata: ''
            });
        }
        // } else {
        //     res.redirect('./Splash');
        // }
    } catch (err) {
        console.log(err)
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}

