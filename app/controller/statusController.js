
var Article = require('../../app/models/article.js');
var User = require('../../app/models/user.js');
var ObjectID = require('mongodb').ObjectID;

function SaveTodataBase(data) {
    Article.findOne({'title': data.title, image: data.image}, function (err, result) {
       if(result === null) {
           var newArticle = new Article();
           newArticle.title= data.title;
           newArticle.image = data.image;
           newArticle.status = 'Draft';
           newArticle.linkCrawler = data.linkCrawler;
           newArticle.linkVideo = data.linkVideo;
           newArticle.type = data.type;
           newArticle.source = data.source;
           newArticle.date = Math.floor(Date.now()/1000);
           newArticle.save(function (err) {
               if(err) throw err;
           });
       }
    });
}

function DanhSachChoDuyet(skip,status,callback) {
    Article.find({status: status}).sort({date: -1}).skip(skip).limit(20).exec(function (err,data) {
        callback(err, data);
    });
}

function CountDanhSachChoDuyet(status, callback) {
     Article.count({status: status}, function (err, count) {
         callback(null, count);
     });
}

function DanhSachUser(skip,callback) {
    User.find({}).sort({published_at: -1}).skip(skip).limit(20).exec(function (err,data) {
        callback(err, data);
    });
}

function CountDanhSachUser(callback) {
    User.count({}, function (err, count) {
        callback(null, count);
    });
}

function DuyetBaiViet(id,user, callback) {
    Article.findOne({'_id': id}, function (err, result) {
        if(result !== null) {
            result.userId = user._id,
            result.userSlug = user.userSlug,
            result.status = 'Publish';
            result.published_at = Math.floor(Date.now()/1000);

            result.total_like = 0;
            result.like_icon = [];
            result.total_share = 0;
            result.total_comment = 0;
            result.total_view = 0;
            result.likes = [];

            result.save(function (err) {
                if(err) throw err;
            });
            callback(err,result);
        } else {
            callback(err,result);
        }
    });
}

function XoaBaiViet(id,callback) {
    Article.remove({'_id':id}).exec(function(err, result){
        callback(err,result);
    });
}

function NhapBaiViet(id,callback) {
    Article.findOne({'_id': id}, function (err, result) {
        if(result !== null) {
            result.status = 'Draft';
            result.save(function (err) {
                if(err) throw err;
            });
            callback(err,result);
        }
    });
}

module.exports.SaveTodataBase = SaveTodataBase;
module.exports.DanhSachChoDuyet = DanhSachChoDuyet;
module.exports.DuyetBaiViet = DuyetBaiViet;
module.exports.XoaBaiViet = XoaBaiViet;
module.exports.NhapBaiViet = NhapBaiViet;
module.exports.CountDanhSachChoDuyet = CountDanhSachChoDuyet;

module.exports.DanhSachUser = DanhSachUser;
module.exports.CountDanhSachUser = CountDanhSachUser;
