import Alien from "./alien.js";

export default class AlienGrid {
    constructor(gameState, visualEffect, map) {
        this.gameArea = gameState.gameArea;
        this.effects = visualEffect;
        this.aliens = [];
        this.direction = 1;
        this.MOVE_SPEED = map.speed;
        this.dropDistance = 40;

        this.columns = map.columns;
        this.rows = map.rows;
        this.aliens_count = map.aliens_count;
        this.x_Spacing = this.gameArea.offsetWidth / 13; // default it was 60
        this.y_Spacing = this.gameArea.offsetWidth / 16; // default it was 50

        this.bullets = new Set();
        this.BULLET_SPEED = map.bullet_speed;

        this.createAlienGrid(map);

    }

    createAlienGrid(map) {
        const startX = (this.gameArea.clientWidth - (this.columns * this.x_Spacing)) / 2;
        const startY = 50;
    
        let tileIndex = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (map.tiles[tileIndex] === 1) {
                    const x = startX + (col * this.x_Spacing);
                    const y = startY + (row * this.y_Spacing);
    
                    const alien = new Alien(x, y, this.gameArea, map.alien);
                    this.aliens.push(alien);
                }
                tileIndex++;
            }
        }
    }
    

    updateGridPosition() {
        const edge = this.getGridEdges()
        this.moveGrid(edge);

        if (Math.random() < 0.02) {
            const bottomAliens = this.getBottomAliens(edge.left)
            if (bottomAliens.length > 0) {
                this.shoot(bottomAliens);
            }
        }
    }

    getGridEdges() {
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

    moveGrid(edge) {
        let shouldDrop = false;

        // Check if grid reached the edges
        if (this.direction > 0 && edge.right > this.gameArea.clientWidth) {
            this.direction = -1;
            shouldDrop = true;
        } else if (this.direction < 0 && edge.left <= 0) {
            this.direction = 1;
            shouldDrop = true;
        }

        // Move all aliens
        this.aliens.forEach(alien => {
            if (alien.isAlive) {
                if (shouldDrop) {
                    alien.position.y += this.dropDistance;
                }
                alien.position.x += this.MOVE_SPEED * this.direction;
                alien.updatePosition();
            }
        });

        // Increase speed as aliens are destroyed
        this.updateDifficulty();
    }

    updateDifficulty() {
        const totalAlive = this.aliens.filter(alien => alien.isAlive).length;
        const percente = totalAlive * 100 / this.aliens_count;
        if (percente < 10) this.MOVE_SPEED = 5
        else if (percente < 20) this.MOVE_SPEED = 4;
        else if (percente < 40) this.MOVE_SPEED = 3.5;
    }

    getBottomAliens(startGrid) {
        const columns = new Map();

        // Group aliens by column
        this.aliens.forEach(alien => {
            if (alien.isAlive) {
                const col = Math.round(alien.position.x - startGrid / this.x_Spacing);
                if (!columns.has(col) || alien.position.y > columns.get(col).position.y) {
                    columns.set(col, alien);
                }
            }
        });

        return Array.from(columns.values());
    }

    shoot(bottomAliens) {
        const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
        if (shooter && shooter.isAlive) {
            const bullet = document.createElement('div');
            bullet.className = 'alien-bullet';

            const bulletX = shooter.position.x + (shooter.width / 2) - 2;
            const bulletY = shooter.position.y + shooter.height;

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
    }

    updateBullets() {
        for (const bullet of this.bullets) {
            bullet.y += bullet.speed;
            bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;

            if (bullet.y > 800) {
                bullet.element.remove();
                this.bullets.delete(bullet);
            }
        }
    }

    isAlienDestroyed(bullets) {
        for (const bullet of bullets) {
            for (const alien of this.aliens) {
                if (alien.checkCollision(bullet)) {
                    const x_center = alien.position.x;
                    const y_center = alien.position.y - 20;

                    this.effects.createExplosion(x_center, y_center);

                    alien.destroy();
                    bullet.element.remove();
                    bullets.delete(bullet);
                    return alien.points;
                }
            }
        }
        return 0;
    }

    isPlayerDestroyed() {
        return this.aliens.some(alien =>
            alien.isAlive && alien.position.y + alien.height > this.gameArea.clientHeight - 60);
    }

    isAllAliensDestroyed() {
        return this.aliens.every(alien => !alien.isAlive)
    }
}