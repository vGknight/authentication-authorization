// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
// var ConnectRoles = require('connect-roles');
var flash    = require('connect-flash');
// var user = new ConnectRoles({
//   failureHandler: function (req, res, action) {
//     // optional function to customise code that runs when
//     // user fails authorisation
//     var accept = req.headers.accept || '';
//     res.status(403);
//     if (~accept.indexOf('html')) {
//       res.render('access-denied', {action: action});
//     } else {
//       res.send('Access Denied - You don\'t have permission to: ' + action);
//     }
//   }
// });

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(function(req, res, next) {
    res.locals.user = req.user; // This is the important line

    next();
});

// connect stuff



// app.use(user.middleware());

//anonymous users can only access the home page
//returning false stops any more rules from being
//considered
// user.use(function (req, action) {
//   if (!req.isAuthenticated()) return action === 'access home page';
// })

// //moderator users can access private page, but
// //they might not be the only ones so we don't return
// //false if the user isn't a moderator
// user.use('access private page', function (req) {
//   if (req.user.role === 'user-role') {
//     return true;
//   }
// })

// //admin users can access all pages
// user.use('access admin page',function (req) {
//   if (res.locals.user.role === 'admin-role') {
//   	console.log(res.locals.user.role);
//     return true;
//   }
//   console.log(res.locals.user.role);
// });




///


app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
