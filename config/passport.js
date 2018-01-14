// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var domain = require('../config/domain.js');

// load up the user model
var User = require('../app/models/user');

var configAuth = require('./auth');

function ChangeToSlug(title) {
    var slug;
    slug = title.toLowerCase();
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    slug = slug.replace(/ /g,'-');
    return slug;
}

module.exports = function (passport) {



    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            User.findOne({'email': email}, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Email này đã tồn tại'));
                } else {
                    // if there is no user with that email
                    // create the user
                    if (req.body.fullname.trim() !== '' && email.trim() !== '' && password !== '' && password.length >= 6) {

                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        var checkemail = re.test(email);
                        var slug = ChangeToSlug(req.body.fullname) +'@'+ Math.floor(Math.random() * Math.floor(10000));
                        if (checkemail) {
                            if (password === req.body.repassword) {
                                var newUser = new User();
                                // set the user's local credentials
                                newUser.email = email;
                                newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
                                newUser.name = req.body.fullname;
                                newUser.userSlug = slug;
                                newUser.image = 'https://www.onlinejobs.ph/images/default-avatar.png';
                                newUser.level = 'admin';
                                newUser.id_social = '';

                                // save the user
                                newUser.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            } else {
                                return done(null, false, req.flash('signupMessage', 'Mật khẩu không khớp'));
                            }

                        } else {
                            return done(null, false, req.flash('signupMessage', 'Không đúng định dang email'));
                        }
                    } else {
                        return done(null, false, req.flash('signupMessage', 'Bạn nhập thiếu trường'));
                    }
                }
            });

        }));


    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'email': email}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);



                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Tài khoản không tồn tại')); // req.flash is the way to set flashdata using connect-flash


                if (user.level !== 'admin')
                    return done(null, false, req.flash('loginMessage', 'Bạn không có quyền đăng nhập'));

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Nhập sai mật khẩu')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));
};
