# DPDP Sentinel Quest

> An open-world browser RPG that teaches India's **Digital Personal Data Protection Act 2023** through immersive gameplay.

---

## What is this?

You play as a **Data Protection Officer** navigating a top-down corporate office world. Your mission: audit departments, advise employees, resolve compliance incidents, and earn your DPDP certification — all while learning real legal obligations under India's landmark privacy law.

The game distils **44 sections** and **14 rules** of the DPDP Act into quest chains, NPC conversations, and mini-games so that legal professionals, engineers, HR teams, and policy students can learn by doing rather than reading.

---

## Gameplay Features

| Feature | Description |
|---|---|
| **Hub World** | 5-room corporate office (CEO Suite, Dev Lab, Legal Library, Audit Hall, MEITY Lobby) connected by corridors |
| **Grid Movement** | Tile-snapped, Pokemon Red-style movement (32 px per step, 160 ms tween) |
| **NPC Dialogue** | Branching conversations powered by **Ink** narrative scripting |
| **Quest System** | Multi-objective quests across departments; track unlocked districts |
| **Score & Compliance Meter** | Privacy score, compliance rating, and GDPR-style audit log |
| **Save / Auto-Save** | localStorage checkpoints; P key = manual save; auto-save on every day advance |
| **Mini-games** | PII Radar (spot personal data leaks), Audit Plaza (compliance challenges) |
| **Responsive Scale** | Phaser Scale.FIT — fills any browser window at 1728×1440 logical resolution |

---

## DPDP Act 2023 — Topics Covered

- Right to access, correct, erase, and nominate (§11–18)
- Consent notices and withdrawal flow (§6–7)
- Data Fiduciary obligations (§8–9)
- Significant Data Fiduciary rules (§10)
- Data Breach notification to DPBI (§8(6))
- Cross-border data transfer restrictions (§16)
- Data Protection Board of India procedures (§18–27)
- Penalty tiers from ₹10,000 to ₹500 Crore (§33)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Game engine** | [Phaser 3](https://phaser.io) (Arcade physics, Tweens, Scale Manager) |
| **Narrative** | [Inkjs](https://github.com/y-lohse/inkjs) (compiled `.ink` → `.json`) |
| **Build** | [Vite 5](https://vitejs.dev) + TypeScript |
| **Fonts** | Inter (UI), JetBrains Mono (code/mono) via Google Fonts |
| **Deployment** | GitHub Pages via GitHub Actions |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone
git clone https://github.com/<your-username>/dpdp-sentinel-quest.git
cd dpdp-sentinel-quest

# Install
npm install

# Compile Ink stories + start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
src/
  constants.ts          # Colors, fonts, scene keys, game dimensions
  main.ts               # Phaser game config + scene registry
  entities/
    Player.ts           # Grid-based player with sprite animations
    NPC.ts              # NPC sprites + proximity detection
  scenes/
    BootScene.ts        # Asset preloading
    PreloaderScene.ts   # Loading screen
    MainMenuScene.ts    # Title + new game / continue
    HubWorldScene.ts    # Main overworld — rooms, NPCs, camera
    UIScene.ts          # Persistent HUD overlay
    DialogueScene.ts    # Ink-powered dialogue box
    AuditPlazaScene.ts  # Audit mini-game
    minigames/
      PIIRadarScene.ts  # PII spotting mini-game
  systems/
    DialogueSystem.ts   # Ink story runner
    QuestSystem.ts      # Quest state + objective tracking
    ScoreSystem.ts      # Privacy score + compliance rating
    InventorySystem.ts  # Items (evidence files, consent forms)
    SaveSystem.ts       # localStorage save / load / auto-save
  ui/
    HUD.ts              # Day counter, score, quest log strip
    DialogueBox.ts      # Typewriter + choices UI
    NotificationToast.ts
    ScoreSummary.ts     # Conversation impact screen
  world/
    RoomBuilder.ts      # Procedural office tilemap renderer
  ink/                  # .ink narrative source files
  assets/               # Spritesheets, tilesets, audio
```

---

## Roadmap — Next Development Cycle

### v0.2 — World Polish
- [ ] NPC facing direction toward player on approach
- [ ] Animated door transitions between rooms
- [ ] Tiled map editor integration (replace procedural `RoomBuilder`)
- [ ] Day/night lighting cycle tied to in-game clock

### v0.3 — Content Expansion
- [ ] 10+ fully scripted NPC quest chains covering all DPDP sections
- [ ] Inventory items: consent forms, breach reports, audit findings
- [ ] Evidence board UI — collect documents, connect the dots
- [ ] MEITY Lobby mini-game: file a Data Protection Board complaint

### v0.4 — Progression & Meta
- [ ] Main Menu save slot selection (3 slots)
- [ ] Unlockable DPDP certification badges
- [ ] Knowledge quiz checkpoints before boss dialogues
- [ ] Scoring leaderboard (optional anonymous submission)

### v0.5 — Accessibility & Mobile
- [ ] Touch / virtual joystick controls for mobile browsers
- [ ] Colour-blind modes
- [ ] Screen-reader-friendly dialogue transcripts
- [ ] PWA manifest for "Add to Home Screen"

### v1.0 — Launch
- [ ] Full DPDP Act content coverage
- [ ] Professional narration / SFX / background music
- [ ] Shareable completion certificate
- [ ] Hindi language support

---

## Contributing

Issues and PRs welcome. If you're a DPDP / privacy law expert and spot an inaccuracy in the game's legal content, please open an issue — correctness matters here.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with Phaser 3, Ink, and a belief that compliance training doesn't have to be boring.*
