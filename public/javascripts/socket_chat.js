$(document).ready(function() {
    var socket = new io.connect('http://' + window.location.host);

    console.log(socket)

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
