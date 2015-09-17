// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

var UserSch = new mongoose.Schema({
  'username': {type: String, required: true},
  'password': {type: String, required: true}
});

var Link = mongoose.model('User', UserSch);

module.exports = User;
