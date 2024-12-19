import GameState from "./modules/gameState.js";
import SpaceShip from './modules/spaceShip.js';

const game = new GameState();
const spaceShip = new SpaceShip(game.gameArea);

const gameLoop = () => {
    if (!game.isPaused) {
        game.update();
        spaceShip.update();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop()