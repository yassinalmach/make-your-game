export default class VisualEffect {
    constructor() {
        this.gameArea = document.getElementById('game-area');
    }

    createExplosion(x, y) {
        const explosion = document.createElement('img');
        explosion.src = `images/explosion.gif?${Date.now()}`;
        explosion.alt = 'explosion';
        explosion.className = 'explosion';
        explosion.style.transform = `translate(${x}px, ${y}px)`;

        this.gameArea.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 300);
    }

    createPlayerHit() {
        const flash = document.createElement('div');
        flash.className = 'player-hit';
        this.gameArea.appendChild(flash);

        setTimeout(() => {
            flash.remove();
        }, 300);
    }

    createGameMessage(message, isVictory = false) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';

        const messageElement = document.createElement('div');
        messageElement.className = `game-message ${isVictory ? 'victory' : 'defeat'}`;
        messageElement.textContent = message;

        messageContainer.appendChild(messageElement);
        this.gameArea.appendChild(messageContainer);

        setTimeout(() => {
            messageContainer.remove();
        }, 2000);
    }
}