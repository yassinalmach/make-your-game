export default class StoryMode {
    constructor(gameState) {
        this.game = gameState;
        this.storyPhase = {
            intro: {
                title: "Earth's Last Hope",
                content: "Alien forces have breached our solar system's defenses. As Earth's most skilled pilot, you must defend humanity from the incoming invasion. Our experimental laser cannon is our only hope."
            },
            development: {
                score: 180,
                title: "The Tide Turns",
                content: "Your successful defense has revealed a weakness in their formation! Keep pushing forward - their mothership must be nearby."
            },
            victory: {
                title: "Victory!",
                content: "You've done it! The alien fleet is in retreat. Earth is safe thanks to your bravery."
            },
            defeat: {
                title: "Defeat",
                content: "The alien forces were too strong. Earth's last defense has fallen."
            }
        };
    }

    showStoryDialog(phase) {
        const container = document.createElement('div');
        container.className = 'story-dialog';
        container.innerHTML = `
            <h2>${this.storyPhase[phase].title}</h2>
            <p>${this.storyPhase[phase].content}</p>
            <button class="menu-button">${phase === 'intro' ? 'Start Mission' : 'Continue'}</button>
        `

        this.game.gameArea.appendChild(container);

        return new Promise(resolve => {
            container.querySelector('button').onclick = () => {
                container.remove();
                resolve();
            };
        });
    }

    async showIntro() {
        this.game.isPaused = true;
        await this.showStoryDialog('intro');
        this.game.isPaused = false;
    }

    async checkProgress() {
        if (this.game.score >= this.storyPhase.development.score && !this.developmentShown) {
            this.developmentShown = true;
            this.game.isPaused = true;
            await this.showStoryDialog('development');
            this.game.isPaused = false;
        }
    }

    async showEnding(victory) {
        this.game.isPaused = true;
        await this.showStoryDialog(victory ? 'victory' : 'defeat');
    }
}