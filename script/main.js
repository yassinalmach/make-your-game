import GameState from "./modules/gameState.js";
import SpaceShip from './modules/spaceShip.js';

const game = new GameState();
const ship = new SpaceShip(game.gameArea);

const gameLoop = () => {
    if (!game.isPaused) {
        game.update();
        ship.updatePosition();
        ship.updateBullets();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop()