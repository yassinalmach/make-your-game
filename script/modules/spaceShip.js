export default class SpaceShip {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.width = 70;
        this.height = 60;
        this.moveSpeed = 5;
        this.moveDirection = 0;

        this.input = {
            space: false
        };

        this.shot = {
            last: 0,
            cooldown: 1000,
        };

        this.bullets = new Set();

        this.position = {
            x: (gameArea.clientWidth - this.width) / 2,
            y: gameArea.clientHeight - this.height - 10
        };

        this.createSpaceShip()
        this.setupControls();
        this.updatePosition();
    }

    createSpaceShip() {
        this.element = document.createElement('img');
        this.element.src = "images/ship.png";
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.className = 'ship';
        this.gameArea.appendChild(this.element);
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            if (e.repeat) return
            switch (e.code) {
                case 'ArrowLeft':
                    this.moveDirection = -1;
                    break;
                case 'ArrowRight':
                    this.moveDirection = 1;
                    break;
                case 'Space':
                    this.input.space = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if ((e.code === 'ArrowLeft' && this.moveDirection === -1) ||
                (e.code === 'ArrowRight' && this.moveDirection === 1)) {
                this.moveDirection = 0;
            }
            if (e.code === 'Space') {
                this.input.space = false;
            }
        });
    }

    update() {
        if (this.moveDirection !== 0) {

            this.position.x += this.moveDirection * this.moveSpeed;

            if (this.position.x < 0) {
                this.position.x = 0;
            }

            if (this.position.x > this.gameArea.clientWidth - this.width) {
                this.position.x = this.gameArea.clientWidth - this.width;
            }
            this.updatePosition();
        }

        this.updateBullets();
    }

    tryShoot() {
        const currentTime = Date.now();

        if (currentTime - this.shot.last >= this.shot.cooldown) {
            this.shoot();
            this.shot.last = currentTime;
        }
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
            speed: 7
        };

        this.bullets.add(bulletData);
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

    updatePosition() {
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
}   