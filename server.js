'use strict';

console.log('[%s]\nSystem started. Initializing system parameters.', new Date());

var http = require('http');

var connect = require('connect');
var logger = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var connectRedis = require('connect-redis');
var multiparty = require('connect-multiparty');
var errorHandler = require('errorhandler');


var server = connect();

server.use(logger('dev'));
server.use(compress());
server.use(bodyParser());
server.use(multiparty({limit: '8mb'}));
server.use(cookieParser());
server.use(serveStatic(__dirname + '/dist'));
server.use(methodOverride());

server.use(errorHandler({ dumpExceptions: true, showStack: true }));

http.createServer(server).listen(1337, function () {
  console.log('HTTP server listening on port %d', 1337);
});