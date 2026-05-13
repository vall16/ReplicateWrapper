import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  private getInitialTheme(): boolean {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('theme-mode');
    if (stored) {
      return stored === 'dark';
    }
    return true;
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    this.applyTheme(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
  }
}
