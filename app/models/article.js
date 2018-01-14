/**
 * Created by Tien on 8/6/2017.
 */
var mongoose = require("mongoose");

var AricleSchema = mongoose.Schema({
  userId: String,
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
  date: {type: Date, default: Date.now},
  likes: [],
  shares: [],
  dislikes: []
});

module.exports = mongoose.model('Article',AricleSchema);
