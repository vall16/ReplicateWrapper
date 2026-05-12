import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-shell">
      <!-- Left rail -->
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo">RW</div>
          <div class="brand-text">
            <span class="brand-title">AI Credit Console</span>
            <!-- <span class="brand-subtitle">AI Credit Console</span> -->
          </div>
        </div>

        <nav class="nav">
          <button class="nav-item nav-item-active">
            <span class="nav-dot"></span>
            <span>Home</span>
          </button>
          <button class="nav-item" (click)="goToDashboard()">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span>Dashboard</span>
          </button>
          <button class="nav-item" (click)="goToStore()">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/><line x1="13" y1="12" x2="11" y2="12"/></svg>
            <span>Token Store</span>
          </button>
          <button class="nav-item" (click)="goToTransactions()">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>History</span>
          </button>
        </nav>

        <div class="sidebar-footer" *ngIf="user">
          <div class="user-pill">
            <div class="avatar">{{ user?.username!.charAt(0) | uppercase }}</div>
            <div class="user-meta">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </aside>

      <!-- Main surface -->
      <main class="dashboard-main">
        <!-- Top bar -->
        <header class="topbar">
          <div class="topbar-left">
            <h1 class="page-title">Home</h1>
            <p class="page-subtitle">
              Welcome to the credit management console for your Replicate models.
            </p>
          </div>
        </header>

        <!-- Home content -->
        <section class="home-grid">
          <section class="hero">
            <div class="hero-label">AI Pipelines · Replicate</div>
            <h2 class="hero-title">
              Transform Your Models
              <span class="gradient-text">Into Ready-to-Use Experiences</span>
            </h2>
            <p class="hero-subtitle">
              Repli lets you quickly connect Replicate models to your products:
              clean prompts, saved parameters, and consistent previews in one interface.
            </p>
            <div class="hero-actions">
              <button type="button" class="hero-primary" (click)="goToDashboard()">
                Create New Session
              </button>
              <button type="button" class="hero-secondary" (click)="goToDashboard()">
                Explore Your Models
              </button>
            </div>
            <div class="hero-meta">
              <span>Real-time latency monitoring</span>
              <span class="dot"></span>
              <span>Generation history included</span>
            </div>
          </section>

          <section class="panel-grid" aria-label="Key Features">
            <article class="panel primary">
              <header>
                <h2>Visual Generation Flow</h2>
                <span class="badge">Live</span>
              </header>
              <p>
                Create a clear inference flow: input, model, output and
                post-processing in one panel, ready to share.
              </p>
              <div class="panel-preview">
                <div class="step -in">Prompt · Input</div>
                <div class="step -model">Replicate Model</div>
                <div class="step -out">Output · Preview</div>
              </div>
            </article>

            <article class="panel">
              <header>
                <h3>Prompt Presets</h3>
              </header>
              <p>
                Save reusable presets for your use cases: marketing, product,
                images, audio and more.
              </p>
              <ul class="chips">
                <li>Product shot</li>
                <li>Portrait clean-up</li>
                <li>UI concept</li>
              </ul>
            </article>

            <article class="panel">
              <header>
                <h3>Secure Environment</h3>
              </header>
              <p>
                All keys remain on the backend, the frontend only orchestrates
                calls to Replicate securely.
              </p>
              <div class="status-pill">
                <span class="status-dot"></span>
                Backend Connected
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      color: #f5f5ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .dashboard-shell {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      height: 100vh;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
      color: #f9fafb;
      overflow: hidden;
    }

    .sidebar {
      backdrop-filter: blur(20px);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95));
      border-right: 1px solid rgba(148, 163, 184, 0.2);
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #a855f7, #22d3ee, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .brand-title {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }

    .nav-item {
      border: none;
      background: transparent;
      color: #cbd5f5;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
    }

    .nav-item:hover {
      background: rgba(148, 163, 184, 0.15);
      color: #e5edff;
      transform: translateY(-1px);
    }

    .nav-item-active {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0));
      color: #f9fafb;
      box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.5);
    }

    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
    }

    .nav-icon {
      font-size: 1rem;
    }

    .nav-icon-svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }

    .sidebar-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.6rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.35);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 0, #e5e7eb, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0b1120;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .user-email {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .btn-logout {
      border-radius: 999px;
      border: 1px solid rgba(248, 113, 113, 0.7);
      background: rgba(30, 64, 175, 0.4);
      color: #fecaca;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(220, 38, 38, 0.75);
      box-shadow: 0 10px 25px rgba(248, 113, 113, 0.4);
      transform: translateY(-1px);
    }

    .dashboard-main {
      padding: 1.75rem 2rem;
      overflow-y: auto;
      position: relative;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
      position:sticky;
    }

    .page-title {
      margin: 0;
      font-size: 1.6rem;
      letter-spacing: 0.03em;
      font-weight: 600;
    }

    .page-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: #cbd5f5;
      max-width: 420px;
    }

    .home-grid {
      display: grid;
      grid-template-columns: minmax(0, 3fr) minmax(0, 2.4fr);
      gap: 2.25rem;
      color: #e5e7eb;
    }

    .hero {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      background: radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.14), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(148, 163, 184, 0.4);
      color: #9ca3af;
    }

    .hero-title {
      font-size: clamp(2.1rem, 2.8vw, 2.6rem);
      line-height: 1.1;
      font-weight: 600;
      letter-spacing: -0.04em;
      color: #f9fafb;
      margin: 0;
    }

    .gradient-text {
      display: block;
      background: linear-gradient(120deg, #22c55e, #22d3ee, #6366f1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-subtitle {
      font-size: 0.98rem;
      color: #9ca3af;
      max-width: 32rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 0.25rem;
    }

    .hero-primary,
    .hero-secondary {
      border-radius: 999px;
      padding: 0.7rem 1.4rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .hero-primary {
      background: linear-gradient(120deg, #22c55e, #22d3ee, #4f46e5);
      color: #020617;
      box-shadow: 0 16px 35px rgba(56, 189, 248, 0.6);
    }

    .hero-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 50px rgba(56, 189, 248, 0.7);
    }

    .hero-secondary {
      background-color: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      border: 1px solid rgba(148, 163, 184, 0.8);
    }

    .hero-secondary:hover {
      background-color: rgba(15, 23, 42, 0.95);
      border-color: rgba(248, 250, 252, 0.8);
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.78rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .hero-meta .dot {
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background-color: #4b5563;
    }

    .panel-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr);
      gap: 1rem;
    }

    .panel {
      border-radius: 18px;
      padding: 1.25rem 1.35rem;
      background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.35), rgba(15, 23, 42, 0.96));
      border: 1px solid rgba(148, 163, 184, 0.4);
      box-shadow:
        0 18px 40px rgba(15, 23, 42, 0.85),
        0 0 0 1px rgba(15, 23, 42, 0.9);
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .panel.primary {
      grid-column: 1 / -1;
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.24), rgba(30, 64, 175, 0.9));
    }

    .panel header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .panel h2,
    .panel h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #f9fafb;
    }

    .badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.13em;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(191, 219, 254, 0.85);
      color: #bfdbfe;
    }

    .panel p {
      font-size: 0.85rem;
      color: #cbd5f5;
    }

    .panel.primary p {
      color: #e5e7eb;
    }

    .panel-preview {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.6rem;
      font-size: 0.75rem;
    }

    .step {
      flex: 1;
      padding: 0.55rem 0.6rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(191, 219, 254, 0.5);
      color: #e5e7eb;
      white-space: nowrap;
    }

    .step.-in {
      border-style: dashed;
    }

    .step.-model {
      background: linear-gradient(120deg, rgba(22, 163, 74, 0.1), rgba(96, 165, 250, 0.5));
    }

    .step.-out {
      border-style: dashed;
      opacity: 0.9;
    }

    .chips {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.3rem;
      padding: 0;
    }

    .chips li {
      font-size: 0.75rem;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.7);
      color: #e5e7eb;
    }

    .status-pill {
      margin-top: 0.4rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(52, 211, 153, 0.8);
      color: #bbf7d0;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: radial-gradient(circle, #22c55e, #16a34a);
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.95);
    }

    .dashboard-main::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }

    .dashboard-main::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.6);
      border-radius: 999px;
    }

    .dashboard-main::-webkit-scrollbar-track {
      background: transparent;
    }

    @media (max-width: 960px) {
      .dashboard-shell {
        grid-template-columns: 220px minmax(0, 1fr);
      }

      .home-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard-shell {
        grid-template-columns: minmax(0, 1fr);
        min-height: auto;
      }

      .sidebar {
        display: none;
      }

      .dashboard-main {
        padding: 1rem 16px 1.5rem;
      }

      .topbar {
        flex-direction: column;
        gap: 12px;
      }

      .home-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .hero-primary,
      .hero-secondary {
        width: 100%;
        justify-content: center;
        display: inline-flex;
        align-items: center;
        padding: 12px 16px;
        font-size: 0.95rem;
      }

      .page-title {
        font-size: 1.75rem;
      }

      .page-subtitle {
        font-size: 0.8rem;
        max-width: 100%;
      }

      .hero-label {
        font-size: 0.7rem;
        padding: 0.15rem 0.5rem;
      }

      .hero-title {
        font-size: 1.8rem;
      }

      .hero-desc {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-main {
        padding: 12px;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .page-subtitle {
        font-size: 0.75rem;
      }

      .hero-title {
        font-size: 1.4rem;
      }

      .hero-desc {
        font-size: 0.95rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .hero-primary,
      .hero-secondary {
        padding: 10px 12px;
        font-size: 0.9rem;
      }

      .chips li {
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
      }

      .status-pill {
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.authService.getCurrentUser();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

