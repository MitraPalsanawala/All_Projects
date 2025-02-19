const PlantProductTransactionAPI = require('../../Network/PlantProductionTransactionAPIManager/PlantProductionTransactionAPI');
var dotenv = require('dotenv');
dotenv.config()
const base_url = process.env.BaseURL
const request = require('request');
const moment = require('moment-timezone');
const moment1 = require('moment');

//--------------------------------------Plant Product Transaction Add------------------------------------//
exports.GetPlantProductTransaction = [async (req, res) => {
    try {
        res.render('./RailNeer/PlantProductTransaction', { title: 'PlantProductTransaction', Menutitle: 'PlantProductTransaction' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.AddPlantProduct = [async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

//--------------------------------------Plant Product Transaction View------------------------------------//
exports.ViewPlantProduct = [async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];

exports.DeletePlantProduct = [async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ status: 0, message: error.message, error: null });
    }
}];