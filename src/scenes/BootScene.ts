import Phaser from 'phaser';
import { SCENES } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    this.load.setPath('assets/');
  }

  create(): void {
    this.generatePlaceholderTextures();
    this.scene.start(SCENES.PRELOADER);
  }

  private generatePlaceholderTextures(): void {
    // ── PLAYER (32×48, 16 frames — Pokemon trainer style) ──────────────────
    if (!this.textures.exists('player')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const W = 32, H = 48;

      // Shirt colors per direction
      const shirtColors = [0x3366FF, 0x2255EE, 0x4477FF, 0x2244CC]; // down, left, right, up
      const skinTone = 0xFFCC88;

      for (let frame = 0; frame < 16; frame++) {
        const ox = frame * W;
        const dir = Math.floor(frame / 4); // 0=down,1=left,2=right,3=up
        const step = frame % 4;
        // Walk animation: clear leg separation
        const leftLeg  = [0, 6, 0, -6][step];
        const rightLeg = [0, -6, 0, 6][step] * -1;
        const shirtColor = shirtColors[dir];

        // ── Legs / Pants (black with slight blue) ──
        const pantColor = 0x222244;
        g.fillStyle(pantColor, 1);
        // Left leg
        g.fillRect(ox + 10, 33, 6, 11 + Math.max(0, leftLeg));
        // Right leg
        g.fillRect(ox + 16, 33, 6, 11 + Math.max(0, rightLeg));

        // ── Shoes (white/cream) ──
        const shoeColor = 0xEEEEFF;
        g.fillStyle(shoeColor, 1);
        g.fillRect(ox + 9,  33 + 11 + Math.max(0, leftLeg),  8, 3);
        g.fillRect(ox + 15, 33 + 11 + Math.max(0, rightLeg), 8, 3);

        // ── Body / Shirt ──
        g.fillStyle(shirtColor, 1);
        g.fillRect(ox + 7, 20, 18, 14);

        // Collar / neck
        g.fillStyle(skinTone, 1);
        g.fillRect(ox + 13, 20, 6, 3);

        // ── Arms ──
        g.fillStyle(shirtColor, 1);
        if (dir === 0 || dir === 3) {
          g.fillRect(ox + 3,  21, 5, 10);
          g.fillRect(ox + 24, 21, 5, 10);
          g.fillStyle(skinTone, 1);
          g.fillRect(ox + 3,  30, 5, 4);
          g.fillRect(ox + 24, 30, 5, 4);
        } else if (dir === 1) {
          g.fillRect(ox + 23, 21, 5, 10);
          g.fillStyle(skinTone, 1);
          g.fillRect(ox + 23, 30, 5, 4);
        } else {
          g.fillRect(ox + 4, 21, 5, 10);
          g.fillStyle(skinTone, 1);
          g.fillRect(ox + 4, 30, 5, 4);
        }

        // ── Head (bigger, 18×16) ──
        g.fillStyle(skinTone, 1);
        g.fillRect(ox + 7,  4, 18, 16);   // main head
        g.fillRect(ox + 5,  6, 22, 12);   // wider mid
        g.fillRect(ox + 6,  5, 20, 14);   // rounded corners

        // ── Cap (bright red Pokemon trainer style) ──
        // Dark band
        g.fillStyle(0x880000, 1);
        g.fillRect(ox + 5, 4, 22, 4);
        // Red cap top
        g.fillStyle(0xDD1111, 1);
        g.fillRect(ox + 6, 1, 20, 5);
        g.fillRect(ox + 4, 5, 24, 3);
        // Cap brim
        if (dir !== 3) {
          g.fillStyle(0xCC0000, 1);
          g.fillRect(ox + 5, 7, 22, 2);
        }
        // Cap button on top
        g.fillStyle(0xCC0000, 1);
        g.fillRect(ox + 14, 0, 4, 2);

        // ── Face features ──
        if (dir === 0) { // facing down
          // White eye whites
          g.fillStyle(0xffffff, 1);
          g.fillRect(ox + 10, 13, 4, 4);
          g.fillRect(ox + 18, 13, 4, 4);
          // Black pupils
          g.fillStyle(0x000000, 1);
          g.fillRect(ox + 11, 14, 2, 2);
          g.fillRect(ox + 19, 14, 2, 2);
        } else if (dir === 1) { // facing left
          g.fillStyle(0xffffff, 1);
          g.fillRect(ox + 9, 13, 4, 4);
          g.fillStyle(0x000000, 1);
          g.fillRect(ox + 9, 14, 2, 2);
        } else if (dir === 2) { // facing right
          g.fillStyle(0xffffff, 1);
          g.fillRect(ox + 19, 13, 4, 4);
          g.fillStyle(0x000000, 1);
          g.fillRect(ox + 21, 14, 2, 2);
        }
        // dir===3 (up/back): no face visible

        // ── Sentinel badge (glowing teal circle on chest) ──
        g.fillStyle(0x00ffcc, 1);
        g.fillCircle(ox + 21, 24, 4);
        g.fillStyle(0x003322, 1);
        g.fillCircle(ox + 21, 24, 2);
        g.fillStyle(0x00ffcc, 0.6);
        g.fillCircle(ox + 21, 24, 1);
      }

      g.generateTexture('player', W * 16, H);
      g.destroy();

      const playerTex = this.textures.get('player');
      for (let i = 0; i < 16; i++) {
        playerTex.add(i, 0, i * W, 0, W, H);
      }
    }

    // ── NPC GENERATOR ────────────────────────────────────────────────────────
    const makeNPC = (
      key: string,
      opts: {
        bodyColor: number;
        accentColor: number;
        hairColor?: number;
        skinTone?: number;
        hasGlasses?: boolean;
        hasSuit?: boolean;
        suitColor?: number;
        hasTie?: boolean;
        tieColor?: number;
        hasHeadband?: boolean;
        headbandColor?: number;
        hasPearls?: boolean;
        hasKurta?: boolean;
        kurta?: { baseColor: number; trimColor: number };
      }
    ) => {
      if (this.textures.exists(key)) return;
      const g = this.make.graphics({ x: 0, y: 0 });
      const W = 32, H = 48;
      const hairColor = opts.hairColor ?? 0x221100;
      const skin = opts.skinTone ?? 0xFFCC88;

      for (let frame = 0; frame < 2; frame++) {
        const ox = frame * W;
        const bobY = frame === 1 ? 1 : 0;

        // ── Legs ──
        g.fillStyle(0x111122, 1);
        g.fillRect(ox + 10, 34 + bobY, 5, 12);
        g.fillRect(ox + 17, 34 + bobY, 5, 12);
        g.fillStyle(0x221100, 1);
        g.fillRect(ox + 9,  34 + bobY + 12, 7, 3);
        g.fillRect(ox + 16, 34 + bobY + 12, 7, 3);

        // ── Body ──
        if (opts.hasKurta && opts.kurta) {
          // Government kurta
          g.fillStyle(opts.kurta.baseColor, 1);
          g.fillRect(ox + 7, 20 + bobY, 18, 14);
          // Saffron trim on edges
          g.fillStyle(opts.kurta.trimColor, 1);
          g.fillRect(ox + 7,  20 + bobY, 3, 14);
          g.fillRect(ox + 22, 20 + bobY, 3, 14);
          g.fillRect(ox + 7,  20 + bobY, 18, 2);
        } else if (opts.hasSuit) {
          const sc = opts.suitColor ?? 0x1a1a2a;
          // Suit jacket
          g.fillStyle(sc, 1);
          g.fillRect(ox + 7, 20 + bobY, 18, 14);
          // White shirt center
          g.fillStyle(0xffffff, 1);
          g.fillRect(ox + 13, 20 + bobY, 6, 13);
          // Lapels
          g.fillStyle(sc, 1);
          g.fillRect(ox + 7,  20 + bobY, 7, 10);
          g.fillRect(ox + 18, 20 + bobY, 7, 10);
          // Tie
          if (opts.hasTie !== false) {
            const tc = opts.tieColor ?? opts.accentColor;
            g.fillStyle(tc, 1);
            g.fillRect(ox + 14, 21 + bobY, 4, 11);
          }
        } else {
          g.fillStyle(opts.bodyColor, 1);
          g.fillRect(ox + 7, 20 + bobY, 18, 14);
          // Accent stripe
          g.fillStyle(opts.accentColor, 1);
          g.fillRect(ox + 7, 22 + bobY, 18, 3);
        }

        // ── Arms ──
        g.fillStyle(opts.bodyColor, 1);
        g.fillRect(ox + 3,  21 + bobY, 5, 10);
        g.fillRect(ox + 24, 21 + bobY, 5, 10);
        g.fillStyle(skin, 1);
        g.fillRect(ox + 3,  30 + bobY, 5, 4);
        g.fillRect(ox + 24, 30 + bobY, 5, 4);

        // ── Head ──
        g.fillStyle(skin, 1);
        g.fillRect(ox + 9,  5 + bobY, 14, 15);
        g.fillRect(ox + 7,  7 + bobY, 18, 11);
        g.fillRect(ox + 8,  5 + bobY, 16, 14);

        // ── Hair ──
        g.fillStyle(hairColor, 1);
        g.fillRect(ox + 7,  4 + bobY, 18, 4);
        g.fillRect(ox + 7,  5 + bobY, 3, 7);
        g.fillRect(ox + 22, 5 + bobY, 3, 7);

        // ── Headband (Dev Priya) ──
        if (opts.hasHeadband && opts.headbandColor) {
          g.fillStyle(opts.headbandColor, 1);
          g.fillRect(ox + 7, 8 + bobY, 18, 3);
        }

        // ── Eyes ──
        g.fillStyle(0xffffff, 1);
        g.fillRect(ox + 10, 12 + bobY, 4, 4);
        g.fillRect(ox + 18, 12 + bobY, 4, 4);
        g.fillStyle(0x000000, 1);
        g.fillRect(ox + 11, 13 + bobY, 2, 2);
        g.fillRect(ox + 19, 13 + bobY, 2, 2);

        // ── Mouth ──
        g.fillStyle(0xcc6644, 1);
        g.fillRect(ox + 13, 17 + bobY, 6, 2);

        // ── Glasses (thick black frames) ──
        if (opts.hasGlasses) {
          // Thick black frames
          g.fillStyle(0x111111, 1);
          g.fillRect(ox + 9,  11 + bobY, 6, 5);
          g.fillRect(ox + 17, 11 + bobY, 6, 5);
          // Lens tint (slightly lighter center)
          g.fillStyle(0x223344, 0.5);
          g.fillRect(ox + 10, 12 + bobY, 4, 3);
          g.fillRect(ox + 18, 12 + bobY, 4, 3);
          // Bridge
          g.fillStyle(0x111111, 1);
          g.fillRect(ox + 15, 13 + bobY, 2, 1);
          // Eyes re-drawn on top for visibility
          g.fillStyle(0xffffff, 1);
          g.fillRect(ox + 10, 12 + bobY, 4, 3);
          g.fillRect(ox + 18, 12 + bobY, 4, 3);
          g.fillStyle(0x000000, 1);
          g.fillRect(ox + 11, 13 + bobY, 2, 2);
          g.fillRect(ox + 19, 13 + bobY, 2, 2);
        }

        // ── Pearl necklace (Anjali) ──
        if (opts.hasPearls) {
          g.fillStyle(0xffffff, 1);
          for (let p = 0; p < 5; p++) {
            g.fillCircle(ox + 11 + p * 2, 21 + bobY, 1);
          }
        }

        // ── White hair for Auditor Rakesh ──
        if (hairColor === 0xCCCCCC) {
          // Re-draw hair as white/grey
          g.fillStyle(0xCCCCCC, 1);
          g.fillRect(ox + 7,  4 + bobY, 18, 4);
          g.fillRect(ox + 7,  5 + bobY, 3, 7);
          g.fillRect(ox + 22, 5 + bobY, 3, 7);
        }
      }

      g.generateTexture(key, W * 2, H);
      g.destroy();

      const npcTex = this.textures.get(key);
      npcTex.add(0, 0, 0,   0, W, H);
      npcTex.add(1, 0, W,   0, W, H);
    };

    // npc_auditor (Rakesh): Grey suit, RED tie, thick black-frame glasses, white hair
    makeNPC('npc_auditor', {
      bodyColor: 0x555566,
      accentColor: 0xff2222,
      hairColor: 0xCCCCCC,
      skinTone: 0xFFCC88,
      hasGlasses: true,
      hasSuit: true,
      suitColor: 0x445566,
      hasTie: true,
      tieColor: 0xff2222,
    });

    // npc_dev (Priya): Dark hoodie, bright green headband, dark hair
    makeNPC('npc_dev', {
      bodyColor: 0x223355,
      accentColor: 0x44FF88,
      hairColor: 0x111111,
      skinTone: 0xFFCC88,
      hasHeadband: true,
      headbandColor: 0x44FF88,
    });

    // npc_ceo (Vikram): GOLD suit, white shirt, gold tie, slicked dark hair
    makeNPC('npc_ceo', {
      bodyColor: 0xDDAA00,
      accentColor: 0xFFDD44,
      hairColor: 0x222222,
      skinTone: 0xFFCC88,
      hasSuit: true,
      suitColor: 0xDDAA00,
      hasTie: true,
      tieColor: 0xFFDD00,
    });

    // npc_lawyer (Anjali): Purple blazer, pearl necklace, dark hair
    makeNPC('npc_lawyer', {
      bodyColor: 0x6633CC,
      accentColor: 0xAA66FF,
      hairColor: 0x110033,
      skinTone: 0xFFCC88,
      hasPearls: true,
    });

    // npc_meity (Officer Gupta): Government white kurta with saffron trim, salt-and-pepper hair
    makeNPC('npc_meity', {
      bodyColor: 0xEEEEFF,
      accentColor: 0xFF8800,
      hairColor: 0x998888,
      skinTone: 0xFFCC88,
      hasKurta: true,
      kurta: { baseColor: 0xEEEEFF, trimColor: 0xFF8800 },
    });

    makeNPC('npc_intern', {
      bodyColor: 0x1a2a2a,
      accentColor: 0x88ccff,
      hairColor: 0x442211,
    });

    // ── TILESET (9 tiles × 32×32 — Pokemon-style vibrant colors) ────────────
    if (!this.textures.exists('tiles')) {
      const g = this.make.graphics({ x: 0, y: 0 });

      const tileSpecs = [
        // Tile 0 — HQ carpet: warm beige with diagonal hash marks
        (i: number) => {
          g.fillStyle(0xD4A070, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0xC49060, 0.8);
          for (let d = -32; d < 64; d += 8) {
            g.lineBetween(i * 32 + d, 0, i * 32 + d + 32, 32);
          }
        },
        // Tile 1 — Server floor: dark blue with grid lines and tiny grey dots
        (i: number) => {
          g.fillStyle(0x1A1A4A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0x2A2A6A, 0.7);
          for (let x = 0; x < 32; x += 8) g.lineBetween(i * 32 + x, 0, i * 32 + x, 32);
          for (let y = 0; y < 32; y += 8) g.lineBetween(i * 32, y, i * 32 + 32, y);
          g.fillStyle(0x888899, 0.5);
          g.fillRect(i * 32 + 4, 4, 2, 2);
          g.fillRect(i * 32 + 20, 20, 2, 2);
        },
        // Tile 2 — Legal floor: warm brown with gold border inlay
        (i: number) => {
          g.fillStyle(0x5A3A1A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(2, 0xAA8833, 0.8);
          g.strokeRect(i * 32 + 3, 3, 26, 26);
          g.lineStyle(1, 0xAA8833, 0.4);
          g.strokeRect(i * 32 + 6, 6, 20, 20);
        },
        // Tile 3 — Marketing floor: bright teal with wave pattern
        (i: number) => {
          g.fillStyle(0x1A4A4A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0x2A6A6A, 0.7);
          for (let y = 4; y < 32; y += 8) {
            g.beginPath();
            for (let x = 0; x < 32; x += 4) {
              const wy = y + Math.sin(x * 0.5) * 2;
              if (x === 0) g.moveTo(i * 32 + x, wy);
              else g.lineTo(i * 32 + x, wy);
            }
            g.strokePath();
          }
        },
        // Tile 4 — Safe Harbor: soft green with dot pattern
        (i: number) => {
          g.fillStyle(0x2A4A2A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.fillStyle(0x3A6A3A, 0.7);
          for (let dx = 4; dx < 32; dx += 8) {
            for (let dy = 4; dy < 32; dy += 8) {
              g.fillCircle(i * 32 + dx, dy, 2);
            }
          }
        },
        // Tile 5 — RBI Vault: dark gold with bright gold brick lines
        (i: number) => {
          g.fillStyle(0x3A2A00, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0xDDAA00, 0.8);
          for (let y = 0; y < 32; y += 8) {
            g.lineBetween(i * 32, y, i * 32 + 32, y);
            const off = (Math.floor(y / 8) % 2 === 0) ? 0 : 16;
            g.lineBetween(i * 32 + off, y, i * 32 + off, y + 8);
          }
        },
        // Tile 6 — Cloud Frontier: deep purple with cloud-like blobs
        (i: number) => {
          g.fillStyle(0x1A0A3A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.fillStyle(0x3A2A6A, 0.6);
          g.fillCircle(i * 32 + 8, 10, 6);
          g.fillCircle(i * 32 + 14, 8, 7);
          g.fillCircle(i * 32 + 20, 10, 5);
          g.fillCircle(i * 32 + 22, 22, 5);
          g.fillCircle(i * 32 + 16, 24, 6);
          g.fillCircle(i * 32 + 10, 22, 4);
        },
        // Tile 7 — Audit Plaza: almost black with dark red lines (ominous)
        (i: number) => {
          g.fillStyle(0x0A0A0A, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0x3A0A0A, 0.9);
          for (let y = 0; y < 32; y += 6) g.lineBetween(i * 32, y, i * 32 + 32, y);
          for (let x = 0; x < 32; x += 6) g.lineBetween(i * 32 + x, 0, i * 32 + x, 32);
        },
        // Tile 8 — Wall: grey with darker brick pattern
        (i: number) => {
          g.fillStyle(0x444444, 1); g.fillRect(i * 32, 0, 32, 32);
          g.lineStyle(1, 0x333333, 1);
          for (let y = 0; y < 32; y += 8) {
            g.lineBetween(i * 32, y, i * 32 + 32, y);
            const off = (Math.floor(y / 8) % 2 === 0) ? 0 : 16;
            g.lineBetween(i * 32 + off, y, i * 32 + off, y + 8);
          }
        },
      ];

      tileSpecs.forEach((draw, i) => draw(i));

      g.generateTexture('tiles', 32 * tileSpecs.length, 32);
      g.destroy();

      const tilesTex = this.textures.get('tiles');
      for (let i = 0; i < tileSpecs.length; i++) {
        tilesTex.add(i, 0, i * 32, 0, 32, 32);
      }
    }

    // ── Sentinel device icon ─────────────────────────────────────────────────
    if (!this.textures.exists('sentinel_icon')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x001122, 1); g.fillRoundedRect(0, 0, 24, 24, 4);
      g.lineStyle(2, 0x00ffcc, 1); g.strokeRoundedRect(0, 0, 24, 24, 4);
      g.fillStyle(0x00ffcc, 1); g.fillCircle(12, 10, 5);
      g.lineStyle(2, 0x00ffcc, 0.6); g.strokeCircle(12, 10, 8);
      g.generateTexture('sentinel_icon', 24, 24);
      g.destroy();
    }
  }
}
