import Phaser from 'phaser';
import { ScoreSystem } from '../systems/ScoreSystem';
import { CompanyHealthSystem } from '../systems/CompanyHealthSystem';
import { GAME_WIDTH } from '../constants';

const HUD_H = 56;
const BAR_W = 120;
const BAR_H = 14;
const HUD_Y = 0;

export class HUD {
  private scene: Phaser.Scene;

  // Compliance bar
  private complianceTrack!: Phaser.GameObjects.Graphics;
  private complianceFill!: Phaser.GameObjects.Graphics;
  private complianceText!: Phaser.GameObjects.Text;

  // Debt bar
  private debtFill!: Phaser.GameObjects.Graphics;
  private debtText!: Phaser.GameObjects.Text;

  // Trust bar
  private trustFill!: Phaser.GameObjects.Graphics;
  private trustText!: Phaser.GameObjects.Text;

  // Coins
  private coinsText!: Phaser.GameObjects.Text;

  // Day counter
  private dayText!: Phaser.GameObjects.Text;

  // Grade
  private gradeText!: Phaser.GameObjects.Text;

  // Company Health
  private healthFill!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private healthLabelText!: Phaser.GameObjects.Text;
  private healthTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.build();
    this.bindEvents();
    this.refresh();
  }

  private build(): void {
    const s = this.scene;
    const depth = 50;

    // ── Panel background (full-width, opaque dark blue) ──
    const panelBg = s.add.rectangle(0, HUD_Y, GAME_WIDTH, HUD_H, 0x0A0A1E, 1)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(depth);
    void panelBg;

    // Bottom border (teal 2px)
    const border = s.add.graphics().setScrollFactor(0).setDepth(depth + 1);
    border.lineStyle(2, 0x00FFCC, 1);
    border.lineBetween(0, HUD_Y + HUD_H - 1, GAME_WIDTH, HUD_Y + HUD_H - 1);

    // Layout columns
    const colY = HUD_Y + 8;
    const barY = colY + 18;

    // ── Compliance ──────────────────────────────────────────────────────────
    const cx1 = 14;
    s.add.text(cx1, colY, 'COMPLIANCE', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#aabbcc',
    }).setScrollFactor(0).setDepth(depth + 1);

    this.complianceTrack = s.add.graphics().setScrollFactor(0).setDepth(depth + 1);
    this.complianceFill = s.add.graphics().setScrollFactor(0).setDepth(depth + 2);
    this.complianceText = s.add.text(cx1 + BAR_W + 6, barY, '20%', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '13px', color: '#00FF88',
    }).setScrollFactor(0).setDepth(depth + 2);

    // Track
    this.complianceTrack.fillStyle(0x003311, 1);
    this.complianceTrack.fillRoundedRect(cx1, barY, BAR_W, BAR_H, 3);

    // ── Privacy Debt ────────────────────────────────────────────────────────
    const cx2 = cx1 + BAR_W + 58;
    s.add.text(cx2, colY, 'PRIV. DEBT', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#aabbcc',
    }).setScrollFactor(0).setDepth(depth + 1);

    const debtTrack = s.add.graphics().setScrollFactor(0).setDepth(depth + 1);
    debtTrack.fillStyle(0x330011, 1);
    debtTrack.fillRoundedRect(cx2, barY, BAR_W, BAR_H, 3);

    this.debtFill = s.add.graphics().setScrollFactor(0).setDepth(depth + 2);
    this.debtText = s.add.text(cx2 + BAR_W + 6, barY, '30%', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '13px', color: '#FF3344',
    }).setScrollFactor(0).setDepth(depth + 2);

    // ── Trust Rating ─────────────────────────────────────────────────────────
    const cx3 = cx2 + BAR_W + 58;
    s.add.text(cx3, colY, 'TRUST', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#aabbcc',
    }).setScrollFactor(0).setDepth(depth + 1);

    const trustTrack = s.add.graphics().setScrollFactor(0).setDepth(depth + 1);
    trustTrack.fillStyle(0x332200, 1);
    trustTrack.fillRoundedRect(cx3, barY, BAR_W, BAR_H, 3);

    this.trustFill = s.add.graphics().setScrollFactor(0).setDepth(depth + 2);
    this.trustText = s.add.text(cx3 + BAR_W + 6, barY, '50%', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '13px', color: '#FFCC00',
    }).setScrollFactor(0).setDepth(depth + 2);

    // ── Coins ────────────────────────────────────────────────────────────────
    const cx4 = cx3 + BAR_W + 58;
    this.coinsText = s.add.text(cx4, colY, 'Coins: 0', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#FFDD44',
    }).setScrollFactor(0).setDepth(depth + 1);

    // ── Day Counter ──────────────────────────────────────────────────────────
    this.dayText = s.add.text(GAME_WIDTH - 130, colY, 'DAY 1 / 30', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '13px', color: '#aabbcc',
    }).setScrollFactor(0).setDepth(depth + 1);

    // ── Grade Letter ─────────────────────────────────────────────────────────
    this.gradeText = s.add.text(GAME_WIDTH - 40, HUD_Y + HUD_H / 2, 'F', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '26px', color: '#ff3333', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2);

    // ── Company Health ────────────────────────────────────────────────────────
    const chX = GAME_WIDTH - 130;
    const chBarY = barY + 22;
    s.add.text(chX, colY + 22, 'CO. HEALTH', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#aabbcc',
    }).setScrollFactor(0).setDepth(depth + 1);

    const healthTrack = s.add.graphics().setScrollFactor(0).setDepth(depth + 1);
    healthTrack.fillStyle(0x001122, 1);
    healthTrack.fillRoundedRect(chX, chBarY, BAR_W, BAR_H, 3);

    this.healthFill = s.add.graphics().setScrollFactor(0).setDepth(depth + 2);

    this.healthText = s.add.text(chX + BAR_W + 6, chBarY, 'FAIR', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '14px', color: '#FFCC00',
    }).setScrollFactor(0).setDepth(depth + 2);

    this.healthLabelText = s.add.text(chX, chBarY - 1, '', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '11px', color: '#aaaaaa',
    }).setScrollFactor(0).setDepth(depth + 2);
  }

  private bindEvents(): void {
    ScoreSystem.on('change', () => this.refresh());
  }

  private refresh(): void {
    const state = ScoreSystem.getState();
    const colY = HUD_Y + 8;
    const barY = colY + 18;

    const cx1 = 14;
    const cx2 = cx1 + BAR_W + 58;
    const cx3 = cx2 + BAR_W + 58;

    // ── Compliance bar ──
    const compPct = state.complianceScore / 100;
    this.complianceFill.clear();
    this.complianceFill.fillStyle(0x00FF88, 1);
    this.complianceFill.fillRoundedRect(cx1, barY, Math.max(0, BAR_W * compPct), BAR_H, 3);
    this.complianceText.setText(`${state.complianceScore}%`);

    // ── Debt bar ──
    const debtPct = state.privacyDebt / 100;
    this.debtFill.clear();
    this.debtFill.fillStyle(0xFF3344, 1);
    this.debtFill.fillRoundedRect(cx2, barY, Math.max(0, BAR_W * debtPct), BAR_H, 3);
    this.debtText.setText(`${state.privacyDebt}%`);

    // ── Trust bar ──
    const trustPct = state.trustRating / 100;
    this.trustFill.clear();
    this.trustFill.fillStyle(0xFFCC00, 1);
    this.trustFill.fillRoundedRect(cx3, barY, Math.max(0, BAR_W * trustPct), BAR_H, 3);
    this.trustText.setText(`${state.trustRating}%`);

    // ── Coins ──
    this.coinsText.setText(`Coins: ${state.privacyCoins}`);

    // ── Day counter — urgent colors ──
    const d = state.inGameDay;
    const dayColor = d > 25 ? '#ff3333' : d > 15 ? '#ffcc00' : '#aabbcc';
    this.dayText.setText(`DAY ${d} / 30`).setColor(dayColor);

    // ── Grade ──
    const gradeStr = ScoreSystem.getGrade();
    const letter = gradeStr.charAt(0);
    const gradeColors: Record<string, string> = {
      S: '#FFCC00', A: '#00FF88', B: '#00FFCC', C: '#FFCC00', D: '#FF8800', F: '#FF3333',
    };
    this.gradeText.setText(letter).setColor(gradeColors[letter] ?? '#aabbcc');

    // ── Company Health ──
    const chX = GAME_WIDTH - 130;
    const chBarY = barY + 22;
    const health = CompanyHealthSystem.getHealth();
    const status = CompanyHealthSystem.getStatus();
    const healthPct = health / 100;

    this.healthFill.clear();
    this.healthFill.fillStyle(status.color, 1);
    this.healthFill.fillRoundedRect(chX, chBarY, Math.max(0, BAR_W * healthPct), BAR_H, 3);
    this.healthText.setText(status.label).setColor(status.textColor);

    // Pulse tween for warning states
    if (status.pulse) {
      if (!this.healthTween || !this.healthTween.isPlaying()) {
        this.healthTween = this.scene.tweens.add({
          targets: this.healthFill,
          alpha: 0.4,
          duration: 600,
          yoyo: true,
          repeat: -1,
        });
      }
    } else {
      if (this.healthTween) {
        this.healthTween.stop();
        this.healthTween = null;
        this.healthFill.setAlpha(1);
      }
    }
  }
}
