import GameState from "./modules/gameState.js";
import SpaceShip from './modules/spaceShip.js';
import AlienGrid from "./modules/alienGrid.js";

const game = new GameState();
let ship = new SpaceShip(game.gameArea);
let aliens = new AlienGrid(game.gameArea)

const gameLoop = () => {
    if (!game.isPaused) {
        game.update();
        ship.updatePosition();
        ship.updateBullets();

        aliens.updateAliensPosition();
        game.score += aliens.checkCollisions(ship.bullets);

        if (aliens.isGameOver()) {
            game.restart();
            game.gameArea.innerHTML = '';
            ship = new SpaceShip(game.gameArea);
            aliens = new AlienGrid(game.gameArea);
        }
    }
    requestAnimationFrame(gameLoop);
}

gameLoop()