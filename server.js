
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

process.env.TZ = 'Asia/Ho_Chi_Minh';

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.session({secret: 'vantientran'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.bodyParser());
app.use(flash());

setInterval(function (){
    console.log('xem.vn');
    crawler.crawlerXem('https://xem.vn');
},1000 * 12* 3600);


setInterval(function (){
    console.log('chat vl.com');
    crawler.crawlerChatvl('http://chatvl.com');
},1000 * 12* 3600);



require('./app/routes.js')(app, passport,server);

server.listen(port);
console.log("listening port ", port);

