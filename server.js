/*
 * server.js
 * Copyright (C) 2016 salva <salva@salva-WorkStation>
 *
 * Distributed under terms of the MIT license.
 */

//express&express-session
var express = require('express');
var session = require('express-session');
var app = express();

var sessionOptions = {
	secret: "secret",
	resave : true,
	saveUninitialized : false
};

//socketIO - Server Client (Events)
var io = require('socket.io')(server);

//socket AMI - Server Server (Asterisk Events)
var aio = require('asterisk.io'), ami = null;
var loco = require('socket.io/package').version;
console.log(loco);
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

//HTTP Server
var server = require('http').Server(app);

//initializing APP
app.use(session(sessionOptions));

app.get("/", function(req, res) {

	if ( !req.session.views){

		req.session.views = 1;
	}else{

		req.session.views += 1;
	}

	res.json({

		"status":"ok",
		"frequency" : req.session.views,
		"id": req.session.id,
		"session": req.session
	});
});

//initializing io Sockets & clients object
var clients = [];

io.use(sharedsession(session, {
    autoSave:true
}));

io.on("connection", function(socket) {
	socket.on("login", function(userdata) {
			socket.handshake.session.userdata = userdata;
			console.log(socket.handshake.session);
	});
	socket.on("logout", function(userdata) {
		console.log('borrar Session ID (userdata)');
			if (socket.handshake.session.userdata) {
					delete socket.handshake.session.userdata;
			}
	});
	socket.on("ask", function(userdata) {
			if (socket.handshake.session.userdata) {
					console.log(socket.handshake.session);
			}
	});
}

server.listen(8080, function() {

		console.log("nodejs on %j", server.address());
});
