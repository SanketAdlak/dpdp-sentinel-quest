import Phaser from 'phaser';
import { SCENES, GAME_WIDTH } from '../constants';
import { QuestSystem, Quest } from '../systems/QuestSystem';

export class UIScene extends Phaser.Scene {
  private questPanel!: Phaser.GameObjects.Container;
  private questContent: Phaser.GameObjects.GameObject[] = [];
  private progressText!: Phaser.GameObjects.Text;
  private panelVisible = true;
  private toggleKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: SCENES.UI });
  }

  create(): void {
    this.buildQuestTracker();
    this.bindEvents();
    this.refreshQuests();

    // Q key toggles quest panel
    this.toggleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.toggleKey.on('down', () => this.togglePanel());
  }

  private togglePanel(): void {
    this.panelVisible = !this.panelVisible;
    this.questPanel.setVisible(this.panelVisible);
  }

  private buildQuestTracker(): void {
    const x = GAME_WIDTH - 280;
    const y = 56;

    this.questPanel = this.add.container(x, y).setDepth(50).setScrollFactor(0);

    // White background (Pokemon Red-style)
    const bg = this.add.rectangle(0, 0, 260, 200, 0xFFFFFF, 1)
      .setOrigin(0, 0).setStrokeStyle(2, 0x000000);

    // Header black strip
    const header = this.add.rectangle(0, 0, 260, 22, 0x000000)
      .setOrigin(0, 0);

    const title = this.add.text(8, 4, '📋 QUESTS  [ Q ]', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#ffffff',
    });

    this.progressText = this.add.text(252, 4, '', {
      fontFamily: 'Courier New', fontSize: '10px', color: '#aaaaaa',
    }).setOrigin(1, 0);

    this.questPanel.add([bg, header, title, this.progressText]);
  }

  private refreshQuests(): void {
    // Remove old content
    this.questContent.forEach(o => {
      this.questPanel.remove(o, true);
    });
    this.questContent = [];

    const active = QuestSystem.getActiveQuests();
    const { completed, total } = QuestSystem.getProgress();
    this.progressText.setText(`${completed}/${total}`);

    if (active.length === 0) {
      const none = this.add.text(8, 30, 'No active quests.\nTalk to NPCs to begin.', {
        fontFamily: 'Courier New', fontSize: '10px', color: '#333333', lineSpacing: 3,
      });
      this.questPanel.add(none);
      this.questContent.push(none);

      // Resize bg
      const panelBg = this.questPanel.getAt(0) as Phaser.GameObjects.Rectangle;
      panelBg.height = 70;
      return;
    }

    // Show top 3 active quests
    let yOffset = 28;
    active.slice(0, 3).forEach((quest: Quest, qi: number) => {
      const questTitle = this.add.text(8, yOffset, `▶ ${quest.title}`, {
        fontFamily: 'Courier New', fontSize: '11px', color: '#000000', fontStyle: 'bold',
        wordWrap: { width: 240 },
      });
      yOffset += questTitle.height + 2;

      const doneObjs  = quest.objectives.filter(o => o.completed).length;
      const totalObjs = quest.objectives.length;

      // Progress bar track (black)
      const barBg = this.add.rectangle(8, yOffset, 200, 8, 0x222222).setOrigin(0, 0);
      // Progress bar fill (green)
      const fillW = Math.round(200 * doneObjs / totalObjs);
      const barFill = this.add.rectangle(8, yOffset, Math.max(0, fillW), 8, 0x00CC44).setOrigin(0, 0);
      // Obj count right-aligned
      const countText = this.add.text(215, yOffset - 1, `${doneObjs}/${totalObjs}`, {
        fontFamily: 'Courier New', fontSize: '9px', color: '#444444',
      });
      yOffset += 12;

      // Next incomplete objective
      const nextObj = quest.objectives.find(o => !o.completed);
      if (nextObj) {
        const objText = this.add.text(12, yOffset, `○ ${nextObj.description}`, {
          fontFamily: 'Courier New', fontSize: '10px', color: '#444444',
          wordWrap: { width: 236 },
        });
        yOffset += objText.height + 2;
        this.questContent.push(objText);
      }

      // Separator
      if (qi < Math.min(active.length, 3) - 1) {
        const sep = this.add.rectangle(8, yOffset, 244, 1, 0x000000).setOrigin(0, 0);
        yOffset += 6;
        this.questContent.push(sep);
      }

      this.questPanel.add([questTitle, barBg, barFill, countText]);
      this.questContent.push(questTitle, barBg, barFill, countText);
    });

    if (active.length > 3) {
      const more = this.add.text(8, yOffset, `  + ${active.length - 3} more active`, {
        fontFamily: 'Courier New', fontSize: '10px', color: '#666666',
      });
      this.questPanel.add(more);
      this.questContent.push(more);
      yOffset += 14;
    }

    // Resize panel bg to fit content
    const panelBg = this.questPanel.getAt(0) as Phaser.GameObjects.Rectangle;
    panelBg.height = Math.max(70, yOffset + 10);
  }

  private bindEvents(): void {
    QuestSystem.on('quest-started',       () => this.refreshQuests());
    QuestSystem.on('quest-completed',     () => this.refreshQuests());
    QuestSystem.on('objective-completed', () => this.refreshQuests());
  }
}
