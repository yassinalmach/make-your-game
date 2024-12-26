export default class GameState {
    constructor(visualEffects) {
        this.effects = visualEffects;
        this.isPaused = false;

        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;

        this.FRAME_TIME = 1 / 60;

        this.init();
        this.pauseMenu.style.display = 'none';
        this.pauseContainer.style.display = 'none';
    }

    init() {
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.livesElement = document.getElementById('lives');
        this.pauseContainer = document.getElementById('pause-container');
        this.pauseMenu = document.getElementById('pause-menu');
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.pauseMenu.style.display = this.isPaused ? 'block' : 'none';
        this.pauseContainer.style.display = this.isPaused ? 'block' : 'none';
    }

    updateState() {
        if (!this.isPaused) {
            this.gameTime += this.FRAME_TIME;

            this.scoreElement.textContent = `Score: ${this.score}`;
            this.timerElement.textContent = `${this.formatTime(this.gameTime)}`;
            this.livesElement.textContent = `Lives: ${this.lives}`;
        }
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}