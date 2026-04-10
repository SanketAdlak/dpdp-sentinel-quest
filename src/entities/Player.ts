import Phaser from 'phaser';
import { COLORS } from '../constants';

export type PlayerDirection = 'up' | 'down' | 'left' | 'right';

const TILE_SIZE   = 32;
const MOVE_DURATION = 160; // ms per tile — snappy Pokemon Red feel

/** Neutral (idle) frame index per direction. */
const IDLE_FRAME: Record<PlayerDirection, number> = {
  down:  0,
  left:  4,
  right: 8,
  up:    12,
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private direction: PlayerDirection = 'down';
  private isInteracting = false;
  private canInteract = false;
  private currentNPCTarget: string | null = null;
  private interactIndicator!: Phaser.GameObjects.Text;

  // ── Grid movement state ──────────────────────────────────────────────────
  private isMoving = false;
  /** One-slot buffer: last direction held while a move was in progress. */
  private moveBuffer: PlayerDirection | null = null;
  /** Injected by HubWorldScene after the room map is built. */
  private collisionCheck: ((x: number, y: number) => boolean) | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Snap spawn to the nearest 32 px grid point
    const sx = Math.round(x / TILE_SIZE) * TILE_SIZE;
    const sy = Math.round(y / TILE_SIZE) * TILE_SIZE;
    super(scene, sx, sy, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Foot-level hitbox: 20×24 at bottom-center of the 32×48 sprite
    this.setSize(20, 24);
    this.setOffset(6, 24);
    this.setDepth(10);

    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = {
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.interactIndicator = scene.add.text(sx, sy - 28, '[E]', {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: COLORS.TEXT_HIGHLIGHT,
      backgroundColor: '#00000099',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 1).setVisible(false).setDepth(20);

    this.createAnimations(scene);
    // Start facing down
    this.setFrame(IDLE_FRAME.down);
  }

  /** Called by HubWorldScene once the room map is ready. */
  setCollisionCallback(cb: (x: number, y: number) => boolean): void {
    this.collisionCheck = cb;
  }

  private createAnimations(scene: Phaser.Scene): void {
    // 4 frames per direction: base+0 neutral, base+1 left-step, base+2 right-step, base+3 alt
    // Walk cycle uses: step-L → neutral → step-R → neutral (4 frames, 10 fps = 25 ms/frame)
    // At 160 ms move this gives ≈6.4 frames visible — a clear two-step cycle
    const dirs: Array<[string, number]> = [
      ['down',  0],
      ['left',  4],
      ['right', 8],
      ['up',    12],
    ];
    dirs.forEach(([dir, base]) => {
      const key = `walk-${dir}`;
      if (!scene.anims.exists(key)) {
        scene.anims.create({
          key,
          frames: [
            { key: 'player', frame: base + 1 },
            { key: 'player', frame: base },
            { key: 'player', frame: base + 2 },
            { key: 'player', frame: base },
          ],
          frameRate: 10,
          repeat: -1,
        });
      }
    });
  }

  update(): void {
    if (this.isInteracting) {
      this.setVelocity(0, 0);
      return;
    }

    // ── Read directional input ──────────────────────────────────────────────
    const holdUp    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const holdDown  = this.cursors.down.isDown  || this.wasd.down.isDown;
    const holdLeft  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const holdRight = this.cursors.right.isDown || this.wasd.right.isDown;

    let pressedDir: PlayerDirection | null = null;
    if (holdLeft)       pressedDir = 'left';
    else if (holdRight) pressedDir = 'right';
    else if (holdUp)    pressedDir = 'up';
    else if (holdDown)  pressedDir = 'down';

    // ── While a tile-move is in progress ───────────────────────────────────
    if (this.isMoving) {
      this.setVelocity(0, 0);
      // Buffer the latest direction so it fires right after the tween ends
      if (pressedDir) this.moveBuffer = pressedDir;
      return;
    }

    // ── Face a newly pressed direction immediately (before moving) ──────────
    if (pressedDir && pressedDir !== this.direction) {
      this.direction = pressedDir;
      this.showIdleFrame();
      // Return for one frame so the player "turns" before stepping
      // (omit this return to allow immediate movement — both feel fine)
    }

    // ── Determine the direction to attempt ─────────────────────────────────
    const dir = pressedDir ?? this.moveBuffer;
    this.moveBuffer = null;

    if (!dir) {
      this.showIdleFrame();
      this.setVelocity(0, 0);
      this.interactIndicator.setPosition(this.x, this.y - 28);
      this.checkInteract();
      return;
    }

    this.direction = dir;

    const dx = dir === 'left' ? -TILE_SIZE : dir === 'right' ? TILE_SIZE : 0;
    const dy = dir === 'up'   ? -TILE_SIZE : dir === 'down'  ? TILE_SIZE : 0;
    const tx = this.x + dx;
    const ty = this.y + dy;

    // ── Collision check ─────────────────────────────────────────────────────
    if (this.collisionCheck && !this.collisionCheck(tx, ty)) {
      // Blocked — face the direction but stay put
      this.showIdleFrame();
      this.setVelocity(0, 0);
      this.interactIndicator.setPosition(this.x, this.y - 28);
      this.checkInteract();
      return;
    }

    // ── Start tile move ─────────────────────────────────────────────────────
    this.isMoving = true;
    this.setVelocity(0, 0);
    this.anims.play(`walk-${dir}`, true);

    this.scene.tweens.add({
      targets: this,
      x: tx,
      y: ty,
      duration: MOVE_DURATION,
      ease: 'Linear',
      onComplete: () => {
        // Snap to integer grid to kill floating-point drift
        const gx = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
        const gy = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
        this.setPosition(gx, gy);
        // Sync physics body
        (this.body as Phaser.Physics.Arcade.Body).reset(gx, gy);
        this.isMoving = false;
      },
    });

    this.interactIndicator.setPosition(this.x, this.y - 28);
    this.checkInteract();
  }

  private showIdleFrame(): void {
    this.anims.stop();
    this.setFrame(IDLE_FRAME[this.direction]);
  }

  private checkInteract(): void {
    if (
      Phaser.Input.Keyboard.JustDown(this.interactKey) &&
      this.canInteract &&
      this.currentNPCTarget
    ) {
      this.scene.events.emit('player-interact', this.currentNPCTarget);
    }
  }

  setInteracting(value: boolean): void {
    this.isInteracting = value;
    if (value) {
      this.setVelocity(0, 0);
      this.isMoving = false;
      this.showIdleFrame();
    }
    if (!value && this.currentNPCTarget) {
      this.interactIndicator.setVisible(true);
    }
  }

  setNearNPC(npcId: string | null): void {
    this.currentNPCTarget = npcId;
    this.canInteract = npcId !== null;
    this.interactIndicator.setVisible(this.canInteract && !this.isInteracting);
  }

  getDirection(): PlayerDirection {
    return this.direction;
  }
}
