import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
    this.listenToSystemPreference();
  }

  private getInitialTheme(): boolean {
    // Controlla localStorage prima
    const stored = localStorage.getItem('theme-mode');
    if (stored) {
      return stored === 'dark';
    }

    // Poi controlla la preferenza del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private listenToSystemPreference(): void {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      // Solo se l'utente non ha scelto manualmente
      if (!localStorage.getItem('theme-mode')) {
        this.isDarkMode.set(e.matches);
        this.applyTheme(e.matches);
      }
    });
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
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
  }
}
