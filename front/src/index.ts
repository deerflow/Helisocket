import { io } from 'socket.io-client';

import Ship from './scripts/Ship';

const KEY = {
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    SHOOT: 'Space'
}

const press = {
    up: false,
    right: false,
    down: false,
    left: false,
    shoot: false
}

const socket = io();

const screen = document.getElementById('screen');
let playerOne;
let playerTwo;

let myNumber: number;

socket.on('playerNumber', number => {
    if (number === 1) {
        myNumber = 1;
        playerOne = new Ship(0, 0, true);
    }
    else if (number === 2) {
        myNumber = 2;
        playerOne = new Ship(700);
        playerTwo = new Ship(0, 0, true);
    } else {
        playerOne = new Ship(700);
        playerTwo = new Ship(0, 0, true);
        return;
    }
    window.addEventListener('keydown', e => {
        console.log(e.code);
        switch(e.code) {
            case KEY.UP:
                press.up = true;
                break;
            case KEY.RIGHT:
                press.right = true;
                break;
            case KEY.DOWN:
                press.down = true;
                break;
            case KEY.LEFT:
                press.left = true;
                break;
            case KEY.SHOOT:
                press.shoot = true;
        }
    })

    window.addEventListener('keyup', e => {
        switch(e.code) {
            case KEY.UP:
                press.up = false;
                break;
            case KEY.RIGHT:
                press.right = false;
                break;
            case KEY.DOWN:
                press.down = false;
                break;
            case KEY.LEFT:
                press.left = false;
                break;
        }
    })
})

socket.on('playerJoin', number => {
    if (number === 2) {
        playerTwo = new Ship(700)
    }
})

socket.on('position', position => {
    playerTwo.setPosition(position.x, position.y, position.isFlipped);
    if (position.isShooting) {
        playerTwo.shoot();
    }
})

socket.on('reset', () => {
    if (playerOne.bullet) {
        playerOne.bullet.destroy();
    }
    if (playerTwo.bullet) {
        playerTwo.bullet.destroy();
    }
    if (myNumber === 1) {
        playerOne.setPosition(0, 0, true);
        playerTwo.setPosition(700);
    } else if (myNumber === 2) {
        playerOne.setPosition(700);
        playerTwo.setPosition(0, 0, true);
    } else {
        playerOne.setPosition(700);
        playerTwo.setPosition(0, 0, true);
    }
})

socket.on('playerDisconnect', () => {
    playerTwo.disconnect();
    playerTwo = null;
    myNumber = 1;
})

const draw = () => {
    if (press.up) {
        playerOne.updatePosition(0, -5);
    }
    if (press.right) {
        playerOne.updatePosition(5, 0);
        playerOne.setFlipped(true);
    }
    if (press.down) {
        playerOne.updatePosition(0, 5);
    }
    if (press.left) {
        playerOne.updatePosition(-5, 0);
        playerOne.setFlipped(false);
    }
    playerOne.broadcastPosition(socket, press.shoot);
    if (press.shoot) {
        playerOne.shoot();
        press.shoot = false;
    }

    if (playerOne.bullet) {
        playerOne.bullet.eachFrame(playerTwo, socket);
    }
    if (playerTwo && playerTwo.bullet) {
        playerTwo.bullet.eachFrame(playerTwo, socket);
    }
}

const game = setInterval(draw, 30);

