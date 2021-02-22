// @ts-ignore
import imgHelico from '../img/helicol.png';
import Bullet from './Bullet';

class Ship {
    private x: number;
    private y: number;
    private element: HTMLElement;
    private isFlipped: boolean = false;
    private bullet: Bullet | null;

    constructor(
        x: number = 0,
        y: number = 0,
        isFlipped: boolean = false,
        parent: HTMLElement = document.getElementById('screen')
    ) {
        this.x = x;
        this.y = y;
        this.isFlipped = isFlipped;
        this.bullet = null;

        this.element = document.createElement('img');
        this.element.setAttribute('src', imgHelico);
        this.element.classList.add('helico');
        parent.appendChild(this.element);

        this.updatePosition();
    }

    public getPosition() {
        return { x: this.x, y: this.y };
    }

    public updatePosition(x: number = 0, y: number = 0) {
        this.x += x;
        this.y += y;
        if (this.x < 0) this.x = 0;
        if (this.x > 800 - 96) this.x = 800 - 96;
        if (this.y > 0) this.y = 0;
        if (this.y < - 800 + 46) this.y = - 800 + 46;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotateY(${this.isFlipped ? '180deg' : '0deg'}`;
    }

    public setPosition(x: number = 0, y: number = 0, isFlipped: boolean) {
        this.x = x;
        this.y = y;
        this.isFlipped = isFlipped;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotateY(${this.isFlipped ? '180deg' : '0deg'}`;
    }

    public setFlipped(isFlipped: boolean) {
        this.isFlipped = isFlipped;
    }

    public shoot() {
        if (this.bullet) {
            this.bullet.destroy();
        }
        let variation = 0
        if (this.isFlipped) variation = 100
        else variation = -50
        this.bullet = new Bullet(this.x + variation, this.y, this.isFlipped);
    }

    public broadcastPosition(socket, isShooting: boolean) {
        socket.emit('position', {
            x: this.x,
            y: this.y,
            isFlipped: this.isFlipped,
            isShooting: isShooting
        })
    }

    public disconnect() {
        this.element.remove();
    }
}

export default Ship;