// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-mark">R</span>
            <div class="logo-text">
              <span class="logo-title">Replicate Wrapper</span>
              <span class="logo-subtitle"></span>
            </div>
          </div>
        </div>

        <div class="header-right">
          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">🏠 Home</a>
            <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard</a>
            <a routerLink="/gallery" routerLinkActive="active">🖼️ Galleria</a>
            <a routerLink="/store" routerLinkActive="active">🛒 Store</a>
          </nav>

          <button 
            class="primary-cta" 
            [class.active]="activeCTA === 'image'" 
            (click)="setActiveCTA('image')" 
            routerLink="/generate"> 
            ✨ AI Image
          </button>

          <button 
            class="primary-cta" 
            [class.active]="activeCTA === 'video'" 
            (click)="setActiveCTA('video')" 
            routerLink="/generate"> 
            🎬 AI Video
          </button>
        </div>
      </header>

      <main class="app-main">
        <section class="content-surface">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    /* --- base styles --- */
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px); background-size: 32px 32px; color: #1f2937; position: relative; overflow: hidden; }
    .app-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2.5rem; backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.92); border-bottom: 1px solid rgba(229, 231, 235, 0.8); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08); }
    .logo { display: flex; align-items: center; gap: 0.75rem; }
    .logo-mark { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3); font-weight: 700; color: #ffffff; font-size: 1.25rem; }
    .logo-text { display: flex; flex-direction: column; gap: 0.1rem; }
    .logo-title { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; color: #6366f1; }
    .logo-subtitle { font-size: 0.75rem; color: #6b7280; }
    .header-left, .header-right { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links { display: flex; align-items: center; gap: 1rem; font-size: 0.95rem; }
    .nav-links a { color: #4b5563; text-decoration: none; padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 500; transition: color 0.2s ease, background-color 0.2s ease; }
    .nav-links a:hover { color: #111827; background-color: #f3f4f6; }
    .nav-links a.active { color: #3b82f6; background: transparent; }

    /* --- CTA buttons --- */
    .primary-cta { border: none; border-radius: 6px; padding: 0.55rem 1.4rem; font-size: 0.9rem; font-weight: 500; color: #ffffff; cursor: pointer; background: #6366f1; transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.2s ease; white-space: nowrap; }
    .primary-cta:hover { background-color: #4f46e5; transform: translateY(-1px); }
    .primary-cta:active { transform: translateY(0); background-color: #4338ca; }

    /* --- active CTA style --- */
    .primary-cta.active {
  background-color: #3b82f6;   /* blu acceso */
  color: #ffffff;              /* testo chiaro */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6); /* ombra più intensa */
  border: 2px solid #1e40af;  /* bordo scuro per contrasto */
  transform: translateY(-1px); /* leggero sollevamento */
}

    .app-main { flex: 1; display: flex; align-items: stretch; justify-content: center; padding: 0; position: relative; }
    .content-surface { position: relative; z-index: 1; width: 100%; margin: 0; border-radius: 0; padding: 0; background: transparent; box-shadow: none; border: none; backdrop-filter: none; display: flex; flex-direction: column; }

    @media (max-width: 900px) {
      .app-header { padding-inline: 1.25rem; gap: 1rem; }
      .header-right { gap: 0.75rem; }
      .nav-links { display: none; }
      .primary-cta { padding-inline: 1.1rem; }
      .app-main { padding-inline: 0; }
      .content-surface { padding: 0; border-radius: 0; }
    }
  `]
})
export class AppComponent {
  title = 'repli-frontend';
  activeCTA: 'image' | 'video' | null = null;

  setActiveCTA(type: 'image' | 'video') {
    this.activeCTA = type;
  }
}