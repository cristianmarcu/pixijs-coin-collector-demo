# Coin Collector PixiJS Demo

A responsive HTML5 arcade-style game built with PixiJS and plain JavaScript.

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
- Responsive canvas scaling for different screen sizes
- Built with plain JavaScript and PixiJS

## Tech Stack

- PixiJS
- JavaScript
- HTML5
- CSS

## How to Run

Open `index.html` directly in the browser.

You can also deploy the project to any static hosting platform, such as:

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

## Game Logic

The player controls a basket and must catch falling coins while avoiding bombs.

- Catch coin = `+10 score`
- Hit bomb = `-1 life`
- Game over = when lives reach `0`
- Best score is saved in the browser using `localStorage`
- Difficulty increases over time by spawning objects faster

## Controls

- `←` or `A` = move left
- `→` or `D` = move right
- `SPACE` = restart after game over
- `RESTART` button = restart game

## Project Structure

```text
project-folder/
├── index.html
├── src/
│   └── main.js
└── README.md
```
