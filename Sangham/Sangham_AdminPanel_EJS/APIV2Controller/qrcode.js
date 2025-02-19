// /* More Details: https://developer.paytm.com/docs/checksum/#node */

// var PaytmChecksum = require("./PaytmChecksum");

// var paytmParams = {};

// /* Generate Checksum via Array */

// /* initialize an array */
// paytmParams["MID"] = "oywAAl32724891291998";
// paytmParams["ORDERID"] = "YOUR_ORDER_ID_HERE";

// /**
// * Generate checksum by parameters we have
// * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
// */
// var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, "gMbgy6lqQGf8@XzP");
// paytmChecksum.then(function(result){
// 	console.log("generateSignature Returns: " + result);
// 	var verifyChecksum =  PaytmChecksum.verifySignature(paytmParams, "gMbgy6lqQGf8@XzP",result);
// 	console.log("verifySignature Returns: " + verifyChecksum);
// }).catch(function(error){
// 	console.log(error);
// });


const https = require('https');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const PaytmChecksum = require('./PaytmChecksum');

var paytmParams = {};

paytmParams.body = {
    "mid"               : "xhpRUN73731129313977",
    "orderId"           : "OREDRID9876811",
    "amount"            : "1000.00",
    "businessType"      : "UPI_QR_CODE",
    "posId"             : "S1234_P1235",
    "contactPhoneNo"    : "8156067411"
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "lR_vF&371I5Fu7Y4").then(function(checksum){

    paytmParams.head = {
        "clientId"	: "C11",
        "version"	: "v1",
        "signature"	: checksum
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        //hostname: 'securegw-stage.paytm.in',

        /* for Production */
         hostname: 'securegw.paytm.in',

        port: 443,
        path: '/paymentservices/qr/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    post_req.write(post_data);
    post_req.end();
});

