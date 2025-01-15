# Space Invaders

A vanilla JavaScript implementation of the classic Space Invaders game featuring three different tile-based maps, story mode, and online scoreboards, optimized for 60 FPS performance.

![Space Invaders Gameplay](images/gameplay.png)

## Authors

- Yassine El mach
- Hamza Maach

## Core Features

- 60 FPS gameplay with no frame drops
- Smooth keyboard controls
- Pause menu (Continue/Restart)
- Score tracking (Time, Points, Lives)
- Performance-optimized rendering using minimal layers
- Pure JavaScript/DOM implementation (no Canvas/frameworks)
- Global high-score system with REST API
- Immersive story mode with progressive narrative
- Three unique tile-based maps

## Project Structure

```
make-your-game/
├── api/
│   ├── handlers/    
│       ├── get_scores.go     # Handle getting all scores
│       └── post_score.go     # Handle posting new score
│   ├── scores.json       # Contain the scores that has been saved
│   └── main.go           # Entry point  
├── images/            # Combined tile images for maps
├── script/
│   ├── modules/           # Game logic modules
│       ├── alien.js           # Alien entity logic
│       ├── alienGrid.js       # Alien formation management
│       ├── gameState.js       # Game state/scoring system
│       ├── spaceShip.js       # Player ship controls
│       ├── storyMode.js       # Story progression system
│       └── visuals.js         # Visual effects/animations
│   ├── score_handling.js   # Score API integration
│   ├── maps.js             # Map configuration
│   └── main.js             # Entry point  
├── sounds/             # Game audio assets
├── style/              # CSS styling
├── index.html          # Main game page
└── README.md           # Documentation
```

## Technologies

- HTML5 & CSS3
- Vanilla JavaScript 
- requestAnimationFrame API
- DOM manipulation
- Go (for score API)
- REST API

## Game Features

### Tile Map System
- Three unique map layouts
- Logical grid-based collision detection
- Performance-optimized scrolling system

### Story Mode
- Dynamic story introduction sequence
- Score-based story advancement
- Interactive story elements
- Mid-game narrative events

### Global Scoreboards
- Top 5 high scores display
- Position percentile calculation
- Score pagination system
- Player name registration
- Time tracking in minutes:seconds
- REST API integration
- JSON-based data storage

## Performance Optimization

- Minimal DOM layers
- Transform/opacity for animations
- Optimized collision detection
- Efficient tile rendering
- Performance monitoring via Dev Tools

## Setup

1. Clone repository:
```bash
git clone https://github.com/yassinalmach/make-your-game
cd make-your-game
```

2. Start the score API server:
```bash
cd api
go run main.go
```

3. Open `index.html` in a modern browser

## API Endpoints

### GET /scores
Retrieves high scores

Response format:
```json
[
  {
    "name": "Player1",
    "rank": 1,
    "score": 233254,
    "time": "12:01"
  },
  ...
]
```

### POST /scores
Submits a new score

Request format:
```json
{
  "name": "Player1",
  "score": 233254,
  "time": "12:01"
}
```

## Development Tools

- Performance Tool for FPS monitoring
- Network tab for API debugging
- Console for game state monitoring