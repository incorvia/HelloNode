
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
var clients = [];

chat.sockets.on('connection', function (socket) {

  clients.push(socket);

  socket.on('message', function (data) {
    console.log(data);
    
    clients.forEach(function(client) {
       client.send(data); 
    });
  });
});
