/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	saveDetails: function (req, res) {
			var mysql      = require('mysql');
			var connection = mysql.createConnection({
			  host     : sails.config.dbConfig.host,
			  user     : sails.config.dbConfig.user,
			  password : sails.config.dbConfig.password,
			  database : sails.config.dbConfig.database
			});

			var items		= req.body;
			var firstName 	= items.first_name;
			var lastName 	= items.last_name;
			var companyName = items.company_name;
			var phone		= items.phone;
			var city		= items.city;
			var state		= items.state;
			var dotNumber	= items.dot_number;
			var email		= items.email;
			var Password 	= items.password;
			var userType	= 1;
			if(items.usertype=="carrier")userType=0;
			connection.connect(function(err) {
			  if (err)console.error('error connecting: ' + err.stack);
			});
			connection.query('call usp_SignUpDetailsAdd(?,?,?,?,?,?,?,?,?,?)',[firstName,lastName, companyName,phone,city,state,dotNumber,email,Password,userType], function(err, rows, fields) {
				if (err) console.error('Error in saveDetails : ' + err.stack);
				req.session.user = req.body;
				res.json(JSON.parse(JSON.stringify(rows)));
			});			 
			connection.end();
	},
	getDetails: function (req, res) {
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
		  host     : sails.config.dbConfig.host,
		  user     : sails.config.dbConfig.user,
		  password : sails.config.dbConfig.password,
		  database : sails.config.dbConfig.database
		});
		connection.connect(function(err) {if (err)return;});
		connection.query('select * from user order by 1 desc',function(err, rows, fields) {
			if (err) console.error('Error in getDetails : ' + err.stack);
			res.json(JSON.parse(JSON.stringify(rows)));
		});			 
		connection.end();
	},	
	getProfileDetails: function (req, res){
		res.json(req.session.user);
	},
	updateProfileDetails: function(req, res){
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			host     : sails.config.dbConfig.host,
			user     : sails.config.dbConfig.user,
			password : sails.config.dbConfig.password,
			database : sails.config.dbConfig.database
		});
		var items		= req.body;
		var firstName 	= items.userFirstName;
		var lastName 	= items.userLastName;
		var companyName = items.companyName;
		var phone		= items.phone;
		var email		= items.email;
		var id			= items.id;
		connection.connect(function(err) {
		  if (err)console.error('error connecting: ' + err.stack);
		});			
		connection.query('call usp_updateUserDetails(?,?,?,?,?,?)',[firstName,lastName, companyName,phone,email,id], function(err, rows, fields) {
			if (err){
				console.error('Error in updateProfileDetails : ' + err.stack);
				res.json({Status : "FAILED"});
			}
			else{
				req.session.user.userFirstName=firstName;
				req.session.user.userLastName=lastName;
				req.session.user.companyName=companyName;
				req.session.user.phone=phone;
				req.session.user.email=email;
				res.json(JSON.parse(JSON.stringify(rows)));
			} 
		});			 
		connection.end();
	},
	updatePassword: function(req, res){
		var items			= req.body;
		var oldpswd			= items.cpswd
		var newpswd 		= items.npswd;
		var confirmpswd 	= items.cnpswd;
		var id				= items.id;

		if(req.session.user.password==oldpswd){
			if(req.session.user.password==newpswd){return res.json("nochange");}
			var mysql      = require('mysql');
			var connection = mysql.createConnection({
			 	host     : sails.config.dbConfig.host,
			  	user     : sails.config.dbConfig.user,
			  	password : sails.config.dbConfig.password,
			  	database : sails.config.dbConfig.database
			});			
			connection.connect(function(err) {
				if (err)console.error('error connecting: ' + err.stack);
			});			
			connection.query('call usp_updatePassword(?,?)',[newpswd,id], function(err, rows, fields) {
				if (err){
					console.error('Error in updatePassword : ' + err.stack);
					res.json({Status : "FAILED"});
				}
				else{
					req.session.user.password=newpswd;
					res.json(JSON.parse(JSON.stringify(rows)));
				}				
			});			 
			connection.end();
		}
		else{res.json("wp");}		
	},
	upload: function(req, res) {
    if (req.method === 'GET')return res.json({ 'status': 'GET not allowed' });

    var uploadFile = req.file('uploadFile');
    uploadFile.upload({ dirname: require('path').resolve(sails.config.appPath, 'assets/images'),maxBytes: 1000000 },function onUploadComplete(err, files) {
    	console.log("file : "+JSON.stringify(files));

        if (err) return res.serverError(err);
        var ppic = files[0].fd.substring(files[0].fd.indexOf('images') + 7,files[0].fd.length);
        req.session.user.imageUrl=ppic;

		var mysql      = require('mysql');
        var connection = mysql.createConnection({
			  host     : sails.config.dbConfig.host,
			  user     : sails.config.dbConfig.user,
			  password : sails.config.dbConfig.password,
			  database : sails.config.dbConfig.database
		});
		var id			= req.session.user.id;
		connection.connect(function(err) {
			if (err) {console.error('error connecting: ' + err.stack);}
		});			
		connection.query('call usp_updateImageUrl(?,?)',[ppic,id], function(err, rows, fields) {
			if (err) console.error('Error in upload : ' + err.stack);
			res.redirect('/profile');
		});			 
		connection.end();
        //res.json({ status: 200, file: files });
    });
	
}

};
