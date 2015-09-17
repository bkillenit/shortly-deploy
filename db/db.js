var mongoose = require('mongoose');
var schema = mongoose.Schema;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   createSchema();
// });


var config = require('./config.js')

// connect to mongoDb
mongoose.connect(config.url);
 
// connection events: 
// we can use the mongoose api to hook into events e.g. when connecting / disconnecting to MongoDB
mongoose.connection.on('connected', function() {
  console.log('Connected to url: ' + config.url);
});
mongoose.connection.on('error', function(err) {
  console.log('Connection error: ' + err);
});


var Url = new schema({
  'url': {type: String, required: true},
  'base_url': {type: String, required: true},
  'code': {type: String},
  'title': {type: String},
  'visits': {type: Number}
});

var User = new schema({
  'username': {type: String, required: true},
  'password': {type: String, required:true}
});

exports.urlMod = mongoose.model('Url', Url);
exports.userMod = mongoose.model('User', User);

module.exports = {
  // the database url to connect
  // (Note: later we will connect to an Azure hosted instance)
  url : 'mongodb://localhost/nodeToDo'
}