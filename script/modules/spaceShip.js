
export default class SpaceShip {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.width = 70;
        this.height = 60;
        this.moveSpeed = 5;
        this.moveDirection = 0;

        this.createSpaceShip()

        this.position = {
            x: (gameArea.clientWidth - this.width) / 2,
            y: gameArea.clientHeight - this.height - 10
        };

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
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveDirection = -1;
                    break;
                case 'ArrowRight':
                    this.moveDirection = 1;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if ((e.key === 'ArrowLeft' && this.moveDirection === -1) ||
                (e.key === 'ArrowRight' && this.moveDirection === 1)) {
                this.moveDirection = 0;
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
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
}