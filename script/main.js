import GameState from "./modules/gameState.js";
import SpaceShip from "./modules/spaceShip.js";
import AlienGrid from "./modules/alienGrid.js";
import VisualEffect from "./modules/visuals.js";
import StoryMode from "./modules/storyMode.js";
import { postScore, fetchScores, renderScoreboard } from "./score_handling.js";

// init all objects
let effects = new VisualEffect();
let game = new GameState(effects);
let storyMode = new StoryMode(game);
let ship = new SpaceShip(game);
let aliens = new AlienGrid(game, effects);

// init events
const setupEvents = () => {
  document.addEventListener("keydown", (e) => {
    if (storyMode.viewStory === true) return;
    if (e.key === "Escape") game.pause();
  });

  document
    .getElementById("continue")
    .addEventListener("click", () => game.pause());
  document
    .getElementById("restart")
    .addEventListener("click", () => resetGame(200));

  const playAgain = document.getElementById("play-again");
  playAgain.addEventListener("click", () => {
    resetGame(200);
    document.getElementById("scoreboard").remove();
    playAgain.style.display = "none";
  });

  window.addEventListener("keydown", (e) => {
    if (storyMode.viewStory === true) return;
    switch (e.code) {
      case "ArrowLeft":
        ship.moveDirection = -1;
        break;
      case "ArrowRight":
        ship.moveDirection = 1;
        break;
      case "Space":
        const currentTime = Date.now();
        if (currentTime - ship.lastShot >= ship.COOLDOWN) {
          ship.shoot();
          ship.lastShot = currentTime;
        }
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (
      (e.code === "ArrowLeft" && ship.moveDirection === -1) ||
      (e.code === "ArrowRight" && ship.moveDirection === 1)
    ) {
      ship.moveDirection = 0;
    }
  });
};

// game loop function
const gameLoop = () => {
  if (!game.isPaused) {
    game.updateState();
    storyMode.checkProgress();
    ship.updatePosition();
    ship.updateBullets();
    if (ship.isPlayerHits(aliens.bullets)) {
      game.lives--;
      effects.createPlayerHit();
      if (game.lives <= 0) {
        game.isPaused = true;
        effects.createGameMessage("you are defeated!", false);
        isVictory(false, game.formatTime(game.gameTime), game.score);
      }
    }

    aliens.updateGridPosition();
    aliens.updateBullets();
    game.score += aliens.isAlienDestroyed(ship.bullets);

    if (aliens.isAllAliensDestroyed()) {
      game.isPaused = true;
      game.effects.createGameMessage("Victory!", true);
      isVictory(true, game.formatTime(game.gameTime), game.score);
    } else if (aliens.isPlayerDestroyed()) {
      game.isPaused = true;
      effects.createGameMessage("you are defeated!", false);
      isVictory(false, game.formatTime(game.gameTime), game.score);
    }
  }
  requestAnimationFrame(gameLoop);
};

// reset the Game params
const resetGame = (time) => {
  setTimeout(() => {
    game.gameArea.innerHTML = "";
    game = new GameState(effects);
    ship = new SpaceShip(game);
    storyMode = new StoryMode(game);
    aliens = new AlienGrid(game, effects);
    storyMode.showIntro();
  }, time);
};

const isVictory = async (victory, time, score) => {
  setTimeout(() => {
    let element = storyMode.showEnding(victory);
    element.querySelector("button").addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default behavior
      const data = {
        name: element.querySelector("input#player-name").value,
        time: time,
        score: score,
      };
      console.log(data);

      // postScore(data); // Submit the score
      fetchScores();
      element.remove();
    });
  }, 200);
};

// Start the game
document.getElementById("start").addEventListener("click", () => {
  const startContainer = document.getElementById("start-container");
  startContainer.remove();
  storyMode.showIntro();
  setupEvents();
  requestAnimationFrame(gameLoop);
});

// restarts the game in case of resizing the page width
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout); // Clear the previous timeout
  resizeTimeout = setTimeout(() => {
    resetGame();
  }, 500);
});
