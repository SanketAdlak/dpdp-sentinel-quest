import { ScoreSystem } from './ScoreSystem';

export type QuestStatus = 'inactive' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  dpdpSection: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewardCompliance: number;
  rewardCoins: number;
  rewardTrust: number;
  penaltyDebt: number;
  unlocks?: string[];         // district IDs or quest IDs to unlock on complete
  onComplete?: () => void;
}

type QuestEvent = 'quest-started' | 'quest-completed' | 'quest-failed' | 'objective-completed';

class QuestSystemClass {
  private static instance: QuestSystemClass;
  private quests: Map<string, Quest> = new Map();
  private unlockedDistricts: Set<string> = new Set(['hq']);
  private listeners: Map<QuestEvent, Array<(quest: Quest, objectiveId?: string) => void>> = new Map();

  private constructor() {}

  static getInstance(): QuestSystemClass {
    if (!QuestSystemClass.instance) {
      QuestSystemClass.instance = new QuestSystemClass();
    }
    return QuestSystemClass.instance;
  }

  registerQuest(quest: Quest): void {
    this.quests.set(quest.id, {
      ...quest,
      rewardTrust: quest.rewardTrust ?? 0,
      unlocks: quest.unlocks ?? [],
      objectives: quest.objectives.map(o => ({ ...o })),
    });
  }

  startQuest(id: string): boolean {
    const quest = this.quests.get(id);
    if (!quest || quest.status !== 'inactive') return false;
    quest.status = 'active';
    this.emit('quest-started', quest);
    return true;
  }

  completeObjective(questId: string, objectiveId: string): boolean {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'active') return false;

    const obj = quest.objectives.find(o => o.id === objectiveId);
    if (!obj || obj.completed) return false;

    obj.completed = true;
    this.emit('objective-completed', quest, objectiveId);

    if (quest.objectives.every(o => o.completed)) {
      this.completeQuest(questId);
    }
    return true;
  }

  completeQuest(id: string): void {
    const quest = this.quests.get(id);
    if (!quest || quest.status !== 'active') return;
    quest.status = 'completed';

    // Apply rewards automatically
    ScoreSystem.applyDecision({
      id: `quest-complete-${id}`,
      description: `Completed: ${quest.title}`,
      complianceDelta: quest.rewardCompliance,
      debtDelta: -quest.penaltyDebt,
      trustDelta: quest.rewardTrust,
      coinsDelta: quest.rewardCoins,
      dpdpSection: quest.dpdpSection,
    });

    // Unlock districts / next quests
    quest.unlocks?.forEach(unlockId => {
      this.unlockedDistricts.add(unlockId);
      // Auto-start unlocked quests if they exist
      if (this.quests.has(unlockId)) this.startQuest(unlockId);
    });

    quest.onComplete?.();
    this.emit('quest-completed', quest);
  }

  failQuest(id: string): void {
    const quest = this.quests.get(id);
    if (!quest) return;
    quest.status = 'failed';

    // Apply debt penalty
    if (quest.penaltyDebt > 0) {
      ScoreSystem.applyDecision({
        id: `quest-failed-${id}`,
        description: `Failed: ${quest.title}`,
        complianceDelta: 0,
        debtDelta: quest.penaltyDebt,
        trustDelta: -10,
        coinsDelta: 0,
        dpdpSection: quest.dpdpSection,
      });
    }

    this.emit('quest-failed', quest);
  }

  isDistrictUnlocked(id: string): boolean {
    return this.unlockedDistricts.has(id);
  }

  unlockDistrict(id: string): void {
    this.unlockedDistricts.add(id);
  }

  getQuest(id: string): Quest | undefined {
    return this.quests.get(id);
  }

  getActiveQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.status === 'active');
  }

  getCompletedQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.status === 'completed');
  }

  getProgress(): { total: number; completed: number; active: number } {
    const all = Array.from(this.quests.values());
    return {
      total: all.length,
      completed: all.filter(q => q.status === 'completed').length,
      active: all.filter(q => q.status === 'active').length,
    };
  }

  on(event: QuestEvent, cb: (quest: Quest, objectiveId?: string) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  off(event: QuestEvent, cb: (quest: Quest, objectiveId?: string) => void): void {
    const arr = this.listeners.get(event) ?? [];
    this.listeners.set(event, arr.filter(fn => fn !== cb));
  }

  getAllQuests(): Quest[] {
    return Array.from(this.quests.values());
  }

  getUnlockedDistricts(): string[] {
    return Array.from(this.unlockedDistricts);
  }

  restoreQuestStatus(id: string, status: QuestStatus): void {
    const quest = this.quests.get(id);
    if (quest) quest.status = status;
  }

  restoreObjectiveCompleted(questId: string, objectiveId: string): void {
    const quest = this.quests.get(questId);
    if (!quest) return;
    const obj = quest.objectives.find(o => o.id === objectiveId);
    if (obj) obj.completed = true;
  }

  reset(): void {
    this.quests.clear();
    this.unlockedDistricts = new Set(['hq']);
    this.listeners.clear();
  }

  private emit(event: QuestEvent, quest: Quest, objectiveId?: string): void {
    this.listeners.get(event)?.forEach(fn => fn(quest, objectiveId));
  }
}

export const QuestSystem = QuestSystemClass.getInstance();
