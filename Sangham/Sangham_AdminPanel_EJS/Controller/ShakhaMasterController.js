const ShakhaMasterModel = require("../Model/ShakhaMasterModel");
const ErrorLogsModel = require("../Model/ErrorLogsModel");
var mongoose = require('mongoose')
//------------------------------------------ App ----------------------------------------------------//
exports.SetShakha = [async (req, res) => {
    try {
        if (!req.body.ShakhaName) {
            res.json({ status: 0, message: "Please Enter Shakha Name!", data: null, error: null });
        } else {
            let ShakhaData = await ShakhaMasterModel.findOne({ IsActive: true, ShakhaName: req.body.ShakhaName }).exec();
            if (ShakhaData) {
                return res.status(200).json({ status: 1, message: "Shakha name is already available.", data: ShakhaData, error: null });
            } else {
                var Shakha = await ShakhaMasterModel({
                    ShakhaName: req.body.ShakhaName,
                }).save();
                return res.status(200).json({ status: 1, message: "Shakha Successfully Inserted.", data: Shakha, error: null });
            }
        }
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
exports.GetShakha = [async (req, res) => {
    try {
        var CheckSearchID = ((req.body.ID) ? ({ $in: [mongoose.Types.ObjectId(req.body.ID)] }) : { $nin: [] });
        var DataResponse = await ShakhaMasterModel.aggregate(
            [
                {
                    "$project": {
                        "_id": "_id",
                        "Shakha": "$$ROOT"
                    }
                },
                {
                    "$match": {
                        "Shakha._id": CheckSearchID,
                        "Shakha.IsActive": true,

                    }
                },
                { "$sort": { "Shakha._id": -1 } },
                {
                    "$project": {
                        "_id": "$Shakha._id",
                        "ShakhaName": "$Shakha.ShakhaName",
                        "IsActive": "$Shakha.IsActive",
                        "IsDelete": "$Shakha.IsDelete",
                        "ModifiedDate": "$Shakha.ModifiedDate",
                        "CreatedDate": "$Shakha.CreatedDate"
                    }
                },
            ]).exec();
        return res.status(200).json({ status: 1, message: "Success.", data: DataResponse, error: null });
    } catch (err) {
        save(req, err.message); return res.status(500).json({ status: 0, message: err.message, data: null });
    }
}];
function save(req, err) {
    new ErrorLogsModel({ ServiceName: req.headers.host + req.path, Method: req.method, Message: err, RequestBody: ((req.body === {}) ? ({}) : (req.body)) }).save();
}