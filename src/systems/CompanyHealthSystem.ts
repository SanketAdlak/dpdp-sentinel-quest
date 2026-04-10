import { ScoreSystem } from './ScoreSystem';

export class CompanyHealthSystem {
  static getHealth(): number {
    const s = ScoreSystem.getState();
    const raw = 50
      + (s.complianceScore / 100) * 30
      + (s.trustRating / 100) * 20
      - (s.privacyDebt / 100) * 50;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }

  static getStatus(): { label: string; color: number; textColor: string; pulse: boolean } {
    const h = this.getHealth();
    if (h >= 85) return { label: 'EXCELLENT', color: 0x00FF88, textColor: '#00FF88', pulse: false };
    if (h >= 70) return { label: 'GOOD',      color: 0x88FF44, textColor: '#88FF44', pulse: false };
    if (h >= 55) return { label: 'FAIR',      color: 0xFFCC00, textColor: '#FFCC00', pulse: false };
    if (h >= 35) return { label: 'POOR',      color: 0xFF8800, textColor: '#FF8800', pulse: true  };
    if (h >= 15) return { label: 'CRITICAL',  color: 0xFF4444, textColor: '#FF4444', pulse: true  };
    return              { label: 'FAILING',   color: 0xFF0000, textColor: '#FF0000', pulse: true  };
  }
}
