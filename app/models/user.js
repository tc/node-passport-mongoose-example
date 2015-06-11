var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/passport_development');
var Schema = mongoose.Schema;

var schema = new Schema({
  id:  Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String
});

schema.pre('save', function(callback) {
  var user = this;

  if (!user.isModified('password')){
      return callback();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
        return callback(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
          return callback(err);
      }

      user.password = hash;
      callback();
    });
  });
});

schema.methods.isValidPassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

var Model = conn.model('User', schema);

module.exports = Model;
