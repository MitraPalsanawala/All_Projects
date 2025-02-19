var port = 2007
var express = require('express');
const dataAccess = require('./data-access')
const Connection = require('./Connection')

const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');

const LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');

var path = require('path');
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

//------------start-----------//
express = require('express'),
  app = express().use(express.static(__dirname + '/')),
  http = require('http').Server(app),
  io = require('socket.io')(http);

// fs = require('fs'),
//   ccav = require('./ccavutil'),
//   qs = require('querystring'),
//   ccavReqHandler = require('./ccavRequestHandler.js'),
//   ccavResHandler = require('./ccavResponseHandler.js');
fs = require('fs'),
  ccav = require('./ccavutil.js'),
  qs = require('querystring'),
  ccavReqHandler = require('./ccavRequestHandler.js'),
  ccavResHandler = require('./ccavResponseHandler.js');
//------------end-----------//

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config();
app.use(cors()); //To allow cross-origin requests
app.use(bodyParser.json());

app.use(cookieParser());

app.use(checkBrowserID);
app.use(localStorageMiddleware);
app.use(bindOverallCart);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var check_out_url = 'https://asaga.in/PlaceOrder'

// app.get('/aboutpay', function (req, res) {
//   // res.render('about.html');
//   res.sendFile(__dirname + '/views/Asaga/about.html');
// });


// app.get('/CCPayment', function (req, res) {
//     res.render('CCPayment.ejs');
//   });

// app.post('/ccavRequestHandler', function (request, response) {
//   console.log("ccavRequestHandler POST", request )
//   ccavReqHandler.postReq(request, response);
// });


// app.post('/ccavResponseHandler', function (request, response) {
//   console.log("ccavResponseHandler")
//   ccavResHandler.postRes(request, response);
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
// });


io.on('connection', function (socket) {
  console.log('a user connected');
});

app.get('/about', function (req, res) {
  res.render('dataFrom.html');
});

app.post('/ccavRequestHandler', function (request, response) {
  console.log("---request---")
  ccavReqHandler.postReq(request, response);

});

app.post('/ccavResponseHandler', function (request, response) {
  // console.log(request.params, request.body, request)
  ccavResHandler.postRes(request, response);
});

var merchant_id = 697662
var order_id;
var currency;
var amount;
var redirect_url;
var language;
var billing_name;
var billing_address;
var billing_city;
var billing_state;
var billing_zip;
var billing_country;
var billing_tel;
var billing_email;
var delivery_name;
var delivery_address;
var delivery_city;
var delivery_state;
var delivery_zip;
var delivery_country;
var delivery_tel;
var merchant_param1;
var merchant_param2;
var merchant_param3;
var merchant_param4;
var merchant_param5;
var promo_code;
var customer_identifier;


app.get('/pay', [async (req, res) => {
  console.log("====123===")
  var BindUniqueID = req.query.UniqueID ? req.query.UniqueID : ''
  var UserData;
  var BindID;
  await Connection.connect();

  BindUniqueID = BindUniqueID.toString().trim()
  if (!BindUniqueID || BindUniqueID.length == 0) {
    res.send({
      status: false,
      message: 'Something went wrong!'
    })
  }
  const OrderData = await dataAccess.execute(`SP_OrderMaster`, [
    { name: 'Query', value: "SelectCCAvenue2" },
    { name: 'UniqueID', value: BindUniqueID },
  ]);

  if (OrderData.recordset && OrderData.recordset[0]) {
    UserData = OrderData.recordset;

  } else {
    UserData = null;
  }

  console.log('----userdaat----', UserData)
  // console.log('----useName----',UserData[0].FisrtName + '' + UserData[0].LastName )

  if (!UserData || UserData.length == 0) {
    // return res.send({
    //   status : false,
    //   message : "User Data Not Found"
    // })

    return res.writeHead(301, {
      Location: check_out_url + `?message=UserID`
    }).end();


  }

  UserData = UserData[0]

  if (!UserData.UniqueID) {
    return res.writeHead(301, {
      Location: check_out_url + `?message=UniqueID`
    }).end();
  }

  if (!UserData.OrderMasterID) {
    return res.writeHead(301, {
      Location: check_out_url + `?message=OrderID`
    }).end();
  }

  if (!UserData.FinalAmount) {
    return res.writeHead(301, {
      Location: check_out_url + `?message=FinalAmount`
    }).end();
  }


  BindID = UserData.UniqueID
  //id == null or empty or undefined or 0
  // if (UserData.length > 0 && BindUniqueID > 0 && UniqueID === BindUniqueID) {
  if (BindID === BindUniqueID) {
    // var userAddressObject = UserData.UserAddressDetail ?? '';
    // console.log("===fff",UserData);
    var billing_name = (UserData.FirstName ?? '') + ' ' + (UserData.MiddleName ?? '') + ' ' + (UserData.LastName ?? '');
    var billing_address = UserData.Address1 ?? '';
    var billing_city = UserData.CityName ?? '';
    var billing_state = UserData.StateName ?? '';
    var billing_zip = UserData.PinCode ?? '';
    var billing_country = UserData.CountryName ?? '';
    var billing_tel = UserData.MobileNo ?? '';
    var billing_email = UserData.EmailID ?? '';
    var delivery_name = (UserData.FirstName ?? '') + ' ' + (UserData.MiddleName ?? '') + ' ' + (UserData.LastName ?? '');
    var delivery_address = UserData.Address1 ?? '';
    var delivery_city = UserData.CityName ?? '';
    var delivery_state = UserData.StateName ?? '';
    var delivery_zip = UserData.PinCode ?? '';
    var delivery_country = UserData.CountryName ?? '';
    var delivery_tel = UserData.MobileNo ?? '';

    // if(
    //   !billing_name ||
    //   !billing_address ||
    //   !billing_city ||
    //   !billing_state ||
    //   !billing_zip ||
    //   !billing_country ||
    //   !billing_tel ||
    //   !billing_email ||
    //   !delivery_name ||
    //   !delivery_address ||
    //   !delivery_city ||
    //   !delivery_state ||
    //   !delivery_zip ||
    //   !delivery_country ||
    //   !delivery_tel){
    //     return res.writeHead(301, {
    //     Location: check_out_url+ `?message=AddressData`
    //     }).end();
    // }
    // var data = {
    //     merchant_id: 697662,
    //     order_id: UserData.OrderMasterID ?? '',
    //     currency: 'INR',
    //     // amount: 1,
    //     amount: UserData.FinalAmount ?? '',
    //     redirect_url: 'https://asaga.in/ccavResponseHandler',
    //     //redirect_url: 'http://192.168.0.100:2007/response',
    //     cancel_url: 'https://asaga.in/ccavResponseHandler',
    //     // cancel_url: 'http://192.168.0.100:2007/error',
    //     language: 'EN',
    //     billing_name: billing_name,
    //     billing_address: billing_address,
    //     billing_city: billing_city,
    //     billing_state: billing_state,
    //     billing_zip: billing_zip,
    //     billing_country: billing_country,
    //     billing_tel: billing_tel,
    //     billing_email: billing_email,
    //     delivery_name: delivery_name,
    //     delivery_address: delivery_address,
    //     delivery_city: delivery_city,
    //     delivery_state: delivery_state,
    //     delivery_zip: delivery_zip,
    //     delivery_country: delivery_country,
    //     delivery_tel: delivery_tel,
    //     // billing_name: UserData ? UserData[0].UserName : '',
    //     // billing_address: UserData ? UserData[0].UserAddressDetail[0].Address1 : '',
    //     // billing_city: UserData ? UserData[0].UserAddressDetail[0].CityName : '',
    //     // billing_state: UserData ? UserData[0].UserAddressDetail[0].StateName : '',
    //     // billing_zip: UserData ? UserData[0].UserAddressDetail[0].Pincode : '',
    //     // billing_country: UserData ? UserData[0].UserAddressDetail[0].CountryName : '',
    //     // billing_tel: UserData ? UserData[0].UserAddressDetail[0].MobileNo : '',
    //     // billing_email: UserData ? UserData[0].EmailID : '',
    //     // delivery_name: UserData ? UserData[0].UserName : '',
    //     // delivery_address: UserData ? UserData[0].UserAddressDetail[0].Address1 : '',
    //     // delivery_city: UserData ? UserData[0].UserAddressDetail[0].CityName : '',
    //     // delivery_state: UserData ? UserData[0].UserAddressDetail[0].StateName : '',
    //     // delivery_zip: UserData ? UserData[0].UserAddressDetail[0].Pincode : '',
    //     // delivery_country: UserData ? UserData[0].UserAddressDetail[0].CountryName : '',
    //     // delivery_tel: UserData ? UserData[0].UserAddressDetail[0].MobileNo : '',
    //     merchant_param1: '',
    //     merchant_param2: '',
    //     merchant_param3: '',
    //     merchant_param4: '',
    //     merchant_param5: '',
    //     promo_code: '',
    //     customer_identifier: ''
    // }
    // console.log("====data====",data)

    var data = {
      merchant_id: 697662,
      // order_id: UserData.OrderMasterID ?? '',
      order_id: UserData.OrderMasterID,
      currency: 'INR',
      // amount: 1,
      amount: UserData.FinalAmount ?? '',
      // amount: UserData.FinalAmount,
      redirect_url: 'https://asaga.in/ccavResponseHandler',
      //redirect_url: 'http://192.168.0.100:2007/response',
      cancel_url: 'https://asaga.in/ccavResponseHandler',
      // cancel_url: 'http://192.168.0.100:2007/error',
      language: 'EN',
      billing_name: billing_name,
      billing_address: billing_address,
      billing_city: billing_city,
      billing_state: billing_state,
      billing_zip: billing_zip,
      billing_country: billing_country,
      billing_tel: billing_tel,
      billing_email: billing_email,
      delivery_name: delivery_name,
      delivery_address: delivery_address,
      delivery_city: delivery_city,
      delivery_state: delivery_state,
      delivery_zip: delivery_zip,
      delivery_country: delivery_country,
      delivery_tel: delivery_tel,
      // billing_name: UserData ? UserData[0].UserName : '',
      // billing_address: UserData ? UserData[0].UserAddressDetail[0].Address1 : '',
      // billing_city: UserData ? UserData[0].UserAddressDetail[0].CityName : '',
      // billing_state: UserData ? UserData[0].UserAddressDetail[0].StateName : '',
      // billing_zip: UserData ? UserData[0].UserAddressDetail[0].Pincode : '',
      // billing_country: UserData ? UserData[0].UserAddressDetail[0].CountryName : '',
      // billing_tel: UserData ? UserData[0].UserAddressDetail[0].MobileNo : '',
      // billing_email: UserData ? UserData[0].EmailID : '',
      // delivery_name: UserData ? UserData[0].UserName : '',
      // delivery_address: UserData ? UserData[0].UserAddressDetail[0].Address1 : '',
      // delivery_city: UserData ? UserData[0].UserAddressDetail[0].CityName : '',
      // delivery_state: UserData ? UserData[0].UserAddressDetail[0].StateName : '',
      // delivery_zip: UserData ? UserData[0].UserAddressDetail[0].Pincode : '',
      // delivery_country: UserData ? UserData[0].UserAddressDetail[0].CountryName : '',
      // delivery_tel: UserData ? UserData[0].UserAddressDetail[0].MobileNo : '',
      merchant_param1: '',
      merchant_param2: '',
      merchant_param3: '',
      merchant_param4: '',
      merchant_param5: '',
      promo_code: '',
      customer_identifier: ''
    }

    console.log("===122", data);
    // var send = {
    //   "promo_calculation_amount" : data.promo_calculation_amount ?? "",
    //   "promo_code" : data.promo_code ?? "",
    //   "billing_address" : data.billing_address ?? "",
    //   "integration_type" : data.integration_type ?? "",
    //   "tc_url" : data.tc_url ?? "",
    //   "customer_identifier" : data.customer_identifier ?? "",
    //   "billing_email" : data.billing_email ?? "",
    //   "split_data" : data.split_data ?? "",
    //   "3" : "",
    //   "si_frequency" : data.si_frequency ?? "",
    //   "cvv_number" : data.cvv_number ?? "",
    //   "masterpass_misc" : data.masterpass_misc ?? "",
    //   "si_amount" : data.si_amount ?? "",
    //   "card_number" : data.card_number ?? "",
    //   "mpiStatusCode" : data.mpiStatusCode ?? "",
    //   "data_accept" : data.data_accept ?? "",
    //   "mm_id" : data.mm_id ?? "",
    //   "otp" : data.otp ?? "",
    //   "delivery_state" : data.delivery_state ?? "",
    //   "bin_supported" : data.bin_supported ?? "",
    //   "card_name" : data.card_name ?? "",
    //   "display_promo" : data.display_promo ?? "",
    //   "customer_account_id" : data.customer_account_id ?? "",
    //   "order_id" : data.order_id ?? "",
    //   "redirect_url" : data.redirect_url ?? "",
    //   "si_start_date" : data.si_start_date ?? "",
    //   "saveCard" : data.saveCard ?? "",
    //   "delivery_name" : data.delivery_name ?? "",
    //   "customer_ip" : data.customer_ip ?? "",
    //   "mobile_no" : data.mobile_no ?? "",
    //   "si_end_date" : data.si_end_date ?? "",
    //   "sub_account_id" : data.sub_account_id ?? "",
    //   "mpipurchasexid" : data.mpipurchasexid ?? "",
    //   "billing_state" : data.billing_state ?? "",
    //   "customer_card_id" : data.customer_card_id ?? "",
    //   "card_suffix" : data.card_suffix ?? "",
    //   "payment_option" : data.payment_option ?? "",
    //   "billing_country" : data.billing_country ?? "",
    //   "virtualAddress" : data.virtualAddress ?? "",
    //   "card_type" : data.card_type ?? "",
    //   "challan_exp_date" : data.challan_exp_date ?? "",
    //   "non_si_transaction" : data.non_si_transaction ?? "",
    //   "delivery_city" : data.delivery_city ?? "",
    //   "delivery_address" : data.delivery_address ?? "",
    //   "merchRecvCountry" : data.merchRecvCountry ?? "",
    //   "access_code" : data.access_code ?? "",
    //   "si_type" : data.si_type ?? "",
    //   "language" : data.language ?? "",
    //   "device_type" : data.device_type ?? "",
    //   "token_requestor_id" : data.token_requestor_id ?? "",
    //   "token_expiry" : data.token_expiry ?? "",
    //   "tid" : data.tid ?? "",
    //   "expiry_month" : data.expiry_month ?? "",
    //   "collectByDate" : data.collectByDate ?? "",
    //   "si_bill_cycle" : data.si_bill_cycle ?? "",
    //   "upiPaymentFlag" : data.upiPaymentFlag ?? "",
    //   "si_is_setup_amt" : data.si_is_setup_amt ?? "",
    //   "walletId" : data.walletId ?? "",
    //   "si_mer_ref_no" : data.si_mer_ref_no ?? "",
    //   "encRequest" : data.encRequest ?? "",
    //   "break_iframe" : data.break_iframe ?? "",
    //   "token_number" : data.token_number ?? "",
    //   "expiry_year" : data.expiry_year ?? "",
    //   "billing_city" : data.billing_city ?? "",
    //   "billing_notes" : data.billing_notes ?? "",
    //   "merchRecvCurrency" : data.merchRecvCurrency ?? "",
    //   "account_otp" : data.account_otp ?? "",
    //   "merchSendCountry" : data.merchSendCountry ?? "",
    //   "cancel_url" : data.cancel_url ?? "",
    //   "carddetails" : data.carddetails ?? "",
    //   "merchSendCurrency" : data.merchSendCurrency ?? "",
    //   "emi_plan_id" : data.emi_plan_id ?? "",
    //   "instant_gratification" : data.instant_gratification ?? "",
    //   "merchant_id" : data.merchant_id ?? "",
    //   "billing_tel" : data.billing_tel ?? "",
    //   "si_frequency_type" : data.si_frequency_type ?? "",
    //   "issuing_bank" : data.issuing_bank ?? "",
    //   "billing_zip" : data.billing_zip ?? "",
    //   "merchant_param1" : data.merchant_param1 ?? "",
    //   "merchant_param2" : data.merchant_param2 ?? "",
    //   "merchant_param3" : data.merchant_param3 ?? "",
    //   "merchant_param4" : data.merchant_param4 ?? "",
    //   "mpiEci" : data.mpiEci ?? "",
    //   "merchant_param5" : data.merchant_param5 ?? "",
    //   "cryptogram" : data.cryptogram ?? "",
    //   "merchant_param7" : data.merchant_param7 ?? "",
    //   "delivery_country" : data.delivery_country ?? "",
    //   "amount" : data.amount ?? "",
    //   "merchant_param8" : data.merchant_param8 ?? "",
    //   "wallet_integration_type" : data.wallet_integration_type ?? "",
    //   "mpiCavv" : data.mpiCavv ?? "",
    //   "billing_name" : data.billing_name ?? "",
    //   "command" : data.command ?? "",
    //   "emi_tenure_id" : data.emi_tenure_id ?? "",
    //   "delivery_tel" : data.delivery_tel ?? "",
    //   "delivery_zip" : data.delivery_zip ?? "",
    //   }

    return res.send(get_data(data));
  } else {
    res.send({
      status: false,
      message: 'Something went wrong!!!!!!!!!!!!!!'
    })
  }
}]);

app.post('/response', (req, res) => {
  // Parse the payment response received from CCAvenue
  const response = req.body;

  console.log('response', response)

  // Validate the response and check if payment was successful
  if (response.Status === 'Success') {
    // Payment successful, perform further actions
    // ...
    res.send('Payment successful!');
  } else {
    // Payment failed or was cancelled
    res.send('Payment failed!');
  }
});

app.use('/success', function (req, res) {
  console.log('SUCCESS.', req.body)
  res.send({
    status: true,
    message: 'payment Done.'
  })
});

app.use('/error', function (req, res) {
  console.log('ERROR PAYMENT', req.body)
  res.send({
    status: false,
    message: 'payment Error.'
  })
});

app.get('/1', function (req, res) {
  res.sendFile(__dirname + '/direct.html');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dataFrom.html');
});


function get_data(data) {
  return `<!DOCTYPE html>
  <head>
      <script src="https://www.tutorialspoint.com/jquery/jquery-3.6.0.js"></script>
  </head>
  <body>
      <script type="text/javascript">
           call();
          function call() {
              $("document").ready(function () {
              $("#button_submit").trigger('click');
          });
          }
      </script>
      <form hidden id="form" method="POST" name="form" action="/ccavRequestHandler">
          <table width="40%" height="100" border='1' align="center">
              <caption>
                  <font size="4" color="blue"><b>Integration Kit</b></font>
              </caption>
          </table>
          <table width="40%" height="100" border='1' align="center">
              <tr>
                  <td>Parameter Name:</td>
                  <td>Parameter Value:</td>
              </tr>
              <tr>
                  <td colspan="2">Compulsory information</td>
              </tr>
              <tr>
                  <td>Merchant Id</td>
                  <td><input type="text" name="merchant_id" id="merchant_id" value="${data.merchant_id}" /> </td>
              </tr>
              <tr>
                  <td>Order Id</td>
                  <td><input type="text" name="order_id" value="${data.order_id}" /></td>
              </tr>
              <tr>
                  <td>Currency</td>
                  <td><input type="text" name="currency" value="${data.currency}" /></td>
              </tr>
              <tr>
                  <td>Amount</td>
                  <td><input type="text" name="amount" value="${data.amount}" /></td>
              </tr>
              <tr>
                  <td>Redirect URL</td>
                  <td><input type="text" name="redirect_url" value="${data.redirect_url}" />
                  </td>
              </tr>
              <tr>
                  <td>Cancel URL</td>
                  <td><input type="text" name="cancel_url" value="${data.cancel_url}" />
                  </td>
              </tr>
              <tr>
                  <td>Language</td>
                  <td><input type="text" name="language" id="language" value="EN" /></td>
              </tr>
              <tr>
                  <td colspan="2">Billing information(optional):</td>
              </tr>
              <tr>
                  <td>Billing Name</td>
                  <td><input type="text" name="billing_name" value="${data.billing_name}" /></td>
              </tr>
              <tr>
                  <td>Billing Address:</td>
                  <td><input type="text" name="billing_address" value="${data.billing_address}" /></td>
              </tr>
              <tr>
                  <td>Billing City:</td>
                  <td><input type="text" name="billing_city" value="${data.billing_city}" /></td>
              </tr>
              <tr>
                  <td>Billing State:</td>
                  <td><input type="text" name="billing_state" value="${data.billing_state}" /></td>
              </tr>
              <tr>
                  <td>Billing Zip:</td>
                  <td><input type="text" name="billing_zip" value="${data.billing_zip}" /></td>
              </tr>
              <tr>
                  <td>Billing Country:</td>
                  <td><input type="text" name="billing_country" value="${data.billing_country}" />
                  </td>
              </tr>
              <tr>
                  <td>Billing Tel:</td>
                  <td><input type="text" name="billing_tel" value="${data.billing_tel}" />
                  </td>
              </tr>
              <tr>
                  <td>Billing Email:</td>
                  <td><input type="text" name="billing_email" value="${data.billing_email}" /></td>
              </tr>
              <tr>
                  <td colspan="2">Shipping information(optional):</td>
              </tr>
              <tr>
                  <td>Shipping Name</td>
                  <td><input type="text" name="delivery_name" value="${data.delivery_name}" />
                  </td>
              </tr>
              <tr>
                  <td>Shipping Address:</td>
                  <td><input type="text" name="delivery_address" value="${data.delivery_address}" /></td>
              </tr>
              <tr>
                  <td>Shipping City:</td>
                  <td><input type="text" name="delivery_city" value="${data.delivery_city}" />
                  </td>
              </tr>
              <tr>
                  <td>Shipping State:</td>
                  <td><input type="text" name="delivery_state" value="${data.delivery_state}" />
                  </td>
              </tr>
              <tr>
                  <td>Shipping Zip:</td>
                  <td><input type="text" name="delivery_zip" value="${data.delivery_zip}" /></td>
              </tr>
              <tr>
                  <td>Shipping Country:</td>
                  <td><input type="text" name="delivery_country" value="${data.delivery_country}" />
                  </td>
              </tr>
              <tr>
                  <td>Shipping Tel:</td>
                  <td><input type="text" name="delivery_tel" value="${data.delivery_tel}" />
                  </td>
              </tr>
              <tr>
                  <td>Merchant Param1</td>
                  <td><input type="text" name="merchant_param1" value="${data.merchant_param1}" /></td>
              </tr>
              <tr>
                  <td>Merchant Param2</td>
                  <td><input type="text" name="merchant_param2" value="${data.merchant_param2}" /></td>
              </tr>
              <tr>
                  <td>Merchant Param3</td>
                  <td><input type="text" name="merchant_param3" value="${data.merchant_param3}" /></td>
              </tr>
              <tr>
                  <td>Merchant Param4</td>
                  <td><input type="text" name="merchant_param4" value="${data.merchant_param4}" /></td>
              </tr>
              <tr>
                  <td>Merchant Param5</td>
                  <td><input type="text" name="merchant_param5" value=""${data.merchant_param5}" /></td>
              </tr>
              <tr>
                  <td>Promo Code:</td>
                  <td><input type="text" name="promo_code" value="${data.promo_code}" /></td>
              </tr>
              <tr>
                  <td>Customer Id:</td>
                  <td><input type="text" name="customer_identifier" value="${data.customer_identifier}" /></td>
              </tr>
              <tr>
                  <td></td>
                  <td><INPUT TYPE="submit" id="button_submit" value="Checkout"></td>
              </tr>
          </table>
      </form>
  </body>
  </html>`
}

// app.listen(process.env.PORT, () => {
//   console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
// });

http.listen(port, function () {
  console.log("Node server listening on port " + port);
});


const generateUniqueId = () => {
  let timestamp = new Date().getTime().toString(36);
  let randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}`;
};

const browserIdExpiration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds


function checkBrowserID(req, res, next) {
  let browserId = req.cookies.browserId;

  //console.log("cookies-----32424242342------->", req.cookies.browserId);

  const now = new Date().getTime();

  if (!browserId || now - browserId.split('-')[0] > browserIdExpiration || browserId == undefined) {
    browserId = generateUniqueId();
    //console.log("browserId-------->", browserId);
    res.cookie('browserId', browserId, { maxAge: browserIdExpiration });
    next();
  } else {
    next();
  }
  //console.log("cookies----aftteetet-------->", req.cookies.browserId);
}

function localStorageMiddleware(req, res, next) {
  let browserId = req.cookies.browserId;

  const localStorageData = JSON.parse(localStorage.getItem(`cart_${browserId}`));
  res.locals.localStorageData = localStorageData;
  //console.log("cookies----req.localStorage-------->", localStorageData);
  next();
}

async function bindOverallCart(req, res, next) {
  let browserId = req.cookies.browserId;
  var BindCart = [];
  const items = JSON.parse(localStorage.getItem(`cart_${browserId}`)) || [];

  // console.log("======items-----------======", items)

  if (items.length > 0) {
    for (var i = 0; i < items.length; i++) {
      const resultitemData = await dataAccess.execute(`SP_Item`, [
        { name: 'Query', value: "SelectAll2" },
        { name: 'ItemID', value: items[i].ItemID }
      ]);

      if (resultitemData.recordset && resultitemData.recordset[0]) {

        let discountInformation;
        if (resultitemData.recordset[0].DiscountDetail) {
          discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
        }
        if (discountInformation) {
          if (discountInformation.length > 0) {

            res.locals.DiscountDetail = discountInformation;

            // var ActualAmt = (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, "")));
            var ActualAmt = (Number(items[i].ItemAmount));

            if (ActualAmt > discountInformation[0].MinAmount || ActualAmt == discountInformation[0].MinAmount) {
              let findDiscountAmount = parseFloat(ActualAmt) * parseFloat(discountInformation[0].Discount) / 100;
              let DiscountAmt = parseFloat(ActualAmt * items[i].Qty) - parseFloat(findDiscountAmount * items[i].Qty);

              BindCart.push({
                browserId_ItemID_Size: items[i].browserId_ItemID_Size,
                ItemID: resultitemData.recordset[0].ItemID,
                ItemName: resultitemData.recordset[0].ItemName,
                Size: items[i].Size,
                Color: resultitemData.recordset[0].Color,
                Material: resultitemData.recordset[0].Material,
                ActualPrice: ActualAmt * items[i].Qty,
                Image: resultitemData.recordset[0].ItemImage,
                Qty: items[i].Qty,
                FinalPrice: DiscountAmt,
                DiscountPrice: findDiscountAmount * (items[i].Qty),
                DiscountName: discountInformation[0].DiscountName
              });
            } else {
              BindCart.push({
                browserId_ItemID_Size: items[i].browserId_ItemID_Size,
                ItemID: resultitemData.recordset[0].ItemID,
                ItemName: resultitemData.recordset[0].ItemName,
                Size: items[i].Size,
                Color: resultitemData.recordset[0].Color,
                Material: resultitemData.recordset[0].Material,
                // ActualPrice: resultitemData.recordset[0].Amount,
                ActualPrice: items[i].ItemAmount,
                Image: resultitemData.recordset[0].ItemImage,
                Qty: items[i].Qty,
                // FinalPrice: (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) * (items[i].Qty),
                FinalPrice: (Number(items[i].ItemAmount)) * (items[i].Qty),
                DiscountPrice: '',
                DiscountName: ''
              });
            }
          } else {
            res.locals.DiscountDetail = [];
            BindCart.push({
              browserId_ItemID_Size: items[i].browserId_ItemID_Size,
              ItemID: resultitemData.recordset[0].ItemID,
              ItemName: resultitemData.recordset[0].ItemName,
              Size: items[i].Size,
              Color: resultitemData.recordset[0].Color,
              Material: resultitemData.recordset[0].Material,
              // ActualPrice: resultitemData.recordset[0].Amount,
              ActualPrice: items[i].ItemAmount,
              Image: resultitemData.recordset[0].ItemImage,
              Qty: items[i].Qty,
              // FinalPrice: (Number(items[i].ItemAmount.replace(/[^0-9\.-]+/g, ""))) * (items[i].Qty),
              FinalPrice: (Number(items[i].ItemAmount)) * (items[i].Qty),
              DiscountPrice: '',
              DiscountName: ''
            });
          }
        } else {
          res.locals.DiscountDetail = [];
          BindCart.push({
            browserId_ItemID_Size: items[i].browserId_ItemID_Size,
            ItemID: resultitemData.recordset[0].ItemID,
            ItemName: resultitemData.recordset[0].ItemName,
            Size: items[i].Size,
            Color: resultitemData.recordset[0].Color,
            Material: resultitemData.recordset[0].Material,
            // ActualPrice: resultitemData.recordset[0].Amount,
            ActualPrice: items[i].ItemAmount,
            Image: resultitemData.recordset[0].ItemImage,
            Qty: items[i].Qty,
            // FinalPrice: (Number(resultitemData.recordset[0].Amount.replace(/[^0-9\.-]+/g, ""))) * (items[i].Qty),
            FinalPrice: (Number(items[i].ItemAmount)) * (items[i].Qty),
            DiscountPrice: '',
            DiscountName: ''
          });
        }
      }
    };
  } else {
    const resultitemData = await dataAccess.execute(`SP_Discount`, [
      { name: 'Query', value: "FetchDiscountDetail" }
    ]);

    if (resultitemData.recordset && resultitemData.recordset[0]) {

      let discountInformation;
      if (resultitemData.recordset[0].DiscountDetail) {
        discountInformation = JSON.parse(resultitemData.recordset[0].DiscountDetail);
      }

      if (discountInformation) {
        if (discountInformation.length > 0) {
          res.locals.DiscountDetail = discountInformation;
        }
      }
    }
  }

  if (BindCart.length > 0) {
    res.locals.cartItemData = BindCart;
    // cache.put(cacheKey, BindCart, 3000); // Cache for 5 minutes (300,000 milliseconds)
  }

  next();
};

// app.get('/aboutpay', function (req, res) {
//   // res.render('about.html');
//   res.sendFile(__dirname + '/views/Asaga/about.html');
// });


// app.get('/CCPayment', function (req, res) {
//     res.render('CCPayment.ejs');
//   });
//   app.get('/ccavRequestHandler', function (request, response) {
//     // console.log("ccavRequestHandler POST", request )
//     ccavReqHandler.postReq(request, response);
//   });

// app.post('/ccavRequestHandler', function (request, response) {
//   // console.log("ccavRequestHandler POST", request )
//   ccavReqHandler.postReq(request, response);
// });

// app.get('/ccavResponseHandler', function (request, response) {
//   // console.log("ccavResponseHandler")
//   ccavResHandler.postRes(request, response);
// });

// app.post('/ccavResponseHandler', function (request, response) {
//   console.log("ccavResponseHandler")
//   ccavResHandler.postRes(request, response);
// });


app.get('/9442', function (req, res) {
  res.sendFile(__dirname + '/sample.html');
});

app.get('/9442', function (req, res) {
  res.render('sample.html');
});

module.exports = app;
