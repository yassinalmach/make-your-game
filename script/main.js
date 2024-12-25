import GameState from "./modules/gameState.js";
import SpaceShip from './modules/spaceShip.js';
import AlienGrid from "./modules/alienGrid.js";
import VisualEffect from "./modules/visuals.js";

// init all objects
let effects = new VisualEffect();
let game = new GameState(effects);
let ship = new SpaceShip(game);
let aliens = new AlienGrid(game)

// init events
const setupEvents = () => {
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') game.pause() });
    document.getElementById('continue').addEventListener('click', () => game.pause());
    document.getElementById('restart').addEventListener('click', () => resetGame(200));

    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowLeft':
                ship.moveDirection = -1;
                break;
            case 'ArrowRight':
                ship.moveDirection = 1;
                break;
            case 'Space':
                const currentTime = Date.now();
                if (currentTime - ship.lastShot >= ship.COOLDOWN) {
                    ship.shoot();
                    ship.lastShot = currentTime;
                }
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        if ((e.code === 'ArrowLeft' && ship.moveDirection === -1) ||
            (e.code === 'ArrowRight' && ship.moveDirection === 1)) {
            ship.moveDirection = 0;
        }
    });
}

// reset the Game params
const resetGame = (time) => {
    setTimeout(() => {
        game.gameArea.innerHTML = '';
        game = new GameState(effects);
        ship = new SpaceShip(game);
        aliens = new AlienGrid(game)
    }, time);
};

// game loop function
const gameLoop = () => {
    if (!game.isPaused) {
        game.updateState();

        ship.updatePosition();
        ship.updateBullets();
        if (ship.checkCollisions(aliens.bullets)) {
            game.lives--;
            effects.createPlayerHit();
            if (game.lives <= 0) {
                effects.createGameMessage('you are defeated!', false);
                game.isPaused = true
                resetGame(2000);
            }
        }

        aliens.updateAliens();
        aliens.updateBullets();
        game.score += aliens.checkCollisions(ship.bullets);

        if (aliens.aliens.every(alien => !alien.isAlive)) {
            game.isPaused = true;
            game.effects.createGameMessage('Victory!', true);
            resetGame(2000);
        } else if (aliens.isGameOver()) {
            game.isPaused = true;
            game.effects.createGameMessage('you are defeated!', false);
            resetGame(2000);
        }
    }
    requestAnimationFrame(gameLoop);
}

setupEvents();
gameLoop();