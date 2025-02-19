const { Console } = require('console');
var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring');

exports.postReq = function (request, response) {
    //debugger;
    var body = '',
        accessCode= 'AVKP54IJ69CG80PKGC',
        workingKey= '3EC3A98B606D7E569625E3A0028DB332',
        encRequest = '',
        formbody = '';
    var data = request.body
    // var rediret_url = `http%3A%2F%2F202.0.103.177%3A9906%2FccavResponseHandler`
    var redirect_url = 'https%3A%2F%2Fasaga.in%2FccavResponseHandler'
    var data___ = `merchant_id=697662&order_id=${data.order_id}&currency=${data.currency}&amount=${data.amount}&redirect_url=${redirect_url}&cancel_url=${redirect_url}&language=${data.language}&billing_name=${data.billing_name}&billing_address=${data.billing_address}&billing_city=${data.billing_city}&billing_state=${data.billing_state}&billing_zip=${data.billing_zip}&billing_country=${data.billing_country}&billing_tel=${data.billing_tel}&billing_email=${data.billing_email}&delivery_name=${data.delivery_name}&delivery_address=${data.delivery_address}&delivery_city=${data.delivery_city}&delivery_state=${data.delivery_state}&delivery_zip=${data.delivery_zip}&delivery_country=${data.delivery_country}&delivery_tel=${data.delivery_tel}&merchant_param1=&merchant_param2=&merchant_param3=&merchant_param4=&merchant_param5=&promo_code=&customer_identifier=`
    encRequest = ccav.encrypt(data___, workingKey);
    formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" name="currency" value="INR">  <input type="hidden" id="currency" name="currency" value="INR"> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(formbody);
    response.end();
    return;
};
