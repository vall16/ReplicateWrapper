import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-shell">
      <div class="login-grid">
        <section class="login-hero">
          <div class="hero-glow"></div>
          <div class="logo-orb">
            <div class="logo-inner">RX</div>
          </div>
          <h1 class="hero-title">Access your AI workspace</h1>
          <p class="hero-subtitle">
            Manage credits, transactions, and Replicate wrapper calls from a single console.
          </p>
          <ul class="hero-points">
            <li><span class="point-icon">◆</span> Real-time token balance dashboard</li>
            <li><span class="point-icon">◆</span> Secure and transparent payments</li>
            <li><span class="point-icon">◆</span> Complete transaction history</li>
          </ul>
        </section>

        <section class="login-panel">
          <div class="panel-glow"></div>
          <div class="panel-border"></div>
          <header class="panel-header">
            <h2>Login</h2>
            <p>Sign in with your credentials to continue.</p>
          </header>

          <form (ngSubmit)="login()" *ngIf="!isLoading" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="your@email.com"
                required
              />
              <div class="input-glow"></div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <div class="input-glow"></div>
            </div>

            <button type="submit" class="btn-primary">
              <span class="btn-text">Sign in</span>
              <span class="btn-arrow">→</span>
            </button>
          </form>

          <div *ngIf="isLoading" class="loading">
            <span class="loading-text">Authenticating</span>
            <span class="dots">
              <span></span><span></span><span></span>
            </span>
          </div>

          <div *ngIf="error" class="feedback feedback-error">
            {{ error }}
          </div>

          <div class="oauth-divider">
            <span>or</span>
          </div>

          <button type="button" class="btn-google" (click)="loginWithGoogle()">
            <img src="assets/google.png" />
            Continue with Google
          </button>

          <div class="panel-footer">
            <span>Don't have an account?</span>
            <button class="btn-ghost" type="button" (click)="goToRegister()">
              Sign up <span class="btn-arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
    @keyframes borderFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes blink {
      0%, 80%, 100% { opacity: 0; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-3px); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    :host {
      display: block;
      min-height: 100vh;
      color: #e5e7eb;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .login-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      position: relative;
      background: radial-gradient(1200px 500px at 20% -10%, rgba(124, 58, 237, 0.2), transparent),
                  radial-gradient(1000px 400px at 80% 0%, rgba(6, 182, 212, 0.15), transparent),
                  rgba(10, 10, 20, 0.95);
      overflow: hidden;
    }

    .login-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1.5px, transparent 1.5px);
      background-size: 32px 32px;
      pointer-events: none;
    }

    .login-grid {
      width: 100%;
      max-width: 980px;
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 3rem;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .login-hero {
      position: relative;
      animation: slideInUp 0.6s ease-out;
    }

    .hero-glow {
      position: absolute;
      top: -100px;
      left: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%);
      pointer-events: none;
    }

    .logo-orb {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
      animation: float 3s ease-in-out infinite;
    }

    .logo-inner {
      width: 74%;
      height: 74%;
      border-radius: 10px;
      background: rgba(10, 10, 20, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #c4b5fd;
      text-transform: uppercase;
    }

    .hero-title {
      margin: 0 0 0.75rem;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #c4b5fd, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      margin: 0 0 1.2rem;
      font-size: 1rem;
      line-height: 1.6;
      color: #94a3b8;
      max-width: 420px;
    }

    .hero-points {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .hero-points li {
      font-size: 0.9rem;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      animation: slideInUp 0.5s ease-out backwards;
    }
    .hero-points li:nth-child(1) { animation-delay: 0.1s; }
    .hero-points li:nth-child(2) { animation-delay: 0.2s; }
    .hero-points li:nth-child(3) { animation-delay: 0.3s; }

    .point-icon {
      color: #6366f1;
      font-size: 0.6rem;
    }

    .login-panel {
      position: relative;
      border-radius: 1.2rem;
      padding: 2.5rem 2rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden;
      max-width: 380px;
      margin-left: auto;
      animation: slideInUp 0.6s ease-out 0.1s backwards;
    }

    .panel-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.08), transparent 60%);
      pointer-events: none;
    }

    .panel-border {
      position: absolute;
      inset: 0;
      border-radius: 1.2rem;
      padding: 1px;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(6, 182, 212, 0.3), rgba(124, 58, 237, 0.1));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .panel-header h2 {
      margin: 0;
      color: #e5e7eb;
      font-size: 1.1rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .panel-header p {
      margin: 0.35rem 0 1.3rem;
      font-size: 0.8rem;
      color: #64748b;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      position: relative;
    }

    label {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 500;
      letter-spacing: 0.03em;
    }

    input {
      width: 100%;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #334155;
      background: rgba(2, 6, 23, 0.6);
      color: #e5e7eb;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      position: relative;
      z-index: 1;
    }

    input::placeholder {
      color: #475569;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.1);
    }

    .btn-primary {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(99, 102, 241, 0.45);
    }
    .btn-primary:active {
      transform: translateY(0) scale(0.98);
    }

    .btn-arrow {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    .btn-primary:hover .btn-arrow,
    .btn-ghost:hover .btn-arrow {
      transform: translateX(4px);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      padding: 1rem 0;
    }

    .loading-text {
      color: #94a3b8;
      font-size: 0.85rem;
    }

    .dots span {
      display: inline-block;
      width: 5px;
      height: 5px;
      background: #6366f1;
      border-radius: 50%;
      animation: blink 1s infinite;
      margin: 0 1px;
    }
    .dots span:nth-child(2) { animation-delay: 0.2s; }
    .dots span:nth-child(3) { animation-delay: 0.4s; }

    .feedback {
      margin-top: 0.8rem;
      font-size: 0.8rem;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      animation: fadeIn 0.3s ease-out;
    }

    .feedback-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    .oauth-divider {
      margin: 1.2rem 0 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #64748b;
    }

    .oauth-divider::before,
    .oauth-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #334155;
    }

    .btn-google {
      margin-top: 0.25rem;
      width: 100%;
      padding: 0.65rem 0.9rem;
      border-radius: 8px;
      border: 1px solid #334155;
      background: rgba(2, 6, 23, 0.4);
      color: #cbd5e1;
      font-size: 0.88rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      transition: all 0.2s ease;
    }

    .btn-google img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }

    .btn-google:hover {
      background: rgba(30, 41, 59, 0.8);
      border-color: #475569;
      transform: translateY(-1px);
    }

    .panel-footer {
      margin-top: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.8rem;
      color: #64748b;
    }

    .btn-ghost {
      border-radius: 8px;
      border: 1px solid #334155;
      background: transparent;
      color: #cbd5e1;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      transition: all 0.2s ease;
    }

    .btn-ghost:hover {
      border-color: #6366f1;
      color: #c4b5fd;
      transform: translateY(-1px);
    }

    @media (max-width: 900px) {
      .login-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.5rem;
      }
      .login-panel {
        margin: 0 auto;
      }
      .login-hero { display: none; }
    }

    @media (max-width: 640px) {
      .login-shell { padding: 1.5rem 1.1rem; }
      .login-panel { padding: 2rem 1.5rem; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.isLoading = false;
        this.error = error.error?.detail || 'Login error';
      }
    );
  }

  loginWithGoogle() {
    const google = (window as any).google;

    if (!google || !google.accounts || !google.accounts.id) {
      this.error = 'Google Sign-In is not configured correctly.';
      return;
    }

    const win = window as any;
    if (!win.__repliGoogleInitialized) {
      win.__repliGoogleInitialized = true;

      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          const idToken = response.credential;

          this.authService.loginWithGoogle(idToken).subscribe(
            () => {
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            },
            (error: any) => {
              this.isLoading = false;
              this.error = error.error?.detail || 'Error during Google login.';
            }
          );
        }
      });
    }

    this.isLoading = true;
    this.error = '';
    google.accounts.id.prompt();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
