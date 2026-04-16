import Phaser from 'phaser';
import { InventorySystem, InventoryItem } from '../systems/InventorySystem';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONT_UI } from '../constants';

// ─── Layout constants ─────────────────────────────────────────────────────────

const HUD_H          = 56;       // top HUD height to skip
const PANEL_W        = 300;
const PANEL_TOP      = HUD_H;
const PANEL_H        = GAME_HEIGHT - PANEL_TOP;
const PANEL_X_OPEN   = GAME_WIDTH - PANEL_W;   // left edge when open
const PANEL_X_CLOSED = GAME_WIDTH;              // left edge when hidden (off-screen)
const SLIDE_DURATION = 280;

const TOGGLE_DEPTH   = 90;
const PANEL_DEPTH    = 95;

// ─── Per-item-type colour palette ────────────────────────────────────────────

const TYPE_COLORS: Record<InventoryItem['type'], { accent: number; text: string; badge: string }> = {
  evidence: { accent: 0x00ffcc, text: '#00ffcc', badge: 'EVIDENCE' },
  document: { accent: 0xffdd44, text: '#ffdd44', badge: 'DOCUMENT' },
  tool:     { accent: 0x44ccff, text: '#44ccff', badge: 'TOOL'     },
  key:      { accent: 0xcc44ff, text: '#cc44ff', badge: 'KEY'      },
};

// ─── InventoryPanel class ─────────────────────────────────────────────────────

export class InventoryPanel {
  private scene: Phaser.Scene;
  private isOpen = false;

  // ── Toggle button ──
  private toggleContainer!: Phaser.GameObjects.Container;
  private toggleBg!: Phaser.GameObjects.Rectangle;
  private toggleLabel!: Phaser.GameObjects.Text;

  // ── Sliding panel ──
  private panelContainer!: Phaser.GameObjects.Container;
  private panelBg!: Phaser.GameObjects.Rectangle;
  private leftBorder!: Phaser.GameObjects.Rectangle;
  private headerText!: Phaser.GameObjects.Text;
  private countText!: Phaser.GameObjects.Text;
  private closeBtn!: Phaser.GameObjects.Text;
  private closeBtnBg!: Phaser.GameObjects.Rectangle;
  private scrollContainer!: Phaser.GameObjects.Container;
  private maskGraphics!: Phaser.GameObjects.Graphics;

  // ── Keyboard ──
  private keyI!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buildToggleButton();
    this.buildPanel();
    this.bindInventory();
    this.bindKeyboard();
    this.refresh();
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.slideOut();
  }

  // ── Toggle button ───────────────────────────────────────────────────────────

  private buildToggleButton(): void {
    const BTN_W = 130;
    const BTN_H = 34;
    // Screen-space coordinates (used for both rendering and manual hit-test)
    const BTN_SCR_X = GAME_WIDTH - BTN_W / 2 - 8;   // center x on screen
    const BTN_SCR_Y = GAME_HEIGHT - BTN_H / 2 - 8;  // center y on screen

    this.toggleContainer = this.scene.add
      .container(BTN_SCR_X, BTN_SCR_Y)
      .setScrollFactor(0)
      .setDepth(TOGGLE_DEPTH);

    this.toggleBg = this.scene.add
      .rectangle(0, 0, BTN_W, BTN_H, 0x162a44)
      .setStrokeStyle(1, 0x00ffcc);

    this.toggleLabel = this.scene.add
      .text(0, 0, '📋 Items (0)', {
        fontFamily: FONT_UI, fontSize: '13px', color: '#00ffcc', fontStyle: 'bold',
      })
      .setOrigin(0.5, 0.5);

    this.toggleContainer.add([this.toggleBg, this.toggleLabel]);

    // Manual hit-test: avoids the scrollY=56 offset that breaks setInteractive() in containers
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const left   = BTN_SCR_X - BTN_W / 2;
      const right  = BTN_SCR_X + BTN_W / 2;
      const top    = BTN_SCR_Y - BTN_H / 2;
      const bottom = BTN_SCR_Y + BTN_H / 2;
      if (pointer.x >= left && pointer.x <= right &&
          pointer.y >= top  && pointer.y <= bottom) {
        this.toggle();
      }
    });
  }

  // ── Panel shell ─────────────────────────────────────────────────────────────

  private buildPanel(): void {
    // Start off-screen to the right
    this.panelContainer = this.scene.add
      .container(PANEL_X_CLOSED, PANEL_TOP)
      .setScrollFactor(0)
      .setDepth(PANEL_DEPTH);

    // Background
    this.panelBg = this.scene.add
      .rectangle(0, 0, PANEL_W, PANEL_H, 0x050a14, 0.97)
      .setOrigin(0, 0);

    // Left teal border
    this.leftBorder = this.scene.add
      .rectangle(0, 0, 2, PANEL_H, 0x00ffcc, 1)
      .setOrigin(0, 0);

    // Header band
    const headerBand = this.scene.add
      .rectangle(2, 0, PANEL_W - 2, 52, 0x0a1a2e, 1)
      .setOrigin(0, 0);

    this.headerText = this.scene.add
      .text(16, 14, 'EVIDENCE VAULT', {
        fontFamily: FONT_UI,
        fontSize: '15px',
        color: '#00ffcc',
        fontStyle: 'bold',
        letterSpacing: 2,
      })
      .setOrigin(0, 0);

    this.countText = this.scene.add
      .text(16, 32, '0 items', {
        fontFamily: FONT_UI,
        fontSize: '12px',
        color: COLORS.TEXT_SECONDARY,
      })
      .setOrigin(0, 0);

    // Close button — use a clickable rectangle for reliable hit area
    this.closeBtnBg = this.scene.add
      .rectangle(PANEL_W - 28, 14, 28, 28, 0x1a0000)
      .setOrigin(0.5, 0)
      .setStrokeStyle(1, 0x553333);

    this.closeBtn = this.scene.add
      .text(PANEL_W - 28, 14 + 14, '✕', {
        fontFamily: FONT_UI, fontSize: '16px', color: '#ff6666',
      })
      .setOrigin(0.5, 0.5);

    // Scene-level pointer handler for close button
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.isOpen) return;
      const panelScreenX = PANEL_X_OPEN;
      const btnLeft   = panelScreenX + PANEL_W - 28 - 14;
      const btnRight  = panelScreenX + PANEL_W - 28 + 14;
      const btnTop    = HUD_H + 14;
      const btnBottom = HUD_H + 14 + 28;
      if (pointer.x >= btnLeft && pointer.x <= btnRight &&
          pointer.y >= btnTop  && pointer.y <= btnBottom) {
        this.close();
      }
    });

    // Header bottom divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x334455, 1);
    divider.lineBetween(2, 52, PANEL_W, 52);

    // Scroll area container (items go here)
    this.scrollContainer = this.scene.add.container(0, 56);

    // Clipping mask so items don't bleed outside the panel
    this.maskGraphics = this.scene.add.graphics();
    this.maskGraphics
      .fillStyle(0xffffff)
      .fillRect(PANEL_X_CLOSED, PANEL_TOP + 56, PANEL_W, PANEL_H - 56);
    this.maskGraphics.setScrollFactor(0).setDepth(PANEL_DEPTH - 1);
    const mask = this.maskGraphics.createGeometryMask();
    this.scrollContainer.setMask(mask);

    this.panelContainer.add([
      this.panelBg,
      this.leftBorder,
      headerBand,
      this.headerText,
      this.countText,
      this.closeBtnBg,
      this.closeBtn,
      divider,
      this.scrollContainer,
    ]);
  }

  // ── Open / close animation ──────────────────────────────────────────────────

  private open(): void {
    this.isOpen = true;

    // Update mask position to match open panel
    this.maskGraphics.clear();
    this.maskGraphics
      .fillStyle(0xffffff)
      .fillRect(PANEL_X_OPEN, PANEL_TOP + 56, PANEL_W, PANEL_H - 56);

    this.scene.tweens.add({
      targets: this.panelContainer,
      x: PANEL_X_OPEN,
      duration: SLIDE_DURATION,
      ease: 'Power3.easeOut',
    });
  }

  private slideOut(): void {
    this.scene.tweens.add({
      targets: this.panelContainer,
      x: PANEL_X_CLOSED,
      duration: SLIDE_DURATION,
      ease: 'Power3.easeIn',
      onComplete: () => {
        // Reset mask to off-screen so clipped content is hidden when closed
        this.maskGraphics.clear();
        this.maskGraphics
          .fillStyle(0xffffff)
          .fillRect(PANEL_X_CLOSED, PANEL_TOP + 56, PANEL_W, PANEL_H - 56);
      },
    });
  }

  // ── Inventory binding ───────────────────────────────────────────────────────

  private bindInventory(): void {
    InventorySystem.onChange(() => this.refresh());
  }

  // ── Keyboard shortcut ───────────────────────────────────────────────────────

  private bindKeyboard(): void {
    if (!this.scene.input.keyboard) return;
    this.keyI = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.I,
    );
    this.keyI.on('down', () => this.toggle());
  }

  // ── Refresh / rebuild item list ─────────────────────────────────────────────

  private refresh(): void {
    const items = InventorySystem.getItems();
    const totalCount = InventorySystem.getItemCount();

    // Update toggle button badge
    this.toggleLabel.setText(`📋 Items (${totalCount})`);

    // Update header count
    this.countText.setText(
      totalCount === 1 ? '1 item collected' : `${totalCount} items collected`,
    );

    // Rebuild scroll container
    this.scrollContainer.removeAll(true);

    if (items.length === 0) {
      this.buildEmptyState();
      return;
    }

    let cursor = 0;
    items.forEach(item => {
      const itemH = this.buildItemRow(item, cursor);
      cursor += itemH + 8;
    });
  }

  // ── Empty state ─────────────────────────────────────────────────────────────

  private buildEmptyState(): void {
    const emptyText = this.scene.add
      .text(PANEL_W / 2, (PANEL_H - 56) / 2 - 20, 'No items yet.\nTalk to NPCs and complete\nquests to collect evidence.', {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: COLORS.TEXT_SECONDARY,
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0.5);

    const icon = this.scene.add
      .text(PANEL_W / 2, (PANEL_H - 56) / 2 - 70, '🗂️', {
        fontSize: '36px',
      })
      .setOrigin(0.5, 0.5);

    this.scrollContainer.add([icon, emptyText]);
  }

  // ── Single item row — returns row height ────────────────────────────────────

  private buildItemRow(item: InventoryItem, y: number): number {
    const palette = TYPE_COLORS[item.type];
    const ROW_W = PANEL_W - 4;   // leave room for left border
    const PADDING = 10;
    const ICON_SIZE = 32;

    // Estimate height: icon row + description wrap
    const descMaxW = ROW_W - ICON_SIZE - PADDING * 3;

    // Measure description height (2-line truncation is visual; we measure actual)
    const descSample = this.scene.add.text(0, 0, item.description, {
      fontFamily: FONT_UI,
      fontSize: '12px',
      wordWrap: { width: descMaxW },
    });
    // Cap at 2 lines worth of height
    const lineH = descSample.lineSpacing + 14;
    const descH = Math.min(descSample.height, lineH * 2);
    descSample.destroy();

    const hasBadge = !!item.dpdpSection;
    const ROW_H = PADDING + ICON_SIZE + (descH > 0 ? descH + 4 : 0) + (hasBadge ? 20 : 0) + PADDING;

    const rowContainer = this.scene.add.container(4, y);

    // Row background
    const rowBg = this.scene.add
      .rectangle(0, 0, ROW_W, ROW_H, 0x0a1420, 1)
      .setOrigin(0, 0);

    // Accent left strip
    const strip = this.scene.add
      .rectangle(0, 0, 3, ROW_H, palette.accent, 1)
      .setOrigin(0, 0);

    // Icon
    const iconText = this.scene.add
      .text(PADDING + 3, PADDING, item.icon, {
        fontSize: '22px',
      })
      .setOrigin(0, 0);

    // Name
    const nameText = this.scene.add
      .text(PADDING + ICON_SIZE + 4, PADDING, item.name, {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: palette.text,
        fontStyle: 'bold',
        wordWrap: { width: descMaxW },
      })
      .setOrigin(0, 0);

    // Quantity badge (if > 1)
    const elements: Phaser.GameObjects.GameObject[] = [rowBg, strip, iconText, nameText];

    if (item.quantity > 1) {
      const qtyText = this.scene.add
        .text(ROW_W - PADDING, PADDING, `×${item.quantity}`, {
          fontFamily: FONT_UI,
          fontSize: '12px',
          color: COLORS.TEXT_SECONDARY,
        })
        .setOrigin(1, 0);
      elements.push(qtyText);
    }

    // Description (2 lines max)
    const descY = PADDING + nameText.height + 2;
    const descText = this.scene.add
      .text(PADDING + ICON_SIZE + 4, descY, item.description, {
        fontFamily: FONT_UI,
        fontSize: '12px',
        color: COLORS.TEXT_SECONDARY,
        wordWrap: { width: descMaxW },
      })
      .setOrigin(0, 0);

    // Truncate to 2 lines visually via cropping
    if (descText.height > lineH * 2) {
      descText.setCrop(0, 0, descMaxW, lineH * 2);
    }
    elements.push(descText);

    // DPDP Section badge
    if (hasBadge) {
      const badgeY = ROW_H - PADDING - 16;
      const badgeBg = this.scene.add
        .rectangle(PADDING + ICON_SIZE + 4, badgeY, 0, 16, 0x0d2233)
        .setOrigin(0, 0);

      const badgeText = this.scene.add
        .text(PADDING + ICON_SIZE + 8, badgeY + 2, `§ ${item.dpdpSection!}`, {
          fontFamily: FONT_UI,
          fontSize: '11px',
          color: palette.text,
        })
        .setOrigin(0, 0);

      // Resize badge bg to fit text
      badgeBg.setSize(badgeText.width + 8, 16);

      const typeBadge = this.scene.add
        .text(ROW_W - PADDING, badgeY + 2, palette.badge, {
          fontFamily: FONT_UI,
          fontSize: '10px',
          color: palette.text,
          fontStyle: 'bold',
        })
        .setOrigin(1, 0);

      elements.push(badgeBg, badgeText, typeBadge);
    }

    rowContainer.add(elements);
    this.scrollContainer.add(rowContainer);

    return ROW_H;
  }
}
