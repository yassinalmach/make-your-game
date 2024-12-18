export default class GameState {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;

        this.score = 0;
        this.lives = 3;
        this.gameTime = 0;

        this.FRAME_RATE = 60;
        this.FRAME_TIME = 1 / this.FRAME_RATE;

        this.initializeParams();

        this.gameLoop = this.gameLoop.bind(this);
    }

    initializeParams() {
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.livesElement = document.getElementById('lives');
        this.pauseMenuElement = document.getElementById('pause-menu');

        document.getElementById('continue').addEventListener('click', () => this.togglePause());
        document.getElementById('restart').addEventListener('click', () => this.restart());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            requestAnimationFrame(this.gameLoop);
        }
    }

    gameLoop() {
        if (!this.isPaused) {
            this.gameTime += this.FRAME_TIME;
            this.scoreElement.textContent = `Score: ${this.score}`;
            this.timerElement.textContent = `Time: ${this.formatTime(this.gameTime)}`;
            this.livesElement.textContent = `Lives: ${this.lives}`;
        }

        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop);
        }
    }

    formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    togglePause() {
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
}