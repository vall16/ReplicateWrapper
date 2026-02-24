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
    <div class="hero-login-bg">
      <div class="hero-login-card">
        <div class="hero-login-header">
          <img src="assets/hero-logo.svg" alt="Logo" class="hero-logo" />
          <h1 class="hero-title">Benvenuto su Repli!</h1>
          <p class="hero-subtitle">Accedi per continuare la tua avventura</p>
        </div>

        <form (ngSubmit)="login()" *ngIf="!isLoading" class="hero-login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="tua@email.com"
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

          <button type="submit" class="hero-btn">Accedi</button>
        </form>

        <div *ngIf="isLoading" class="loading">
          ⏳ Autenticazione in corso...
        </div>

        <div *ngIf="error" class="error">
          ❌ {{ error }}
        </div>

        <div class="divider">oppure</div>

        <p class="register-link">
          Non hai un account? <a (click)="goToRegister()">Registrati qui</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .hero-login-bg {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(120deg, #2563eb 0%, #6ee7b7 100%);
      padding: 1rem;
    }

    .hero-login-card {
      background: rgba(255,255,255,0.97);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem 2rem 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      text-align: center;
      position: relative;
    }

    .hero-login-header {
      margin-bottom: 2rem;
    }

    .hero-logo {
      width: 56px;
      height: 56px;
      margin-bottom: 0.5rem;
    }

    .hero-title {
      font-size: 2.2rem;
      color: #2563eb;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #4b5563;
      margin-bottom: 0.5rem;
    }

    .hero-login-form .form-group {
      margin-bottom: 1.2rem;
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 0.4rem;
      color: #2563eb;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1.5px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 1rem;
      background: #f9fafb;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #2563eb;
      background: #fff;
    }

    .hero-btn {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(120deg, #2563eb 0%, #6ee7b7 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37,99,235,0.10);
      transition: background 0.2s, transform 0.2s;
    }

    .hero-btn:hover {
      background: linear-gradient(120deg, #1d4ed8 0%, #34d399 100%);
      transform: translateY(-2px) scale(1.03);
    }

    .loading {
      text-align: center;
      color: #2563eb;
      font-weight: 600;
      margin: 1rem 0;
    }

    .error {
      background-color: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      border-left: 4px solid #c33;
      font-weight: 500;
    }

    .divider {
      text-align: center;
      color: #999;
      margin: 1.5rem 0 1rem 0;
      position: relative;
      background: white;
      width: fit-content;
      padding: 0 1rem;
      margin-left: auto;
      margin-right: auto;
    }

    .divider:before {
      content: '';
      position: absolute;
      left: -100px;
      top: 50%;
      width: 100px;
      height: 1px;
      background: #e5e7eb;
    }

    .divider:after {
      content: '';
      position: absolute;
      right: -100px;
      top: 50%;
      width: 100px;
      height: 1px;
      background: #e5e7eb;
    }

    .register-link {
      text-align: center;
      color: #666;
      font-size: 1rem;
    }

    .register-link a {
      color: #2563eb;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: text-decoration 0.2s;
    }

    .register-link a:hover {
      text-decoration: underline;
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



