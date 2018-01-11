
var Article = require('../../app/models/article.js');
var User = require('../../app/models/user.js');

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
    User.find({}).sort({date: -1}).skip(skip).limit(20).exec(function (err,data) {
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
            result.likes = [];
            result.shares = [];
            result.dislikes = [];
            result.save(function (err) {
                if(err) throw err;
            });
            callback(err,result);
        }
    });
}

function XoaBaiViet(id,callback) {
    Article.remove({'_id':id}).exec(function(err, result){
        callback(err,result);
    });
}

module.exports.SaveTodataBase = SaveTodataBase;
module.exports.DanhSachChoDuyet = DanhSachChoDuyet;
module.exports.DuyetBaiViet = DuyetBaiViet;
module.exports.XoaBaiViet = XoaBaiViet;
module.exports.CountDanhSachChoDuyet = CountDanhSachChoDuyet;

module.exports.DanhSachUser = DanhSachUser;
module.exports.CountDanhSachUser = CountDanhSachUser;