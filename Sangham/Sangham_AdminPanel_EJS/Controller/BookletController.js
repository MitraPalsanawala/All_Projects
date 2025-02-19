var mongoose = require('mongoose');
const moment = require('moment');
const excel = require("exceljs");
const BookletAssignDetailModel = require('../Model/BookletAssignDetailModel');
const BookletMasterModel = require('../Model/BookletMasterModel');
const UserMasterModel = require('../Model/UserMasterModel');
const ErrorLogsModel = require("../Model/ErrorLogsModel");
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook(); // Create a new workbook


exports.ViewBookletDetail = [async (req, res) => {
    try {
        if (req.cookies.admindata) {

            var bodyAssignUserType = req.body.AssignUserType ? req.body.AssignUserType : 'SuperUser';
            var bodyStatus = req.body.Status ? req.body.Status : { $nin: [] };
            var bodyUserID = req.body.UserID ? req.body.UserID : { $nin: [] };
            var bodyBookMasterID = req.body.BookMasterID ? req.body.BookMasterID : { $nin: [] };

            var SearchStatus = req.body.Status ? req.body.Status : undefined;
            var SearchUserID = req.body.UserID ? req.body.UserID : undefined;
            var SearchBookMasterID = req.body.BookMasterID ? req.body.BookMasterID : undefined;

            if (req.body) {
                var SearchData = bodyAssignUserType + '~' + SearchStatus + '~' + SearchUserID + '~' + SearchBookMasterID;
            }

            var getBooleteData = await BookletAssignDetailModel.find({
                Type: bodyAssignUserType, Status: bodyStatus, BookletMasterID: bodyBookMasterID,
                $or: [{ BookletGivenByID: bodyUserID }, { BookletGivenToID: bodyUserID }]
            })
                .populate('BookletGivenByID').populate('BookletGivenToID')
                .exec();

            var bookletMasterData = await BookletMasterModel.find().exec();
            var userData = await UserMasterModel.find({ IsActive: true }).exec();

            res.render('./PanelUser/ViewBookletDetail', {
                title: 'ViewBookletDetail', BookletData: getBooleteData, BookletMasterData: bookletMasterData, UserData: userData, SearchData: SearchData, cookieData: req.cookies.admindata.UserName, moment: moment, ID: ''
            });
        } else {
            res.redirect('./Splash');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

exports.ExportBookletDetail = [async (req, res) => {
    try {

        var bodyAssignUserType = req.body.AssignUserType ? req.body.AssignUserType : 'SuperUser';
        var bodyStatus = req.body.Status ? req.body.Status : { $nin: [] };
        var bodyUserID = req.body.UserID ? req.body.UserID : { $nin: [] };
        var bodyBookMasterID = req.body.BookMasterID ? req.body.BookMasterID : { $nin: [] };

        var getBookletData = await BookletAssignDetailModel.find({
            Type: bodyAssignUserType, Status: bodyStatus, BookletMasterID: bodyBookMasterID,
            $or: [{ BookletGivenByID: bodyUserID }, { BookletGivenToID: bodyUserID }]
        })
            .populate('BookletGivenByID').populate('BookletGivenToID')
            .exec();
        var Result = [];
        var count = 1;

        if (getBookletData.length > 0) {
            getBookletData.forEach((bookletdata) => {
                Result.push({
                    "Sr.No.": count++,
                    "UserType": bookletdata.Type,
                    "GivenBy": bookletdata.BookletGivenByID ? bookletdata.BookletGivenByID.UserName : '',
                    "GivenTo": bookletdata.BookletGivenToID ? bookletdata.BookletGivenToID.UserName : '',
                    "BookNo": bookletdata.BookNo ? bookletdata.BookNo : '',
                    "Status": bookletdata.Status ? bookletdata.Status : '',
                    "Amount": bookletdata.Amount ? bookletdata.Amount : '',
                    "GivenDate": bookletdata.CreatedDate ? moment(bookletdata.CreatedDate).format('DD-MM-yyyy HH:mm:ss') : '',
                    "ReturnData": bookletdata.BookletReturnDate ? moment(bookletdata.BookletReturnDate).format('DD-MM-yyyy HH:mm:ss') : '',
                });

            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Booklet Detail");

            worksheet.columns = [
                { header: "Sr.No.", key: "Sr.No.", width: 6 },
                { header: "User Type", key: "UserType", width: 15 },
                { header: "Given By", key: "GivenBy", width: 20 },
                { header: "Given To", key: "GivenTo", width: 20 },
                { header: "Book No", key: "BookNo", width: 20 },
                { header: "Status", key: "Status", width: 10 },
                { header: "Amount", key: "Amount", width: 20 },
                { header: "Given Date", key: "GivenDate", width: 20 },
                { header: "Return Data", key: "ReturnData", width: 20 }
            ];

            worksheet.spliceRows(1, 0, [])
            // Set title
            worksheet.getCell('A1').value = 'Booklet Detail'

            // Optional merge and styles
            worksheet.mergeCells('A1:I1')
            worksheet.getCell('A1').alignment = { horizontal: 'center' }

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.getRow(2).eachCell((cell) => {
                cell.font = { bold: true };
            });
            worksheet.addRows(Result);
            worksheet.eachRow(function (row, rowNumber) {

                row.eachCell((cell, colNumber) => {
                    if (rowNumber == 1) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '8b74a2db' }
                        },
                            cell.font = { color: { argb: 'ffffff' }, bold: true }
                    }
                    //Set border of each cell
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                })
                //Commit the changed row to the stream
                row.commit();
            });
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "BookletDetail.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            res.redirect('/ViewBookletDetail');
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null, error: null });
    }
}];

function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}