export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 32;

export const SCENES = {
  BOOT: 'BootScene',
  PRELOADER: 'PreloaderScene',
  MAIN_MENU: 'MainMenuScene',
  HUB_WORLD: 'HubWorldScene',
  UI: 'UIScene',
  DIALOGUE: 'DialogueScene',
  AUDIT_PLAZA: 'AuditPlazaScene',
  GAME_OVER: 'GameOverScene',
  ENDING: 'EndingScene',
} as const;

export const EVENTS = {
  // Score events
  COMPLIANCE_CHANGE: 'compliance-change',
  DEBT_CHANGE: 'debt-change',
  TRUST_CHANGE: 'trust-change',
  COINS_CHANGE: 'coins-change',
  // Dialogue events
  DIALOGUE_START: 'dialogue-start',
  DIALOGUE_END: 'dialogue-end',
  // Quest events
  QUEST_STARTED: 'quest-started',
  QUEST_COMPLETED: 'quest-completed',
  // Notification events
  SHOW_NOTIFICATION: 'show-notification',
  // Game events
  GAME_OVER: 'game-over',
  AUDIT_TRIGGERED: 'audit-triggered',
} as const;

export const SCORE_LIMITS = {
  COMPLIANCE_MAX: 100,
  DEBT_MAX: 100,
  TRUST_MAX: 100,
  COINS_MAX: 9999,
} as const;

export const PLAYER_SPEED = 160;
export const NPC_INTERACTION_DISTANCE = 60;

export const COLORS = {
  COMPLIANCE: 0x00ff88,
  DEBT: 0xff3333,
  TRUST: 0xffcc00,
  COINS: 0x44aaff,
  UI_BG: 0x0a0a1a,
  UI_BORDER: 0x334455,
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#aabbcc',
  TEXT_HIGHLIGHT: '#ffdd44',
  TEXT_DANGER: '#ff4444',
  TEXT_SUCCESS: '#44ff88',
} as const;

export const FONT_UI   = "'Inter', system-ui, Arial, sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'Courier New', Consolas, monospace";

export const FONT = {
  PIXEL:       { fontFamily: FONT_MONO, fontSize: '15px', color: COLORS.TEXT_PRIMARY },
  PIXEL_LARGE: { fontFamily: FONT_MONO, fontSize: '22px', color: COLORS.TEXT_PRIMARY },
  PIXEL_SMALL: { fontFamily: FONT_MONO, fontSize: '13px', color: COLORS.TEXT_SECONDARY },
} as const;
