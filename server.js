
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser =    require("body-parser");
var cron = require("node-cron");
var cheerio = require("cheerio");
var request = require("request");
var server = require('http').createServer(app);

var configDB = require('./config/database.js');
var crawler = require('./app/functions/crawler.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.logger('dev')); // log every request to the console
app.use(express.cookieParser());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.session({secret: 'vantientran'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.bodyParser());
app.use(flash());

cron.schedule('00 00 12 * * *', function () {
   crawler.crawlerXem('https://xem.vn');
});

cron.schedule('00 00 14 * *', function () {
    crawler.crawlerChatvl('http://chatvl.com');
});

require('./app/routes.js')(app, passport,server);

server.listen(port);
console.log("listening port ", port);

