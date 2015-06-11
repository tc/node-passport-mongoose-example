var controller = {
    index: function (req, res) {
        var pageOpts = {user: req.user,
                        message: req.flash('message'),
                        error: req.flash('error') };
        res.render('index', pageOpts);
    },

    profile: function (req, res) {
        var pageOpts = { user: req.user,
                         message: req.flash('message'),
                         error: req.flash('error') };
        res.render('profile', pageOpts);
    }
};

module.exports = controller;
