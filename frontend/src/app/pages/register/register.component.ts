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
    <div class="register-container">
      <div class="register-card">
        <h1>📝 Registrazione</h1>
        <p>Crea un nuovo account Repli</p>

        <form (ngSubmit)="register()" *ngIf="!isLoading">
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
            <label for="confirmPassword">Conferma Password</label>
            <input
              id="confirmPassword"
              type="password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">Registrati</button>
        </form>

        <div *ngIf="isLoading" class="loading">
          ⏳ Registrazione in corso...
        </div>

        <div *ngIf="error" class="error">
          ❌ {{ error }}
        </div>

        <div *ngIf="success" class="success">
          ✅ {{ success }}
        </div>

        <div class="divider">oppure</div>

        <p class="login-link">
          Hai già un account? <a (click)="goToLogin()">Accedi qui</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    h1 {
      color: #667eea;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    p {
      color: #999;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    small {
      display: block;
      color: #999;
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .loading {
      text-align: center;
      color: #667eea;
      font-weight: 600;
    }

    .error {
      background-color: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #c33;
    }

    .success {
      background-color: #efe;
      color: #3c3;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #3c3;
    }

    .divider {
      text-align: center;
      color: #999;
      margin: 1.5rem 0;
      position: relative;
    }

    .divider {
      background: white;
      width: fit-content;
      margin: 1.5rem auto;
      padding: 0 1rem;
      position: relative;
    }

    .login-link {
      text-align: center;
      color: #666;
    }

    .login-link a {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
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
