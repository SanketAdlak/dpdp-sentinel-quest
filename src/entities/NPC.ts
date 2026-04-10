import Phaser from 'phaser';
import { NPC_INTERACTION_DISTANCE, COLORS } from '../constants';

export interface NPCConfig {
  id: string;
  name: string;
  role: string;
  spriteKey: string;
  dialogue: string;   // Ink knot name to start
  x: number;
  y: number;
}

export class NPC extends Phaser.GameObjects.Sprite {
  readonly npcId: string;
  readonly npcName: string;
  readonly role: string;
  readonly dialogueKnot: string;

  private nameLabel!: Phaser.GameObjects.Text;
  private roleLabel!: Phaser.GameObjects.Text;
  private interactionZone!: Phaser.GameObjects.Zone;
  private proximityBubble!: Phaser.GameObjects.Container;
  private proximityTween?: Phaser.Tweens.Tween;
  private isPlayerNear = false;

  constructor(scene: Phaser.Scene, config: NPCConfig) {
    super(scene, config.x, config.y, config.spriteKey, 0);

    this.npcId = config.id;
    this.npcName = config.name;
    this.role = config.role;
    this.dialogueKnot = config.dialogue;

    scene.add.existing(this);
    this.setDepth(8);

    // Name label
    this.nameLabel = scene.add.text(config.x, config.y - this.height / 2 - 20, config.name, {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: COLORS.TEXT_HIGHLIGHT,
      backgroundColor: '#00000099',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 1).setDepth(15);

    this.roleLabel = scene.add.text(config.x, config.y - this.height / 2 - 6, `[${config.role}]`, {
      fontFamily: 'Courier New',
      fontSize: '9px',
      color: COLORS.TEXT_SECONDARY,
    }).setOrigin(0.5, 1).setDepth(15);

    // Invisible interaction zone
    this.interactionZone = scene.add.zone(config.x, config.y, NPC_INTERACTION_DISTANCE * 2, NPC_INTERACTION_DISTANCE * 2);
    scene.physics.world.enable(this.interactionZone);

    // Proximity indicator — pulsing "!" bubble shown when player is near
    this.proximityBubble = scene.add.container(config.x, config.y - 36);
    const bubbleBg = scene.add.circle(0, 0, 10, 0x00ffcc, 0.85);
    const bubbleText = scene.add.text(0, 0, '!', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);
    const hintText = scene.add.text(14, 0, '[ E ]', {
      fontFamily: 'Courier New',
      fontSize: '10px',
      color: '#00ffcc',
      backgroundColor: '#00000088',
      padding: { x: 3, y: 2 },
    }).setOrigin(0, 0.5);
    this.proximityBubble.add([bubbleBg, bubbleText, hintText]);
    this.proximityBubble.setDepth(20).setVisible(false);

    this.createIdleAnimation(scene, config.spriteKey);

    // Play the sprite-specific idle animation (fixes Bug 4)
    const animKey = `${config.spriteKey}-idle`;
    this.play(animKey, true);
  }

  private createIdleAnimation(scene: Phaser.Scene, key: string): void {
    const animKey = `${key}-idle`;
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        frames: [
          { key, frame: 0 },
          { key, frame: 1 },
        ],
        frameRate: 1.5,
        repeat: -1,
      });
    }
    // Note: generic 'npc-idle' is intentionally NOT created here.
    // Each NPC plays its own key-specific animation.
  }

  getInteractionZone(): Phaser.GameObjects.Zone {
    return this.interactionZone;
  }

  checkPlayerProximity(playerX: number, playerY: number): boolean {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    const wasNear = this.isPlayerNear;
    this.isPlayerNear = dist <= NPC_INTERACTION_DISTANCE;

    // Show/hide proximity bubble with pulse tween
    if (this.isPlayerNear && !wasNear) {
      this.proximityBubble.setVisible(true);
      this.proximityBubble.setScale(0.5);
      this.scene.tweens.add({
        targets: this.proximityBubble,
        scale: 1,
        duration: 200,
        ease: 'Back.easeOut',
      });
      this.proximityTween = this.scene.tweens.add({
        targets: this.proximityBubble,
        y: this.y - 40,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else if (!this.isPlayerNear && wasNear) {
      this.proximityBubble.setVisible(false);
      this.proximityTween?.stop();
      this.proximityTween = undefined;
      this.proximityBubble.y = this.y - 36;
    }

    return this.isPlayerNear;
  }

  isNearPlayer(): boolean {
    return this.isPlayerNear;
  }

  destroy(): void {
    this.nameLabel?.destroy();
    this.roleLabel?.destroy();
    this.interactionZone?.destroy();
    this.proximityBubble?.destroy();
    this.proximityTween?.stop();
    super.destroy();
  }
}
