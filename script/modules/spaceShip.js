export default class SpaceShip {
    constructor(GameState) {
        this.gameArea = GameState.gameArea;
        this.effects = GameState.effects;

        // ship data
        this.width = this.gameArea.offsetWidth / 11; // default it was 66
        this.height = this.gameArea.offsetWidth / 15; // default it was 50

        this.MOVE_SPEED = 6;
        this.moveDirection = 0;
        this.position = {
            x: (this.gameArea.clientWidth - this.width) / 2,
            y: this.gameArea.clientHeight - this.height - 10
        };

        // bullet data
        this.BULLET_SPEED = 10;
        this.COOLDOWN = 300;
        this.lastShot = 0;
        this.bullets = new Set();

        this.createSpaceShip();
        this.ship.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    createSpaceShip() {
        this.ship = document.createElement('img');
        this.ship.src = "images/ship.png";
        this.ship.style.width = `${this.width}px`;
        this.ship.style.height = `${this.height}px`;
        this.ship.className = 'ship';
        this.gameArea.appendChild(this.ship);
    }

    shoot() {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';

        const bulletX = this.position.x + (this.width / 2) - 2;
        const bulletY = this.position.y;

        bullet.style.transform = `translate(${bulletX}px, ${bulletY}px)`;
        this.gameArea.appendChild(bullet);

        const bulletData = {
            element: bullet,
            x: bulletX,
            y: bulletY,
            speed: this.BULLET_SPEED
        };

        this.bullets.add(bulletData);
    }

    updatePosition() {
        if (this.moveDirection !== 0) {
            const newX = this.position.x + (this.moveDirection * this.MOVE_SPEED);

            if (newX >= 0 && newX <= this.gameArea.clientWidth - this.width) {
                this.position.x = newX;
                this.ship.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            }
        }
    }

    updateBullets() {
        for (const bullet of this.bullets) {
            bullet.y -= bullet.speed;
            bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;

            if (bullet.y < -12) {
                bullet.element.remove();
                this.bullets.delete(bullet);
            }
        }
    }

    isPlayerHits(bullets) {
        for (const bullet of bullets) {
            if (bullet.x < this.position.x + this.width &&
                bullet.x + 4 > this.position.x && // 4px is the width of the bullet
                bullet.y < this.position.y + this.height &&
                bullet.y + 12 > this.position.y) { // 12px is the height of the bullet

                bullet.element.remove();
                bullets.delete(bullet);
                return true
            }
        }
        return false;
    }
}   