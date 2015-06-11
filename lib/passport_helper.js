var logger = require('log4js').getLogger();
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../app/models/User');

var helper = {
    serializeUser: function(user, done) {
        done(null, user._id);
    },

    deserializeUser: function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    },

    localLoginStrategy: function () {
        var strategy = new LocalStrategy({
          passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'email' :  email },
                function(err, user) {
                  if (err) {
                    return done(err);
                  }

                  if (!user){
                    return done(null, false, req.flash('error', 'User Not found.'));
                  }

                  // User exists but wrong password, log the error
                  user.isValidPassword(password, function (err, valid) {
                      if (valid) {
                          return done(null, user);
                      } else {
                          return done(null, false, req.flash('error', 'Invalid Password'));
                      }
                  });
                }
        );
        });

        return strategy;
    },

    isAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }
};

module.exports = helper;

