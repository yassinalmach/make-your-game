export default class StoryMode {
    constructor(gameState) {
        this.game = gameState;
        this.storyPhase = {
            intro: {
                title: "Earth's Last Hope",
                content: "Strange spaceships have appeared in the sky. These mysterious visitors showed no interest in communication - only destruction. All our other defenses have failed. But we have one last chance: a special ship with powerful lasers. You are our best pilot, and we need your help. You must stop these aliens before they reach Earth. Are you ready to protect our home?"
            },
            development: {
                score: 180,
                title: "The Secret Mission",
                content: "Look! Your plan is working! The aliens are starting to back away. But wait - we've learned something new. They're not just attacking randomly. They're looking for something special near Earth. We can't let them find it. Keep fighting! You're doing great!"
            },
            victory: {
                title: "You are the hero of earth!",
                content: "You did it! The aliens are running away! We won! Something amazing happened - we found out they were looking for a secret object hidden on our moon. Nobody knew it was there before. Thanks to you, Earth is safe, and we learned we're not alone in space. You're a hero!"
            },
            defeat: {
                title: "Earth Falls Dark",
                content: "Oh no! There were too many alien ships. They found what they were looking for on the moon and took it away. Earth is damaged but still here. We'll grow stronger and be ready if they come back. Thank you for trying your best to protect us."
            }
        };
        this.viewStory = false
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
        this.viewStory = true
        await this.showStoryDialog('intro');
        this.viewStory = false
        this.game.isPaused = false;
    }

    async checkProgress() {
        if (this.game.score >= this.storyPhase.development.score && !this.developmentShown) {
            this.developmentShown = true;
            this.game.isPaused = true;
            this.viewStory = true
            await this.showStoryDialog('development');
            this.viewStory = false
            this.game.isPaused = false;
        }
    }

    async showEnding(victory) {
        this.game.isPaused = true;
        this.viewStory = true
        await this.showStoryDialog(victory ? 'victory' : 'defeat');
        this.viewStory = false
    }
}