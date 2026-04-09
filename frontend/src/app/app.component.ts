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

          <!-- <div class="cta-group">
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
              routerLink="/video-generate"> 
              🎬 AI Video
            </button>

            
          </div> -->
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
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px); background-size: 32px 32px; color: #1f2937; position: relative; overflow: hidden; }
    /* .app-header { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2.5rem; backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.92); border-bottom: 1px solid rgba(229, 231, 235, 0.8); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08); } */
    .app-header {
  position: sticky;
  top: 0;
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem 2rem;

  .ai-switch {
  display: flex;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 4px;
}

.ai-switch button {
  border: none;
  background: transparent;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-switch button.active {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  color: white;
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
}

  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.75);

  border-bottom: 1px solid rgba(255,255,255,0.2);

  /* ✨ glow moderno */
  box-shadow: 
    0 8px 30px rgba(0,0,0,0.08),
    0 0 40px rgba(99,102,241,0.15);
}
    .logo { display: flex; align-items: center; gap: 0.75rem; }
    /* .logo-mark { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3); font-weight: 700; color: #ffffff; font-size: 1.25rem; } */
    .logo-mark {
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}
    .logo-text { display: flex; flex-direction: column; gap: 0.1rem; }
    .logo-title { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; color: #6366f1; }
    .logo-subtitle { font-size: 0.75rem; color: #6b7280; }
    .header-left { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .header-right { display: flex; align-items: center; gap: 0.85rem; }
    /* .nav-links { display: flex; align-items: center; gap: 1.8rem; font-size: 0.95rem; } */
    /* aggiungi questo nel tuo styles array */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.8rem;   /* già presente */
  /* margin-right: 2rem; spazio extra verso il gruppo AI */
  margin-right: auto; 
}
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4b5563;
      text-decoration: none;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      transition: color 0.2s ease, background-color 0.2s ease;
    }
    .nav-links a:hover { color: #111827; background-color: #f3f4f6; }
    .nav-links a.active { color: #3b82f6; background-color: rgba(99, 102, 241, 0.08); }
    .icon { width: 1.4em; height: 1.4em; position: relative; top: 1px; }
    .cta-group { display: flex; align-items: center; gap: 0.75rem; }
    .auth-buttons { display: flex; align-items: center; gap: 0.75rem; margin-left: 1.5rem; }
    /* --- CTA buttons --- */
    .primary-cta { border: none; border-radius: 6px; padding: 0.55rem 1.4rem; font-size: 0.9rem; font-weight: 500; color: #ffffff; cursor: pointer; background: #6366f1; transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.2s ease; white-space: nowrap; }
    .primary-cta:hover { background-color: #4f46e5; transform: translateY(-1px); }
    .primary-cta:active { transform: translateY(0); background-color: #4338ca; }
    .btn-login, .btn-register { border-radius: 6px; padding: 0.55rem 1rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, transform 0.15s ease; }
    /* .btn-login { border: 1px solid #d1d5db; background: transparent; color: #4b5563; }
    .btn-login:hover { background: #f3f4f6; transform: translateY(-1px); }
     */
    .btn-login {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
}

.btn-login:hover {
  color: #111827;
  background: rgba(0,0,0,0.05);
}
    /* .btn-register { background: #6366f1; color: #ffffff; border: none; }
    .btn-register:hover { background: #4f46e5; transform: translateY(-1px); } */


    .btn-register {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  box-shadow: 0 6px 18px rgba(99,102,241,0.4);
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border-radius: 999px; /* 🔥 pill shape */
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