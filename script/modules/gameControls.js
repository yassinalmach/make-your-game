export default class GameControls {    
    constructor(visualEffects) {
        this.isRunning = false;
        this.isPaused = false;

        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;

        this.FRAME_TIME = 1 / 60;

        this.init();
        this.effects = visualEffects;
    }

    init() {
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.livesElement = document.getElementById('lives');
        this.pauseContainerElement = document.getElementById('pause-container');
        this.pauseMenuElement = document.getElementById('pause-menu');
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.pauseMenuElement.style.display = this.isPaused ? 'block' : 'none';
        this.pauseContainerElement.style.display = this.isPaused ? 'block': 'none';
    }

    resetParams() {
        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;
        this.isPaused = false;
        this.pauseMenuElement.style.display = 'none';
        this.pauseContainerElement.style.display = 'none';
    }

    playerHit() {
        this.lives--;
        this.effects.createPlayerHit();
        if (this.lives <= 0) {
            this.effects.createGameMessage('Game Over!', false);
            return true;
        }
        return false;
    }

    updateState() {
        if (!this.isPaused) {
            this.gameTime += this.FRAME_TIME;

            this.scoreElement.textContent = `Score: ${this.score}`;
            this.timerElement.textContent = `Time: ${this.formatTime(this.gameTime)}`;
            this.livesElement.textContent = `Lives: ${this.lives}`;
        }
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}