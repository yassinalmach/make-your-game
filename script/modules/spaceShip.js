export default class SpaceShip {
    constructor(gameArea) {
        // game area element
        this.gameArea = gameArea;

        // ship data
        this.width = 70;
        this.height = 60;
        this.moveSpeed = 5;
        this.moveDirection = 0;

        this.position = {
            x: (gameArea.clientWidth - this.width) / 2,
            y: gameArea.clientHeight - this.height - 10
        };

        // bullet data
        this.lastShot = 0;
        this.ShotCooldown = 500;
        this.bulletSpeed = 7;
        this.bullets = new Set();

        this.createSpaceShip();
        this.setupEvents();
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

    setupEvents() {
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                    this.moveDirection = -1;
                    break;
                case 'ArrowRight':
                    this.moveDirection = 1;
                    break;
                case 'Space':
                    const currentTime = Date.now();
                    if (currentTime - this.lastShot >= this.ShotCooldown) {
                        this.shoot();
                        this.lastShot = currentTime;
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if ((e.code === 'ArrowLeft' && this.moveDirection === -1) ||
                (e.code === 'ArrowRight' && this.moveDirection === 1)) {
                this.moveDirection = 0;
            }
        });
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
            speed: this.bulletSpeed
        };

        this.bullets.add(bulletData);
    }

    updatePosition() {
        if (this.moveDirection !== 0) {
            this.position.x += this.moveDirection * this.moveSpeed;

            if (this.position.x < 0) this.position.x = 0;

            if (this.position.x > this.gameArea.clientWidth - this.width) {
                this.position.x = this.gameArea.clientWidth - this.width;
            }

            this.ship.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        }
    }

    updateBullets() {
        for (const bullet of this.bullets) {
            bullet.y -= bullet.speed;
            bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;

            if (bullet.y < -10) {
                bullet.element.remove();
                this.bullets.delete(bullet);
            }
        }
    }

    checkCollisions(bullets) {
        for (const bullet of bullets) {
            if (bullet.x < this.position.x + this.width - 4 && bullet.x > this.position.x &&
                bullet.y < this.position.y + this.height && bullet.y + 12 > this.position.y - 8) {
                bullet.element.remove();
                bullets.delete(bullet);
                return -1
            }
        }
        return 0;
    }
}   