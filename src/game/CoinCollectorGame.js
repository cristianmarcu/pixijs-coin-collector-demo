import {
  GAME_WIDTH,
  GAME_HEIGHT,
  COLORS,
  BEST_SCORE_KEY,
} from "../config/constants.js";
import { LAYOUT } from "../config/layout.js";
import { randomBetween, clamp, lerp } from "../utils/math.js";
import { fitPixiTextToBox } from "../utils/text.js";

export default class CoinCollectorGame {
  constructor(app) {
    this.app = app;
    this.stage = app.stage;

    this.score = 0;
    this.lives = 3;
    this.bestScore = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);

    this.gameRunning = false;
    this.gameOver = false;

    this.playerSpeed = 7;
    this.keys = {
      left: false,
      right: false,
    };

    this.fallingObjects = [];
    this.particles = [];
    this.popTexts = [];

    this.spawnTimer = 0;
    this.spawnInterval = 720;
    this.difficultyTimer = 0;

    this.stars = [];

    this.createScene();
    this.createKeyboardControls();
    this.startGame();

    this.app.ticker.add(() => this.update(this.app.ticker.deltaMS || 16.6667));
  }

  createScene() {
    this.createBackground();
    this.createHeader();
    this.createGameArea();
    this.createPlayer();
    this.createHud();
    this.createMessageBox();
  }

  createBackground() {
    const bg = new PIXI.Graphics();
    bg.beginFill(COLORS.background);
    bg.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    bg.endFill();
    this.stage.addChild(bg);

    const glow1 = new PIXI.Graphics();
    glow1.beginFill(0x3b003f, 0.45);
    glow1.drawCircle(130, 100, 210);
    glow1.endFill();
    this.stage.addChild(glow1);

    const glow2 = new PIXI.Graphics();
    glow2.beginFill(0x002b5f, 0.35);
    glow2.drawCircle(835, 95, 220);
    glow2.endFill();
    this.stage.addChild(glow2);

    const glow3 = new PIXI.Graphics();
    glow3.beginFill(0x4a2100, 0.28);
    glow3.drawCircle(800, 450, 190);
    glow3.endFill();
    this.stage.addChild(glow3);

    for (let i = 0; i < 115; i++) {
      const star = new PIXI.Graphics();
      const radius = randomBetween(1, 3);

      star.beginFill(0xffe8a3, Math.random() * 0.6 + 0.15);
      star.drawCircle(0, 0, radius);
      star.endFill();

      star.x = Math.random() * GAME_WIDTH;
      star.y = Math.random() * GAME_HEIGHT;
      star.twinkleSpeed = Math.random() * 0.04 + 0.015;
      star.twinkleOffset = Math.random() * Math.PI * 2;

      this.stars.push(star);
      this.stage.addChild(star);
    }
  }

  createHeader() {
    this.titleText = new PIXI.Text("COIN COLLECTOR", {
      fontFamily: "Arial",
      fontSize: 44,
      fontWeight: "bold",
      fill: COLORS.gold,
      stroke: COLORS.titleStroke,
      strokeThickness: 7,
      dropShadow: true,
      dropShadowColor: 0xffb000,
      dropShadowBlur: 8,
      dropShadowDistance: 0,
    });

    this.titleText.anchor.set(0.5);
    this.titleText.position.set(LAYOUT.titleX, LAYOUT.titleY);
    this.stage.addChild(this.titleText);

    this.subtitleText = new PIXI.Text("PIXIJS ARCADE DEMO", {
      fontFamily: "Arial",
      fontSize: 16,
      fontWeight: "bold",
      fill: COLORS.text,
      stroke: 0x000000,
      strokeThickness: 4,
    });

    this.subtitleText.anchor.set(0.5);
    this.subtitleText.position.set(LAYOUT.subtitleX, LAYOUT.subtitleY);
    this.stage.addChild(this.subtitleText);
  }

  createGameArea() {
    this.gameArea = {
      x: LAYOUT.gameAreaX,
      y: LAYOUT.gameAreaY,
      width: LAYOUT.gameAreaW,
      height: LAYOUT.gameAreaH,
    };

    const panel = new PIXI.Graphics();

    panel.beginFill(COLORS.panelDark, 0.93);
    panel.lineStyle(4, COLORS.panelBorder, 1);
    panel.drawRoundedRect(
      this.gameArea.x,
      this.gameArea.y,
      this.gameArea.width,
      this.gameArea.height,
      14,
    );
    panel.endFill();

    this.stage.addChild(panel);

    this.grid = new PIXI.Graphics();
    this.grid.lineStyle(1, COLORS.gold, 0.14);

    for (let i = 1; i < 7; i++) {
      const x = this.gameArea.x + (this.gameArea.width / 7) * i;

      this.grid.moveTo(x, this.gameArea.y + 10);
      this.grid.lineTo(x, this.gameArea.y + this.gameArea.height - 10);
    }

    for (let i = 1; i < 4; i++) {
      const y = this.gameArea.y + (this.gameArea.height / 4) * i;

      this.grid.moveTo(this.gameArea.x + 10, y);
      this.grid.lineTo(this.gameArea.x + this.gameArea.width - 10, y);
    }

    this.stage.addChild(this.grid);
  }

  createPlayer() {
    this.player = new PIXI.Container();

    const body = new PIXI.Graphics();
    body.beginFill(0x162447);
    body.lineStyle(4, COLORS.gold, 1);
    body.drawRoundedRect(-42, -18, 84, 36, 12);
    body.endFill();

    const basket = new PIXI.Graphics();
    basket.beginFill(0x6b3d00);
    basket.lineStyle(3, COLORS.text, 1);
    basket.drawRoundedRect(-32, -30, 64, 26, 10);
    basket.endFill();

    const handle = new PIXI.Graphics();
    handle.lineStyle(4, COLORS.gold, 1);
    handle.arc(0, -30, 26, Math.PI, Math.PI * 2);

    this.player.addChild(body);
    this.player.addChild(basket);
    this.player.addChild(handle);

    this.player.x = GAME_WIDTH / 2;
    this.player.y = this.gameArea.y + this.gameArea.height - 30;

    this.stage.addChild(this.player);
  }

  createHud() {
    this.createPanel(LAYOUT.scoreX, LAYOUT.hudY, LAYOUT.hudW, LAYOUT.hudH);
    this.createPanel(LAYOUT.bestX, LAYOUT.hudY, LAYOUT.hudW, LAYOUT.hudH);
    this.createPanel(LAYOUT.livesX, LAYOUT.hudY, LAYOUT.hudW, LAYOUT.hudH);

    this.createLabel(LAYOUT.scoreX, LAYOUT.hudY - 16, "SCORE");
    this.createLabel(LAYOUT.bestX, LAYOUT.hudY - 16, "BEST");
    this.createLabel(LAYOUT.livesX, LAYOUT.hudY - 16, "LIVES");

    this.scoreText = this.createValueText(LAYOUT.scoreX, LAYOUT.hudY + 12, "0");
    this.bestText = this.createValueText(
      LAYOUT.bestX,
      LAYOUT.hudY + 12,
      String(this.bestScore),
    );
    this.livesText = this.createValueText(
      LAYOUT.livesX,
      LAYOUT.hudY + 12,
      "❤️❤️❤️",
    );

    this.createRestartButton();
  }

  createRestartButton() {
    this.restartButton = new PIXI.Container();

    this.restartBg = new PIXI.Graphics();
    this.restartBg.beginFill(COLORS.buttonRed);
    this.restartBg.lineStyle(4, COLORS.gold, 1);
    this.restartBg.drawRoundedRect(
      -LAYOUT.restartW / 2,
      -LAYOUT.restartH / 2,
      LAYOUT.restartW,
      LAYOUT.restartH,
      12,
    );
    this.restartBg.endFill();

    this.restartText = new PIXI.Text("RESTART", {
      fontFamily: "Arial",
      fontSize: 18,
      fontWeight: "bold",
      fill: COLORS.text,
      stroke: COLORS.buttonStroke,
      strokeThickness: 4,
    });

    this.restartText.anchor.set(0.5);

    this.restartButton.addChild(this.restartBg);
    this.restartButton.addChild(this.restartText);
    this.restartButton.position.set(LAYOUT.restartX, LAYOUT.restartY);

    this.restartButton.eventMode = "static";
    this.restartButton.cursor = "pointer";

    this.restartButton.on("pointerdown", () => this.startGame());
    this.restartButton.on(
      "pointerover",
      () => (this.restartBg.tint = 0xff173e),
    );
    this.restartButton.on("pointerout", () => (this.restartBg.tint = 0xffffff));

    this.stage.addChild(this.restartButton);
  }

  createPanel(x, y, width, height) {
    const panel = new PIXI.Graphics();

    panel.beginFill(COLORS.panel, 0.95);
    panel.lineStyle(3, COLORS.gold, 1);
    panel.drawRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    panel.endFill();

    this.stage.addChild(panel);

    return panel;
  }

  createLabel(x, y, value) {
    const label = new PIXI.Text(value, {
      fontFamily: "Arial",
      fontSize: 13,
      fontWeight: "bold",
      fill: COLORS.text,
    });

    label.anchor.set(0.5);
    label.position.set(x, y);
    this.stage.addChild(label);

    return label;
  }

  createValueText(x, y, value) {
    const text = new PIXI.Text(value, {
      fontFamily: "Arial",
      fontSize: 22,
      fontWeight: "bold",
      fill: COLORS.white,
    });

    text.anchor.set(0.5);
    text.position.set(x, y);
    this.stage.addChild(text);

    return text;
  }

  createMessageBox() {
    this.messagePanel = this.createPanel(
      LAYOUT.messageX,
      LAYOUT.messageY,
      LAYOUT.messageW,
      LAYOUT.messageH,
    );

    this.messageText = new PIXI.Text(
      "Move with ← → or A / D. Catch coins, avoid bombs!",
      {
        fontFamily: "Arial",
        fontSize: 18,
        fontWeight: "bold",
        fill: COLORS.text,
        stroke: 0x000000,
        strokeThickness: 4,
      },
    );

    this.messageText.anchor.set(0.5);
    this.messageText.position.set(LAYOUT.messageX, LAYOUT.messageY);
    this.stage.addChild(this.messageText);
  }

  createKeyboardControls() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        this.keys.left = true;
      }

      if (key === "arrowright" || key === "d") {
        this.keys.right = true;
      }

      if (key === " " && this.gameOver) {
        this.startGame();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        this.keys.left = false;
      }

      if (key === "arrowright" || key === "d") {
        this.keys.right = false;
      }
    });
  }

  startGame() {
    this.clearFallingObjects();

    this.score = 0;
    this.lives = 3;
    this.spawnTimer = 0;
    this.spawnInterval = 720;
    this.difficultyTimer = 0;
    this.gameRunning = true;
    this.gameOver = false;

    this.player.x = GAME_WIDTH / 2;
    this.player.alpha = 1;
    this.player.scale.set(1);

    this.setMessage("Catch coins, avoid bombs!");
    this.updateHud();
  }

  update(deltaMS) {
    this.updateStars();

    if (!this.gameRunning) return;

    this.updatePlayer();
    this.updateSpawning(deltaMS);
    this.updateFallingObjects(deltaMS);
    this.updateDifficulty(deltaMS);
  }

  updateStars() {
    const time = performance.now() / 1000;

    this.stars.forEach((star) => {
      star.alpha =
        0.25 +
        Math.abs(Math.sin(time * star.twinkleSpeed * 8 + star.twinkleOffset)) *
          0.65;
    });
  }

  updatePlayer() {
    if (this.keys.left) {
      this.player.x -= this.playerSpeed;
    }

    if (this.keys.right) {
      this.player.x += this.playerSpeed;
    }

    const minX = this.gameArea.x + 50;
    const maxX = this.gameArea.x + this.gameArea.width - 50;

    this.player.x = clamp(this.player.x, minX, maxX);
  }

  updateSpawning(deltaMS) {
    this.spawnTimer += deltaMS;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnObject();
    }
  }

  spawnObject() {
    const isBomb = Math.random() < 0.24;

    const object = new PIXI.Container();

    object.type = isBomb ? "bomb" : "coin";
    object.radius = isBomb ? 24 : 21;
    object.speed = isBomb ? randomBetween(2.7, 4.1) : randomBetween(2.3, 3.7);
    object.rotationSpeed = randomBetween(-0.08, 0.08);

    const icon = new PIXI.Text(isBomb ? "💣" : "🪙", {
      fontFamily: "Arial",
      fontSize: isBomb ? 38 : 40,
      stroke: 0x000000,
      strokeThickness: 4,
    });

    icon.anchor.set(0.5);

    object.addChild(icon);

    object.x = randomBetween(
      this.gameArea.x + 35,
      this.gameArea.x + this.gameArea.width - 35,
    );
    object.y = this.gameArea.y - 30;

    object.icon = icon;

    this.fallingObjects.push(object);
    this.stage.addChild(object);
  }

  updateFallingObjects(deltaMS) {
    const deltaFactor = deltaMS / 16.6667;

    for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
      const object = this.fallingObjects[i];

      object.y += object.speed * deltaFactor;
      object.rotation += object.rotationSpeed * deltaFactor;

      if (this.checkCollision(object, this.player)) {
        this.collectObject(object, i);
        continue;
      }

      if (object.y > this.gameArea.y + this.gameArea.height + 50) {
        this.removeObject(object, i);
      }
    }
  }

  checkCollision(object, player) {
    const dx = object.x - player.x;
    const dy = object.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < object.radius + 42;
  }

  collectObject(object, index) {
    if (object.type === "coin") {
      this.score += 10;
      this.setMessage("Nice catch! +10");
      this.popText(object.x, object.y, "+10", COLORS.green);
      this.playCollectEffect(object.x, object.y, COLORS.gold);
    } else {
      this.lives -= 1;
      this.setMessage("Bomb hit! -1 life");
      this.popText(object.x, object.y, "-1 LIFE", COLORS.red);
      this.playCollectEffect(object.x, object.y, COLORS.red);
      this.shakePlayer();

      if (this.lives <= 0) {
        this.endGame();
      }
    }

    this.removeObject(object, index);
    this.updateHud();
  }

  playCollectEffect(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const particle = new PIXI.Graphics();

      particle.beginFill(color, 1);
      particle.drawCircle(0, 0, randomBetween(3, 6));
      particle.endFill();

      particle.x = x;
      particle.y = y;

      this.stage.addChild(particle);

      this.animateParticle(
        particle,
        x + randomBetween(-55, 55),
        y + randomBetween(-55, 55),
      );
    }
  }

  animateParticle(particle, targetX, targetY) {
    const startX = particle.x;
    const startY = particle.y;
    const duration = randomBetween(320, 620);
    const startedAt = performance.now();

    const tick = () => {
      const progress = clamp((performance.now() - startedAt) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      particle.x = lerp(startX, targetX, eased);
      particle.y = lerp(startY, targetY, eased);
      particle.alpha = 1 - progress;
      particle.scale.set(1 + progress);

      if (progress >= 1) {
        this.destroyDisplayObject(particle);
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  }

  popText(x, y, value, color) {
    const text = new PIXI.Text(value, {
      fontFamily: "Arial",
      fontSize: 22,
      fontWeight: "bold",
      fill: color,
      stroke: 0x000000,
      strokeThickness: 4,
    });

    text.anchor.set(0.5);
    text.position.set(x, y);

    this.stage.addChild(text);

    const startY = y;
    const duration = 650;
    const startedAt = performance.now();

    const tick = () => {
      const progress = clamp((performance.now() - startedAt) / duration, 0, 1);

      text.y = startY - progress * 45;
      text.alpha = 1 - progress;

      if (progress >= 1) {
        this.destroyDisplayObject(text);
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  }

  shakePlayer() {
    const originalX = this.player.x;
    let frames = 0;

    const tick = () => {
      frames += 1;
      this.player.x = originalX + randomBetween(-8, 8);

      if (frames >= 12) {
        this.player.x = originalX;
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  }

  updateDifficulty(deltaMS) {
    this.difficultyTimer += deltaMS;

    if (this.difficultyTimer >= 3500) {
      this.difficultyTimer = 0;
      this.spawnInterval = Math.max(320, this.spawnInterval - 35);
    }
  }

  updateHud() {
    this.scoreText.text = String(this.score);
    this.bestText.text = String(this.bestScore);
    this.livesText.text = "❤️".repeat(Math.max(0, this.lives));
  }

  setMessage(value) {
    fitPixiTextToBox(this.messageText, value, LAYOUT.messageW - 40, 18, 11);
  }

  endGame() {
    this.gameRunning = false;
    this.gameOver = true;

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(BEST_SCORE_KEY, String(this.bestScore));
    }

    this.updateHud();
    this.setMessage(`GAME OVER - Score ${this.score}. Press SPACE or RESTART`);

    this.player.alpha = 0.65;

    for (let i = 0; i < 22; i++) {
      const spark = new PIXI.Text("✦", {
        fontSize: randomBetween(16, 28),
        fill: COLORS.red,
        stroke: 0x000000,
        strokeThickness: 3,
      });

      spark.anchor.set(0.5);
      spark.x = this.player.x;
      spark.y = this.player.y;

      this.stage.addChild(spark);

      this.animateParticle(
        spark,
        spark.x + randomBetween(-130, 130),
        spark.y + randomBetween(-90, 90),
      );
    }
  }

  clearFallingObjects() {
    this.fallingObjects.forEach((object) => {
      this.destroyDisplayObject(object);
    });

    this.fallingObjects = [];
  }

  removeObject(object, index) {
    this.destroyDisplayObject(object);
    this.fallingObjects.splice(index, 1);
  }

  destroyDisplayObject(object) {
    if (!object) return;

    if (object.parent) {
      object.parent.removeChild(object);
    }

    object.destroy({ children: true });
  }
}
