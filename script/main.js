import GameState from "./modules/gameState.js";
import SpaceShip from './modules/spaceShip.js';
import AlienGrid from "./modules/alienGrid.js";

let game = new GameState();
let ship = new SpaceShip(game);
let aliens = new AlienGrid(game)

const resetGame = () => {
    setTimeout(() => {
        game.gameArea.innerHTML = '';
        game.restart();
        ship.reset();
        ship = new SpaceShip(game);
        aliens = new AlienGrid(game);
    }, 2000);
};

const gameLoop = () => {
    if (!game.isPaused) {
        game.update();

        ship.updatePosition();
        ship.updateBullets();
        if (ship.checkCollisions(aliens.bullets)) {
            if (game.playerHit()) {
                resetGame();
            }
        }

        aliens.updateAliens();
        aliens.updateBullets();
        game.score += aliens.checkCollisions(ship.bullets);

        if (aliens.aliens.every(alien => !alien.isAlive)) {
            game.effects.createGameMessage('Victory!', true);
            resetGame();
        } else if (aliens.isGameOver()) {
            game.effects.createGameMessage('Game Over!', false);
            resetGame();
        }
    }
    requestAnimationFrame(gameLoop);
}

gameLoop()