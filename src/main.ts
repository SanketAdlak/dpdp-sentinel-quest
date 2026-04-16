import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES } from './constants';
import { BootScene } from './scenes/BootScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { HubWorldScene } from './scenes/HubWorldScene';
import { UIScene } from './scenes/UIScene';
import { DialogueScene } from './scenes/DialogueScene';
import { PIIRadarScene } from './scenes/minigames/PIIRadarScene';
import { AuditPlazaScene } from './scenes/AuditPlazaScene';
import { GameOverScene } from './scenes/GameOverScene';
import { EndingScene } from './scenes/EndingScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  // antialias must be true so text and UI panels render crisply when the canvas
  // is scaled up on 2K / HiDPI screens.  Sprites still look pixel-accurate
  // because we use roundPixels on the world camera (set in HubWorldScene).
  pixelArt: false,
  antialias: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    PreloaderScene,
    MainMenuScene,
    HubWorldScene,
    UIScene,
    DialogueScene,
    PIIRadarScene,
    AuditPlazaScene,
    GameOverScene,
    EndingScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    roundPixels: true,   // keeps sprite positions on whole pixels → no wobble
  },
};

const game = new Phaser.Game(config);

// Hot reload support in development
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.destroy(true);
  });
}

export default game;
