export class GameState {
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
        this.continueButton = document.getElementById('continue')
        this.restartButton = document.getElementById('restart')

        this.continueButton.addEventListener('click', () => this.togglePause());
        this.restartButton.addEventListener('click',  () => this.restart());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
    }

    gameLoop() {
        if (!this.isPaused) {
            this.update();
            this.updateUI();
        }
    
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop);
        }
    }

    update() {
        this.gameTime += this.FRAME_TIME;
    }

    formatTime(timeInSeconds) {
        // Convert total seconds into minutes and remaining seconds
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        // Add leading zeros if needed and format as "00:00"
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    updateUI() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.timerElement.textContent = `Time: ${this.formatTime(this.gameTime)}`;
        this.livesElement.textContent = `Lives: ${this.lives}`;
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