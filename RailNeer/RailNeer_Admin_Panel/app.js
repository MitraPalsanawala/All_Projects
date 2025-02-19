var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')
const request = require('request');

const moment = require('moment-timezone');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
let apiUserRoleDone = false;
let apiPlanDataDone = false;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(BindUserRole);
app.use(BindPlantData);
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();
app.use('/', indexRouter);
app.use('/users', usersRouter);

async function BindPlantData(req, res, next) {
  if (app.locals.plantNameData == undefined) {
    var option = req.cookies.admindata;
    var login_user_id = option ? option[0].id : '';
    var token = option ? option[0].token : '';
    var sendParam = {}
    sendParam["order_by"] = 0
    sendParam["user_role_id"] = option ? option[0].user_role_id : ''
    sendParam["is_report_admin"] = option ? option[0].is_report_admin : ''
    sendParam["user_id"] = option ? option[0].id : ''

    var options = {
      'method': 'POST',
      'url': `${process.env.BaseURL}Plant/getPlant`,
      'headers': {
        'Content-Type': 'application/json',
        'login_user_id': `${login_user_id}`,
        'from': `${process.env.from}`,
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sendParam)
    };
    var BindPlant = await new Promise(function (resolve, reject) {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          // var jsonData = JSON.parse(body);
          // resolve(jsonData.data);
          var jsonData = JSON.parse(body);
          if (jsonData && jsonData.data) {
            resolve(jsonData.data);
          } else {
            resolve();
          }
        }
      });
    });
    app.locals.plantNameData = BindPlant;
    next();
  } else {
    next();
  }
}


app.listen(process.env.PORT, () => {
  console.log(`server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
