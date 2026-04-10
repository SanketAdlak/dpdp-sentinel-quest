import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS } from '../constants';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOADER });
  }

  preload(): void {
    // Load ink story file
    this.load.json('ink-main', 'assets/ink/main.ink.json');

    // Show loading bar
    this.createLoadingUI();

    this.load.on('progress', (value: number) => {
      this.events.emit('loading-progress', value);
    });
  }

  create(): void {
    this.time.delayedCall(200, () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
  }

  private createLoadingUI(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

    // Logo / title
    this.add.text(cx, cy - 80, 'DPDP SENTINEL QUEST', {
      fontFamily: 'Courier New',
      fontSize: '28px',
      color: COLORS.TEXT_HIGHLIGHT,
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(cx, cy - 44, 'India\'s Data Privacy Adventure', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
    }).setOrigin(0.5);

    // Progress bar bg
    this.add.rectangle(cx, cy + 20, 400, 16, 0x223344).setOrigin(0.5);
    const bar = this.add.rectangle(cx - 200, cy + 20, 0, 14, COLORS.COMPLIANCE).setOrigin(0, 0.5);

    // Loading text
    const loadText = this.add.text(cx, cy + 48, 'Loading...', {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: COLORS.TEXT_SECONDARY,
    }).setOrigin(0.5);

    this.events.on('loading-progress', (value: number) => {
      bar.width = 400 * value;
      loadText.setText(`Loading... ${Math.round(value * 100)}%`);
    });

    // Flavor text
    const tips = [
      '💡 Tip: DPDP Act 2023 applies to ALL digital personal data processed in India.',
      '💡 Tip: Under Section 8, Data Fiduciaries must ensure data accuracy and security.',
      '💡 Tip: Children under 18 need Verifiable Parental Consent (VPC) to use your app.',
      '💡 Tip: The Data Protection Board can impose fines up to ₹250 Crore per violation.',
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    this.add.text(cx, cy + 80, tip, {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#557788',
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5);
  }
}
