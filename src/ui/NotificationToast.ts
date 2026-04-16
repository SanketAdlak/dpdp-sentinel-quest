import Phaser from 'phaser';

export type ToastType = 'law' | 'warning' | 'success' | 'info';

export interface ToastConfig {
  message: string;
  type: ToastType;
  dpdpSection?: string;
  penalty?: string;
  duration?: number;
}

const TYPE_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  law:     { bg: '#1a0a0a', border: '#ff3333', icon: '⚖️' },
  warning: { bg: '#1a1400', border: '#ffcc00', icon: '⚠️' },
  success: { bg: '#0a1a0a', border: '#00ff88', icon: '✅' },
  info:    { bg: '#0a0f1a', border: '#44aaff', icon: '📋' },
};

export class NotificationToast {
  private scene: Phaser.Scene;
  private activeToasts: Phaser.GameObjects.Container[] = [];
  private readonly TOAST_WIDTH = 400;
  private readonly TOAST_PADDING = 14;
  private readonly TOAST_START_X: number;
  // Start below the HUD bar (56px) with a small gap — never overlaps HUD or world labels
  private readonly TOAST_START_Y = 64;
  private readonly TOAST_GAP = 6;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.TOAST_START_X = scene.scale.width - this.TOAST_WIDTH - 20;
  }

  show(config: ToastConfig): void {
    const { message, type, dpdpSection, penalty, duration = 5000 } = config;
    const colors = TYPE_COLORS[type];
    const toastHeight = dpdpSection ? 90 : 65;
    const yPos = this.TOAST_START_Y + this.activeToasts.length * (toastHeight + this.TOAST_GAP);

    const container = this.scene.add.container(this.scene.scale.width + this.TOAST_WIDTH, yPos)
      .setDepth(100)
      .setScrollFactor(0);

    // Background
    const bg = this.scene.add.rectangle(0, 0, this.TOAST_WIDTH, toastHeight, parseInt(colors.bg.replace('#', ''), 16))
      .setOrigin(0, 0).setAlpha(0.95);

    // Border (left accent)
    const border = this.scene.add.rectangle(0, 0, 4, toastHeight, parseInt(colors.border.replace('#', ''), 16))
      .setOrigin(0, 0);

    // Icon + Message
    const msgText = this.scene.add.text(this.TOAST_PADDING + 4, this.TOAST_PADDING, `${colors.icon}  ${message}`, {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '14px',
      color: '#ffffff',
      wordWrap: { width: this.TOAST_WIDTH - this.TOAST_PADDING * 2 - 8 },
    });

    const elements: Phaser.GameObjects.GameObject[] = [bg, border, msgText];

    if (dpdpSection) {
      const sectionText = this.scene.add.text(this.TOAST_PADDING + 4, toastHeight - this.TOAST_PADDING - 4,
        `📌 ${dpdpSection}${penalty ? `  |  Fine: ${penalty}` : ''}`, {
        fontFamily: "'Inter', system-ui, Arial, sans-serif",
        fontSize: '12px',
        color: colors.border,
      }).setOrigin(0, 1);
      elements.push(sectionText);
    }

    container.add(elements);
    this.activeToasts.push(container);

    // Slide in
    this.scene.tweens.add({
      targets: container,
      x: this.TOAST_START_X,
      duration: 300,
      ease: 'Back.easeOut',
    });

    // Auto-dismiss
    this.scene.time.delayedCall(duration, () => this.dismiss(container));
  }

  showLawViolation(section: string, message: string, penalty: string): void {
    this.show({ message, type: 'law', dpdpSection: section, penalty });
  }

  showSuccess(message: string, section?: string): void {
    this.show({ message, type: 'success', dpdpSection: section });
  }

  private dismiss(container: Phaser.GameObjects.Container): void {
    this.scene.tweens.add({
      targets: container,
      x: this.scene.scale.width + this.TOAST_WIDTH,
      duration: 250,
      ease: 'Back.easeIn',
      onComplete: () => {
        const idx = this.activeToasts.indexOf(container);
        if (idx !== -1) this.activeToasts.splice(idx, 1);
        container.destroy();
        this.repositionToasts();
      },
    });
  }

  private repositionToasts(): void {
    const toastHeight = 90;
    this.activeToasts.forEach((t, i) => {
      this.scene.tweens.add({
        targets: t,
        y: this.TOAST_START_Y + i * (toastHeight + this.TOAST_GAP),
        duration: 200,
        ease: 'Power2.easeOut',
      });
    });
  }
}
