
/**
 * Module dependencies.
 */

var express = require('express');

//Global variables : Since they are not declared using the var keyword
config = require('./config'),
http = require('http'),
path = require('path'),
app = express(),
routes = require('./routes'), //http://dailyjs.com/2012/01/26/effective-node-modules/
rootDir = __dirname;

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

//This allows you to require files relative to the root
//http://stackoverflow.com/questions/10860244/how-to-make-the-require-in-node-js-to-be-always-relative-to-the-root-folder-of-t
requireFromRoot = (function(root) {
    return function(resource) {
        return require(root+"/"+resource);
    }
})(__dirname);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
