// Create server
var app = require('./app');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var async = require('asyncawait/async');
var randomstring = require('randomstring');

module.exports = server;
