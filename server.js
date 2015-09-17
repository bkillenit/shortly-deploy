var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = process.env.PORT || 4568;

// dunno what config is yet
mongoose.connect(config.url);

app.listen(port);

console.log('Server now listening on port ' + port);
