import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-shell">
      <div class="register-card glass-card">
        <header class="card-header">
          <div>
            <h1>Registrazione</h1>
            <p class="subtitle">
              Crea il tuo account per iniziare a gestire i token dei modelli Replicate.
            </p>
          </div>
        </header>

        <form (ngSubmit)="register()" *ngIf="!isLoading" class="form-body">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="tuoindirizzo@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Il tuo username"
              required
            />
          </div>

          <div class="form-row">
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
              <small>Minimo 8 caratteri</small>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Conferma password</label>
              <input
                id="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-primary">Crea account</button>
        </form>

        <div *ngIf="isLoading" class="loading">
          Registrazione in corso…
        </div>

        <div *ngIf="error" class="feedback feedback-error">
          {{ error }}
        </div>

        <div *ngIf="success" class="feedback feedback-success">
          {{ success }}
        </div>

        <div class="divider">
          <span>oppure</span>
        </div>

        <p class="login-link">
          Hai già un account?
          <button type="button" class="link-button" (click)="goToLogin()">Accedi qui</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.75rem 1.2rem;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
      color: #f9fafb;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .register-card {
      width: 100%;
      max-width: 440px;
    }

    .glass-card {
      position: relative;
      border-radius: 1.25rem;
      padding: 1.6rem 1.7rem 1.5rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78));
      border: 1px solid rgba(148, 163, 184, 0.35);
      box-shadow:
        0 20px 50px rgba(15, 23, 42, 0.95),
        0 0 0 1px rgba(15, 23, 42, 0.95);
      overflow: hidden;
    }

    .glass-card::before {
      content: "";
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.09), transparent 60%),
        radial-gradient(circle at 100% 0, rgba(129, 140, 248, 0.16), transparent 60%);
      opacity: 0.95;
      pointer-events: none;
    }

    .glass-card > * {
      position: relative;
      z-index: 1;
    }

    .card-header h1 {
      margin: 0;
      font-size: 1.6rem;
      letter-spacing: 0.03em;
      font-weight: 600;
    }

    .subtitle {
      margin: 0.4rem 0 0;
      font-size: 0.86rem;
      color: #cbd5f5;
    }

    .form-body {
      margin-top: 1.3rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    label {
      font-size: 0.8rem;
      color: #e5e7eb;
    }

    small {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    input {
      width: 100%;
      padding: 0.65rem 0.75rem;
      border-radius: 0.7rem;
      border: 1px solid rgba(148, 163, 184, 0.5);
      background: rgba(15, 23, 42, 0.9);
      color: #f9fafb;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #6b7280;
    }

    input:focus {
      border-color: rgba(129, 140, 248, 0.95);
      box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.9);
      background: rgba(15, 23, 42, 0.95);
    }

    .btn-primary {
      margin-top: 0.25rem;
      width: 100%;
      border-radius: 999px;
      border: none;
      padding: 0.75rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: #f9fafb;
      box-shadow: 0 18px 45px rgba(56, 189, 248, 0.6);
      transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 24px 55px rgba(56, 189, 248, 0.7);
      filter: brightness(1.05);
    }

    .loading {
      margin-top: 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: #cbd5f5;
    }

    .feedback {
      margin-top: 0.9rem;
      border-radius: 0.8rem;
      padding: 0.65rem 0.8rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .feedback-error {
      background: rgba(127, 29, 29, 0.82);
      border: 1px solid rgba(248, 113, 113, 0.9);
      color: #fee2e2;
    }

    .feedback-success {
      background: rgba(22, 101, 52, 0.85);
      border: 1px solid rgba(74, 222, 128, 0.9);
      color: #dcfce7;
    }

    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin: 1.4rem 0 0.9rem;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: radial-gradient(circle, rgba(148, 163, 184, 0.5), transparent);
    }

    .login-link {
      text-align: center;
      font-size: 0.82rem;
      color: #cbd5f5;
    }

    .link-button {
      border: none;
      background: transparent;
      color: #a5b4fc;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 0.18rem;
    }

    @media (max-width: 640px) {
      .register-shell {
        padding: 1.5rem 1rem;
      }

      .glass-card {
        padding: 1.4rem 1.4rem 1.3rem;
      }

      .form-row {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `]
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    // Validazione
    if (this.password !== this.confirmPassword) {
      this.error = 'Le password non coincidono';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La password deve avere almeno 8 caratteri';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.email, this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        this.success = '✅ Registrazione avvenuta con successo! Accedi ora.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        this.error = error.error?.detail || 'Errore durante la registrazione';
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
