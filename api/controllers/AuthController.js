/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
module.exports = {
	index: function (req,res)
    {
        res.view();
    },

    passport_local: function(req, res)
    {
        passport.authenticate('local', function(err, user, info)
        {console.log("passport_local"+JSON.stringify(req.body));
            if (err)
            {	
                
                res.redirect('/');
                return;
            }
            if (!user)
            {   
                res.json('User Does not exist');
                return;
            }

            req.logIn(user, function(err)
            {
                if (err)
                {
                	console.log("passport_local use err");
                    res.redirect('/');
                    return;
                }
                if(user.imageUrl==null)user.imageUrl="default.jpg";
                req.session.user = user;
                console.log("passport_local :: "+req.session.passport.user+"::"+JSON.stringify(user));
                //var strobj=user.userFirstName+';'+user.userLastName+';'+user.companyName+';'+user.phone+';'+user.email
                if(user.userType==1){
                    res.redirect('/loginshipper?ufn='+user.userFirstName);
                }
                else{
                    res.redirect('/logincarrier?ufn='+user.userFirstName);
                }
                
                return;
            });
        })(req, res);
    },

    logout: function (req,res)
    {
        req.logout();
        //req.session.user = ""
        req.session.destroy();
        res.redirect('/login');
    }
};
/*module.exports.blueprints = {
  actions: true,
  rest: true,

  shortcuts: true
	
};*/


