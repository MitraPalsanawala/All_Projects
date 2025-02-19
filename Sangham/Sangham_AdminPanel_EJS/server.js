// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
var app = express(), 
sessions = require('express-session');
var MONGODB_URL = process.env.MONGODB_URL; // DB connection
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    if (process.env.NODE_ENV !== "test") { //don't show the log when it is test
        console.log("Connected to %s", MONGODB_URL);
        console.log("App is running ... \n");
        console.log("Press CTRL + C to stop the process. \n");
    }
}).catch(err => { console.error("App starting error:", err.message), process.exit(1); });
// mongoose.set("debug", true);
var db = mongoose.connection;

var app = express();
if (process.env.NODE_ENV !== "test") { app.use(logger("dev")); }
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger('dev'));
app.use(cookieParser());

app.use(cors()); //To allow cross-origin requests



// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

//app.use('/uploads', express.static(process.cwd() + '/uploads'));

app.use('/welcome', (req, res) => {
    res.send({ message: "Welcome to the service." })
});


app.post('/paytm_hook', (req, res) => {
    console.log(req.body)
    res.send({
        body: req.body,
        message: "Welcome to the service."
    })
});

var APIRouter = require('./routes/API');
var APIV2Router = require('./routes/APIV2');
var indexRouter = require('./routes/index');
app.use('/API', APIRouter)
app.use('/APIV2', APIV2Router)
app.use('/', indexRouter);

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT + '!');
});

function middleware(req, res, next) {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        if (!token) return res.status(403).send("Access denied.");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send("Invalid token");
    }
}

module.exports = app;
