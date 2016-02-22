var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/foodZen');

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// start listening to requests on port 3000
app.listen(3000);
console.log("listening on port 3000");
// export our app for testing and flexibility, required by index.js
module.exports = app;
