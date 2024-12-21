import Alien from "./alien.js";

export default class AlienGrid {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.aliens = [];
        this.direction = 1;
        this.moveSpeed = 1;
        this.dropDistance = 30;

        this.columns = 8;
        this.rows = 4;
        this.horizontalSpacing = 60;
        this.verticalSpacing = 50;

        this.createAlienGrid();
    }

    createAlienGrid() {
        const startX = (this.gameArea.clientWidth - (this.columns * this.horizontalSpacing)) / 2;
        const startY = 50;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const x = startX + (col * this.horizontalSpacing);
                const y = startY + (row * this.verticalSpacing);

                const alien = new Alien(x, y, this.gameArea);
                this.aliens.push(alien);
            }
        }
    }

    updateAliensPosition() {
        this.moveGrid();
    }

    moveGrid() {
        let shouldDrop = false;
        const bounds = this.getGridBounds();

        // Check if grid reached the edges
        if (this.direction > 0 && bounds.right + this.moveSpeed > this.gameArea.clientWidth - 20) {
            this.direction = -1;
            shouldDrop = true;
        } else if (this.direction < 0 && bounds.left - this.moveSpeed < 20) {
            this.direction = 1;
            shouldDrop = true;
        }

        // Move all aliens
        this.aliens.forEach(alien => {
            if (alien.isAlive) {
                if (shouldDrop) {
                    alien.position.y += this.dropDistance;
                }
                alien.position.x += this.moveSpeed * this.direction;
                alien.updatePosition();
            }
        });

        // Increase speed as aliens are destroyed
        this.updateDifficulty();
    }

    getGridBounds() {
        let left = Infinity;
        let right = -Infinity;

        this.aliens.forEach(alien => {
            if (alien.isAlive) {
                left = Math.min(left, alien.position.x);
                right = Math.max(right, alien.position.x + alien.width);
            }
        });

        return { left, right };
    }

    updateDifficulty() {
        const aliveCount = this.aliens.filter(alien => alien.isAlive).length;
        const totalAliens = this.rows * this.columns;
        const percente = aliveCount / totalAliens * 100;
        if (percente < 20) this.moveSpeed = 3;
        else if (percente < 40) this.moveSpeed = 2.5;
        else if (percente < 60) this.moveSpeed = 2;
        else if (percente < 80) this.moveSpeed = 1.5;
    }

    checkCollisions(bullets) {
        for (const bullet of bullets) {
            for (const alien of this.aliens) {
                if (alien.checkCollision(bullet)) {
                    alien.destroy();
                    bullet.element.remove();
                    bullets.delete(bullet);
                    return alien.points;
                }
            }
        }
        return 0;
    }

    isGameOver() {
        return this.aliens.filter(alien => alien.isAlive).length === 0 || this.aliens.some(alien =>
            alien.isAlive && alien.position.y + alien.height > this.gameArea.clientHeight - 100);
    }
}