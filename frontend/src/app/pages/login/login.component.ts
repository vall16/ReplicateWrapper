import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';


// ...existing code...
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-shell">
      <div class="login-grid">
        <section class="login-hero">
          <div class="logo-orb">
            <div class="logo-inner">RX</div>
          </div>
          <h1 class="hero-title">Access your AI workspace</h1>

          <p class="hero-subtitle">
            Manage credits, transactions, and Replicate wrapper calls from a single console.

          </p>
          <ul class="hero-points">
<li>Real-time token balance dashboard</li>
  <li>Secure and transparent payments</li>
  <li>Complete transaction history</li>

          </ul>
        </section>

        <section class="login-panel glass-card">
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
            </div>

            <button type="submit" class="btn-primary">
              Sign in

            </button>
          </form>

          <div *ngIf="isLoading" class="loading">
            Authenticating…

          </div>

          <div *ngIf="error" class="feedback feedback-error">
            {{ error }}
          </div>

          <div class="oauth-divider">
            <span>or</span>
          </div>

          <button type="button" class="btn-google" (click)="loginWithGoogle()">
            <!-- <span class="google-logo"></span> -->
            <img src="assets/google.png"  />

            Continue with Google

          </button>

          <div class="panel-footer">
            <span>Don't have an account?</span>
            <button class="btn-ghost" type="button" (click)="goToRegister()">
              Sign up
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      color: #1f2937;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .login-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      position: relative;
      background-color: #f1f5f9;
      overflow: hidden;
    }

    .login-shell::before {
      content: '';
      position: absolute;
      inset: -5%;
      background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      pointer-events: none;
    }

    .login-shell::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, 
        rgba(15, 23, 42, 0.85) 0%,
        rgba(15, 23, 42, 0.65) 25%,
        rgba(255, 255, 255, 0.95) 50%,
        rgba(255, 255, 255, 0.98) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      pointer-events: none;
    }

    .login-grid {
      width: 100%;
      max-width: 980px;
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 3rem; /* Aumentato leggermente per dare respire */
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .login-hero {
      color: #1f2937;
    }

    .logo-orb {
      width: 58px;
      height: 58px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    }

    .logo-inner {
      width: 76%;
      height: 76%;
      border-radius: 6px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #6366f1;
      text-transform: uppercase;
    }

    .hero-title {
      margin: 0 0 0.5rem;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #0f172a;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .hero-subtitle {
      margin: 0 0 1rem;
      font-size: 1.05rem;
      line-height: 1.5;
      color: #1f2937;
      max-width: 420px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      font-weight: 500;
    }

    .hero-points {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #111827;
      font-weight: 500;
    }

    .hero-points li::before {
      content: "•";
      display: inline-block;
      margin-right: 0.4rem;
      color: #6366f1;
      font-size: 1.2rem;
      vertical-align: middle;
    }

    .glass-card {
      position: relative;
      border-radius: 1.5rem;
      padding: 2.5rem 2.2rem;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      overflow: hidden;
    }

    .glass-card::before {
      display: none;
    }

    .glass-card > * {
      position: relative;
      z-index: 1;
    }

    .login-panel {
      max-width: 380px;
      margin-left: auto;
    }

    .panel-header h2 {
      margin: 0;
      color: #e5e8ecff;
      font-size: 1.1rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .panel-header p {
      margin: 0.35rem 0 1.1rem;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    label {
      font-size: 0.8rem;
      color: #374151;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #1f2937;
      font-size: 0.9rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    input::placeholder {
      color: #9ca3af;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 1px #6366f1;
    }

    .btn-primary {
      margin-top: 0.3rem;
      width: 100%;
      padding: 0.65rem 0.9rem;
      border-radius: 6px;
      border: none;
      background: #6366f1;
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .btn-primary:hover {
      background-color: #4f46e5;
      transform: translateY(-1px);
    }

    .loading {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .feedback {
      margin-top: 0.8rem;
      font-size: 0.8rem;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
    }

    .feedback-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
    }

    .oauth-divider {
      margin: 1rem 0 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #6b7280;
    }

    .oauth-divider::before,
    .oauth-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .btn-google {
      margin-top: 0.25rem;
      width: 100%;
      padding: 0.6rem 0.9rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #374151;
      font-size: 0.88rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .btn-google img {
      width: 16px;   /* 👈 più piccola */
      height: 16px;
      object-fit: contain;
    }

    .btn-google:hover {
      background-color: #f9fafb;
      transform: translateY(-1px);
    }

    .google-logo {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background:
        linear-gradient(45deg, #4285f4 0 50%, transparent 50%),
        linear-gradient(-45deg, #34a853 0 50%, transparent 50%),
        radial-gradient(circle at 30% 30%, #fbbc05 0 40%, transparent 41%),
        radial-gradient(circle at 70% 70%, #ea4335 0 40%, transparent 41%);
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.9);
    }

    .panel-footer {
      margin-top: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .btn-ghost {
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #374151;
      padding: 0.35rem 0.75rem;
      font-size: 0.78rem;
      cursor: pointer;
      font-weight: 500;
      transition: border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
    }

    .btn-ghost:hover {
      border-color: #9ca3af;
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
    }

    @media (max-width: 640px) {
      .login-shell {
        padding: 1.5rem 1.1rem;
      }

      .hero-title {
        font-size: 1.6rem;
      }
    }
  `]
})
// ...existing code...
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

    // Evita inizializzazioni multiple della Google Identity API
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



