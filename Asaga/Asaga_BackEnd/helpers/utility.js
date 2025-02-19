const helper = require('../helpers/utility.js');
// const tblVisitorModel = require("../Models/tblVisitorModel");
var nodemailer = require('nodemailer');

exports.generatePassword = function (length) {
	// Define all possible characters that can be used in the password
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';

	let password = '';
	// Generate random characters and add them to the password until it reaches the desired length
	for (let i = 0; i < length; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	//console.log("---password-------->", password);

	return password;
}

//------ Email -----//

var transporter = nodemailer.createTransport({
	// host: 'smtp.gmail.com',
	// port: 587,
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	}
});

exports.SendMail = function (EmailID, Subject, Body) {
	try {
		var fromEmail;
		console.log("345354353535", EmailID, Subject, Body)
		var mailOptions = {
			from: process.env.EMAIL_SMTP_USERNAME,
			to: EmailID,
			subject: Subject,
			html: Body,
			// attachments: [
			// 	{ // use URL as an attachment
			// 	   filename: 'User Manual for VMS.pdf',
			// 	   path: './public/SmartCollection/User Manual for VMS.pdf'
			// 	}
			//  ]
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response + 'id: ' + EmailID);
			}
		});

	} catch (err) {
		return err.message;
	}
};

