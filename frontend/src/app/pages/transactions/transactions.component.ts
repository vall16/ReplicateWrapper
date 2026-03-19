import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-shell">
      <header class="transactions-header">
        <div>
          <h1 class="header-title">Storico transazioni</h1>
          <p class="header-subtitle">
            Visualizza tutti i movimenti di token tra consumi e acquisti.
          </p>
        </div>
        <button class="btn-back" (click)="goBack()">← Torna al dashboard</button>
      </header>

      <section class="stats-row">
        <div class="glass-card stat-card">
          <h3>Transazioni totali</h3>
          <p class="stat-number">{{ transactions.length }}</p>
        </div>
        <div class="glass-card stat-card">
          <h3>Token consumati</h3>
          <p class="stat-number negative">{{ totalConsumed }}</p>
        </div>
        <div class="glass-card stat-card">
          <h3>Token acquistati</h3>
          <p class="stat-number positive">{{ totalPurchased }}</p>
        </div>
      </section>

      <section class="table-card glass-card">
        <div class="table-header">
          <h2>Dettaglio movimenti</h2>
        </div>

        <div class="table-wrapper" *ngIf="transactions.length; else emptyState">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrizione</th>
                <th class="amount-col">Importo</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let tx of transactions"
                [class.consume]="tx.transaction_type === 'consume'"
                [class.purchase]="tx.transaction_type === 'purchase'"
              >
                <td class="cell-date">{{ tx.created_at | date: 'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span
                    class="type-badge"
                    [class.consume]="tx.transaction_type === 'consume'"
                    [class.purchase]="tx.transaction_type === 'purchase'"
                  >
                    {{ tx.transaction_type === 'consume' ? 'Consumo' : 'Acquisto' }}
                  </span>
                </td>
                <td class="cell-description">{{ tx.description }}</td>
                <td
                  class="cell-amount"
                  [class.negative]="tx.amount < 0"
                  [class.positive]="tx.amount > 0"
                >
                  {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }} token
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <p>Non hai ancora transazioni registrate.</p>
            <button class="btn-primary" (click)="goToDashboard()">Vai al dashboard</button>
          </div>
        </ng-template>
      </section>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .transactions-shell {
      max-width: 1120px;
      margin: 0 auto;
      padding: 1.75rem 1.5rem 2.5rem;
      color: #1f2937;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
    }

    .header-title {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    .header-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: #6b7280;
      max-width: 460px;
    }

    .btn-back {
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #4b5563;
      padding: 0.45rem 0.9rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .btn-back:hover {
      background: #f3f4f6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .glass-card {
      position: relative;
      border-radius: 1.15rem;
      padding: 1.1rem 1.2rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .glass-card::before {
      display: none;
    }

    .glass-card > * {
      position: relative;
      z-index: 1;
    }

    .stat-card h3 {
      margin: 0 0 0.45rem;
      font-size: 0.85rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.09em;
    }

    .stat-number {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .stat-number.negative {
      color: #ef4444;
    }

    .stat-number.positive {
      color: #10b981;
    }

    .table-card {
      margin-top: 0.25rem;
    }

    .table-header h2 {
      margin: 0 0 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .table-wrapper {
      border-radius: 0.85rem;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #e5e7eb;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    thead {
      background: #f9fafb;
    }

    th {
      padding: 0.7rem 0.9rem;
      text-align: left;
      color: #6b7280;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.72rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .amount-col {
      text-align: right;
    }

    tbody tr {
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.15s ease;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    tbody tr.consume {
      border-left: 3px solid #fca5a5;
    }

    tbody tr.purchase {
      border-left: 3px solid #86efac;
    }

    td {
      padding: 0.7rem 0.9rem;
      color: #374151;
      vertical-align: middle;
    }

    .cell-date {
      white-space: nowrap;
      color: #6b7280;
    }

    .cell-description {
      max-width: 380px;
    }

    .cell-amount {
      text-align: right;
      font-weight: 600;
    }

    .cell-amount.positive {
      color: #10b981;
    }

    .cell-amount.negative {
      color: #ef4444;
    }

    .type-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.26rem 0.7rem;
      border-radius: 999px;
      font-weight: 500;
      font-size: 0.72rem;
      border: 1px solid #d1d5db;
      color: #374151;
      background: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .type-badge.consume {
      border-color: #fca5a5;
      background: #fef2f2;
      color: #ef4444;
    }

    .type-badge.purchase {
      border-color: #86efac;
      background: #f0fdf4;
      color: #10b981;
    }

    .empty-state {
      padding: 2.4rem 1.2rem 2.1rem;
      text-align: center;
    }

    .empty-state p {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .btn-primary {
      border-radius: 6px;
      border: none;
      background: #6366f1;
      color: white;
      padding: 0.6rem 1.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
      transition: transform 0.1s ease, background 0.15s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      background: #4f46e5;
    }

    .error-message {
      margin-top: 1rem;
      border-radius: 0.9rem;
      padding: 0.65rem 0.9rem;
      font-size: 0.8rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .transactions-shell {
        padding: 1.4rem 1.1rem 2rem;
      }

      .transactions-header {
        flex-direction: column;
        align-items: flex-start;
      }

      table {
        font-size: 0.8rem;
      }
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
