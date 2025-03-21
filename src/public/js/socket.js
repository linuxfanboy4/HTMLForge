let socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('codeUpdate', function (newCode) {
    editor.setValue(newCode);
});

socket.emit('joinRoom', 'room1');
