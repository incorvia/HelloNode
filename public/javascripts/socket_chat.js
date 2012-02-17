$(document).ready(function() {
    var socket = new io.connect('http://localhost:3080');

    socket.on('connect', function() {
        socket.send('A client connected.');
    });
    
    socket.on('message', function(message) {
        $('#messages').html('<p>' + message + '</p>' +  $('#messages').html());
        console.log(socket);
        
    });

    $('input').keydown(function(event) {
        if(event.keyCode === 13) {   
            socket.send($('input').val());
            $('input').val('');
        }
    });
});
