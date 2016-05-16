var app = require('express')(),
  server  = require("http").createServer(app),
  io = require("socket.io")(server),
  session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  }),
  sharedsession = require("express-socket.io-session");


// Attach session
app.use(session);

// Share session with io sockets
io.use(sharedsession(session));

io.on("connection", function(socket) {
    // Accept a login event with user's data
    console.log(socket.handshake.session.userdata);
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
});

server.listen(8080, function() {

		console.log("nodejs on %j", server.address());
});
