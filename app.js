/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/hello', routes.hello);
app.get('/', routes.index);

app.listen(3080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Chat

var chat = io.listen(app);
var clients = {};

chat.sockets.on('connection', function (socket) {

  socket.on('setup', function(box) {
    socket.emit('init_boxes', clients);

    eval("clients.client_" + socket.id + "= {}")
    eval("clients.client_" + socket.id + ".box = box")
    eval("clients.client_" + socket.id + ".id = socket.id")

    eval("chat.sockets.emit('new_box', clients.client_" + socket.id + ")");

    socket.emit('ready')
  });

  socket.on('msg_room', function(room, data) {
    console.log('hello world');
    chat.sockets.to(room).emit('new_msg', room, data);
  });

  socket.on('move_box', function(mousePos) {
    eval("clients.client_" + socket.id + ".box.x = mousePos.x")
    eval("clients.client_" + socket.id + ".box.y = mousePos.y")

    eval("chat.sockets.emit('move_box', clients.client_" + socket.id + ", socket.id)");

    if (mousePos.x < 75) {
        socket.join('room1')
      }
      else if (mousePos.x > 425) {
        socket.join('room2')
      }
      else {
        socket.leave('room1')
        socket.leave('room2')
      }

  });

  socket.on('disconnect', function() {
    var removed = 0;

    for (var client in clients) {
      client = eval("clients." + client)

      if (client.id == socket.id) {
        removed = client.id;
        eval("delete clients.client_" + client.id);
      }
    };

    chat.sockets.emit('remove_box', removed)
  });
 });
