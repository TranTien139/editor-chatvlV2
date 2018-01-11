// app/routes.js

var User = require('../app/models/user.js');
var mongoose = require('mongoose');
var domain = require('../config/domain.js');
var fun =  require('./controller/statusController.js');

var path = require('path'),
    fs = require('fs');

module.exports = function (app, passport, server) {

    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            res.render('login.ejs', {message: req.flash('signupMessage')});
        }
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function (req, res) {
        var user = req.user;
        res.render('index.ejs', {
            user: user
        });
    });

    app.get('/danh-sach-chua-duyet', isLoggedIn, function (req, res) {
        var user = req.user;
        var page = req.query.page;
        if(typeof page === 'undefined'){
            page ==0;
        }
        var skip = parseInt(page)*20;
        fun.DanhSachChoDuyet(skip,'Draft',function (err, data) {
             fun.CountDanhSachChoDuyet('Draft', function (err, count) {
                 res.render('danhsachcho.ejs', {
                     data: data,
                     user: user,
                     len: count
                 });
             });
        });

    });

    app.get('/danh-sach-da-duyet', isLoggedIn, function (req, res) {
        var user = req.user;
        var page = req.query.page;
        if(typeof page === 'undefined'){
            page ==0;
        }
        var skip = parseInt(page)*20;
        fun.DanhSachChoDuyet(skip,'Publish',function (err, data) {
            fun.CountDanhSachChoDuyet('Publish', function (err, count) {
                res.render('danhsachdaduyet.ejs', {
                    data: data,
                    user: user,
                    len: count
                });
            });
        });
    });

    app.get('/danh-sach-user', isLoggedIn, function (req, res) {
        var user = req.user;
        var page = req.query.page;
        if(typeof page === 'undefined'){
            page ==0;
        }
        var skip = parseInt(page)*20;
        fun.DanhSachUser(skip,function (err, data) {
            fun.CountDanhSachUser(function (err, count) {
                res.render('danhsachuser.ejs', {
                    data: data,
                    user: user,
                    len: count
                });
            });
        });

    });

    app.get('/publish/:id', isLoggedIn, function (req, res) {
        var user = req.user;
        var id_art = req.params.id;
        if(typeof id_art !== 'undefined'){
            fun.DuyetBaiViet(id_art,user,function (err, data) {
               var backURL=req.header('Referer') || '/';
                res.redirect(backURL);
            });
        }else {
            var backURL=req.header('Referer') || '/';
            res.redirect(backURL);
        }
    });

    app.get('/trang-ca-nhan', isLoggedIn, function (req, res) {
        var user = req.user;
        res.render('profile.ejs', {
            user: user
        });
    });

    app.get('/delete/:id', isLoggedIn, function (req, res) {
        var user = req.user;
        var id_art = req.params.id;
        if(typeof id_art !== 'undefined'){
            fun.XoaBaiViet(id_art,function (err, data) {
                var backURL=req.header('Referer') || '/';
                res.redirect(backURL);
            });
        }else {
            var backURL=req.header('Referer') || '/';
            res.redirect(backURL);
        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
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
