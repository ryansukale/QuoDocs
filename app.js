
/**
 * Module dependencies.
 */

var express = require('express');

//Global variables : Since they are not declared using the var keyword
config = require('./config'),
http = require('http'),
path = require('path'),
app = express(),
formidable = require('formidable'),
util = require('util'),
rootDir = __dirname;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(require('connect').bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser({defer: true}));
//app.use(require('connect').bodyParser());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

routes = require('./routes'); //http://dailyjs.com/2012/01/26/effective-node-modules/

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//This allows you to require files relative to the root
//http://stackoverflow.com/questions/10860244/how-to-make-the-require-in-node-js-to-be-always-relative-to-the-root-folder-of-t
requireFromRoot = (function(root) {
	return function(resource) {
			return require(root+"/"+resource);
	}
})(__dirname);



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//server.on('request', function(request, response) {
//
//	console.log(request.url);
//	if(request.url==='/streams/'){
//		var form = new formidable.IncomingForm(),
//    fields = [],
//    files = [];
//
//		form.on('error', function(err){
//			response.writeHead(200, {'content-type': 'text/plain'});
//			response.end('error:\n\n' + util.inspect(err));
//		});
//
//		form.on('field', function(field, value){
//			console.log(field, value);
//			fields.push([field, value]);
//		});
//
//		form.on('file', function(field, file){
//			console.log(field, file);
//			files.push([field, file]);
//		});
//
//		form.on('end', function(){
//			console.log('-> upload done');
//			response.writeHead(200, {'content-type': 'text/plain'});
//			response.write('Received fields:\n\n ' + util.inspect(fields));
//			response.write('\n\n');
//			response.end('received files:\n\n ' + util.inspect(files));
//		});
//
//		form.encoding = 'utf-8';
//		form.uploadDir = './tmp';
//		form.keepExtensions = true;
//		form.parse(request);
//	}
//	
//});

  

app.use(app.router);