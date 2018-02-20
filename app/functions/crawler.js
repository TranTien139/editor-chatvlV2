/**
 * Created by Tien on 8/5/2017.
 */

var mongoose = require('mongoose');
var cheerio = require("cheerio");
var request = require("request");
var fun = require('../../app/controller/statusController.js');

function crawlerChatvl(url, callback) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body);
            $("#entries-content-ul .gag-link").each(function () {
                var link_image = $(this).children('.content').children('.img-wrap').children('a').children('.thumb-img').attr('src');
                var title = $(this).children('.post-info').children().children('h1').children('a').text();
                var link_crawler = $(this).children('.post-info').children().children('h1').children('a').attr('href');
                if (typeof link_image === 'undefined') {
                    link_image = $(this).children('.content').children('.img-wrap').children('a').children('img').attr('src');
                    if (link_image !== '' && title !== '') {
                        var data = {title: title, image: link_image, linkCrawler: link_crawler, linkVideo: '', type:'image',source:url}
                        fun.SaveTodataBase(data);
                    }
                }else {
                    var video = link_image.replace('https://i.ytimg.com/vi/','').replace('/0.jpg','');
                    if (link_image !== '' && title !== '') {
                        var data = {title: title, image: link_image, linkCrawler: link_crawler, linkVideo: video,type:'video',source:url}
                        fun.SaveTodataBase(data);
                    }
                }

            });
        }
    });
}

function crawlerXem(url, callback) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body);
            $("#leftColumn .photoList .photoListItem").each(function () {
                var link_image = $(this).children('.thumbnail').children('a').children('img').attr('src');
                if (typeof link_image === 'undefined') {
                    link_image = '';
                }
                var title = $(this).children('.info').children('h2').children('a').text();

                var link_crawler = $(this).children('.info').children('h2').children('a').attr('href');
                link_crawler = url + link_crawler;

                if (link_image !== '' && title !== '') {
                    var data = {title: title, image: link_image, linkCrawler: link_crawler,linkVideo: '',type:'image',source:url}
                    fun.SaveTodataBase(data);
                }
            });
        }
    });
}

module.exports.crawlerChatvl = crawlerChatvl;
module.exports.crawlerXem = crawlerXem;