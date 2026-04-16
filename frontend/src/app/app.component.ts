// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

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
              <span class="logo-title">ReplicateXpress</span>
              <span class="logo-subtitle"></span>
            </div>
          </div>
        </div>

        <div class="header-right">
          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

 Home</a>
            <a routerLink="/dashboard" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
</svg>
 Dashboard</a>
            <a routerLink="/gallery" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
 Gallery</a>
            <a routerLink="/store" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>
 Store</a>
          </nav>

          <!-- Theme Toggle Button -->
          <button class="theme-toggle" (click)="themeService.toggleTheme()" [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg *ngIf="!themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="theme-icon">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg *ngIf="themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="theme-icon">
              <path d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <div class="ai-switch">
            <button [class.active]="activeCTA==='image'" (click)="setActiveCTA('image')" routerLink="/generate">
              ✨ Image
            </button>
            <button [class.active]="activeCTA==='video'" (click)="setActiveCTA('video')" routerLink="/video-generate">
              🎬 Video
            </button>
          </div>

          <div class="auth-buttons">
            <button class="btn-login" routerLink="/login">Login</button>
            <button class="btn-register" routerLink="/register">Sign up</button>
          </div>
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
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; background-color: var(--color-bg-primary); background-image: radial-gradient(circle, var(--color-bg-tertiary) 1.5px, transparent 1.5px); background-size: 32px 32px; color: var(--color-text-primary); position: relative; overflow: hidden; transition: background-color 0.3s ease, color 0.3s ease; }
    
    .app-header {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      backdrop-filter: blur(20px);
      background: var(--color-header-bg);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-glow);
      transition: all 0.3s ease;
    }

    .ai-switch {
      display: flex;
      background: var(--color-bg-tertiary);
      border-radius: 999px;
      padding: 4px;
      transition: background-color 0.3s ease;
    }

    .ai-switch button {
      border: none;
      background: transparent;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--color-text-secondary);
    }

    .ai-switch button.active {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: white;
      box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    }

    /* Theme Toggle Button */
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: var(--color-bg-tertiary);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--color-text-primary);
      margin: 0 0.5rem;
    }

    .theme-toggle:hover {
      background: var(--color-bg-secondary);
      transform: scale(1.1) rotate(20deg);
    }

    .theme-icon {
      width: 1.4rem;
      height: 1.4rem;
    }

    .logo { display: flex; align-items: center; gap: 0.75rem; }
    
    .logo-mark {
      border-radius: 12px;
      background: linear-gradient(135deg, var(--color-gradient-start), #8b5cf6, var(--color-gradient-end));
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      font-size: 1.25rem;
    }

    .logo-text { display: flex; flex-direction: column; gap: 0.1rem; }
    .logo-title { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; color: var(--color-gradient-start); }
    .logo-subtitle { font-size: 0.75rem; color: var(--color-text-tertiary); }
    
    .header-left { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .header-right { display: flex; align-items: center; gap: 0.85rem; }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.8rem;
      margin-right: auto;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      transition: color 0.2s ease, background-color 0.2s ease;
    }

    .nav-links a:hover { 
      color: var(--color-text-primary);
      background-color: var(--color-bg-tertiary);
    }

    .nav-links a.active { 
      color: var(--color-gradient-end);
      background-color: rgba(99, 102, 241, 0.08);
    }

    .icon { width: 1.4em; height: 1.4em; position: relative; top: 1px; }
    .cta-group { display: flex; align-items: center; gap: 0.75rem; }
    .auth-buttons { display: flex; align-items: center; gap: 0.75rem; margin-left: 1.5rem; }

    /* --- CTA buttons --- */
    .primary-cta { 
      border: none; 
      border-radius: 6px; 
      padding: 0.55rem 1.4rem; 
      font-size: 0.9rem; 
      font-weight: 500; 
      color: #ffffff; 
      cursor: pointer; 
      background: var(--color-accent);
      transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.2s ease; 
      white-space: nowrap; 
    }

    .primary-cta:hover { 
      background-color: var(--color-accent-hover);
      transform: translateY(-1px); 
    }

    .primary-cta:active { 
      transform: translateY(0); 
      background-color: var(--color-accent-active); 
    }

    .btn-login, .btn-register { 
      border-radius: 6px; 
      padding: 0.55rem 1rem; 
      font-size: 0.9rem; 
      font-weight: 500; 
      cursor: pointer; 
      transition: background-color 0.2s ease, transform 0.15s ease; 
      border: none;
    }

    .btn-login {
      background: transparent;
      color: var(--color-text-tertiary);
      font-weight: 500;
    }

    .btn-login:hover {
      color: var(--color-text-primary);
      background: var(--color-bg-tertiary);
    }

    .btn-register {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(99,102,241,0.4);
      font-weight: 600;
      padding: 0.55rem 1.2rem;
      border-radius: 999px;
      position: relative;
      overflow: hidden;
    }

    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(99,102,241,0.6);
    }

    .btn-register::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: 0.5s;
    }

    .btn-register:hover::after {
      left: 100%;
    }

    /* --- active CTA style --- */
    .primary-cta.active {
      background-color: var(--color-gradient-end);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
      border: 2px solid #1e40af;
      transform: translateY(-1px);
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

  constructor(public themeService: ThemeService) {}

  setActiveCTA(type: 'image' | 'video') {
    this.activeCTA = type;
  }
}