/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	saveDetails: function (req, res) {
		console.log('Hello GK"');
		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			/*host     : 'us-cdbr-iron-east-04.cleardb.net',
			user     : 'b28812d048a235',
			password : '8a07c11a',
			database : 'heroku_67bca853788ef8b'*/
			host     : 'sql6.freesqldatabase.com',
			user     : 'sql6130033',
			password : 'Vwr5LRNtw5',
			database : 'sql6130033'
		});
		//console.log("req : " +JSON.stringify(req.body));
		console.log("req : " +req.param('a'));

		
		var items		= req.body;
		var userName 	= req.param('a');
		var firstName 	= req.param('b');
		var lastName 	= req.param('c');
		var gender		= req.param('d');
		var intrestedIn	= req.param('e');
		var notification= req.param('f');
		var Password 	= req.param('g');
		var userType	= 1;
		
			
		connection.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				return;
			}
			 
			console.log('connected');// as id ' + connection.threadId);
		});
			
		connection.query('call usp_chatUserDetailsAdd(?,?,?,?,?,?,?)',[userName,firstName,lastName, gender,intrestedIn,notification,Password], function(err, rows, fields) {
			if (err) throw err;
			//res.json(JSON.parse(JSON.stringify(rows)));
			res.json('Your Registration is Done With the details: \n'+userName+" : "+firstName+" : "+lastName+" : "+gender+" : "+intrestedIn+" : "+notification+" : "+Password);

		});			 
		connection.end();
	},
	index: function(req, res) {
    	res.view({
      		user: req.user
    	});
  	},
  	login: function(req, res) {
    	res.view({
      		user: req.user
    	});
  	},
  	shipperhome:function(req, res) {
  		if(req.session.user.userType==0 || req.session.user.usertype=="carrier"){
			return res.view('pagenotfound');
		}
	    res.view({user: req.user});
	},
	carrierhome:function(req, res) {
		if(req.session.user.userType==1 || req.session.user.usertype=="shipper"){
			return res.view('pagenotfound');
		}
	    res.view({user: req.user});
	},
	profile:function(req, res){
		res.view({
      		user: req.user
    	});
	}
	
};

