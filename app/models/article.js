/**
 * Created by Tien on 8/6/2017.
 */
var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

var AricleSchema = mongoose.Schema({
  userId: ObjectId,
  userSlug: String,
  title: String,
  image: String,
  linkCrawler: String,
  linkVideo: String,
  status: String,
  views: String,
  type: String,
  source: String,
  published_at: Number,
  date: Number,
  total_like: Number,
  like_icon: Array,
  total_share: Number,
  total_comment: Number
});

module.exports = mongoose.model('Article',AricleSchema);
