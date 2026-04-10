export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'evidence' | 'tool' | 'document' | 'key';
  icon: string;
  quantity: number;
  dpdpSection?: string;
}

class InventorySystemClass {
  private static instance: InventorySystemClass;
  private items: Map<string, InventoryItem> = new Map();
  private listeners: Array<(items: InventoryItem[]) => void> = [];

  private constructor() {}

  static getInstance(): InventorySystemClass {
    if (!InventorySystemClass.instance) {
      InventorySystemClass.instance = new InventorySystemClass();
    }
    return InventorySystemClass.instance;
  }

  addItem(item: Omit<InventoryItem, 'quantity'> & { quantity?: number }): void {
    const existing = this.items.get(item.id);
    if (existing) {
      existing.quantity += item.quantity ?? 1;
    } else {
      this.items.set(item.id, { ...item, quantity: item.quantity ?? 1 });
    }
    this.emit();
  }

  removeItem(id: string, quantity = 1): boolean {
    const item = this.items.get(id);
    if (!item || item.quantity < quantity) return false;
    item.quantity -= quantity;
    if (item.quantity === 0) this.items.delete(id);
    this.emit();
    return true;
  }

  hasItem(id: string): boolean {
    return (this.items.get(id)?.quantity ?? 0) > 0;
  }

  getItems(): InventoryItem[] {
    return Array.from(this.items.values());
  }

  getEvidenceItems(): InventoryItem[] {
    return this.getItems().filter(i => i.type === 'evidence');
  }

  getItemCount(): number {
    return Array.from(this.items.values()).reduce((sum, i) => sum + i.quantity, 0);
  }

  clear(): void {
    this.items.clear();
    this.emit();
  }

  onChange(cb: (items: InventoryItem[]) => void): void {
    this.listeners.push(cb);
  }

  private emit(): void {
    const items = this.getItems();
    this.listeners.forEach(cb => cb(items));
  }
}

export const InventorySystem = InventorySystemClass.getInstance();
