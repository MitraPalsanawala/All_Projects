var http = require('http'),
	fs = require('fs'),
	ccav = require('./ccavutil.js'),
	qs = require('querystring');
const HtmlTableToJson = require('html-table-to-json');
const dataAccess = require('./data-access')
const Connection = require('./Connection')

exports.postRes = function (request, response) {
	var ccavEncResponse = '',
		ccavResponse = '',
		workingKey = '3EC3A98B606D7E569625E3A0028DB332',//Put in the 32-Bit key shared by CCAvenues.
		ccavPOST = '';
	console.log(request.query, request.body)

	var _custom = ''
	var _encryption = request.body.encResp
	var final_data = ccavResponse = ccav.decrypt(_encryption, workingKey);
	console.log('final_data', final_data)
	const params = new URLSearchParams(final_data);
	const paramObject = Object.fromEntries(params.entries());
	paramObject.order_id
	// return response.se
	var orderID = paramObject.order_id
	var orderStatus = paramObject.order_status
	var trackID = paramObject.tracking_id ? paramObject.tracking_id : ''
	var rawJson = JSON.stringify(paramObject)
	var insert_query = `INSERT INTO tblUserTransactionDetails (transaction_code, id, object) VALUES (N'${orderID}', N'${trackID}', N'${rawJson}')`
	var insert_result = dataAccess.query(insert_query);
	if (orderStatus == 'Success') {
		return response.writeHead(301, {
			Location: `http://asaga.in/OrderSuccess/` + orderID
		}).end();
	}
	else {
		return response.writeHead(301, {
			Location: `http://asaga.in/OrderCancle/` + orderID
		}).end();
	}

};
