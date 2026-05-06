import CoinCollectorGame from "./game/CoinCollectorGame.js";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "./config/constants.js";

const app = new PIXI.Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COLORS.background,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.getElementById("game").appendChild(app.view);

new CoinCollectorGame(app);

function resizeGame() {
  const wrapper = document.getElementById("game");
  if (!wrapper) return;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const scale = Math.min(windowWidth / GAME_WIDTH, windowHeight / GAME_HEIGHT);

  app.view.style.width = `${GAME_WIDTH * scale}px`;
  app.view.style.height = `${GAME_HEIGHT * scale}px`;
}

window.addEventListener("resize", resizeGame);
resizeGame();
