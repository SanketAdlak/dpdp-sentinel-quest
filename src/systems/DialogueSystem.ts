import { Story } from 'inkjs';

export interface DialogueLine {
  text: string;
  tags: string[];
}

export interface DialogueChoice {
  index: number;
  text: string;
}

export type DialogueCallback = (line: DialogueLine) => void;
export type ChoiceCallback = (choices: DialogueChoice[]) => void;
export type EndCallback = () => void;

class DialogueSystemClass {
  private static instance: DialogueSystemClass;
  private story: Story | null = null;
  private onLineCallbacks: DialogueCallback[] = [];
  private onChoiceCallbacks: ChoiceCallback[] = [];
  private onEndCallbacks: EndCallback[] = [];

  private constructor() {}

  static getInstance(): DialogueSystemClass {
    if (!DialogueSystemClass.instance) {
      DialogueSystemClass.instance = new DialogueSystemClass();
    }
    return DialogueSystemClass.instance;
  }

  loadStory(inkJson: object): void {
    this.story = new Story(JSON.stringify(inkJson));
  }

  loadStoryFromString(inkJsonString: string): void {
    this.story = new Story(inkJsonString);
  }

  startKnot(knot: string): void {
    if (!this.story) return;
    this.story.ChoosePathString(knot);
    this.advance();
  }

  /**
   * Advances the story by exactly ONE non-empty line and emits it via onLine.
   * If no more lines remain, emits onChoice (if choices exist) or onEnd.
   */
  advance(): void {
    if (!this.story) return;

    while (this.story.canContinue) {
      const text = (this.story.Continue() ?? '').trim();
      const tags = this.story.currentTags ?? [];

      if (text) {
        // Emit exactly one line, then STOP
        this.onLineCallbacks.forEach(cb => cb({ text, tags }));
        return;
      }
      // Empty line — skip it and keep looking
    }

    // No more text lines — check for choices or end
    if (this.story.currentChoices.length > 0) {
      const choices: DialogueChoice[] = this.story.currentChoices.map((c, i) => ({
        index: i,
        text: c.text,
      }));
      this.onChoiceCallbacks.forEach(cb => cb(choices));
    } else {
      this.onEndCallbacks.forEach(cb => cb());
    }
  }

  /**
   * Backwards-compatible alias for advance().
   * @deprecated Use advance() instead.
   */
  continue(): void {
    this.advance();
  }

  choose(index: number): void {
    if (!this.story) return;
    this.story.ChooseChoiceIndex(index);
    this.advance();
  }

  setVariable(name: string, value: string | number | boolean): void {
    if (!this.story) return;
    this.story.variablesState[name] = value;
  }

  getVariable(name: string): unknown {
    if (!this.story) return undefined;
    return this.story.variablesState[name];
  }

  onLine(cb: DialogueCallback): void { this.onLineCallbacks.push(cb); }
  onChoice(cb: ChoiceCallback): void { this.onChoiceCallbacks.push(cb); }
  onEnd(cb: EndCallback): void { this.onEndCallbacks.push(cb); }

  clearCallbacks(): void {
    this.onLineCallbacks = [];
    this.onChoiceCallbacks = [];
    this.onEndCallbacks = [];
  }

  isActive(): boolean {
    return this.story !== null && (this.story.canContinue || this.story.currentChoices.length > 0);
  }
}

export const DialogueSystem = DialogueSystemClass.getInstance();
