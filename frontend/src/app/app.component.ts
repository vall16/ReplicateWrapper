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
          <nav class="nav-links hide-mobile">
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

          <div class="ai-switch hide-mobile">
            <button [class.active]="activeCTA==='image'" (click)="setActiveCTA('image')" routerLink="/generate">
              ✨ Image
            </button>
            <button [class.active]="activeCTA==='video'" (click)="setActiveCTA('video')" routerLink="/video-generate">
              🎬 Video
            </button>
          </div>

          <div class="auth-buttons hide-mobile">
            <button class="btn-login" routerLink="/login">Login</button>
            <button class="btn-register" routerLink="/register">Sign up</button>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle show-mobile" (click)="toggleMobileMenu()" [attr.aria-label]="mobileMenuOpen ? 'Close menu' : 'Open menu'">
            <svg *ngIf="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="menu-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg *ngIf="mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="menu-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile Menu -->
      <nav class="mobile-menu show-mobile" [class.active]="mobileMenuOpen">
        <div class="mobile-menu-header">
          <h2>Menu</h2>
          <button (click)="closeMobileMenu()" class="close-btn" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul class="mobile-menu-items">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMobileMenu()">Home</a></li>
          <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()">Dashboard</a></li>
          <li><a routerLink="/gallery" routerLinkActive="active" (click)="closeMobileMenu()">Gallery</a></li>
          <li><a routerLink="/store" routerLinkActive="active" (click)="closeMobileMenu()">Store</a></li>
          <li class="divider"></li>
          <li>
            <button class="mobile-ai-switch" [class.image-active]="activeCTA==='image'" (click)="setActiveCTA('image'); closeMobileMenu()" routerLink="/generate">
              ✨ Image
            </button>
          </li>
          <li>
            <button class="mobile-ai-switch" [class.video-active]="activeCTA==='video'" (click)="setActiveCTA('video'); closeMobileMenu()" routerLink="/video-generate">
              🎬 Video
            </button>
          </li>
          <li class="divider"></li>
          <li><button class="mobile-auth-btn" routerLink="/login" (click)="closeMobileMenu()">Login</button></li>
          <li><button class="mobile-auth-btn primary" routerLink="/register" (click)="closeMobileMenu()">Sign up</button></li>
        </ul>
      </nav>
      
      <div class="mobile-menu-overlay show-mobile" [class.open]="mobileMenuOpen"
 [class.active]="mobileMenuOpen" (click)="closeMobileMenu()"></div>

      <main class="app-main">
        <section class="content-surface">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    /* --- Keyframe Animations --- */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
      }
      50% {
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.8);
      }
    }

    @keyframes floatUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes navLinkStagger {
      from {
        opacity: 0;
        transform: translateX(-15px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* --- base styles --- */
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; background-color: var(--color-bg-primary); background-image: radial-gradient(circle, var(--color-bg-tertiary) 1.5px, transparent 1.5px); background-size: 32px 32px; color: var(--color-text-primary); position: relative; overflow: hidden; transition: background-color 0.3s ease, color 0.3s ease; }
    
    .app-header {
      /* position: sticky; */
      position: relative;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      /* backdrop-filter: blur(20px);
      background: var(--color-header-bg);
      border-bottom: 1px solid var(--color-border); */

      background: radial-gradient(1200px 400px at 20% -10%, rgba(124, 58, 237, 0.25), transparent),
              radial-gradient(1000px 300px at 80% 0%, rgba(6, 182, 212, 0.2), transparent),
              rgba(10, 10, 20, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.08);

      box-shadow: var(--shadow-glow);
      transition: all 0.3s ease;
      animation: slideDown 0.5s ease-out;

      @keyframes borderFlow {
  0% { background-position: 0% }
  100% { background-position: 200% }
      }

    }

    /* .app-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(124, 58, 237, 0.8),
    rgba(6, 182, 212, 0.8),
    transparent
  );

  filter: blur(2px);
  opacity: 0.7;
} */

/* .app-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(124, 58, 237, 0.8),
    rgba(6, 182, 212, 0.8),
    transparent
  );

  filter: blur(2px);
  opacity: 0.7;
} */

.app-header::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 4px;

  background: linear-gradient(
    90deg,
    rgba(124, 58, 237, 0.9) 0%,
    rgba(6, 182, 212, 0.7) 35%,
    rgba(6, 182, 212, 0.35) 65%,
    rgba(124, 58, 237, 0.1) 85%,
    transparent 100%
  );

  /* 🔥 fa diventare il bordo più “fine” a destra */
  mask-image: linear-gradient(to right, black 55%, transparent 100%);

  /* glow controllato */
  filter: blur(3px);
  opacity: 0.9;

  /* effetto dinamico */
  background-size: 200% 100%;
  animation: borderFlow 4s linear infinite;
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
      position: relative;
    }

    .ai-switch button:hover {
      transform: translateY(-2px);
      color: var(--color-text-primary);
    }

    .ai-switch button:active {
      transform: scale(0.98);
    }

    .ai-switch button.active {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: white;
      box-shadow: 0 4px 12px rgba(99,102,241,0.4);
      animation: floatUp 0.4s ease-out;
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
      position: relative;
      overflow: hidden;
    }

    .theme-toggle::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }

    .theme-toggle:active::before {
      width: 300px;
      height: 300px;
    }

    .theme-toggle:hover {
      background: var(--color-bg-secondary);
      transform: scale(1.1) rotate(20deg);
    }

    .theme-icon {
      width: 1.4rem;
      height: 1.4rem;
      transition: transform 0.3s ease;
    }

    .theme-toggle:hover .theme-icon {
      animation: spin 0.4s ease-in-out;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(20deg); }
    }

    .logo { display: flex; align-items: center; gap: 0.75rem; animation: floatUp 0.6s ease-out; }
    
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
      transition: all 0.3s ease;
    }

    .logo-mark:hover {
      transform: scale(1.05) rotate(5deg);
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.8);
    }

    .logo-text { display: flex; flex-direction: column; gap: 0.1rem; }
    /* .logo-title { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; color: var(--color-gradient-start); transition: all 0.3s ease; } */
    .logo-title {
      font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, #c084fc, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  transform: skewX(-10deg); /* 👈 inclinazione verso destra */
  display: inline-block; /* importante per evitare glitch */

}
    .logo-subtitle { font-size: 0.75rem; color: var(--color-text-tertiary); }
    
    .header-left { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .header-right { display: flex; align-items: center; gap: 0.85rem; }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.8rem;
      margin-right: auto;
    }

    /* .nav-links a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      animation: navLinkStagger 0.5s ease-out backwards;
      position: relative;
    } */

    .nav-links a {
  background: transparent;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}


    .nav-links a:nth-child(1) { animation-delay: 0.1s; }
    .nav-links a:nth-child(2) { animation-delay: 0.2s; }
    .nav-links a:nth-child(3) { animation-delay: 0.3s; }
    .nav-links a:nth-child(4) { animation-delay: 0.4s; }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--color-gradient-start), var(--color-gradient-end));
      transition: width 0.3s ease;
    }

    .nav-links a:hover { 
      color: var(--color-text-primary);
      background-color: var(--color-bg-tertiary);
      transform: translateY(-2px);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    .nav-links a.active { 
      color: var(--color-gradient-end);
      background-color: rgba(99, 102, 241, 0.08);
    }

    .nav-links a.active::after {
      width: 100%;
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
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); 
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .primary-cta::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
    }

    .primary-cta:hover { 
      background-color: var(--color-accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
    }

    .primary-cta:active { 
      transform: translateY(0) scale(0.98);
      background-color: var(--color-accent-active); 
    }

    .btn-login, .btn-register { 
      border-radius: 6px; 
      padding: 0.55rem 1rem; 
      font-size: 0.9rem; 
      font-weight: 500; 
      cursor: pointer; 
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); 
      border: none;
      position: relative;
      overflow: hidden;
    }

    .btn-login {
      background: transparent;
      color: var(--color-text-tertiary);
      font-weight: 500;
      animation: floatUp 0.6s ease-out;
    }

    .btn-login:hover {
      color: var(--color-text-primary);
      background: var(--color-bg-tertiary);
      transform: translateY(-1px);
    }

    .btn-login:active {
      transform: scale(0.98);
    }

    /* .btn-register {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(99,102,241,0.4);
      font-weight: 600;
      padding: 0.55rem 1.2rem;
      border-radius: 999px;
      animation: floatUp 0.6s ease-out 0.1s backwards;
    }

    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(99,102,241,0.6);
    }

    .btn-register:active {
      transform: translateY(0) scale(0.97);
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
    } */

    /* .btn-register {
  background: transparent;
  border: 1px solid rgba(124, 58, 237, 0.6);
  color: white;
  border-radius: 10px;
  padding: 0.5rem 1.2rem;
  position: relative;
}

.btn-register::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  opacity: 0.15;
}

.btn-register:hover {
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.6);
} */

  .btn-register {
  position: relative;
  padding: 0.55rem 1.4rem;
  border-radius: 12px;
  background: rgba(15, 15, 25, 0.9);
  color: #fff;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  z-index: 1;
  overflow: hidden;
}

/* BORDO GRADIENT REALE */
.btn-register::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 12px;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);

  -webkit-mask: 
    linear-gradient(#000 0 0) content-box, 
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
}

/* GLOW ESTERNO */
.btn-register::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 12px;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  filter: blur(12px);
  opacity: 0.6;
  z-index: -1;
}

/* HOVER */
.btn-register:hover {
  transform: translateY(-1px);
}

.btn-register:hover::after {
  opacity: 0.9;
}

    /* --- active CTA style --- */
    .primary-cta.active {
      background-color: var(--color-gradient-end);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
      border: 2px solid #1e40af;
      transform: translateY(-1px);
      animation: glowPulse 2s ease-in-out infinite;
    }

    .app-main { flex: 1; display: flex; align-items: stretch; justify-content: center; padding: 0; position: relative; }
    .content-surface { position: relative; z-index: 1; width: 100%; margin: 0; border-radius: 0; padding: 0; background: transparent; box-shadow: none; border: none; backdrop-filter: none; display: flex; flex-direction: column; animation: fadeIn 0.4s ease-out; }

    .mobile-menu-toggle {
  position: relative;
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;

  background:
    radial-gradient(circle at top left,
      rgba(124,58,237,0.25),
      transparent 60%),
    rgba(15,15,25,0.85);

  backdrop-filter: blur(14px);

  cursor: pointer;
  overflow: hidden;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

/* glow */
.mobile-menu-toggle::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 14px;

  background: linear-gradient(
    135deg,
    rgba(124,58,237,0.9),
    rgba(6,182,212,0.9)
  );

  opacity: 0.25;
  filter: blur(10px);

  z-index: 0;
  transition: opacity 0.25s ease;
}

/* animated shine */
.mobile-menu-toggle::after {
  content: "";
  position: absolute;
  top: -40%;
  left: -120%;

  width: 80%;
  height: 180%;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.18),
    transparent
  );

  transform: rotate(20deg);
  transition: left 0.6s ease;
}

.mobile-menu-toggle:hover {
  transform: translateY(-2px) scale(1.03);

  border-color: rgba(124,58,237,0.5);

  box-shadow:
    0 0 20px rgba(124,58,237,0.35),
    0 0 40px rgba(6,182,212,0.15);
}

.mobile-menu-toggle:hover::before {
  opacity: 0.45;
}

.mobile-menu-toggle:hover::after {
  left: 140%;
}

.mobile-menu-toggle:active {
  transform: scale(0.96);
}

.menu-icon {
  position: relative;
  z-index: 2;

  width: 24px;
  height: 24px;

  color: white;

  transition:
    transform 0.25s ease,
    color 0.25s ease;
}

.mobile-menu-toggle:hover .menu-icon {
  transform: scale(1.08);
}

/* stato OPEN */
.mobile-menu-toggle.open {
  border-color: rgba(6,182,212,0.6);

  box-shadow:
    0 0 18px rgba(6,182,212,0.35),
    0 0 36px rgba(124,58,237,0.2);
}

    /* Mobile Menu Styles */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: -100%;
      width: 80%;
      max-width: 280px;
      height: 100vh;
      background: var(--color-bg-primary);
      border-right: 1px solid var(--color-border);
      z-index: 999;
      transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-top: 60px;
    }

    .mobile-menu.active {
      left: 0;
      box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
    }

    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
      position: fixed;
      top: 0;
      left: -100%;
      width: 80%;
      max-width: 280px;
      background: var(--color-bg-primary);
      z-index: 1000;
      transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .mobile-menu.active ~ .mobile-menu-header,
    .mobile-menu.active + .mobile-menu-header {
      left: 0;
    }

    .mobile-menu-header h2 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--color-text-primary);
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-primary);
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .close-btn:hover {
      background-color: var(--color-bg-tertiary);
    }

    .close-btn svg {
      width: 20px;
      height: 20px;
    }

    .mobile-menu-items {
      list-style: none;
      padding: 0;
      margin: 0;
      padding-top: 8px;
    }

    .mobile-menu-items li {
      padding: 0;
    }

    .mobile-menu-items a,
    .mobile-menu-items .mobile-auth-btn {
      display: block;
      padding: 12px 20px;
      color: var(--color-text-secondary);
      text-decoration: none;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-radius: 6px;
      margin: 0 8px;
      text-align: left;
    }

    .mobile-menu-items a:hover,
    .mobile-menu-items .mobile-auth-btn:hover {
      color: var(--color-text-primary);
      background-color: rgba(99, 102, 241, 0.1);
    }

    .mobile-menu-items a.active {
      color: var(--color-gradient-end);
      background-color: rgba(99, 102, 241, 0.08);
    }

    .mobile-menu-items .divider {
      height: 1px;
      background: var(--color-border);
      margin: 8px 12px;
    }

    .mobile-ai-switch {
      width: 100%;
      padding: 12px 20px;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      margin: 0 8px;
      transition: all 0.2s ease;
      text-align: left;
    }

    .mobile-ai-switch:hover {
      background-color: rgba(99, 102, 241, 0.1);
      color: var(--color-text-primary);
    }

    .mobile-ai-switch.image-active,
    .mobile-ai-switch.video-active {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: white;
    }

    .mobile-auth-btn {
      border-radius: 6px;
      margin: 4px 8px;
    }

    .mobile-auth-btn.primary {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: white !important;
    }

    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      z-index: 998;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Header adjustments for mobile */
    @media (max-width: 768px) {
      .app-header {
        padding: 12px 16px;
        gap: 12px;
      }

      .logo-mark {
        width: 36px;
        height: 36px;
        font-size: 1rem;
      }

      .logo-text {
        display: none;
      }

      .logo {
        gap: 0;
      }

      .header-right {
        gap: 8px;
      }

      .theme-toggle {
        width: 40px;
        height: 40px;
      }

      .theme-icon {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 900px) {
      .app-header { padding-inline: 1.25rem; gap: 1rem; }
      .header-right { gap: 0.75rem; }
      .primary-cta { padding-inline: 1.1rem; }
      .app-main { padding-inline: 0; }
      .content-surface { padding: 0; border-radius: 0; }
    }
  `]
})
export class AppComponent {
  title = 'repli-frontend';
  activeCTA: 'image' | 'video' | null = null;
  mobileMenuOpen = false;

  constructor(public themeService: ThemeService) {}

  setActiveCTA(type: 'image' | 'video') {
    this.activeCTA = type;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}