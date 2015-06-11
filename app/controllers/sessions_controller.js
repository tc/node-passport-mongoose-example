var logger = require('log4js').getLogger();
var passport = require('passport');

var controller = {

    login: function(req,res, next) {
      passport.authenticate('login', function(err, user, info) {
        if (err) {
            logger.error(err);
            return next(err);
        }

        if (!user) {
            return res.redirect('/');
        }

        req.logIn(user, function(err) {
            if (err) {
                logger.error(err);
                return next(err);
            }
            return res.redirect('/profile');
        });

      })(req, res, next);
    },

    logout: function(req, res) {
      req.logout();
      res.redirect('/');
    }
};

module.exports = controller;

