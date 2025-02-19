const UserMasterModel = require("../Model/UserMasterModel");
const AnnadanModel = require("../Model/AnnadanModel");
const AnnadanRequestModel = require("../Model/AnnadanRequestModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose');
const CollectionModel = require("../Model/CollectionModel");
const { collection } = require("../Model/BhagModel");


exports.GetCollectionV2 = [async (req, res) => {
    try {
        var CheckMobileNo = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
        var CheckOtherStatus = req.body.OtherStatus;
        if (!req.body.ID) {
            return res.status(200).json({ status: 1, message: "Please Enter ID", data: null, error: null });
        } else if (!req.body.UserRole) {
            return res.status(200).json({ status: 1, message: "Please Enter UserRole", data: null, error: null });
        } else if (!req.body.CollectionUserStatus) {
            return res.status(200).json({ status: 1, message: "Please Enter Collection Status", data: null, error: null });
        } else {
            let usermasterdata = await UserMasterModel.find({ "_id": req.body.ID, "UserRole": req.body.UserRole }).sort({ '_id': -1 }).exec();
            var AllData = [], Rsult = [];
            if (usermasterdata.length > 0) {
                if (req.body.CollectionUserStatus == "SuperUserCollection") {
                    if (CheckOtherStatus == "Own") {
                        let normaluserdata = await UserMasterModel.find({
                            "UserID": { $in: req.body.ID },
                            // "MainAnnadanStatus": true,
                            "MobileNo": CheckMobileNo
                        }).populate({
                            path: 'AnnadanDetail', select: 'AnnadanUserName ModeOfPayment Amount MobileNo AnnadanStatus',
                            // match: { AnnadanStatus: "Pending", ModeOfPayment: "Cash", IsActive: true }
                            match: { AnnadanStatus: "Pending", IsActive: true }
                        }).sort({ '_id': -1 }).exec();
                        var allcountuser = [];
                        var OverAllTotalAmount = 0;
                        if (normaluserdata.length > 0) {
                            normaluserdata.forEach((obj) => {
                                var TotalAmount = 0;
                                var Sum1 = 0;
                                var CheckCount = 0;
                                obj.AnnadanDetail.forEach((cb) => {
                                    if (cb.ModeOfPayment == "Cash") {
                                        allcountuser.push(cb.Amount ? cb.Amount : 0);
                                        Sum1 = Sum1 + Number(cb.Amount)
                                    } else if (cb.ModeOfPayment == "Bank") {
                                        CheckCount += 1;
                                    }
                                });
                                if (obj.AnnadanDetail.length) {
                                    obj.AnnadanDetail.push({
                                        TotalAmount: Sum1
                                    });

                                    obj.AnnadanDetail.push({
                                        TotalNoOfCheque: CheckCount
                                    });
                                } else {

                                }
                                OverAllTotalAmount = OverAllTotalAmount + Number(Sum1)
                            });
                        }
                        return res.status(200).json({
                            status: 1, message: "Success.",
                            data: normaluserdata,
                            OverAllTotalAmount: OverAllTotalAmount,
                            error: null
                        });
                    } else {
                        let normaluserdata = await UserMasterModel.find({
                            "UserRole": { $in: "NormalUser" },
                            "UserID": { $nin: req.body.ID },
                            "MobileNo": CheckMobileNo,
                        }).populate({
                            path: 'AnnadanDetail', select: 'AnnadanUserName ModeOfPayment Amount MobileNo AnnadanStatus',
                            match: { AnnadanStatus: "Pending", IsActive: true }
                        }).sort({ '_id': -1 }).exec();
                        var allcountuser = [];
                        var OverAllTotalAmount = 0;
                        if (normaluserdata.length > 0) {
                            normaluserdata.forEach((obj) => {
                                var TotalAmount = 0;
                                var Sum1 = 0;
                                var CheckCount = 0;
                                obj.AnnadanDetail.forEach((cb) => {
                                    if (cb.ModeOfPayment == "Cash") {
                                        allcountuser.push(cb.Amount ? cb.Amount : 0);
                                        Sum1 = Sum1 + Number(cb.Amount)
                                    } else if (cb.ModeOfPayment == "Bank") {
                                        CheckCount += 1;
                                    }
                                });
                                if (obj.AnnadanDetail.length) {
                                    obj.AnnadanDetail.push({
                                        TotalAmount: Sum1
                                    });

                                    obj.AnnadanDetail.push({
                                        TotalNoOfCheque: CheckCount
                                    });
                                } else {
                                }
                                OverAllTotalAmount = OverAllTotalAmount + Number(Sum1)
                            });
                        }
                        return res.status(200).json({
                            status: 1, message: "Success.",
                            // AllData: Rsult,
                            data: normaluserdata,
                            OverAllTotalAmount: OverAllTotalAmount,
                            error: null
                        });
                    }
                }
                else if (req.body.CollectionUserStatus == "MainUserCollection") {
                    var superuserdata = await UserMasterModel.find({
                        "MobileNo": CheckMobileNo
                    }).populate({
                        path: 'AnnadanDetail', select: 'AnnadanUserName ModeOfPayment Amount MobileNo AnnadanStatus',
                        match: { AnnadanStatus: "Pending", ModeOfPayment: "Cash", IsActive: true }
                    }).sort({ '_id': -1 }).exec();
                    var allcountuser = [];
                    var OverAllTotalAmount = 0;
                    var OverAllTotalNoOfCheque = 0;
                    if (superuserdata.length > 0) {
                        for (let index = 0; index < superuserdata.length; index++) {
                            var obj = superuserdata[index]
                            var TotalAmount = 0;
                            var Sum1 = 0;
                            var CheckCount = 0;
                            obj.AnnadanDetail.forEach((cb) => {
                                if (cb.ModeOfPayment == "Cash") {
                                    allcountuser.push(cb.Amount ? cb.Amount : 0);
                                    Sum1 = Sum1 + Number(cb.Amount)
                                } else if (cb.ModeOfPayment == "Bank") {
                                    CheckCount += 1;
                                }
                            });

                            if (obj.AnnadanDetail.length) {
                                obj.AnnadanDetail.push({
                                    TotalAmount: Sum1
                                });

                                obj.AnnadanDetail.push({
                                    TotalNoOfCheque: CheckCount
                                });
                            } else {
                                obj.AnnadanDetail.push({
                                    TotalAmount: 0
                                });

                                obj.AnnadanDetail.push({
                                    TotalNoOfCheque: 0
                                });
                            }

                            OverAllTotalAmount = OverAllTotalAmount + Number(Sum1)
                            OverAllTotalNoOfCheque = OverAllTotalNoOfCheque + Number(CheckCount)

                            let collectiondata = await CollectionModel.find({
                                "CollectionStatus": "Pending",
                                "CollectionUserID": obj._id,
                                "CollectionType": "SuperUser Collection",
                            }).exec();

                            var CollectionSum = 0;
                            var TotalNoOfCollectedCheque = 0;
                            if (collectiondata.length > 0) {
                                var AllCount = [];
                                collectiondata.forEach((doc) => {
                                    AllCount.push({
                                        Amount: doc.Amount,
                                    })

                                    CollectionSum = CollectionSum + Number(doc.Amount)

                                    if (doc.TotalNoOfCheque != "" && doc.TotalNoOfCheque != null && doc.TotalNoOfCheque != undefined) {
                                        TotalNoOfCollectedCheque = TotalNoOfCollectedCheque + Number(doc.TotalNoOfCheque)
                                    }
                                });
                            }

                            OverAllTotalAmount = OverAllTotalAmount + Number(CollectionSum)
                            OverAllTotalNoOfCheque = OverAllTotalNoOfCheque + Number(TotalNoOfCollectedCheque)

                            obj.AnnadanDetail.push({
                                CollectionSum: CollectionSum
                            });

                            obj.AnnadanDetail.push({
                                TotalNoOfCollectedCheque: TotalNoOfCollectedCheque
                            });

                            superuserdata[index] = obj

                            if (Sum1 != 0) {
                            }

                            if (CollectionSum != 0) {
                            }
                        }

                        return res.status(200).json({ status: 1, message: "Success.", data: superuserdata, OverAllTotalAmount: OverAllTotalAmount, OverAllTotalNoOfCheque: OverAllTotalNoOfCheque, error: null });
                    }
                    else {
                        return res.status(200).json({ status: 1, message: "Data Not Found.", data: null, OverAllTotalAmount: OverAllTotalAmount, OverAllTotalNoOfCheque: OverAllTotalNoOfCheque, error: null });
                    }
                } else {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, OverAllTotalAmount: null, OverAllTotalNoOfCheque: null, error: null });
                }
            } else {
                return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, OverAllTotalAmount: null, OverAllTotalNoOfCheque: null, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, OverAllTotalAmount: null, OverAllTotalNoOfCheque: null, error: null });
    }
}];

exports.SetCollectionV2 = [async (req, res) => {
    try {
        if (!req.body.CollectionUserID) {
            return res.status(200).json({ status: 1, message: "Please Enter Collection User ID", data: null, error: null });
        }
        else if (!req.body.UserRole) {
            return res.status(200).json({ status: 1, message: "Please Enter UserRole", data: null, error: null });
        } else if (!req.body.CollectionUserStatus) {
            return res.status(200).json({ status: 1, message: "Please Enter Collection Status", data: null, error: null });
        } else if (!req.body.UniqueCollectionNumber) {
            return res.status(200).json({ status: 1, message: "Please Enter Unique Collection Number", data: null, error: null });
        } else if (!req.body.CollectID) {
            return res.status(200).json({ status: 1, message: "Please Enter Collect ID", data: null, error: null });
        } else {
            let CheckUniqueCollectionNumberData = await UserMasterModel.find({ "_id": req.body.CollectID },
                { _id: 1, UserName: 1, MobileNo: 1, UserRole: 1, IsActive: 1, IsDelete: 1, UniqueCollectionNumber: 1 }).exec();
            if (CheckUniqueCollectionNumberData.length > 0) {
                var useruniqueno = "";
                useruniqueno = (CheckUniqueCollectionNumberData[0].UniqueCollectionNumber) ? (CheckUniqueCollectionNumberData[0].UniqueCollectionNumber) : "";
                if (useruniqueno == req.body.UniqueCollectionNumber) {
                    var CollectionStatus = "", CollectionType = "";
                    if (req.body.CollectionUserStatus == "SuperUserCollection") {
                        CollectionStatus = "Pending";
                        CollectionType = 'SuperUser Collection'
                    } else if (req.body.CollectionUserStatus == "MainUserCollection") {
                        CollectionStatus = "Complete";
                        CollectionType = 'MainUser Collection';
                    }
                    else {
                        CollectionStatus = "Pending";
                        CollectionType = "SuperUser Collection";
                    }

                    var addcollection = await CollectionModel({
                        CollectionUserID: req.body.CollectionUserID,
                        UserID: req.body.CollectID,
                        Amount: req.body.Amount,
                        DeductAmount: req.body.DeductAmount,
                        TotalNoOfCheque: (req.body.TotalNoOfCheque) ? (req.body.TotalNoOfCheque) : 0,
                        OtherStatus: req.body.OtherStatus,
                        CollectionType: CollectionType,
                        CollectionStatus: CollectionStatus
                    }).save();
                    if (addcollection) {
                        updateData = {};
                        updateData["AnnadanStatus"] = "Complete";
                        var updateDataAnnadan = {};
                        updateDataAnnadan["CollectionGivenUserID"] = req.body.CollectionUserID;
                        updateMaster = {};
                        updateMaster["CollectionStatus"] = "Complete";
                        return res.status(200).json({
                            status: 1,
                            message: "Successfully Inserted.",
                            data: addcollection,
                            error: null
                        });
                    } else {
                        return res.status(200).json({
                            status: 1,
                            message: "Data Not Inserted",
                            data: null,
                            error: null
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: 1,
                        message: "Wrong Collection Number Passed",
                        data: null,
                        error: null
                    });
                }
            }
            else {
                return res.status(200).json({
                    status: 1,
                    message: "Collection Number Not Found",
                    data: null,
                    error: null
                });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.GetUserCollectionV2 = [async (req, res) => {
    try {
        if (!req.body.CollectionUserID) {
            return res.status(200).json({ status: 1, message: "Please Enter User ID", data: null, error: null });
        } else {
            let usercollectdata = await CollectionModel.find({ "CollectionUserID": req.body.CollectionUserID })
                .populate({ path: 'CollectionUserID', select: 'UserName MobileNo' })
                .populate({ path: 'UserID', select: 'UserName MobileNo' })
                .exec();
            var AllData = [], CompleteCount, PendingCount, TotalCount;
            if (usercollectdata.length > 0) {
                if (usercollectdata[0].CollectionStatus == "Complete") {
                    var completeuser = [];
                    var completeSum = 0;
                    usercollectdata.forEach((cb) => {
                        completeuser.push(cb.Amount ? cb.Amount : '0');
                        completeSum = completeSum + Number(cb.Amount)
                    });
                    CompleteCount = completeSum
                } else if (usercollectdata[0].CollectionStatus == "Pending") {
                    var pendinguser = [];
                    var pendingSum = 0;
                    usercollectdata.forEach((cb) => {
                        pendinguser.push(cb.Amount ? cb.Amount : '0');
                        pendingSum = pendingSum + Number(cb.Amount)
                    });
                    PendingCount = pendingSum
                } else {

                }
                TotalCount = Number(completeSum) + Number(pendingSum)
                AllData.push({
                    CompleteCount: CompleteCount ? CompleteCount : 0,
                    PendingCount: PendingCount ? PendingCount : 0,
                    TotalCount: TotalCount ? TotalCount : 0,
                    TotalCount1: CompleteCount + PendingCount
                })
                return res.status(200).json({
                    status: 1, message: "Success.",
                    data: AllData,
                    error: null
                });
            } else {
                return res.status(200).json({
                    status: 0, message: "Data Not Found.",
                    data: null,
                    error: null
                });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];
exports.GetCollectionV23 = [async (req, res) => {
    try {
        var CheckMobileNo = ((req.body.MobileNo) ? ({ $in: [req.body.MobileNo] }) : { $nin: [] });
        var CheckOtherStatus = req.body.OtherStatus;
        if (!req.body.ID) {
            return res.status(200).json({ status: 1, message: "Please Enter ID", data: null, error: null });
        } else if (!req.body.UserRole) {
            return res.status(200).json({ status: 1, message: "Please Enter UserRole", data: null, error: null });
        } else {
            let usermasterdata = await UserMasterModel.find({ "_id": req.body.ID, "UserRole": req.body.UserRole })
                .populate({ path: 'UserID', select: 'UserName' }).sort({ '_id': -1 }).exec();
            var AllData = [], Rsult = [];
            if (usermasterdata.length > 0) {
                if (usermasterdata[0].UserRole == "SuperUser") {
                    if (CheckOtherStatus == "Own") {
                        let normaluserdata = await UserMasterModel.find({
                            "UserID": { $in: req.body.ID },

                            "MobileNo": CheckMobileNo
                        }).populate({ path: 'AnnadanDetail', select: 'AnnadanUserName Amount MobileNo AnnadanStatus', match: { AnnadanStatus: "Pending" } }).sort({ '_id': -1 }).exec();
                        var allcountuser = [];
                        var Sum1 = 0;
                        if (normaluserdata.length > 0) {
                            normaluserdata.forEach((obj) => {
                                obj.AnnadanDetail.forEach((cb) => {
                                    allcountuser.push(cb.Amount ? cb.Amount : '0');
                                    Sum1 = Sum1 + Number(cb.Amount)
                                });
                                if (obj.AnnadanDetail.length) {
                                    obj.AnnadanDetail.push({
                                        TotalAmount: Sum1
                                    });
                                } else {
                                    // obj.AnnadanDetail.push({
                                    //     TotalAmount: '0'
                                    // });
                                }
                            });
                        }
                        return res.status(200).json({
                            status: 1, message: "Success.",
                            // AllData: Rsult,
                            data: normaluserdata,
                            error: null
                        });
                    } else {
                        let normaluserdata = await UserMasterModel.find({
                            "UserRole": { $in: "NormalUser" },
                            "UserID": { $nin: req.body.ID },
                            "MobileNo": CheckMobileNo,
                        }).populate({ path: 'AnnadanDetail', select: 'AnnadanUserName Amount MobileNo AnnadanStatus', match: { AnnadanStatus: "Pending" } }).sort({ '_id': -1 }).exec();
                        var allcountuser = [];
                        if (normaluserdata.length > 0) {
                            normaluserdata.forEach((obj) => {
                                var Sum1 = 0;
                                obj.AnnadanDetail.forEach((cb) => {
                                    allcountuser.push(cb.Amount ? cb.Amount : '0');
                                    Sum1 = Sum1 + Number(cb.Amount)
                                });
                                if (obj.AnnadanDetail.length) {
                                    obj.AnnadanDetail.push({
                                        TotalAmount: Sum1
                                    });
                                } else {
                                    // obj.AnnadanDetail.push({
                                    //     TotalAmount: '0'
                                    // });
                                }
                                // AllData.push({
                                //     _id: obj._id,
                                //     UserName: obj.UserName,
                                //     MobileNo: obj.MobileNo,
                                //     TotalCount: Sum1
                                // });
                            });
                        }

                        return res.status(200).json({
                            status: 1, message: "Success.",
                            // AllData: Rsult,
                            data: normaluserdata,
                            error: null
                        });
                    }
                }
                else if (usermasterdata[0].UserRole == "MainUser") {
                    let superuserdata = await UserMasterModel.find({
                        // "_id": "637b6474b152556a14ed0363",
                        // "MobileNo": CheckMobileNo
                        // "UserRole": { $nin: "NormalUser" },
                        //"MainAnnadanStatus": true
                    }).populate({
                        path: 'AnnadanDetail',
                        select: 'AnnadanUserName Amount MobileNo AnnadanStatus',
                        // match: { AnnadanStatus: "Pending" }
                    }).sort({ '_id': -1 }).exec();
                    var allcountuser = [];
                    var Sum1;
                    if (superuserdata.length > 0) {
                        superuserdata.forEach((obj) => {
                            Sum1 = 0;
                            obj.AnnadanDetail.forEach(async (cb) => {

                                var userid = [];
                                if (superuserdata.length > 0) {
                                    superuserdata.forEach((doc) => {
                                        userid.push(doc._id)
                                    });
                                }
                                let collectiondata = await CollectionModel.find({
                                    "CollectionStatus": "Pending",
                                    "CollectionUserID": { $in: userid },
                                    "CollectionType": "SuperUser Collection",
                                }).exec();

                                var Sum = 0;
                                if (collectiondata.length > 0) {
                                    var AllCount = [];
                                    collectiondata.forEach((doc) => {
                                        AllCount.push({
                                            Amount: doc.Amount,
                                        })
                                        Sum = Sum + Number(doc.Amount)
                                    });
                                } else {

                                }
                                allcountuser.push(cb.Amount ? cb.Amount : '0');
                                Sum1 = Sum1 + Number(cb.Amount)
                            });
                            if (obj.AnnadanDetail.length) {
                                obj.AnnadanDetail.push({
                                    TotalAmount: Sum1
                                });
                            } else {
                               
                            }
                        });
                    }

                    return res.status(200).json({ status: 1, message: "Success.", data: superuserdata, Sum1: Sum1, error: null });
                } else {
                    return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
                }
            } else {
                return res.status(200).json({ status: 0, message: "Data Not Found.", data: null, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.GetCollectionReport = [async (req, res) => {
    try {
        if (!req.body.CollectionUserStatus) {
            return res.status(200).json({ status: 1, message: "Please Enter Collection Status", data: null, error: null });
        } else if (!req.body.UserID) {
            return res.status(200).json({ status: 1, message: "Please Enter UserID", data: null, error: null });
        }
        else {
            var CollectionType = "", CollectionStatus = "";
            if (req.body.CollectionUserStatus == "SuperUserCollection") {
                CollectionType = "SuperUser Collection";
                CollectionStatus = "";
            }
            else if (req.body.CollectionUserStatus == "MainUserCollection") {
                CollectionType = "MainUser Collection";
                CollectionStatus = "Complete";
            }

            let userdata = await UserMasterModel.find({ "_id": req.body.UserID, "IsActive": true },
                { _id: 1, UserName: 1, MobileNo: 1, UserRole: 1, IsActive: 1, IsDelete: 1 })
                .populate({
                    path: 'AnnadanDetail',
                    select: 'AnnadanUserName ModeOfPayment Amount MobileNo AnnadanStatus',
                    // match: { ModeOfPayment: "Cash" }
                    match: { IsActive: true }
                }).sort({ '_id': -1 }).exec();
            var response = [];

            var OverAllTotalAmount = 0;
            var OverAllTotalNoOfCheque = 0;
            if (userdata.length > 0) {
                for (let index = 0; index < userdata.length; index++) {
                    var obj = userdata[index]
                    var Sum1 = 0;
                    var CheckCount = 0;
                    obj.AnnadanDetail.forEach((cb) => {
                        //Sum1 = Sum1 + Number(cb.Amount)
                        if (cb.ModeOfPayment == "Cash") {
                            Sum1 = Sum1 + Number(cb.Amount)
                        } else if (cb.ModeOfPayment == "Bank") {
                            CheckCount += 1;
                        }
                    });

                    OverAllTotalAmount = OverAllTotalAmount + Number(Sum1)
                    OverAllTotalNoOfCheque = OverAllTotalNoOfCheque + Number(CheckCount)
                    //User Anndan Amount

                    var CollectionSum = 0;
                    var TotalNoOfCollectedCheque = 0;
                    if (req.body.CollectionUserStatus == "SuperUserCollection") {
                        let collectiondata = await CollectionModel.find({
                            "CollectionUserID": obj._id,
                            "CollectionType": CollectionType,
                        }).exec();
                        if (collectiondata.length > 0) {
                            collectiondata.forEach((doc) => {
                                CollectionSum = CollectionSum + Number(doc.Amount)

                                if (doc.TotalNoOfCheque != "" && doc.TotalNoOfCheque != null && doc.TotalNoOfCheque != undefined) {
                                    TotalNoOfCollectedCheque = TotalNoOfCollectedCheque + Number(doc.TotalNoOfCheque)
                                }
                            });
                        }
                    }
                    else if (req.body.CollectionUserStatus == "MainUserCollection") {
                        let collectiondata = await CollectionModel.find({
                            "CollectionStatus": CollectionStatus,
                            "CollectionUserID": obj._id,
                            "CollectionType": CollectionType,
                        }).exec();
                        if (collectiondata.length > 0) {
                            collectiondata.forEach((doc) => {
                                CollectionSum = CollectionSum + Number(doc.Amount)

                                if (doc.TotalNoOfCheque != "" && doc.TotalNoOfCheque != null && doc.TotalNoOfCheque != undefined) {
                                    TotalNoOfCollectedCheque = TotalNoOfCollectedCheque + Number(doc.TotalNoOfCheque)
                                }
                            });
                        }
                    }

                    response.push({
                        "_id": userdata._id,
                        "UserName": userdata.UserName,
                        "UserRole": userdata.UserRole,
                        "MobileNo": userdata.MobileNo,
                        "UserRole": userdata.UserRole,
                        "IsActive": userdata.IsActive,
                        "IsDelete": userdata.IsDelete,
                        "AnndanAmount": OverAllTotalAmount,
                        "CollectionAmount": CollectionSum,
                        "TotalNoOfCheque": OverAllTotalNoOfCheque,
                        "TotalNoOfCollectedCheque": TotalNoOfCollectedCheque
                    });
                }

                return res.status(200).json({ status: 1, message: "Success.", data: response, error: null });
            }
            else {
                return res.status(200).json({ status: 1, message: "Data Not Found.", data: null, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body == {}) ? ({}) : (req.body)) }).save();
}