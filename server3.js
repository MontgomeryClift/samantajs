7/*
 * server.js
 * Copyright (C) 2016 salva <salva@salva-WorkStation>
 *
 * Distributed under terms of the MIT license.
 */

 var server = require('http').Server(app);
 var loco = require('http/package').version;
 console.log('version de http -- %j', loco);
//express&express-session
var loco = require('express/package').version;
console.log('version de express -- %j', loco);
var express = require('express');
var app = express();

//socketIO - Server Client (Events)
var io = require('socket.io')(server);
var loco = require('socket.io/package').version;
console.log('version de socket.io -- %j', loco);
//socket AMI - Server Server (Asterisk Events)
var aio = require('asterisk.io'), ami = null;
//initializing AMI socket 4 asterisk
ami = aio.ami(
	'172.30.0.3',
	5038,
	'webadmin',
	'asterisk'
);

ami.on('error', function(err){
	   throw err;
});

var clients = [];

io.on('connection', function(socket) {

});

server.listen(8080, function() {

		console.log("nodejs on %j", server.address());
});
