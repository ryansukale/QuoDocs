
/**
 * Module dependencies.
 */

var express = require('express');
//routes = require('./routes'),
fs = require('fs'),
http = require('http'),
path = require('path'),
app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//I first considered using the advice from for setting up routes
//dailyjs.com/2012/01/26/effective-node-modules/
//Then I thought, the last answer to this question was way more cooler.
//http://stackoverflow.com/questions/9027648/proper-way-to-organize-myapp-routes
app.settings.routePath='./routes/';
console.log('Loading routes from: ' + app.settings.routePath);
fs.readdirSync(app.settings.routePath).forEach(function(file) {
		var route = app.settings.routePath + file.substr(0, file.indexOf('.'));
		console.log('Adding route:' + route);
		require(route)(app);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
