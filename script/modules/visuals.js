export default class VisualEffect {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.activeEffects = new Set();
    }

    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.transform = `translate(${x}px, ${y}px)`;
        
        this.gameArea.appendChild(explosion);
        
        setTimeout(() => {
            explosion.remove();
        }, 300);
    }

    createScorePopup(x, y, score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.transform = `translate(${x}px, ${y}px)`;
        
        this.gameArea.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    }

    createPlayerHit() {
        const flash = document.createElement('div');
        flash.className = 'player-hit';
        this.gameArea.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 200);
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