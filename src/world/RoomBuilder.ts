import Phaser from 'phaser';

export interface RoomDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  subtitle: string;
  floorColor: number;
  floorAltColor: number;
  wallTopColor: number;
  wallFaceColor: number;
  doors: DoorDef[];
}

export interface DoorDef {
  side: 'top' | 'bottom' | 'left' | 'right';
  gapStart: number;
  gapEnd: number;
}

export interface FurnitureDef {
  roomId: string;
  type: 'desk' | 'chair' | 'plant' | 'watercooler' | 'cabinet' | 'serverrack' | 'bookshelf';
  x: number;
  y: number;
}

export const ROOM_DEFS: RoomDef[] = [
  {
    id: 'hq', x: 0, y: 0, w: 512, h: 416,
    name: '🏢 IndiaScale HQ', subtitle: 'Headquarters',
    floorColor: 0xC8A870, floorAltColor: 0xB89860,
    wallTopColor: 0x8B6040, wallFaceColor: 0x6B4020,
    doors: [
      { side: 'right',  gapStart: 160, gapEnd: 256 },
      { side: 'bottom', gapStart: 208, gapEnd: 304 },
    ],
  },
  {
    id: 'server', x: 608, y: 0, w: 512, h: 416,
    name: '📡 Server District', subtitle: 'Data Storage (§8)',
    floorColor: 0x4466AA, floorAltColor: 0x335599,
    wallTopColor: 0x224488, wallFaceColor: 0x112266,
    doors: [
      { side: 'left',   gapStart: 160, gapEnd: 256 },
      { side: 'right',  gapStart: 160, gapEnd: 256 },
      { side: 'bottom', gapStart: 208, gapEnd: 304 },
    ],
  },
  {
    id: 'rbi', x: 1216, y: 0, w: 512, h: 416,
    name: '🏦 RBI Vault', subtitle: 'Retention Rules (§8.7)',
    floorColor: 0xAA8833, floorAltColor: 0x997722,
    wallTopColor: 0x886611, wallFaceColor: 0x664400,
    doors: [
      { side: 'left',   gapStart: 160, gapEnd: 256 },
      { side: 'bottom', gapStart: 208, gapEnd: 304 },
    ],
  },
  {
    id: 'legal', x: 0, y: 512, w: 512, h: 416,
    name: '⚖️  Legal Tower', subtitle: 'Grievance (§13-14)',
    floorColor: 0x9977CC, floorAltColor: 0x8866BB,
    wallTopColor: 0x6644AA, wallFaceColor: 0x443388,
    doors: [
      { side: 'top',    gapStart: 208, gapEnd: 304 },
      { side: 'right',  gapStart: 160, gapEnd: 256 },
      { side: 'bottom', gapStart: 208, gapEnd: 304 },
    ],
  },
  {
    id: 'marketing', x: 608, y: 512, w: 512, h: 416,
    name: '📣 Marketing Floor', subtitle: 'Consent (§6)',
    floorColor: 0x44BB77, floorAltColor: 0x33AA66,
    wallTopColor: 0x228855, wallFaceColor: 0x116644,
    doors: [
      { side: 'top',    gapStart: 208, gapEnd: 304 },
      { side: 'left',   gapStart: 160, gapEnd: 256 },
      { side: 'right',  gapStart: 160, gapEnd: 256 },
      { side: 'bottom', gapStart: 208, gapEnd: 304 },
    ],
  },
  {
    id: 'safeharbor', x: 1216, y: 512, w: 512, h: 416,
    name: '🧒 Safe Harbor', subtitle: "Children's Data (§9)",
    floorColor: 0x77CC55, floorAltColor: 0x66BB44,
    wallTopColor: 0x449933, wallFaceColor: 0x337722,
    doors: [
      { side: 'top',  gapStart: 208, gapEnd: 304 },
      { side: 'left', gapStart: 160, gapEnd: 256 },
    ],
  },
  {
    id: 'cloud', x: 0, y: 1024, w: 512, h: 416,
    name: '🌐 Cloud Frontier', subtitle: 'Cross-Border (Rule 12)',
    floorColor: 0x5555BB, floorAltColor: 0x4444AA,
    wallTopColor: 0x333388, wallFaceColor: 0x222266,
    doors: [
      { side: 'top',   gapStart: 208, gapEnd: 304 },
      { side: 'right', gapStart: 160, gapEnd: 256 },
    ],
  },
  {
    id: 'audit', x: 608, y: 1024, w: 512, h: 416,
    name: '🔍 Audit Plaza', subtitle: 'MeitY Tribunal',
    floorColor: 0x882222, floorAltColor: 0x771111,
    wallTopColor: 0x550000, wallFaceColor: 0x330000,
    doors: [
      { side: 'top',  gapStart: 208, gapEnd: 304 },
      { side: 'left', gapStart: 160, gapEnd: 256 },
    ],
  },
];

export const FURNITURE_DEFS: FurnitureDef[] = [
  // HQ office
  { roomId: 'hq', type: 'desk',        x: 60,  y: 60  },
  { roomId: 'hq', type: 'chair',       x: 60,  y: 96  },
  { roomId: 'hq', type: 'desk',        x: 180, y: 60  },
  { roomId: 'hq', type: 'chair',       x: 180, y: 96  },
  { roomId: 'hq', type: 'desk',        x: 300, y: 60  },
  { roomId: 'hq', type: 'plant',       x: 400, y: 40  },
  { roomId: 'hq', type: 'watercooler', x: 400, y: 200 },
  { roomId: 'hq', type: 'plant',       x: 40,  y: 280 },
  { roomId: 'hq', type: 'desk',        x: 200, y: 260 },
  { roomId: 'hq', type: 'chair',       x: 200, y: 296 },

  // Server District
  { roomId: 'server', type: 'serverrack', x: 40,  y: 40  },
  { roomId: 'server', type: 'serverrack', x: 100, y: 40  },
  { roomId: 'server', type: 'serverrack', x: 160, y: 40  },
  { roomId: 'server', type: 'serverrack', x: 220, y: 40  },
  { roomId: 'server', type: 'desk',       x: 300, y: 200 },
  { roomId: 'server', type: 'chair',      x: 300, y: 236 },
  { roomId: 'server', type: 'plant',      x: 400, y: 280 },

  // RBI Vault
  { roomId: 'rbi', type: 'cabinet',  x: 40,  y: 40  },
  { roomId: 'rbi', type: 'cabinet',  x: 80,  y: 40  },
  { roomId: 'rbi', type: 'cabinet',  x: 120, y: 40  },
  { roomId: 'rbi', type: 'desk',     x: 220, y: 180 },
  { roomId: 'rbi', type: 'chair',    x: 220, y: 216 },
  { roomId: 'rbi', type: 'plant',    x: 400, y: 280 },

  // Legal Tower
  { roomId: 'legal', type: 'bookshelf', x: 40,  y: 40  },
  { roomId: 'legal', type: 'bookshelf', x: 120, y: 40  },
  { roomId: 'legal', type: 'desk',      x: 220, y: 160 },
  { roomId: 'legal', type: 'chair',     x: 220, y: 196 },
  { roomId: 'legal', type: 'desk',      x: 60,  y: 220 },
  { roomId: 'legal', type: 'chair',     x: 60,  y: 256 },
  { roomId: 'legal', type: 'plant',     x: 390, y: 280 },

  // Marketing Floor
  { roomId: 'marketing', type: 'desk',  x: 60,  y: 60  },
  { roomId: 'marketing', type: 'chair', x: 60,  y: 96  },
  { roomId: 'marketing', type: 'desk',  x: 180, y: 60  },
  { roomId: 'marketing', type: 'chair', x: 180, y: 96  },
  { roomId: 'marketing', type: 'desk',  x: 300, y: 60  },
  { roomId: 'marketing', type: 'chair', x: 300, y: 96  },
  { roomId: 'marketing', type: 'plant', x: 390, y: 40  },
  { roomId: 'marketing', type: 'plant', x: 390, y: 280 },
  { roomId: 'marketing', type: 'watercooler', x: 40, y: 250 },

  // Safe Harbor
  { roomId: 'safeharbor', type: 'desk',  x: 100, y: 80  },
  { roomId: 'safeharbor', type: 'chair', x: 100, y: 116 },
  { roomId: 'safeharbor', type: 'plant', x: 40,  y: 40  },
  { roomId: 'safeharbor', type: 'plant', x: 390, y: 40  },
  { roomId: 'safeharbor', type: 'plant', x: 40,  y: 280 },

  // Cloud Frontier
  { roomId: 'cloud', type: 'serverrack', x: 40,  y: 40  },
  { roomId: 'cloud', type: 'serverrack', x: 100, y: 40  },
  { roomId: 'cloud', type: 'desk',       x: 260, y: 200 },
  { roomId: 'cloud', type: 'chair',      x: 260, y: 236 },
  { roomId: 'cloud', type: 'plant',      x: 390, y: 280 },

  // Audit Plaza
  { roomId: 'audit', type: 'desk',    x: 150, y: 80  },
  { roomId: 'audit', type: 'desk',    x: 250, y: 80  },
  { roomId: 'audit', type: 'chair',   x: 150, y: 116 },
  { roomId: 'audit', type: 'chair',   x: 250, y: 116 },
  { roomId: 'audit', type: 'cabinet', x: 40,  y: 40  },
  { roomId: 'audit', type: 'cabinet', x: 80,  y: 40  },
];

export const CORRIDORS = [
  // Horizontal corridors
  { x: 512,  y: 160,  w: 96, h: 96 },
  { x: 1120, y: 160,  w: 96, h: 96 },
  { x: 512,  y: 672,  w: 96, h: 96 },
  { x: 1120, y: 672,  w: 96, h: 96 },
  { x: 512,  y: 1184, w: 96, h: 96 },
  // Vertical corridors
  { x: 208,  y: 416,  w: 96, h: 96 },
  { x: 816,  y: 416,  w: 96, h: 96 },
  { x: 1424, y: 416,  w: 96, h: 96 },
  { x: 208,  y: 928,  w: 96, h: 96 },
  { x: 816,  y: 928,  w: 96, h: 96 },
];

export class RoomBuilder {
  private scene: Phaser.Scene;
  wallGroup!: Phaser.Physics.Arcade.StaticGroup;
  furnitureGroup!: Phaser.Physics.Arcade.StaticGroup;
  private graphics!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  build(): void {
    this.wallGroup      = this.scene.physics.add.staticGroup();
    this.furnitureGroup = this.scene.physics.add.staticGroup();
    this.graphics       = this.scene.add.graphics().setDepth(0);

    // ── Void background: deep space + subtle blueprint grid ─────────────────
    this.graphics.fillStyle(0x0c0c1a, 1);
    this.graphics.fillRect(0, 0, 1728, 1440);
    // Blueprint grid lines in the void — faint, adds depth
    this.graphics.lineStyle(1, 0x1a1a30, 0.6);
    for (let x = 0; x <= 1728; x += 64) {
      this.graphics.lineBetween(x, 0, x, 1440);
    }
    for (let y = 0; y <= 1440; y += 64) {
      this.graphics.lineBetween(0, y, 1728, y);
    }

    // Draw rooms
    for (const room of ROOM_DEFS) {
      this.drawFloor(room);
      this.drawWalls(room);
      this.addPhysicsWalls(room);
      this.drawRoomInnerShadow(room);
      this.addRoomLabel(room);
    }

    // Draw corridors (after rooms so they appear on top at seams)
    for (const corridor of CORRIDORS) {
      this.drawCorridor(corridor);
    }

    // Draw & physics for furniture
    for (const def of FURNITURE_DEFS) {
      const room = ROOM_DEFS.find(r => r.id === def.roomId);
      if (!room) continue;
      this.drawFurniture(def, room);
      this.addPhysicsFurniture(def, room);
    }

    // World + camera bounds
    this.scene.physics.world.setBounds(0, 0, 1728, 1440);
    this.scene.cameras.main.setBounds(0, 0, 1728, 1440);
  }

  private drawFloor(room: RoomDef): void {
    const g = this.graphics;
    const startX = room.x + 32;
    const startY = room.y + 32;
    const cols = Math.floor(448 / 32);
    const rows = Math.floor(352 / 32);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tx = startX + col * 32;
        const ty = startY + row * 32;
        const isAlt = (row + col) % 2 === 0;

        // Main tile
        g.fillStyle(isAlt ? room.floorColor : room.floorAltColor, 1);
        g.fillRect(tx, ty, 32, 32);

        // Subtle bottom-right bevel shadow — gives each tile a lifted 3D feel
        g.fillStyle(0x000000, 0.18);
        g.fillRect(tx,      ty + 30, 32,  2); // bottom strip
        g.fillRect(tx + 30, ty,       2, 32); // right strip
        // And a 1px top-left highlight for the opposite bevel edge
        g.fillStyle(0xffffff, 0.06);
        g.fillRect(tx, ty, 32, 1); // top edge highlight
        g.fillRect(tx, ty, 1, 32); // left edge highlight
      }
    }
  }

  /** Soft inner shadow around room perimeter — simulates ceiling light falloff. */
  private drawRoomInnerShadow(room: RoomDef): void {
    const g = this.scene.add.graphics().setDepth(4); // above floor, below furniture
    const fx = room.x + 32;
    const fy = room.y + 32;
    const fw = 448;
    const fh = 352;

    // Four gradient strips using layered semi-transparent rectangles
    const strips = [
      { alpha: 0.30, size: 4  },
      { alpha: 0.18, size: 8  },
      { alpha: 0.09, size: 14 },
      { alpha: 0.04, size: 20 },
    ];
    strips.forEach(({ alpha, size }) => {
      g.fillStyle(0x000000, alpha);
      g.fillRect(fx,            fy,            fw,   size); // top
      g.fillRect(fx,            fy + fh - size, fw,  size); // bottom
      g.fillRect(fx,            fy,            size,  fh);  // left
      g.fillRect(fx + fw - size, fy,           size,  fh);  // right
    });
  }

  private drawWallTile(tx: number, ty: number, room: RoomDef): void {
    const g = this.graphics;

    // Wall face (front, lower portion)
    g.fillStyle(room.wallFaceColor, 1);
    g.fillRect(tx, ty + 8, 32, 24);

    // Wall top (upper 8px — the "roof" of the wall)
    g.fillStyle(room.wallTopColor, 1);
    g.fillRect(tx, ty, 32, 8);

    // Bright 1px highlight at very top edge — catches the "light"
    g.fillStyle(0xffffff, 0.25);
    g.fillRect(tx, ty, 32, 1);

    // Slightly lighter 1px left edge on the top face
    g.fillStyle(0xffffff, 0.12);
    g.fillRect(tx, ty, 1, 8);

    // Dark 1px shadow at the top-face / front-face seam
    g.fillStyle(0x000000, 0.35);
    g.fillRect(tx, ty + 7, 32, 2);

    // Dark 1px drop shadow at the bottom of the front face — grounds it
    g.fillStyle(0x000000, 0.5);
    g.fillRect(tx, ty + 30, 32, 2);
  }

  private drawWalls(room: RoomDef): void {
    // Helper: check if a position is in a door gap for the given side
    const inGap = (side: DoorDef['side'], pos: number): boolean => {
      return room.doors.some(d => d.side === side && pos >= d.gapStart && pos < d.gapEnd);
    };

    // TOP wall: y = room.y, x from room.x to room.x+512
    for (let col = 0; col < 16; col++) {
      const tx = room.x + col * 32;
      const relX = col * 32; // relative x along room
      if (!inGap('top', relX)) {
        this.drawWallTile(tx, room.y, room);
      }
    }

    // BOTTOM wall: y = room.y + 384
    for (let col = 0; col < 16; col++) {
      const tx = room.x + col * 32;
      const relX = col * 32;
      if (!inGap('bottom', relX)) {
        this.drawWallTile(tx, room.y + 384, room);
      }
    }

    // LEFT wall: x = room.x, y from room.y+32 to room.y+384 (inner segment to avoid corners)
    for (let row = 1; row < 13; row++) {
      const ty = room.y + row * 32;
      const relY = row * 32;
      if (!inGap('left', relY)) {
        this.drawWallTile(room.x, ty, room);
      }
    }

    // RIGHT wall: x = room.x+480, y from room.y+32 to room.y+384
    for (let row = 1; row < 13; row++) {
      const ty = room.y + row * 32;
      const relY = row * 32;
      if (!inGap('right', relY)) {
        this.drawWallTile(room.x + 480, ty, room);
      }
    }
  }

  private addPhysicsWalls(room: RoomDef): void {
    const inGap = (side: DoorDef['side'], pos: number): boolean => {
      return room.doors.some(d => d.side === side && pos >= d.gapStart && pos < d.gapEnd);
    };

    // Build contiguous segments for each side
    const addWallBody = (x: number, y: number, w: number, h: number): void => {
      const body = this.wallGroup.create(x + w / 2, y + h / 2, undefined) as Phaser.Physics.Arcade.Sprite;
      body.setVisible(false);
      body.setImmovable(true);
      (body.body as Phaser.Physics.Arcade.StaticBody).setSize(w, h);
      body.refreshBody();
    };

    // TOP wall segments
    {
      let segStart = -1;
      for (let col = 0; col <= 16; col++) {
        const relX = col * 32;
        const inDoor = col < 16 && inGap('top', relX);
        if (!inDoor && segStart < 0) {
          segStart = col;
        } else if ((inDoor || col === 16) && segStart >= 0) {
          const sx = room.x + segStart * 32;
          const sw = (col - segStart) * 32;
          addWallBody(sx, room.y, sw, 32);
          segStart = -1;
        }
      }
    }

    // BOTTOM wall segments
    {
      let segStart = -1;
      for (let col = 0; col <= 16; col++) {
        const relX = col * 32;
        const inDoor = col < 16 && inGap('bottom', relX);
        if (!inDoor && segStart < 0) {
          segStart = col;
        } else if ((inDoor || col === 16) && segStart >= 0) {
          const sx = room.x + segStart * 32;
          const sw = (col - segStart) * 32;
          addWallBody(sx, room.y + 384, sw, 32);
          segStart = -1;
        }
      }
    }

    // LEFT wall segments (rows 1..12 inner, plus corners covered by top/bottom)
    {
      let segStart = -1;
      for (let row = 1; row <= 13; row++) {
        const relY = row * 32;
        const inDoor = row < 13 && inGap('left', relY);
        if (!inDoor && segStart < 0) {
          segStart = row;
        } else if ((inDoor || row === 13) && segStart >= 0) {
          const sy = room.y + segStart * 32;
          const sh = (row - segStart) * 32;
          addWallBody(room.x, sy, 32, sh);
          segStart = -1;
        }
      }
    }

    // RIGHT wall segments
    {
      let segStart = -1;
      for (let row = 1; row <= 13; row++) {
        const relY = row * 32;
        const inDoor = row < 13 && inGap('right', relY);
        if (!inDoor && segStart < 0) {
          segStart = row;
        } else if ((inDoor || row === 13) && segStart >= 0) {
          const sy = room.y + segStart * 32;
          const sh = (row - segStart) * 32;
          addWallBody(room.x + 480, sy, 32, sh);
          segStart = -1;
        }
      }
    }
  }

  private drawCorridor(corridor: { x: number; y: number; w: number; h: number }): void {
    const g = this.graphics;
    const { x, y, w, h } = corridor;
    const isHoriz = w >= h;

    // Base floor — slightly warmer grey than the void
    g.fillStyle(0x52525f, 1);
    g.fillRect(x, y, w, h);

    // Tile-like floor — subtle alternating shading
    const cols = Math.ceil(w / 32);
    const rows = Math.ceil(h / 32);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tx = x + col * 32;
        const ty = y + row * 32;
        g.fillStyle((row + col) % 2 === 0 ? 0x5a5a68 : 0x504f5c, 1);
        g.fillRect(tx, ty, Math.min(32, x + w - tx), Math.min(32, y + h - ty));
      }
    }

    // Edge darkening — makes it feel like a narrow hallway
    g.fillStyle(0x000000, 0.35);
    if (isHoriz) {
      g.fillRect(x, y,         w, 6); // top edge
      g.fillRect(x, y + h - 6, w, 6); // bottom edge
    } else {
      g.fillRect(x,         y, 6, h); // left edge
      g.fillRect(x + w - 6, y, 6, h); // right edge
    }

    // Centre guide stripe — faint directional cue
    g.fillStyle(0xffffff, 0.07);
    if (isHoriz) {
      g.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
    } else {
      g.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
    }
  }

  private drawFurniture(def: FurnitureDef, room: RoomDef): void {
    const g = this.scene.add.graphics().setDepth(3);
    const wx = room.x + 32 + def.x;
    const wy = room.y + 32 + def.y;

    // Drop shadow drawn first (below the object)
    const shadowMap: Record<FurnitureDef['type'], { w: number; h: number }> = {
      desk:        { w: 64, h: 28 },
      chair:       { w: 28, h: 28 },
      plant:       { w: 32, h: 32 },
      watercooler: { w: 26, h: 48 },
      cabinet:     { w: 32, h: 48 },
      serverrack:  { w: 48, h: 96 },
      bookshelf:   { w: 64, h: 48 },
    };
    const sh = shadowMap[def.type];
    g.fillStyle(0x000000, 0.30);
    g.fillRect(wx + 3, wy + 3, sh.w, sh.h);

    switch (def.type) {
      case 'desk': {
        // Brown top
        g.fillStyle(0xA0522D, 1);
        g.fillRect(wx, wy, 64, 8);
        // Brown body
        g.fillStyle(0x8B4513, 1);
        g.fillRect(wx, wy + 8, 64, 20);
        // Monitor
        g.fillStyle(0x000033, 1);
        g.fillRect(wx + 22, wy - 16, 20, 16);
        // Monitor glow
        g.fillStyle(0x00FFCC, 1);
        g.fillRect(wx + 24, wy - 14, 16, 12);
        // Legs
        g.fillStyle(0x6B3410, 1);
        g.fillRect(wx + 2, wy + 28, 4, 8);
        g.fillRect(wx + 58, wy + 28, 4, 8);
        break;
      }
      case 'chair': {
        // Seat
        g.fillStyle(0x888888, 1);
        g.fillCircle(wx + 16, wy + 16, 12);
        // Back
        g.fillStyle(0x666666, 1);
        g.fillRect(wx + 6, wy, 20, 8);
        break;
      }
      case 'plant': {
        // Pot
        g.fillStyle(0xA0522D, 1);
        g.fillRect(wx + 8, wy + 20, 16, 12);
        // Soil
        g.fillStyle(0x5C3317, 1);
        g.fillRect(wx + 10, wy + 18, 12, 4);
        // Leaves
        g.fillStyle(0x228B22, 1);
        g.fillCircle(wx + 16, wy + 10, 14);
        // Highlight
        g.fillStyle(0x32CD32, 1);
        g.fillCircle(wx + 12, wy + 6, 6);
        break;
      }
      case 'watercooler': {
        // Body
        g.fillStyle(0x87CEEB, 1);
        g.fillRect(wx, wy, 24, 36);
        // Base
        g.fillStyle(0x4682B4, 1);
        g.fillRect(wx - 2, wy + 36, 28, 12);
        // Tank
        g.fillStyle(0xB0E0FF, 1);
        g.fillRect(wx + 3, wy - 16, 18, 16);
        // Highlight stripe
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(wx + 4, wy + 4, 4, 20);
        break;
      }
      case 'cabinet': {
        // Body
        g.fillStyle(0x999999, 1);
        g.fillRect(wx, wy, 32, 48);
        // Drawer lines
        g.lineStyle(1, 0x666666, 1);
        g.lineBetween(wx, wy + 16, wx + 32, wy + 16);
        g.lineBetween(wx, wy + 32, wx + 32, wy + 32);
        // Handles
        g.fillStyle(0x444444, 1);
        g.fillRect(wx + 13, wy + 6, 6, 4);
        g.fillRect(wx + 13, wy + 22, 6, 4);
        g.fillRect(wx + 13, wy + 38, 6, 4);
        break;
      }
      case 'serverrack': {
        // Body
        g.fillStyle(0x222233, 1);
        g.fillRect(wx, wy, 48, 96);
        // Rack units (6 rows)
        for (let i = 0; i < 6; i++) {
          g.fillStyle(0x333355, 1);
          g.fillRect(wx + 2, wy + 4 + i * 14, 44, 12);
        }
        // Blinking lights
        const lightColors = [0xFF0000, 0x00FF00, 0xFF0000, 0x00FF00, 0xFF0000];
        lightColors.forEach((c, i) => {
          g.fillStyle(c, 1);
          g.fillRect(wx + 40, wy + 6 + i * 14, 4, 4);
        });
        break;
      }
      case 'bookshelf': {
        // Shelf body
        g.fillStyle(0x8B4513, 1);
        g.fillRect(wx, wy, 64, 48);
        // Shelf lines
        g.lineStyle(1, 0x6B3410, 1);
        g.lineBetween(wx, wy + 16, wx + 64, wy + 16);
        g.lineBetween(wx, wy + 32, wx + 64, wy + 32);
        // Books (alternating colors)
        const bookColors = [0xFF4444, 0x4444FF, 0x44AA44, 0xFFCC00, 0xAA44AA];
        for (let shelf = 0; shelf < 3; shelf++) {
          for (let b = 0; b < 6; b++) {
            g.fillStyle(bookColors[(shelf * 6 + b) % bookColors.length], 1);
            g.fillRect(wx + 2 + b * 10, wy + shelf * 16 + 2, 8, 12);
          }
        }
        break;
      }
    }
  }

  private addPhysicsFurniture(def: FurnitureDef, room: RoomDef): void {
    const wx = room.x + 32 + def.x;
    const wy = room.y + 32 + def.y;

    const sizeMap: Record<FurnitureDef['type'], { w: number; h: number }> = {
      desk:        { w: 64, h: 28 },
      chair:       { w: 28, h: 28 },
      plant:       { w: 24, h: 24 },
      watercooler: { w: 22, h: 44 },
      cabinet:     { w: 30, h: 46 },
      serverrack:  { w: 46, h: 94 },
      bookshelf:   { w: 62, h: 46 },
    };

    const sz = sizeMap[def.type];
    const body = this.furnitureGroup.create(wx + sz.w / 2, wy + sz.h / 2, undefined) as Phaser.Physics.Arcade.Sprite;
    body.setVisible(false);
    body.setImmovable(true);
    (body.body as Phaser.Physics.Arcade.StaticBody).setSize(sz.w, sz.h);
    body.refreshBody();
  }

  /**
   * Returns all rectangles where the player is allowed to walk:
   * room inner floors + door gap tiles + corridors.
   * Used by the grid movement collision callback.
   */
  getWalkableRects(): { x: number; y: number; w: number; h: number }[] {
    const rects: { x: number; y: number; w: number; h: number }[] = [];

    for (const room of ROOM_DEFS) {
      // Inner floor (inside the 32px walls)
      rects.push({ x: room.x + 32, y: room.y + 32, w: 448, h: 352 });

      // Door gap tiles (the missing 32px wall segment at each door)
      for (const door of room.doors) {
        const len = door.gapEnd - door.gapStart;
        switch (door.side) {
          case 'top':
            rects.push({ x: room.x + door.gapStart, y: room.y,        w: len, h: 32 });
            break;
          case 'bottom':
            rects.push({ x: room.x + door.gapStart, y: room.y + 384,  w: len, h: 32 });
            break;
          case 'left':
            rects.push({ x: room.x,       y: room.y + door.gapStart, w: 32, h: len });
            break;
          case 'right':
            rects.push({ x: room.x + 480, y: room.y + door.gapStart, w: 32, h: len });
            break;
        }
      }
    }

    // Corridors
    for (const c of CORRIDORS) {
      rects.push({ x: c.x, y: c.y, w: c.w, h: c.h });
    }

    return rects;
  }

  private addRoomLabel(room: RoomDef): void {
    const lx = room.x + 32 + 10;
    const ly = room.y + 32 + 10;

    // Translucent chip behind the label for readability over any floor colour
    const chip = this.scene.add.graphics().setDepth(5);
    chip.fillStyle(0x000000, 0.45);
    chip.fillRoundedRect(lx - 4, ly - 2, 200, 38, 4);

    this.scene.add.text(lx, ly, room.name, {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setDepth(6);

    this.scene.add.text(lx, ly + 18, room.subtitle, {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '11px',
      color: '#aaccdd',
    }).setDepth(6);
  }
}
