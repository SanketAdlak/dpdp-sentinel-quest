import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, EVENTS, COLORS } from '../constants';
import { DialogueSystem } from '../systems/DialogueSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { NotificationToast } from '../ui/NotificationToast';

interface DialogueSceneData {
  npcId: string;
  npcName: string;
  npcRole?: string;
  dialogueKnot: string;
  sourceScene: string;
}

// Color coding per NPC type
const NPC_BADGE_COLORS: Record<string, number> = {
  auditor: 0xff4444,
  dev:     0x44aa66,
  ceo:     0xaaaa00,
  lawyer:  0xaa44ff,
  meity:   0xff8800,
};

const NPC_BADGE_TEXT_COLORS: Record<string, string> = {
  auditor: '#ffeeee',
  dev:     '#eeffee',
  ceo:     '#ffffcc',
  lawyer:  '#f0eeff',
  meity:   '#fff5ee',
};

// Track current npcId across init/endDialogue
let _currentNpcId = '';
let _currentNpcRole = '';

export class DialogueScene extends Phaser.Scene {
  private panel!: Phaser.GameObjects.Container;
  private nameBadge!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private roleText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private lawBadge!: Phaser.GameObjects.Container;
  private lawBadgeText!: Phaser.GameObjects.Text;
  private continueHint!: Phaser.GameObjects.Text;
  private choiceButtons: Phaser.GameObjects.Container[] = [];
  private sourceScene!: string;
  private toast!: NotificationToast;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  // State
  private waitingForInput = false;
  private typewriterRunning = false;
  private currentFullText = '';
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private showingChoices = false;

  // Panel layout constants
  private readonly PANEL_W = GAME_WIDTH - 80;
  private readonly PANEL_H = 260;
  private readonly PANEL_X = 40;
  private readonly PANEL_Y = GAME_HEIGHT - this.PANEL_H - 20;
  private readonly BODY_Y = 60;
  private readonly BODY_H = 140;

  constructor() {
    super({ key: SCENES.DIALOGUE });
  }

  init(data: DialogueSceneData): void {
    this.sourceScene = data.sourceScene;
    _currentNpcId = data.npcId;
    _currentNpcRole = data.npcRole ?? '';
    this.toast = new NotificationToast(this);

    // Reset state
    this.waitingForInput = false;
    this.typewriterRunning = false;
    this.currentFullText = '';
    this.showingChoices = false;
    this.choiceButtons = [];

    DialogueSystem.clearCallbacks();

    // onLine: immediately display ONE line (no queuing)
    DialogueSystem.onLine(line => this.displayLine(line.text, line.tags));

    // onChoice: show choices
    DialogueSystem.onChoice(choices => this.showChoices(choices));

    // onEnd: close dialogue
    DialogueSystem.onEnd(() => this.endDialogue());
  }

  create(data: DialogueSceneData): void {
    // Dim background — blocks input to world behind
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setInteractive();

    this.buildDialoguePanel(data.npcId, data.npcName, data.npcRole ?? '');

    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Load the ink story from cache and start the knot
    const inkJson = this.cache.json.get('ink-main');
    if (inkJson) {
      DialogueSystem.loadStoryFromString(JSON.stringify(inkJson));
    } else {
      this.loadFallbackStory();
    }

    DialogueSystem.startKnot(data.dialogueKnot);
  }

  update(): void {
    if (!Phaser.Input.Keyboard.JustDown(this.spaceKey)) return;

    if (this.typewriterRunning) {
      // Skip typewriter — show full text immediately
      this.skipTypewriter();
    } else if (this.waitingForInput && !this.showingChoices) {
      // Advance to next line
      this.waitingForInput = false;
      this.continueHint.setVisible(false);
      DialogueSystem.advance();
    }
  }

  private buildDialoguePanel(npcId: string, npcName: string, npcRole: string): void {
    const PW = this.PANEL_W;
    const PH = this.PANEL_H;

    this.panel = this.add.container(this.PANEL_X, this.PANEL_Y).setDepth(90);

    // Background
    const bg = this.add.rectangle(0, 0, PW, PH, 0x080e1a, 0.97)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x2a4060);

    // Header strip
    const headerBg = this.add.rectangle(0, 0, PW, 50, 0x0d1829, 1)
      .setOrigin(0, 0);

    // NPC badge dot
    const badgeColor = NPC_BADGE_COLORS[npcId] ?? 0x334455;
    this.nameBadge = this.add.rectangle(14, 25, 10, 10, badgeColor, 1)
      .setOrigin(0.5);

    // Speaker name
    const textColor = NPC_BADGE_TEXT_COLORS[npcId] ?? '#ccddee';
    this.nameText = this.add.text(26, 12, npcName.toUpperCase(), {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '16px',
      color: textColor,
      fontStyle: 'bold',
    });

    // Speaker role
    this.roleText = this.add.text(26, 30, npcRole, {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '12px',
      color: '#667788',
    });

    // Law badge (hidden by default, shown via tags)
    this.lawBadge = this.add.container(PW - 8, 25);
    const lawBadgeBg = this.add.rectangle(0, 0, 200, 22, 0x1a0a00, 1)
      .setOrigin(1, 0.5)
      .setStrokeStyle(1, 0xff8800);
    this.lawBadgeText = this.add.text(-4, 0, '', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '12px',
      color: '#ff8800',
    }).setOrigin(1, 0.5);
    this.lawBadge.add([lawBadgeBg, this.lawBadgeText]);
    this.lawBadge.setVisible(false);

    // Divider line
    const divider = this.add.rectangle(0, 52, PW, 1, 0x2a4060, 1)
      .setOrigin(0, 0);

    // Body text area
    this.bodyText = this.add.text(20, this.BODY_Y, '', {
      fontFamily: 'Courier New',
      fontSize: '16px',
      color: COLORS.TEXT_PRIMARY,
      wordWrap: { width: PW - 40 },
      lineSpacing: 6,
    });

    // Bottom divider (above choices area)
    const divider2 = this.add.rectangle(0, PH - 70, PW, 1, 0x1a2a3a, 1)
      .setOrigin(0, 0);

    // Continue hint — bottom right, blinking
    this.continueHint = this.add.text(PW - 16, PH - 14, 'SPACE ▶', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '13px',
      color: '#445566',
    }).setOrigin(1, 1).setVisible(false);

    this.tweens.add({
      targets: this.continueHint,
      alpha: 0.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.panel.add([
      bg, headerBg,
      this.nameBadge, this.nameText, this.roleText,
      this.lawBadge,
      divider,
      this.bodyText,
      divider2,
      this.continueHint,
    ]);
  }

  private displayLine(text: string, tags: string[]): void {
    // Stop any running typewriter
    this.typewriterTimer?.destroy();
    this.typewriterTimer = undefined;

    // Clear old choices
    this.clearChoices();
    this.showingChoices = false;

    // Process tags (score, quests, items, law badge)
    this.processTags(tags);

    // Start typewriter
    this.currentFullText = text;
    this.bodyText.setText('');
    this.continueHint.setVisible(false);
    this.waitingForInput = false;
    this.typewriterRunning = true;

    let charIdx = 0;
    this.typewriterTimer = this.time.addEvent({
      delay: 18,
      repeat: text.length - 1,
      callback: () => {
        charIdx++;
        this.bodyText.setText(text.substring(0, charIdx));
        if (charIdx >= text.length) {
          this.onTypewriterComplete();
        }
      },
    });
  }

  private onTypewriterComplete(): void {
    this.typewriterRunning = false;
    this.waitingForInput = true;
    this.continueHint.setVisible(true);
    this.typewriterTimer?.destroy();
    this.typewriterTimer = undefined;
  }

  private skipTypewriter(): void {
    this.typewriterTimer?.destroy();
    this.typewriterTimer = undefined;
    this.bodyText.setText(this.currentFullText);
    this.onTypewriterComplete();
  }

  private showChoices(choices: { index: number; text: string }[]): void {
    this.waitingForInput = false;
    this.continueHint.setVisible(false);
    this.showingChoices = true;
    this.clearChoices();

    const choiceAreaY = this.PANEL_H - 68;
    const choiceW = this.PANEL_W - 32;

    choices.forEach((choice, i) => {
      const y = choiceAreaY + i * 30;
      const container = this.add.container(16, y);

      const btnBg = this.add.rectangle(0, 0, choiceW, 26, 0x0d1829, 1)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, 0x2a4060);

      const label = this.add.text(10, 13, `[${i + 1}] ${choice.text}`, {
        fontFamily: "'Inter', system-ui, Arial, sans-serif",
        fontSize: '14px',
        color: COLORS.TEXT_SECONDARY,
      }).setOrigin(0, 0.5);

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x1a3355);
        btnBg.setStrokeStyle(1, 0x00ffcc);
        label.setColor(COLORS.TEXT_HIGHLIGHT);
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x0d1829);
        btnBg.setStrokeStyle(1, 0x2a4060);
        label.setColor(COLORS.TEXT_SECONDARY);
      });
      btnBg.on('pointerdown', () => {
        this.selectChoice(choice.index);
      });

      // Keyboard shortcut (1/2/3) — only bind keys 1, 2, 3
      const NUM_KEYS = [
        Phaser.Input.Keyboard.KeyCodes.ONE,
        Phaser.Input.Keyboard.KeyCodes.TWO,
        Phaser.Input.Keyboard.KeyCodes.THREE,
      ];
      if (i < NUM_KEYS.length) {
        const numKey = this.input.keyboard!.addKey(NUM_KEYS[i]);
        numKey.once('down', () => {
          if (this.showingChoices) this.selectChoice(choice.index);
        });
      }

      container.add([btnBg, label]);
      this.panel.add(container);
      this.choiceButtons.push(container);
    });
  }

  private selectChoice(index: number): void {
    this.showingChoices = false;
    this.clearChoices();
    DialogueSystem.choose(index);
  }

  private clearChoices(): void {
    this.choiceButtons.forEach(c => {
      this.panel.remove(c, true);
    });
    this.choiceButtons = [];
  }

  private processTags(tags: string[]): void {
    let complianceDelta = 0;
    let debtDelta = 0;
    let trustDelta = 0;
    let coinsDelta = 0;
    let sectionRef: string | undefined;

    // Hide law badge until a law tag appears
    this.lawBadge.setVisible(false);

    tags.forEach(tag => {
      const [key, ...rest] = tag.split(':');

      switch (key.trim()) {
        case 'compliance':
          complianceDelta += parseInt(rest[0]) || 0;
          break;

        case 'debt':
          debtDelta += parseInt(rest[0]) || 0;
          break;

        case 'trust':
          trustDelta += parseInt(rest[0]) || 0;
          break;

        case 'coins':
          coinsDelta += parseInt(rest[0]) || 0;
          break;

        case 'law': {
          // format: law:Section:Message:Penalty
          const section = rest[0] ?? '';
          const msg = rest[1] ?? '';
          const penalty = rest[2] ?? '';
          this.toast.showLawViolation(section, msg, penalty);
          sectionRef = section;
          // Show law badge in panel header
          this.lawBadgeText.setText(`§ ${section}`);
          this.lawBadge.setVisible(true);
          break;
        }

        case 'success':
          this.toast.showSuccess(rest.join(':'));
          break;

        case 'quest': {
          const [questId, action, objectiveId] = rest;
          if (action === 'start') QuestSystem.startQuest(questId);
          else if (action === 'complete') QuestSystem.completeQuest(questId);
          else if (action === 'objective' && objectiveId) {
            QuestSystem.completeObjective(questId, objectiveId);
          }
          break;
        }

        case 'unlock':
          QuestSystem.unlockDistrict(rest[0]);
          break;

        case 'item': {
          const [itemId, action] = rest;
          if (action === 'add') {
            InventorySystem.addItem({
              id: itemId,
              name: itemId.replace(/_/g, ' '),
              description: `Collected during dialogue`,
              type: 'evidence',
              icon: '📄',
            });
          } else if (action === 'remove') {
            InventorySystem.removeItem(itemId);
          }
          break;
        }
      }
    });

    const hasChange = complianceDelta || debtDelta || trustDelta || coinsDelta;
    if (hasChange) {
      ScoreSystem.applyDecision({
        id: `dialogue-${Date.now()}`,
        description: 'Dialogue decision',
        complianceDelta,
        debtDelta,
        trustDelta,
        coinsDelta,
        dpdpSection: sectionRef,
      });
    }
  }

  private endDialogue(): void {
    this.clearChoices();
    this.typewriterTimer?.destroy();
    this.time.delayedCall(400, () => {
      const npcId = _currentNpcId;
      this.scene.stop(SCENES.DIALOGUE);
      const hubScene = this.scene.get(this.sourceScene);
      hubScene.events.emit(EVENTS.DIALOGUE_END, npcId);
    });
  }

  private loadFallbackStory(): void {
    const fallbackJson = {
      inkVersion: 21,
      root: [
        ["^Welcome to IndiaScale. I'm Rakesh Sharma, the auditor.", "\n", "done"],
      ],
      listDefs: {},
    };
    DialogueSystem.loadStoryFromString(JSON.stringify(fallbackJson));
  }
}
