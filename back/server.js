const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const io = require('socket.io')(server);

let playerNumber = 0;

io.on('connection', socket => {
    playerNumber++;
    console.log(`Player ${playerNumber} connected !`);

    socket.emit('playerNumber', playerNumber);
    socket.broadcast.emit('playerJoin', playerNumber);

    socket.on('position', position => {
        socket.broadcast.emit('position', position);
    })

    socket.on('reset', () => {
        io.emit('reset');
    })

    socket.on('disconnect', () => {
        if (playerNumber <= 2) {
            playerNumber--;
            socket.broadcast.emit('playerDisconnect');
        }
    })
})

server.listen(3000);

