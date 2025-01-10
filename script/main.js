import GameState from "./modules/gameState.js";
import SpaceShip from "./modules/spaceShip.js";
import AlienGrid from "./modules/alienGrid.js";
import VisualEffect from "./modules/visuals.js";
import StoryMode from "./modules/storyMode.js";
import { postScore, fetchScores, renderScoreboard } from "./score_handling.js";
import { maps } from "./maps.js";

let selectedMap = null;
let effects = new VisualEffect();
let game, storyMode, ship, aliens;

// Initialize map selection
const initMapSelection = () => {
  const mapCards = document.querySelectorAll('.map-card');
  const startContainer = document.getElementById("start-container");
  const mapSelectContainer = document.getElementById("map-select-container");

  mapCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      mapCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      selectedMap = maps.get(card.dataset.map);

      // Show start container after delay
      setTimeout(() => {
        mapSelectContainer.style.display = 'none';
        startContainer.style.display = 'flex';
      }, 500);
    });
  });
};

// Initialize game objects
const initGameObjects = () => {
  game = new GameState(effects);
  storyMode = new StoryMode(game);
  ship = new SpaceShip(game, selectedMap.spaceship);
  aliens = new AlienGrid(game, effects, selectedMap);
};

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
const resetGame = (time, isResize = false) => {
  setTimeout(() => {
    game.gameArea.innerHTML = "";
    game = new GameState(effects);
    ship = new SpaceShip(game, selectedMap.spaceship);
    storyMode = new StoryMode(game);
    aliens = new AlienGrid(game, effects, selectedMap);
    if (!isResize) storyMode.showIntro();
  }, time);
};

const isVictory = async (victory, time, score) => {
  setTimeout(() => {
    const element = storyMode.showEnding(victory);
    element.querySelector("button").addEventListener("click", async (e) => {
      const data = {
        name: element.querySelector("input#player-name").value,
        time: time,
        score: score,
      };

      try {
        const response = await postScore(data);
        if (response) {
          await fetchScores(); 
        }
      } catch (error) {
        console.error("Error submitting score:", error.message);
        alert("Failed to submit score. Please try again later.");
      }
      element.remove(); 
    });
  }, 2000);
};

// Start the game
document.getElementById("start").addEventListener("click", () => {
  if (!selectedMap) {
    alert("Please select a map first!");
    return;
  }
  const startContainer = document.getElementById("start-container");
  startContainer.remove();
  initGameObjects();
  storyMode.showIntro();
  setupEvents();
  requestAnimationFrame(gameLoop);
});

// restarts the game in case of resizing the page width
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resetGame(0, true);
  }, 500);
});

// Initialize map selection when the page loads
initMapSelection();