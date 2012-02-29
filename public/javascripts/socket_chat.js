$(document).ready(function() {

  Kinetic.Rect.new_box = function(box, user_id) {
    if (box.x) {
      var new_box = new Kinetic.Rect({
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        fill: box.fill,
        stroke: box.stroke,
        strokeWidth: box.strokeWidth,
        draggable: true,
        name: user_id
      });
    }
    else {
      var new_box = new Kinetic.Rect({
        x: 100,
        y: 100,
        width: 25,
        height: 25,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
        name: user_id
      });
    };

    return new_box;
  };

  // Canvas Layer
  stage = new Kinetic.Stage("canvas", 500, 200);
  layer = new Kinetic.Layer();
  my_box = "";

  boxes = {};

  // Socket
  var socket = new io.connect('http://' + window.location.host);

  socket.on('connect', function() {
    opt = new Object;
    box = Kinetic.Rect.new_box(opt);

     socket.emit('setup', box);
  });

  socket.on('new_box', function(client) {
    var new_box = "box_" + client.id;
    eval(new_box + "= Kinetic.Rect.new_box(client.box, client.id)");

    layer.add(eval(new_box));
    stage.add(layer);
  });

  socket.on('init_boxes', function(clients) {
    for (var client in clients) {
      client = eval("clients." + client)

      var new_box = "box_" + client.id
      eval(new_box + "= Kinetic.Rect.new_box(client.box, client.id)");

      layer.add(eval(new_box));
      stage.add(layer);
    };
  });

  socket.on('remove_box', function(id) {
    boxes = layer.getChildren()
    for (var i = 0; i < boxes.length; i += 1) {
      if (boxes[i].name == id) {
        remove_box = boxes[i];
      }
    };
    layer.remove(remove_box);
    layer.draw();
  });

  socket.on('new_msg', function(room, message) {
      var msg_box = $(".msg_box[data-room = \"" + room + "\"]")
      msg_box.html('<p>' + message + '</p>' +  msg_box.html());
      console.log(socket);
  });

  socket.on('ready', function(data) {
    my_box = layer.getChild(socket.socket.sessionid)

    my_box.on("dragmove", function() {
      var mousePos = stage.getMousePosition();
      socket.emit('move_box', mousePos);
    });
  });

  socket.on('move_box', function(client, id) {
    if (id !== socket.socket.sessionid) {
      box = layer.getChild(id);
      box.x = client.box.x;
      box.y = client.box.y;
      layer.draw();
    }
  });

  // JQuery
  $('.room').keydown(function(event) {
      if(event.keyCode === 13) {
        var room = $(this).attr('data-room')
        var msg = $(this).val()

        socket.emit("msg_room", room, msg);
        $(this).val('');
      }
  });
});

