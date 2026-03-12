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
      color: #f9fafb;
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
      color: #cbd5f5;
      max-width: 460px;
    }

    .btn-back {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.7);
      background: rgba(15, 23, 42, 0.7);
      color: #e5e7eb;
      padding: 0.45rem 0.9rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .btn-back:hover {
      background: rgba(30, 64, 175, 0.95);
      box-shadow: 0 14px 32px rgba(37, 99, 235, 0.45);
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
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78));
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
        radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.09), transparent 60%),
        radial-gradient(circle at 100% 0, rgba(129, 140, 248, 0.15), transparent 60%);
      opacity: 0.95;
      pointer-events: none;
    }

    .glass-card > * {
      position: relative;
      z-index: 1;
    }

    .stat-card h3 {
      margin: 0 0 0.45rem;
      font-size: 0.85rem;
      color: #cbd5f5;
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
      color: #fecaca;
    }

    .stat-number.positive {
      color: #bbf7d0;
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
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(31, 41, 55, 0.9);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    thead {
      background: rgba(15, 23, 42, 0.98);
    }

    th {
      padding: 0.7rem 0.9rem;
      text-align: left;
      color: #a5b4fc;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.72rem;
      border-bottom: 1px solid rgba(31, 41, 55, 0.95);
    }

    .amount-col {
      text-align: right;
    }

    tbody tr {
      border-bottom: 1px solid rgba(31, 41, 55, 0.9);
      transition: background 0.15s ease;
    }

    tbody tr:hover {
      background: rgba(15, 23, 42, 0.9);
    }

    tbody tr.consume {
      border-left: 3px solid rgba(248, 113, 113, 0.9);
    }

    tbody tr.purchase {
      border-left: 3px solid rgba(74, 222, 128, 0.9);
    }

    td {
      padding: 0.7rem 0.9rem;
      color: #e5e7eb;
      vertical-align: middle;
    }

    .cell-date {
      white-space: nowrap;
      color: #cbd5f5;
    }

    .cell-description {
      max-width: 380px;
    }

    .cell-amount {
      text-align: right;
      font-weight: 600;
    }

    .cell-amount.positive {
      color: #bbf7d0;
    }

    .cell-amount.negative {
      color: #fecaca;
    }

    .type-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.26rem 0.7rem;
      border-radius: 999px;
      font-weight: 500;
      font-size: 0.72rem;
      border: 1px solid rgba(148, 163, 184, 0.7);
      color: #e5e7eb;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .type-badge.consume {
      border-color: rgba(248, 113, 113, 0.8);
      background: rgba(127, 29, 29, 0.55);
    }

    .type-badge.purchase {
      border-color: rgba(74, 222, 128, 0.8);
      background: rgba(22, 101, 52, 0.55);
    }

    .empty-state {
      padding: 2.4rem 1.2rem 2.1rem;
      text-align: center;
    }

    .empty-state p {
      color: #cbd5f5;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .btn-primary {
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      padding: 0.6rem 1.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 16px 40px rgba(56, 189, 248, 0.5);
      transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 22px 50px rgba(56, 189, 248, 0.65);
      filter: brightness(1.05);
    }

    .error-message {
      margin-top: 1rem;
      border-radius: 0.9rem;
      padding: 0.65rem 0.9rem;
      font-size: 0.8rem;
      background: rgba(127, 29, 29, 0.8);
      border: 1px solid rgba(248, 113, 113, 0.9);
      color: #fee2e2;
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
