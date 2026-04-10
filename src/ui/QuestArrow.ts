import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { QuestSystem } from '../systems/QuestSystem';

// Maps NPC IDs to their world positions
const NPC_WORLD_POSITIONS: Record<string, { x: number; y: number }> = {
  auditor: { x: 200, y: 180 },
  dev:     { x: 808, y: 200 },
  ceo:     { x: 350, y: 300 },
  lawyer:  { x: 200, y: 720 },
  meity:   { x: 808, y: 1200 },
};

// Maps quest objectives to NPC targets
const OBJECTIVE_NPC_MAP: Record<string, string> = {
  'talk_rakesh': 'auditor',
  'talk_priya':  'dev',
  'talk_anjali': 'lawyer',
};

export class QuestArrow {
  private scene: Phaser.Scene;
  private arrowGraphics: Phaser.GameObjects.Graphics;
  private arrowLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.arrowGraphics = scene.add.graphics()
      .setScrollFactor(0).setDepth(80);
    this.arrowLabel = scene.add.text(0, 0, '', {
      fontFamily: 'Courier New', fontSize: '10px', color: '#FFDD44',
      backgroundColor: '#00000099', padding: { x: 4, y: 2 },
    }).setScrollFactor(0).setDepth(81).setVisible(false);
  }

  update(playerWorldX: number, playerWorldY: number): void {
    const target = this.findTarget();
    if (!target) {
      this.arrowGraphics.clear();
      this.arrowLabel.setVisible(false);
      return;
    }

    const { npcId, objectiveDesc } = target;
    const npcPos = NPC_WORLD_POSITIONS[npcId];
    if (!npcPos) return;

    const dx = npcPos.x - playerWorldX;
    const dy = npcPos.y - playerWorldY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      this.arrowGraphics.clear();
      this.arrowLabel.setVisible(false);
      return;
    }

    const angle = Math.atan2(dy, dx);
    const margin = 60;
    const halfW = GAME_WIDTH / 2 - margin;
    const halfH = GAME_HEIGHT / 2 - margin;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    let screenX: number;
    let screenY: number;

    if (Math.abs(cos) * halfH > Math.abs(sin) * halfW) {
      screenX = cos > 0 ? GAME_WIDTH - margin : margin;
      screenY = GAME_HEIGHT / 2 + (screenX - GAME_WIDTH / 2) * sin / cos;
    } else {
      screenY = sin > 0 ? GAME_HEIGHT - margin : margin;
      screenX = GAME_WIDTH / 2 + (screenY - GAME_HEIGHT / 2) * cos / sin;
    }

    const time = this.scene.time.now;
    const pulse = 0.7 + 0.3 * Math.sin(time * 0.005);

    this.arrowGraphics.clear();
    this.arrowGraphics.fillStyle(0xFFDD44, pulse);
    this.drawArrow(this.arrowGraphics, screenX, screenY, angle, 18);

    const distText = dist > 1000 ? `${Math.round(dist / 100) * 100}m` : `${Math.round(dist)}m`;
    this.arrowLabel.setText(`→ ${objectiveDesc}\n  ${distText} away`);
    this.arrowLabel.setPosition(
      Phaser.Math.Clamp(screenX - 60, 10, GAME_WIDTH - 140),
      Phaser.Math.Clamp(screenY + 22, 60, GAME_HEIGHT - 40),
    );
    this.arrowLabel.setVisible(true);
  }

  private drawArrow(g: Phaser.GameObjects.Graphics, x: number, y: number, angle: number, size: number): void {
    const tip   = { x: x + Math.cos(angle) * size,          y: y + Math.sin(angle) * size };
    const left  = { x: x + Math.cos(angle + 2.5) * size * 0.6, y: y + Math.sin(angle + 2.5) * size * 0.6 };
    const right = { x: x + Math.cos(angle - 2.5) * size * 0.6, y: y + Math.sin(angle - 2.5) * size * 0.6 };
    g.fillTriangle(tip.x, tip.y, left.x, left.y, right.x, right.y);
    g.fillStyle(0xFFDD44, 0.5);
    g.fillCircle(x, y, 8);
  }

  private findTarget(): { npcId: string; questTitle: string; objectiveDesc: string } | null {
    const active = QuestSystem.getActiveQuests();
    for (const quest of active) {
      for (const obj of quest.objectives) {
        if (!obj.completed && OBJECTIVE_NPC_MAP[obj.id]) {
          return {
            npcId: OBJECTIVE_NPC_MAP[obj.id],
            questTitle: quest.title,
            objectiveDesc: obj.description,
          };
        }
      }
    }
    return null;
  }
}
