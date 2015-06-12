var User = require('./../app/models/user');

var helper = {
    deleteAllTables: function (done) {
        User.remove({}, done);
    }
};

module.exports = helper;

