// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
      email        : String,
      id_social    : String,
      name         : String,
      userSlug: String,
      birthday: String,
      job:  String,
      level : String,
      gender: String,
      hometown: String,
      education: String,
      image        : String,
      cover        : String,
      created_at        : {type: Date, default: Date.now},
      description        : String,
      password     : String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
