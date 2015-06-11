var logger = require('log4js').getLogger();
var User = require('./../models/User');

var controller = {

    new: function(req, res){
        res.render('accounts/new', {message: req.flash('message'), error: req.flash('error')});
    },

    create: function(req, res, next) {
        var username = req.body.username,
            email = req.body.email,
            password = req.body.password;

        // input validation
        if (!username) {
            req.flash('error', 'No username');
            return res.redirect('/signup');
        }
        if (!email) {
            req.flash('error', 'No mail');
            return res.redirect('/signup');
        }
        if (!password) {
            req.flash('error', 'no password');
            return res.redirect('/signup');
        }

        User.findOne({'username': username},function(err, user) {
            if (err){
                logger.error('Error in SignUp: '+ err);
                return next(err);
            }

            if (user) {
              return next(null, false, req.flash('message','User Already Exists'));
            }

            var newUser = new User();
            newUser.username = username;
            newUser.password = password;
            newUser.email = email;

            newUser.save(function(err) {
                if (err){
                    logger.error('Error in Saving user: '+ err);
                    next(err);
                }

                logger.info('User Registration succesful');
                req.logIn(newUser, function(err) {
                  if (err) {
                      return next(err);
                  }
                  return res.redirect('/profile');
                });
            });
        });
    }
};

module.exports = controller;
