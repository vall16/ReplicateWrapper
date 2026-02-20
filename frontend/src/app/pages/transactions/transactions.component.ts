import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <div class="transactions-header">
        <h1>📈 Storico Transazioni</h1>
        <button class="btn btn-back" (click)="goBack()">← Indietro</button>
      </div>

      <div class="transactions-stats">
        <div class="stat-card">
          <h3>Transazioni totali</h3>
          <p class="stat-number">{{ transactions.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Token consumati</h3>
          <p class="stat-number consume">{{ totalConsumed }}</p>
        </div>
        <div class="stat-card">
          <h3>Token acquistati</h3>
          <p class="stat-number purchase">{{ totalPurchased }}</p>
        </div>
      </div>

      <div class="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrizione</th>
              <th>Importo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of transactions" [class.consume]="tx.transaction_type === 'consume'" [class.purchase]="tx.transaction_type === 'purchase'">
              <td>{{ tx.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <span class="type-badge" [class.consume]="tx.transaction_type === 'consume'" [class.purchase]="tx.transaction_type === 'purchase'">
                  {{ tx.transaction_type === 'consume' ? '📉 Consumo' : '📈 Acquisto' }}
                </span>
              </td>
              <td>{{ tx.description }}</td>
              <td class="amount" [class.negative]="tx.amount < 0">
                {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }} 🪙
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="transactions.length === 0" class="empty-state">
          <p>📭 Non hai ancora transazioni</p>
          <button class="btn btn-primary" (click)="goToDashboard()">Vai al Dashboard</button>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        ❌ {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
    }

    .transactions-header h1 {
      font-size: 2rem;
      margin: 0;
    }

    .btn-back {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
    }

    .transactions-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
      color: #999;
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .stat-number {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-number.consume {
      color: #c33;
    }

    .stat-number.purchase {
      color: #3c3;
    }

    .transactions-table {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f8f9fa;
      border-bottom: 2px solid #ddd;
    }

    th {
      padding: 1rem;
      text-align: left;
      color: #667eea;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    tbody tr {
      border-bottom: 1px solid #eee;
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: #f8f9fa;
    }

    tbody tr.consume {
      border-left: 4px solid #c33;
    }

    tbody tr.purchase {
      border-left: 4px solid #3c3;
    }

    td {
      padding: 1rem;
      color: #333;
      font-size: 0.95rem;
    }

    .type-badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .type-badge.consume {
      background-color: #ffe5e5;
      color: #c33;
    }

    .type-badge.purchase {
      background-color: #e5ffe5;
      color: #3c3;
    }

    .amount {
      font-weight: 600;
      color: #3c3;
    }

    .amount.negative {
      color: #c33;
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
    }

    .empty-state p {
      color: #999;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 4px solid #c33;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  totalConsumed = 0;
  totalPurchased = 0;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTransactions();
  }

  loadTransactions() {
    this.authService.getTransactions(200).subscribe(
      (data) => {
        this.transactions = data || [];
        this.calculateStats();
      },
      (error) => {
        this.error = 'Errore nel caricamento delle transazioni';
        console.error(error);
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

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
