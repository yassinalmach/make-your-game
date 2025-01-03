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
        `;
    
        let input;
    
        if (phase === 'victory' || phase === 'defeat') {
            input = document.createElement('input');
            input.placeholder = "Enter your name...";
            input.classList.add('player-name');
            container.appendChild(input);
        }
    
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = phase === 'intro' ? 'Start Mission' : 'Continue';
        button.disabled = phase === 'victory' || phase === 'defeat'; 
        container.appendChild(button);
    
        if (input) {
            input.addEventListener('input', () => {
                button.disabled = input.value.trim() === ''; 
            });
        }
    
        // Append container to the game area
        this.game.gameArea.appendChild(container);
        return container;
    }
    
    

    showIntro() {
        this.game.isPaused = true;
        this.viewStory = true;
        let element = this.showStoryDialog('intro');
        element.querySelector('button').onclick = () => {
            element.remove();
            this.game.isPaused = false;
            this.viewStory = false;
        };
    }

    checkProgress() {
        if (!this.developmentShown && this.game.score >= this.storyPhase.development.score) {
            this.developmentShown = true;
            this.game.isPaused = true;
            this.viewStory = true;
            let element = this.showStoryDialog('development');
            element.querySelector('button').onclick = () => {
                element.remove();
                this.game.isPaused = false;
                this.viewStory = false;
            };
        }
    }

    showEnding(victory) {
        this.game.isPaused = true;
        this.viewStory = true
        return this.showStoryDialog(victory ? 'victory' : 'defeat');
    }
}