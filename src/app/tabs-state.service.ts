import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface TabInfo {
  key: string;          // feature key
  title: string;
  outlet: string;       // router outlet name
}

@Injectable({ providedIn: 'root' })
export class TabsStateService {
  tabs: TabInfo[] = [];
  activeIndex = 0;
  private readonly STORAGE_KEY = 'app:mat-tabs-state';

  constructor(private router: Router) {}

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      this.tabs = parsed.tabs || [];
      this.activeIndex = parsed.activeIndex ?? 0;
    } catch {
      this.tabs = [];
      this.activeIndex = 0;
    }
  }

  saveState() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({ tabs: this.tabs, activeIndex: this.activeIndex })
    );
  }

  async openTab(key: string, title: string, outlet: string) {
    const existing = this.tabs.find(t => t.key === key);
    if (!existing) {
      this.tabs.push({ key, title, outlet });
      this.activeIndex = this.tabs.length - 1;
    } else {
      this.activeIndex = this.tabs.indexOf(existing);
    }

    await this.syncRouter();
    this.saveState();
  }

  async syncRouter() {
    const outletsRecord: Record<string, string | null> = {};
    for (const t of this.tabs) outletsRecord[t.outlet] = t.key;
    console.log(outletsRecord)

    // ✅ Important: relativeTo + correct outlet structure
    // await this.router.navigate([{ outlets: outletsRecord }]);
    this.router.navigate(['/tabs', { outlets: outletsRecord }]);
  }

  closeTab(index: number) {
    // const tab = this.tabs[index];
    // this.tabs.splice(index, 1);
    // if (this.activeIndex >= this.tabs.length) {
    //   this.activeIndex = Math.max(0, this.tabs.length - 1);
    // }
    // this.router.navigate(['/tabs', { outlets: { [tab.outlet]: null } }]);
    // this.saveState();
    const removed = this.tabs.splice(index, 1)[0];
    const outlets: Record<string, string | null> = {};
    for (const t of this.tabs) outlets[t.outlet] = t.key;
    outlets[removed.outlet] = null; // close this outlet

    this.router.navigate(['/tabs', { outlets: { [removed.outlet]: null } }]);
    this.saveState();
  }

}
