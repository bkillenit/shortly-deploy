var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = process.env.PORT || 4568;

// dunno what config is yet
mongoose.connect('mongodb://shortly:C_xP0IbncOlYUFUiB1bUCy9W6.iE1e7N9bkEe9W1gBE-@ds042698.mongolab.com:42698/shortly');

app.listen(port);

console.log('Server now listening on port ' + port);
