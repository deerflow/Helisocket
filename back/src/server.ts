const http = require('http');
// @ts-ignore
const app = require('./app');

const server = http.createServer(app);

const io = require('socket.io')(server);

let playerNumber: number = 0;
let score: [number, number] = [0, 0];

io.on('connection', socket => {
    playerNumber++;
    console.log(`Player ${playerNumber} connected !`);

    socket.emit('playerNumber', playerNumber);
    socket.broadcast.emit('playerJoin', playerNumber);

    socket.on('position', position => {
        socket.broadcast.emit('position', position);
    })

    socket.on('reset', number => {
        score[number - 1]++;
        io.emit('reset');
        console.log(score);
        io.emit('score', score);
    })

    socket.on('disconnect', () => {
        if (playerNumber <= 2) {
            playerNumber--;
            socket.broadcast.emit('playerDisconnect');
            score = [0, 0];
            io.emit('score', score);
        }
    })
})

server.listen(3000);

