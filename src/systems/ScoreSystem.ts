import { SCORE_LIMITS } from '../constants';

export interface ScoreState {
  complianceScore: number;
  privacyDebt: number;
  trustRating: number;
  privacyCoins: number;
  decisions: DecisionRecord[];
  inGameDay: number;
}

export interface DecisionRecord {
  id: string;
  description: string;
  complianceDelta: number;
  debtDelta: number;
  trustDelta: number;
  coinsDelta: number;
  timestamp: number;
  dpdpSection?: string;
}

class ScoreSystemClass {
  private static instance: ScoreSystemClass;
  private state: ScoreState;
  private listeners: Map<string, Array<(state: ScoreState) => void>> = new Map();

  private constructor() {
    this.state = {
      complianceScore: 20,
      privacyDebt: 30,
      trustRating: 50,
      privacyCoins: 100,
      decisions: [],
      inGameDay: 1,
    };
  }

  static getInstance(): ScoreSystemClass {
    if (!ScoreSystemClass.instance) {
      ScoreSystemClass.instance = new ScoreSystemClass();
    }
    return ScoreSystemClass.instance;
  }

  getState(): Readonly<ScoreState> {
    return { ...this.state };
  }

  applyDecision(decision: Omit<DecisionRecord, 'timestamp'>): void {
    const record: DecisionRecord = { ...decision, timestamp: Date.now() };

    this.state.complianceScore = Math.max(0, Math.min(
      SCORE_LIMITS.COMPLIANCE_MAX,
      this.state.complianceScore + decision.complianceDelta
    ));
    this.state.privacyDebt = Math.max(0, Math.min(
      SCORE_LIMITS.DEBT_MAX,
      this.state.privacyDebt + decision.debtDelta
    ));
    this.state.trustRating = Math.max(0, Math.min(
      SCORE_LIMITS.TRUST_MAX,
      this.state.trustRating + decision.trustDelta
    ));
    this.state.privacyCoins = Math.max(0, Math.min(
      SCORE_LIMITS.COINS_MAX,
      this.state.privacyCoins + decision.coinsDelta
    ));

    this.state.decisions.push(record);
    this.emit('change', this.state);
  }

  advanceDay(): void {
    this.state.inGameDay++;
    // Random audit pressure: debt grows slightly each day if not addressed
    if (this.state.privacyDebt > 0) {
      this.state.privacyDebt = Math.min(SCORE_LIMITS.DEBT_MAX, this.state.privacyDebt + 1);
    }
    this.emit('change', this.state);
    this.emit('day-advance', this.state);
  }

  isGameOver(): boolean {
    return this.state.privacyDebt >= SCORE_LIMITS.DEBT_MAX;
  }

  passedAudit(): boolean {
    return this.state.complianceScore >= 80;
  }

  getGrade(): string {
    const s = this.state.complianceScore;
    if (s >= 90) return 'S — Privacy Champion';
    if (s >= 80) return 'A — Compliant';
    if (s >= 65) return 'B — Mostly Safe';
    if (s >= 50) return 'C — At Risk';
    return 'F — MeitY is Watching You';
  }

  on(event: string, cb: (state: ScoreState) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  off(event: string, cb: (state: ScoreState) => void): void {
    const arr = this.listeners.get(event) ?? [];
    this.listeners.set(event, arr.filter(fn => fn !== cb));
  }

  private emit(event: string, state: ScoreState): void {
    this.listeners.get(event)?.forEach(fn => fn(state));
  }

  reset(): void {
    this.state = {
      complianceScore: 20,
      privacyDebt: 30,
      trustRating: 50,
      privacyCoins: 100,
      decisions: [],
      inGameDay: 1,
    };
    this.emit('change', this.state);
  }

  restoreState(partial: Partial<Pick<ScoreState, 'complianceScore' | 'privacyDebt' | 'trustRating' | 'privacyCoins' | 'inGameDay'>>): void {
    if (partial.complianceScore !== undefined) this.state.complianceScore = partial.complianceScore;
    if (partial.privacyDebt     !== undefined) this.state.privacyDebt     = partial.privacyDebt;
    if (partial.trustRating     !== undefined) this.state.trustRating     = partial.trustRating;
    if (partial.privacyCoins    !== undefined) this.state.privacyCoins    = partial.privacyCoins;
    if (partial.inGameDay       !== undefined) this.state.inGameDay       = partial.inGameDay;
    this.emit('change', this.state);
  }
}

export const ScoreSystem = ScoreSystemClass.getInstance();
