var http = require('http');
var httpLogger = require('morgan');
var logger = require('log4js').getLogger();
var flash = require('connect-flash');
var express = require('express');
var expressSession = require('express-session');
var expressHandlebars = require('express-handlebars');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var bodyParser = require('body-parser');
var passportHelper = require('./lib/passport_helper');
var controllers = require('./app/controllers/index');

var app = express();
app.disable('x-powered-by');

app.use(httpLogger());
app.use(bodyParser.json({limit: 2000000}));
app.use(bodyParser.urlencoded({}));

app.use(expressSession({
    secret: 'bxcvbaer23488afsdfaj0234230-32423fasdfjk',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: new MongoStore({ url: 'mongodb://localhost:27017/passport_development'})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'hbs');
app.set('views', __dirname + '/app/views');
app.engine('hbs', expressHandlebars({ extname: '.hbs',
                                      defaultLayout: 'base',
                                      partialsDir: __dirname + '/app/views/partials',
                                      layoutsDir: __dirname + '/app/views/layouts'}));

passport.use('login', passportHelper.localLoginStrategy());
passport.serializeUser(passportHelper.serializeUser);
passport.deserializeUser(passportHelper.deserializeUser);

app.post('/login',   controllers.SessionsController.login);
app.get('/logout', controllers.SessionsController.logout);

app.get('/signup',   controllers.AccountsController.new);
app.post('/signup',  controllers.AccountsController.create);

app.get('/profile', passportHelper.isAuthenticated, controllers.HomeController.profile);
app.get   ('/',     controllers.HomeController.index);

app.use(function(req, res) {
    res.status(404).json({msg: 'Not Found'});
});

app.use(function(error, req, res, next) {
    logger.error(error);
    res.status(500).json({msg: 'Error'});
});


var server = http.createServer(app);
module.exports = server;
