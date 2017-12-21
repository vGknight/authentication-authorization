var ConnectRoles = require('connect-roles'); // app/routes.js
module.exports = function(app, passport) {
    // var user = new ConnectRoles({
    //     failureHandler: function(req, res, action) {
    //         // optional function to customise code that runs when
    //         // user fails authorisation
    //         var accept = req.headers.accept || '';
    //         res.status(403);
    //         if (~accept.indexOf('html')) {
    //             res.render('access-denied', { action: action });
    //         } else {
    //             res.send('Access Denied - You don\'t have permission to: ' + action);
    //         }
    //     }
    // });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // Admin SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in and have the 'admin-role' to visit
    // we will use route middleware to verify this (the isAdmin function)
    app.get('/admin', isLoggedIn, isAdmin, function(req, res) {

        console.log(res.locals.user.role);
        // console.log(res.locals.role);

        // if (res.locals.user.role == 'admin-role') {
            console.log('admin!');
            res.render('admin.ejs', {
                user: req.user, // get the user out of session and pass to template
                role: req.role
            });
        // } else {
        //     console.log('not admin');
        //     // res.redirect('/profile');
        //     res.render('access-denied.ejs', {
        //         user: req.user, // get the user out of session and pass to template
        //         role: req.role
        //     });
        // }


        // }

    });
    // connect route
    // app.get('/admin', isLoggedIn, user.can('access admin page'), function(req, res) {
    //     res.render('admin');
    // });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure user has admin role, if not shows access denied
function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on
    if (res.locals.user.role == 'admin-role') {
        console.log("from isAdmin fn return next");
        return next();
    }

    // if they aren't redirect them to the home page
    else {
        console.log("from isAdmin fn");
        res.render('access-denied.ejs');
    };
}
// build logic to only allow users to view own profile/orders
function canViewOwnProfile(req, res, next) {

    // if user is authenticated in the session, carry on
    if (res.locals.user.role == 'user-role') {
        console.log("from isAdmin fn return next");
        return next();
    }

    // if they aren't redirect them to the home page
    else {
        console.log("from isAdmin fn");
        res.render('access-denied.ejs');
    };
}