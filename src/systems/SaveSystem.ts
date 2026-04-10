import { ScoreSystem } from './ScoreSystem';
import { QuestSystem } from './QuestSystem';
import { InventorySystem } from './InventorySystem';
import { InventoryItem } from './InventorySystem';

const SAVE_VERSION = 1;
const SAVE_KEY_PREFIX = 'dpdp_save_';
const AUTO_SAVE_KEY = 'dpdp_autosave';

export interface GameSaveData {
  version: number;
  timestamp: number;
  slot: string;
  // Score
  complianceScore: number;
  privacyDebt: number;
  trustRating: number;
  privacyCoins: number;
  inGameDay: number;
  // Quests: map of questId → status
  questStatuses: Record<string, string>;
  // Quest objectives: map of questId → objectiveId[] (completed ones)
  completedObjectives: Record<string, string[]>;
  // Unlocked districts
  unlockedDistricts: string[];
  // Inventory
  inventoryItems: InventoryItem[];
  // World state
  talkedNPCs: string[];
  triggeredEventIds: string[];
}

class SaveSystemClass {
  private static instance: SaveSystemClass;

  private constructor() {}

  static getInstance(): SaveSystemClass {
    if (!SaveSystemClass.instance) {
      SaveSystemClass.instance = new SaveSystemClass();
    }
    return SaveSystemClass.instance;
  }

  // ── Serialise current state ──────────────────────────────────────────────
  buildSaveData(slot: string, talkedNPCs: string[], triggeredEventIds: string[]): GameSaveData {
    const score = ScoreSystem.getState();
    const quests = QuestSystem.getAllQuests();
    const questStatuses: Record<string, string> = {};
    const completedObjectives: Record<string, string[]> = {};
    quests.forEach(q => {
      questStatuses[q.id] = q.status;
      completedObjectives[q.id] = q.objectives.filter(o => o.completed).map(o => o.id);
    });

    return {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      slot,
      complianceScore: score.complianceScore,
      privacyDebt: score.privacyDebt,
      trustRating: score.trustRating,
      privacyCoins: score.privacyCoins,
      inGameDay: score.inGameDay,
      questStatuses,
      completedObjectives,
      unlockedDistricts: QuestSystem.getUnlockedDistricts(),
      inventoryItems: InventorySystem.getItems(),
      talkedNPCs,
      triggeredEventIds,
    };
  }

  // ── Persist to localStorage ──────────────────────────────────────────────
  save(slot: string, talkedNPCs: string[], triggeredEventIds: string[]): boolean {
    try {
      const data = this.buildSaveData(slot, talkedNPCs, triggeredEventIds);
      localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
      return true;
    } catch {
      console.warn('[SaveSystem] Failed to save:', slot);
      return false;
    }
  }

  autoSave(talkedNPCs: string[], triggeredEventIds: string[]): boolean {
    return this.save(AUTO_SAVE_KEY, talkedNPCs, triggeredEventIds);
  }

  // ── Load from localStorage ───────────────────────────────────────────────
  load(slot: string): GameSaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY_PREFIX + slot);
      if (!raw) return null;
      const data: GameSaveData = JSON.parse(raw);
      if (data.version !== SAVE_VERSION) return null;
      return data;
    } catch {
      return null;
    }
  }

  loadAutoSave(): GameSaveData | null {
    return this.load(AUTO_SAVE_KEY);
  }

  hasSave(slot: string): boolean {
    return localStorage.getItem(SAVE_KEY_PREFIX + slot) !== null;
  }

  hasAutoSave(): boolean {
    return this.hasSave(AUTO_SAVE_KEY);
  }

  getSaveInfo(slot: string): { day: number; timestamp: number } | null {
    const data = this.load(slot);
    if (!data) return null;
    return { day: data.inGameDay, timestamp: data.timestamp };
  }

  // ── Restore state from save data ─────────────────────────────────────────
  restoreState(data: GameSaveData): { talkedNPCs: string[]; triggeredEventIds: string[] } {
    // Restore scores
    ScoreSystem.restoreState({
      complianceScore: data.complianceScore,
      privacyDebt:     data.privacyDebt,
      trustRating:     data.trustRating,
      privacyCoins:    data.privacyCoins,
      inGameDay:       data.inGameDay,
    });

    // Restore quest statuses
    Object.entries(data.questStatuses).forEach(([questId, status]) => {
      QuestSystem.restoreQuestStatus(questId, status as 'inactive' | 'active' | 'completed' | 'failed');
    });

    // Restore completed objectives
    Object.entries(data.completedObjectives).forEach(([questId, objIds]) => {
      objIds.forEach(objId => QuestSystem.restoreObjectiveCompleted(questId, objId));
    });

    // Restore unlocked districts
    data.unlockedDistricts.forEach(d => QuestSystem.unlockDistrict(d));

    // Restore inventory
    InventorySystem.clear();
    data.inventoryItems.forEach(item => InventorySystem.addItem(item));

    return {
      talkedNPCs: data.talkedNPCs ?? [],
      triggeredEventIds: data.triggeredEventIds ?? [],
    };
  }

  deleteSave(slot: string): void {
    localStorage.removeItem(SAVE_KEY_PREFIX + slot);
  }

  listSaves(): Array<{ slot: string; day: number; timestamp: number }> {
    const results: Array<{ slot: string; day: number; timestamp: number }> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(SAVE_KEY_PREFIX)) {
        const slot = key.slice(SAVE_KEY_PREFIX.length);
        const info = this.getSaveInfo(slot);
        if (info) results.push({ slot, ...info });
      }
    }
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const SaveSystem = SaveSystemClass.getInstance();
