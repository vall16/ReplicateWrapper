import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Importt

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule,RouterLink, 
    RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-mark">R</span>
            <div class="logo-text">
              <span class="logo-title">Repli</span>
              <span class="logo-subtitle">Replicate Wrapper</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/store" routerLinkActive="active">Store</a>
          </nav>
          <button class="primary-cta" type="button">
            Avvia generazione
          </button>
        </div>
      </header>

      <main class="app-main">
        <div class="background-orbit orbit-1"></div>
        <div class="background-orbit orbit-2"></div>
        <section class="content-surface">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at top left, #1f2933 0%, #020617 40%, #020617 100%);
      color: #e5e7eb;
      position: relative;
      overflow: hidden;
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2.5rem;
      backdrop-filter: blur(18px);
      background: linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6));
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 999px;
      background: conic-gradient(from 140deg, #22c55e, #06b6d4, #6366f1, #f97316, #22c55e);
      box-shadow: 0 10px 40px rgba(56, 189, 248, 0.5);
      font-weight: 700;
      color: #020617;
      font-size: 1.25rem;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .logo-title {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .logo-subtitle {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.95rem;
    }

    .nav-links a {
      color: #9ca3af;
      text-decoration: none;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      transition: color 0.2s ease, background-color 0.2s ease;
    }

    .nav-links a:hover {
      color: #e5e7eb;
      background-color: rgba(148, 163, 184, 0.12);
    }

    .nav-links a.active {
      color: #e5e7eb;
      background: radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.65), rgba(56, 189, 248, 0.55));
    }

    .primary-cta {
      border: none;
      border-radius: 999px;
      padding: 0.55rem 1.4rem;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #020617;
      cursor: pointer;
      background: linear-gradient(120deg, #22c55e, #22d3ee, #4f46e5);
      box-shadow: 0 12px 40px rgba(56, 189, 248, 0.55);
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      white-space: nowrap;
    }

    .primary-cta:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
      box-shadow: 0 16px 50px rgba(56, 189, 248, 0.65);
    }

    .primary-cta:active {
      transform: translateY(1px) scale(0.99);
      box-shadow: 0 8px 30px rgba(56, 189, 248, 0.5);
    }

    .app-main {
      flex: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      padding: 0;
      position: relative;
    }

    .background-orbit {
      position: absolute;
      border-radius: 999px;
      filter: blur(40px);
      opacity: 0.45;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    .orbit-1 {
      width: 420px;
      height: 420px;
      top: -80px;
      left: -40px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.8), transparent 65%);
    }

    .orbit-2 {
      width: 520px;
      height: 520px;
      bottom: -160px;
      right: -80px;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.9), transparent 70%);
    }

    .content-surface {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1120px;
      margin: 0;
      border-radius: 0;
      padding: 0;
      background: transparent;
      box-shadow: none;
      border: none;
      backdrop-filter: none;
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 900px) {
      .app-header {
        padding-inline: 1.25rem;
        gap: 1rem;
      }

      .header-right {
        gap: 0.75rem;
      }

      .nav-links {
        display: none;
      }

      .primary-cta {
        padding-inline: 1.1rem;
      }

      .app-main {
        padding-inline: 0;
      }

      .content-surface {
        padding: 0;
        border-radius: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'repli-frontend';
}
