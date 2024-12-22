export default class GameState {    
    constructor() {
        this.isRunning = false;
        this.isPaused = false;

        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;

        this.FRAME_TIME = 1 / 60;

        this.init();
    }

    init() {
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.livesElement = document.getElementById('lives');
        this.pauseMenuElement = document.getElementById('pause-menu');

        document.getElementById('continue').addEventListener('click', () => this.pause());
        document.getElementById('restart').addEventListener('click', () => this.restart());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.pause();
            }
        });
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.pauseMenuElement.style.display = this.isPaused ? 'block' : 'none';
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;
        this.isPaused = false;
        this.pauseMenuElement.style.display = 'none';
    }

    update() {
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