export default class Alien {
    constructor(x, y, gameArea) {
        this.gameArea = gameArea;
        this.width = 50;
        this.height = 50;
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
            this.element.style.transition = 'opacity 0.2s ease-out';
            this.element.style.opacity = '0';
            
            setTimeout(() => {
                this.element.remove();
            }, 150);
        }
    }

    checkCollision(bullet) {
        if (!this.isAlive) return false;

        return (bullet.x < this.position.x + this.width && bullet.x > this.position.x &&
            bullet.y < this.position.y + this.height - 12 && bullet.y > this.position.y);
    }
}