import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="login-container">
//       <div class="login-card">
//         <h1>🔐 Login</h1>
//         <p>Accedi al tuo account Repli</p>

//         <form (ngSubmit)="login()" *ngIf="!isLoading">
//           <div class="form-group">
//             <label for="email">Email</label>
//             <input
//               id="email"
//               type="email"
//               [(ngModel)]="email"
//               name="email"
//               placeholder="tua@email.com"
//               required
//             />
//           </div>

//           <div class="form-group">
//             <label for="password">Password</label>
//             <input
//               id="password"
//               type="password"
//               [(ngModel)]="password"
//               name="password"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           <button type="submit" class="btn btn-primary">Accedi</button>
//         </form>

//         <div *ngIf="isLoading" class="loading">
//           ⏳ Autenticazione in corso...
//         </div>

//         <div *ngIf="error" class="error">
//           ❌ {{ error }}
//         </div>

//         <div class="divider">oppure</div>

//         <p class="register-link">
//           Non hai un account? <a (click)="goToRegister()">Registrati qui</a>
//         </p>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .login-container {
//       min-height: 100vh;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       padding: 1rem;
//     }

//     .login-card {
//       background: white;
//       border-radius: 12px;
//       padding: 2rem;
//       width: 100%;
//       max-width: 400px;
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//     }

//     h1 {
//       color: #667eea;
//       margin-bottom: 0.5rem;
//       font-size: 1.8rem;
//     }

//     p {
//       color: #999;
//       margin-bottom: 1.5rem;
//       font-size: 0.95rem;
//     }

//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     label {
//       display: block;
//       margin-bottom: 0.5rem;
//       color: #333;
//       font-weight: 500;
//     }

//     input {
//       width: 100%;
//       padding: 0.75rem;
//       border: 2px solid #ddd;
//       border-radius: 8px;
//       font-size: 1rem;
//       transition: border-color 0.3s;
//     }

//     input:focus {
//       outline: none;
//       border-color: #667eea;
//     }

//     .btn {
//       width: 100%;
//       padding: 0.75rem;
//       border: none;
//       border-radius: 8px;
//       font-size: 1rem;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .btn-primary {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//     }

//     .btn-primary:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
//     }

//     .loading {
//       text-align: center;
//       color: #667eea;
//       font-weight: 600;
//     }

//     .error {
//       background-color: #fee;
//       color: #c33;
//       padding: 1rem;
//       border-radius: 8px;
//       margin-bottom: 1rem;
//       border-left: 4px solid #c33;
//     }

//     .divider {
//       text-align: center;
//       color: #999;
//       margin: 1.5rem 0;
//       position: relative;
//     }

//     .divider:before {
//       content: '';
//       position: absolute;
//       left: 0;
//       top: 50%;
//       width: 100%;
//       height: 1px;
//       background: #ddd;
//     }

//     .divider {
//       background: white;
//       width: fit-content;
//       margin: 1.5rem auto;
//       padding: 0 1rem;
//       position: relative;
//     }

//     .register-link {
//       text-align: center;
//       color: #666;
//     }

//     .register-link a {
//       color: #667eea;
//       cursor: pointer;
//       text-decoration: none;
//       font-weight: 600;
//     }

//     .register-link a:hover {
//       text-decoration: underline;
//     }
//   `]
// })

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
            <div class="logo-inner">RW</div>
          </div>
          <h1 class="hero-title">Accedi al tuo spazio AI</h1>
          <p class="hero-subtitle">
            Gestisci crediti, transazioni e chiamate al wrapper Replicate da un’unica console.
          </p>
          <ul class="hero-points">
            <li>Dashboard in tempo reale del saldo token</li>
            <li>Pagamenti sicuri e trasparenti</li>
            <li>Storico completo delle operazioni</li>
          </ul>
        </section>

        <section class="login-panel glass-card">
          <header class="panel-header">
            <h2>Login</h2>
            <p>Entra con le tue credenziali per continuare.</p>
          </header>

          <form (ngSubmit)="login()" *ngIf="!isLoading" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="tuo@email.com"
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
              Accedi
            </button>
          </form>

          <div *ngIf="isLoading" class="loading">
            Autenticazione in corso…
          </div>

          <div *ngIf="error" class="feedback feedback-error">
            {{ error }}
          </div>

          <div class="panel-footer">
            <span>Non hai un account?</span>
            <button class="btn-ghost" type="button" (click)="goToRegister()">
              Registrati
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
      color: #f5f5ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
    }

    .login-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }

    .login-grid {
      width: 100%;
      max-width: 980px;
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 2rem;
      align-items: center;
    }

    .login-hero {
      color: #e5e7eb;
    }

    .logo-orb {
      width: 58px;
      height: 58px;
      border-radius: 999px;
      background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #a855f7, #22d3ee, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .logo-inner {
      width: 76%;
      height: 76%;
      border-radius: 999px;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #e5e7eb;
      text-transform: uppercase;
    }

    .hero-title {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .hero-subtitle {
      margin: 0 0 0.8rem;
      font-size: 0.95rem;
      color: #cbd5f5;
      max-width: 420px;
    }

    .hero-points {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.82rem;
      color: #cbd5f5;
    }

    .hero-points li::before {
      content: "•";
      display: inline-block;
      margin-right: 0.35rem;
      color: #38bdf8;
    }

    .glass-card {
      position: relative;
      border-radius: 1.25rem;
      padding: 1.4rem 1.5rem 1.3rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8));
      border: 1px solid rgba(148, 163, 184, 0.35);
      box-shadow:
        0 18px 45px rgba(15, 23, 42, 0.9),
        0 0 0 1px rgba(15, 23, 42, 0.9);
      overflow: hidden;
    }

    .glass-card::before {
      content: "";
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.08), transparent 58%),
        radial-gradient(circle at 100% 0, rgba(129, 140, 248, 0.12), transparent 60%);
      opacity: 0.9;
      pointer-events: none;
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
      font-size: 1.1rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .panel-header p {
      margin: 0.35rem 0 1.1rem;
      font-size: 0.8rem;
      color: #9ca3af;
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
      color: #e5e7eb;
    }

    input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border-radius: 0.7rem;
      border: 1px solid rgba(148, 163, 184, 0.4);
      background: rgba(15, 23, 42, 0.9);
      color: #f9fafb;
      font-size: 0.9rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }

    input::placeholder {
      color: #64748b;
    }

    input:focus {
      outline: none;
      border-color: rgba(59, 130, 246, 0.9);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.7);
      background: rgba(15, 23, 42, 0.95);
    }

    .btn-primary {
      margin-top: 0.3rem;
      width: 100%;
      padding: 0.65rem 0.9rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 16px 40px rgba(56, 189, 248, 0.45);
      transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 22px 50px rgba(56, 189, 248, 0.6);
      filter: brightness(1.06);
    }

    .loading {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #a5b4fc;
    }

    .feedback {
      margin-top: 0.8rem;
      font-size: 0.8rem;
      border-radius: 0.8rem;
      padding: 0.6rem 0.75rem;
    }

    .feedback-error {
      background: rgba(127, 29, 29, 0.8);
      border: 1px solid rgba(248, 113, 113, 0.8);
      color: #fee2e2;
    }

    .panel-footer {
      margin-top: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .btn-ghost {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      background: transparent;
      color: #e5e7eb;
      padding: 0.35rem 0.75rem;
      font-size: 0.78rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .btn-ghost:hover {
      background: rgba(30, 64, 175, 0.9);
      box-shadow: 0 14px 32px rgba(37, 99, 235, 0.45);
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
  ) {}

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
        this.error = error.error?.detail || 'Errore durante il login';
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}



