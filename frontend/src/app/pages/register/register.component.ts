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
            <h1>Sign Up</h1>
            <p class="subtitle">
              Create your account to start managing Replicate model tokens.

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
              placeholder="youraddress@email.com"
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
              placeholder="Your username"

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
              <small>Minimum 8 characters</small>

            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm password</label>
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

          <button type="submit" class="btn-primary">Create account</button>
        </form>

        <div *ngIf="isLoading" class="loading">
          Registration in progress…

        </div>

        <div *ngIf="error" class="feedback feedback-error">
          {{ error }}
        </div>

        <div *ngIf="success" class="feedback feedback-success">
          {{ success }}
        </div>

        <div class="divider">
          <span>or</span>
        </div>

        <p class="login-link">
          Already have an account?

          <button type="button" class="link-button" (click)="goToLogin()">Login here</button>
        </p>
      </div>
    </div>
  `,
  // styles: [`
  //   .register-shell {
  //     min-height: 100vh;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     padding: 1.75rem 1.2rem;
  //     background-color: #ffffff;
  //     background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px);
  //     background-size: 32px 32px;
  //     color: #1f2937;
  //     font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  //   }

  //   .register-card {
  //     width: 100%;
  //     max-width: 440px;
  //   }



  //   .glass-card {
  //     position: relative;
  //     border-radius: 1.25rem;
  //     padding: 1.6rem 1.7rem 1.5rem;
  //     background: #ffffff;
  //     border: 1px solid #e5e7eb;
  //     box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  //     overflow: hidden;
  //   }

  //   .glass-card::before {
  //     display: none;
  //   }

  //   .glass-card > * {
  //     position: relative;
  //     z-index: 1;
  //   }

  //   .card-header h1 {
  //     margin: 0;
  //     color: #1f2937;
  //     font-size: 1.6rem;
  //     letter-spacing: 0.03em;
  //     font-weight: 600;
  //   }

  //   .subtitle {
  //     margin: 0.4rem 0 0;
  //     font-size: 0.86rem;
  //     color: #4b5563;
  //   }

  //   .form-body {
  //     margin-top: 1.3rem;
  //     display: flex;
  //     flex-direction: column;
  //     gap: 1rem;
  //   }

  //   .form-group {
  //     display: flex;
  //     flex-direction: column;
  //     gap: 0.35rem;
  //   }

  //   .form-row {
  //     display: grid;
  //     grid-template-columns: repeat(2, minmax(0, 1fr));
  //     gap: 0.9rem;
  //   }

  //   label {
  //     font-size: 0.8rem;
  //     color: #374151;
  //     font-weight: 500;
  //   }

  //   small {
  //     font-size: 0.75rem;
  //     color: #6b7280;
  //   }

  //   input {
  //     width: 100%;
  //     padding: 0.65rem 0.75rem;
  //     border-radius: 6px;
  //     border: 1px solid #d1d5db;
  //     background: #ffffff;
  //     color: #1f2937;
  //     font-size: 0.9rem;
  //     outline: none;
  //     transition: border-color 0.15s ease, box-shadow 0.15s ease;
  //     box-sizing: border-box;
  //   }

  //   input::placeholder {
  //     color: #9ca3af;
  //   }

  //   input:focus {
  //     border-color: #6366f1;
  //     box-shadow: 0 0 0 1px #6366f1;
  //   }

  //   .btn-primary {
  //     margin-top: 0.25rem;
  //     width: 100%;
  //     border-radius: 6px;
  //     border: none;
  //     padding: 0.75rem 1.2rem;
  //     font-size: 0.9rem;
  //     font-weight: 500;
  //     cursor: pointer;
  //     background: #6366f1;
  //     color: #ffffff;
  //     box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
  //     transition: background-color 0.15s ease, transform 0.1s ease;
  //   }

  //   .btn-primary:hover {
  //     background-color: #4f46e5;
  //     transform: translateY(-1px);
  //   }

  //   .loading {
  //     margin-top: 1rem;
  //     text-align: center;
  //     font-size: 0.85rem;
  //     color: #6b7280;
  //   }

  //   .feedback {
  //     margin-top: 0.9rem;
  //     border-radius: 6px;
  //     padding: 0.65rem 0.8rem;
  //     font-size: 0.8rem;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //     gap: 0.5rem;
  //   }

  //   .feedback-error {
  //     background: #fef2f2;
  //     border: 1px solid #fecaca;
  //     color: #b91c1c;
  //   }

  //   .feedback-success {
  //     background: #f0fdf4;
  //     border: 1px solid #bbf7d0;
  //     color: #15803d;
  //   }

  //   .divider {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     gap: 0.75rem;
  //     margin: 1.4rem 0 0.9rem;
  //     font-size: 0.8rem;
  //     color: #6b7280;
  //   }

  //   .divider::before,
  //   .divider::after {
  //     content: "";
  //     flex: 1;
  //     height: 1px;
  //     background: #e5e7eb;
  //   }

  //   .login-link {
  //     text-align: center;
  //     font-size: 0.82rem;
  //     color: #4b5563;
  //   }

  //   .link-button {
  //     border: none;
  //     background: transparent;
  //     color: #6366f1;
  //     cursor: pointer;
  //     font-size: 0.82rem;
  //     font-weight: 500;
  //     text-decoration: underline;
  //     text-underline-offset: 0.18rem;
  //   }

  //   @media (max-width: 640px) {
  //     .register-shell {
  //       padding: 1.5rem 1rem;
  //     }

  //     .glass-card {
  //       padding: 1.4rem 1.4rem 1.3rem;
  //     }

  //     .form-row {
  //       grid-template-columns: minmax(0, 1fr);
  //     }
  //   }
  // `]

  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      color: #1f2937;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .register-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      position: relative;
      background-color: #f1f5f9; /* Colore di fallback */
      overflow: hidden;
    }

    /* Background con immagine e sfocatura identico al login */
    .register-shell::before {
      content: '';
      position: absolute;
      inset: -5%;
      background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      pointer-events: none;
    }

    .register-shell::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.75) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      pointer-events: none;
    }

    .register-card {
      width: 100%;
      max-width: 460px; /* Leggermente più largo per accomodare la grid delle password */
      position: relative;
      z-index: 10;
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

    .glass-card > * {
      position: relative;
      z-index: 1;
    }

    .card-header h1 {
      margin: 0;
      color: #1f2937;
      font-size: 1.1rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .subtitle {
      margin: 0.35rem 0 1.1rem;
      font-size: 0.8rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .form-body {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
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

    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 1px #6366f1;
    }

    small {
      display: block;
      margin-top: 0.2rem;
      font-size: 0.7rem;
      color: #9ca3af;
    }

    .btn-primary {
      margin-top: 0.5rem;
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

    .feedback-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }

    .divider {
      margin: 1.2rem 0 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #6b7280;
    }

    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .login-link {
      margin-top: 0.5rem;
      text-align: center;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .link-button {
      border: none;
      background: transparent;
      color: #6366f1;
      cursor: pointer;
      font-weight: 600;
      padding-left: 0.3rem;
    }

    .link-button:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .register-shell {
        padding: 1.5rem 1.1rem;
      }
      .form-row {
        grid-template-columns: 1fr;
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
  ) { }

  register() {
    // Validazione
    if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
        this.error = 'Password must be at least 8 characters';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.email, this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        this.success = '✅ Registration successful! Login now.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        this.error = error.error?.detail || 'Registration error';
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
