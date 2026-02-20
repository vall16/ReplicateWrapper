import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>👤 Dashboard</h1>
          <button class="btn btn-logout" (click)="logout()">🚪 Logout</button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Card Profilo -->
        <div class="card profile-card">
          <h2>📋 Profilo Utente</h2>
          <div class="profile-info" *ngIf="user">
            <p><strong>Username:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>ID:</strong> #{{ user.id }}</p>
          </div>
        </div>

        <!-- Card Saldo Token -->
        <div class="card balance-card">
          <h2>🪙 Saldo Token</h2>
          <div class="token-display">
            <div class="token-amount">{{ balance?.tokens || 0 }}</div>
            <div class="token-label">TOKEN DISPONIBILI</div>
            <div *ngIf="balance?.tokens === 0" class="warning">
              🚫 Non hai token! Acquistane alcuni per usare l'API
            </div>
          </div>
        </div>

        <!-- Card Acquista Token -->
        <div class="card purchase-card">
          <h2>💳 Acquista Token</h2>
          <div class="packages-preview">
            <button 
              *ngFor="let pkg of packages" 
              class="package-btn"
              (click)="goToStore()"
            >
              <strong>{{ pkg.name }}</strong>
              <span class="tokens">{{ pkg.tokens }} 🪙</span>
              <span class="price">€{{ pkg.price }}</span>
            </button>
          </div>
          <button class="btn btn-primary" (click)="goToStore()">🛒 Vai al negozio</button>
        </div>

        <!-- Card Statistiche -->
        <div class="card stats-card">
          <h2>📊 Statistiche</h2>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Transazioni totali:</span>
              <span class="stat-value">{{ transactions.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Token consumati:</span>
              <span class="stat-value">{{ totalConsumed }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Token acquistati:</span>
              <span class="stat-value">{{ totalPurchased }}</span>
            </div>
          </div>
        </div>

        <!-- Card Transazioni -->
        <div class="card transactions-card">
          <h2>📈 Ultime Transazioni</h2>
          <div class="transactions-list">
            <div *ngFor="let tx of transactions.slice(0, 5)" class="transaction-item">
              <span class="tx-type" [class.consume]="tx.transaction_type === 'consume'" [class.purchase]="tx.transaction_type === 'purchase'">
                {{ tx.transaction_type === 'consume' ? '📉' : '📈' }}
              </span>
              <div class="tx-info">
                <p class="tx-desc">{{ tx.description }}</p>
                <p class="tx-date">{{ tx.created_at | date:'short' }}</p>
              </div>
              <span class="tx-amount" [class.negative]="tx.amount < 0">
                {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }}
              </span>
            </div>
            <div *ngIf="transactions.length === 0" class="empty-state">
              Nessuna transazione ancora
            </div>
          </div>
          <a href="#" class="view-all" (click)="goToTransactions()" *ngIf="transactions.length > 5">
            Visualizza tutte →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding-bottom: 2rem;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
      border-radius: 12px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      margin: 0;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .card h2 {
      color: #667eea;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .profile-info p {
      margin: 0.5rem 0;
      color: #666;
    }

    .balance-card {
      grid-column: span 1;
    }

    .token-display {
      text-align: center;
      padding: 2rem 1rem;
    }

    .token-amount {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .token-label {
      color: #999;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 1px;
    }

    .warning {
      margin-top: 1rem;
      color: #c33;
      font-weight: 600;
    }

    .purchase-card {
      display: flex;
      flex-direction: column;
    }

    .packages-preview {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex: 1;
    }

    .package-btn {
      background: #f8f9fa;
      border: 2px solid #ddd;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .package-btn:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .tokens {
      color: #667eea;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .package-btn:hover .tokens {
      color: white;
    }

    .price {
      font-size: 0.85rem;
      color: #999;
      font-weight: 600;
    }

    .package-btn:hover .price {
      color: white;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .stat-label {
      color: #666;
    }

    .stat-value {
      font-weight: bold;
      color: #667eea;
      font-size: 1.2rem;
    }

    .transactions-card {
      grid-column: 1 / -1;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #ddd;
    }

    .tx-type {
      font-size: 1.5rem;
    }

    .tx-type.consume {
      color: #c33;
    }

    .tx-type.purchase {
      color: #3c3;
    }

    .tx-info {
      flex: 1;
    }

    .tx-desc {
      margin: 0;
      color: #333;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .tx-date {
      margin: 0;
      color: #999;
      font-size: 0.85rem;
    }

    .tx-amount {
      font-weight: bold;
      font-size: 1rem;
      color: #3c3;
    }

    .tx-amount.negative {
      color: #c33;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 2rem 1rem;
    }

    .view-all {
      text-align: center;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .view-all:hover {
      text-decoration: underline;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  balance: any = null;
  transactions: any[] = [];
  packages: any[] = [];
  totalConsumed = 0;
  totalPurchased = 0;

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
    this.loadBalance();
    this.loadTransactions();
    this.loadPackages();
  }

  loadBalance() {
    this.authService.getBalance().subscribe(
      (data) => {
        this.balance = data;
      },
      (error) => {
        console.error('Errore nel caricamento del saldo', error);
      }
    );
  }

  loadTransactions() {
    this.authService.getTransactions(50).subscribe(
      (data) => {
        this.transactions = data;
        this.calculateStats();
      },
      (error) => {
        console.error('Errore nel caricamento delle transazioni', error);
      }
    );
  }

  loadPackages() {
    this.authService.getTokenPackages().subscribe(
      (data) => {
        this.packages = data.packages || [];
      },
      (error) => {
        console.error('Errore nel caricamento dei pacchetti', error);
      }
    );
  }

  calculateStats() {
    this.totalConsumed = 0;
    this.totalPurchased = 0;

    this.transactions.forEach((tx) => {
      if (tx.transaction_type === 'consume') {
        this.totalConsumed += Math.abs(tx.amount);
      } else if (tx.transaction_type === 'purchase') {
        this.totalPurchased += tx.amount;
      }
    });
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
