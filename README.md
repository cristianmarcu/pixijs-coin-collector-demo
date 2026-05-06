# Coin Collector PixiJS Demo

A responsive HTML5 arcade-style game built with PixiJS and modern JavaScript.

## Live Demo

https://cristianmarcu.ro/demo-games/coin-collector-pixi/

## GitHub Repository

https://github.com/cristianmarcu/pixijs-coin-collector-demo

---

## Features

- Player movement with keyboard controls
- Falling coin and bomb objects
- Coin collection system
- Bomb collision and lives system
- Score and best score tracking
- LocalStorage best score saving
- Game over and restart logic
- Increasing difficulty over time
- Particle effects on collection and collision
- Animated star background
- Responsive UI layout
- Responsive canvas scaling
- Smooth arcade gameplay
- Built with plain JavaScript and PixiJS

---

## Tech Stack

- PixiJS
- JavaScript (ES6 Modules)
- HTML5
- CSS

---

## Game Logic

The player controls a basket and must catch falling coins while avoiding bombs.

- Catch coin = `+10 score`
- Hit bomb = `-1 life`
- Game over = when lives reach `0`
- Best score is saved in the browser using `localStorage`
- Difficulty increases over time by spawning objects faster

---

## Controls

| Action | Key |
|---|---|
| Move Left | ← or A |
| Move Right | → or D |
| Restart After Game Over | SPACE |
| Restart Game | RESTART Button |

---

## Project Structure

```text
project-folder/
├── index.html
├── src/
│   ├── config/
│   │   ├── constants.js
│   │   └── colors.js
│   ├── game/
│   │   └── CoinCollectorGame.js
│   ├── utils/
│   │   ├── math.js
│   │   └── text.js
│   └── main.js
├── README.md
└── .gitignore
```

---

## How to Run

Open `index.html` directly in the browser.

You can also deploy the project to any static hosting platform:

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

---

## What I Practiced

- PixiJS rendering systems
- Real-time arcade gameplay logic
- Collision detection
- Object spawning systems
- Particle effects and animations
- Responsive canvas scaling
- LocalStorage integration
- Keyboard input handling
- Game state management
- Modular JavaScript architecture

---

## CV Description

### Coin Collector Demo (PixiJS)

- Built a responsive arcade-style browser game using PixiJS
- Implemented collision detection, score tracking, and difficulty scaling
- Created particle effects, animated backgrounds, and responsive UI systems
- Structured the project using modular JavaScript architecture
