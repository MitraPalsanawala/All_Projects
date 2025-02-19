const express = require('express')
const mssql = require('mssql')
const dotenv = require('dotenv')

dotenv.config();

const config = {
    driver: process.env.SQL_DRIVER,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_UID,
    password: process.env.SQL_PWD,
    requestTimeout: 600000,
    options: {
        encrypt: false,
        enableArithAbort: false,
        idleTimeoutMillis: 600000
    },
};

const pool = new mssql.ConnectionPool(config);
module.exports = pool;