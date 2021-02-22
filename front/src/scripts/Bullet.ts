// @ts-ignore
import imgBullet from '../img/bullet.png';
import Ship from "./Ship";

class Bullet {
    private x: number;
    private y: number;
    private element: HTMLElement;
    private direction: boolean;

    constructor(x: number = 0, y: number = 0, direction: boolean = false, parent: HTMLElement = document.getElementById('screen')) {
        this.x = x;
        this.y = y;
        this.direction = direction;

        this.element = document.createElement('img');
        this.element.setAttribute('src', imgBullet);
        this.element.classList.add('bullet');

        this.updatePosition();

        parent.appendChild(this.element);

        setTimeout(() => {
            this.destroy();
        }, 1000)
    }

    public updatePosition(x: number = 0, y: number = 0) {
        this.x += x;
        this.y += y;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    public checkCollision(player: Ship, socket) {
        const playerPos = player.getPosition()
        if (this.x > playerPos.x - 20 && this.x < playerPos.x + 20 && this.y > playerPos.y - 40 && this.y < playerPos.y + 40) {
            socket.emit('reset')
        }
    }

    public eachFrame(player: Ship, socket) {
        if (this.direction) {
            this.updatePosition(20, 0)
        } else {
            this.updatePosition(-20, 0);
        }
        this.checkCollision(player, socket)

    }

    public destroy() {
        this.element.remove();
    }
}

export default Bullet;