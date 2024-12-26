export default class Alien {
    constructor(x, y, gameArea) {
        this.gameArea = gameArea;
        this.width = gameArea.offsetWidth / 14; // default it was 60
        this.height = (gameArea.offsetWidth / 14) * .7; // default it was 40
        this.position = { x, y };
        this.isAlive = true;
        this.points = 10;

        this.element = this.createAlienElement();
        this.updatePosition();
    }

    createAlienElement() {
        const alien = document.createElement('img');
        alien.className = 'alien';
        alien.src = 'images/alien.png';
        alien.alt = 'chirir'
        alien.style.width = `${this.width}px`;
        alien.style.height = `${this.height}px`;
        this.gameArea.appendChild(alien);
        return alien;
    }

    updatePosition() {
        if (this.isAlive) this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    destroy() {
        if (this.isAlive) {
            this.isAlive = false;
            this.element.style.transition = 'opacity 0.1s ease-out';
            this.element.style.opacity = '0';

            setTimeout(() => {
                this.element.remove();
            }, 0.1);
        }
    }

    checkCollision(bullet) {
        if (!this.isAlive) return false;

        return (bullet.x < this.position.x + this.width && bullet.x > this.position.x &&
            bullet.y < this.position.y + this.height && bullet.y > this.position.y);
    }
}