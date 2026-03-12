import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-shell">
      <!-- Left rail -->
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo">RW</div>
          <div class="brand-text">
            <span class="brand-title">Replicate Wrapper</span>
            <span class="brand-subtitle">AI Credit Console</span>
          </div>
        </div>

        <nav class="nav">
          <button class="nav-item nav-item-active">
            <span class="nav-dot"></span>
            <span>Dashboard</span>
          </button>
          <button class="nav-item" (click)="goToStore()">
            <span class="nav-icon">🪙</span>
            <span>Token Store</span>
          </button>
          <button class="nav-item" (click)="goToTransactions()">
            <span class="nav-icon">📈</span>
            <span>Storico</span>
          </button>
        </nav>

        <div class="sidebar-footer" *ngIf="user">
          <div class="user-pill">
            <div class="avatar">{{ user.username?.charAt(0) | uppercase }}</div>
            <div class="user-meta">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </aside>

      <!-- Main surface -->
      <main class="dashboard-main">
        <!-- Top bar -->
        <header class="topbar">
          <div class="topbar-left">
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">
              Monitora saldo, consumi e acquisti dei tuoi crediti AI in tempo reale.
            </p>
          </div>
          <div class="topbar-right">
            <div class="pill">
              <span class="pill-label">Token disponibili</span>
              <span class="pill-value">{{ balance?.tokens || 0 }}</span>
            </div>
          </div>
        </header>

        <!-- Hero row: balance + quick actions -->
        <section class="hero-row">
          <div class="glass-card balance-card">
            <div class="card-header">
              <div>
                <h2>Saldo attuale</h2>
                <p class="card-subtitle">Token disponibili per le tue chiamate API</p>
              </div>
            </div>

            <div class="balance-body">
              <div class="balance-circle">
                <div class="balance-inner">
                  <span class="balance-value">{{ balance?.tokens || 0 }}</span>
                  <span class="balance-label">TOKEN</span>
                </div>
              </div>
              <div class="balance-side">
                <div class="balance-stat">
                  <span class="balance-stat-label">Token consumati</span>
                  <span class="balance-stat-value negative">{{ totalConsumed }}</span>
                </div>
                <div class="balance-stat">
                  <span class="balance-stat-label">Token acquistati</span>
                  <span class="balance-stat-value positive">{{ totalPurchased }}</span>
                </div>
                <div
                  class="balance-warning"
                  *ngIf="(balance?.tokens || 0) === 0"
                >
                  Nessun token disponibile. Acquista un pacchetto per iniziare a usare le API.
                </div>
                <button class="btn-primary" (click)="goToStore()">Acquista token</button>
              </div>
            </div>
          </div>

          <div class="glass-card profile-card">
            <div class="card-header">
              <div>
                <h2>Profilo</h2>
                <p class="card-subtitle">Dettagli del tuo account</p>
              </div>
            </div>
            <div class="profile-body" *ngIf="user">
              <div class="profile-row">
                <span class="profile-label">Username</span>
                <span class="profile-value">{{ user.username }}</span>
              </div>
              <div class="profile-row">
                <span class="profile-label">Email</span>
                <span class="profile-value">{{ user.email }}</span>
              </div>
              <div class="profile-row">
                <span class="profile-label">ID Utente</span>
                <span class="profile-value">#{{ user.id }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Middle row: packages + stats -->
        <section class="middle-row">
          <div class="glass-card purchase-card">
            <div class="card-header">
              <div>
                <h2>Pacchetti token</h2>
                <p class="card-subtitle">Scegli il pacchetto più adatto</p>
              </div>
            </div>
            <div class="packages-row" *ngIf="packages?.length">
              <button
                *ngFor="let pkg of packages"
                class="package-pill"
                (click)="goToStore()"
              >
                <span class="package-name">{{ pkg.name }}</span>
                <span class="package-tokens">{{ pkg.tokens }} token</span>
                <span class="package-price">€{{ pkg.price }}</span>
              </button>
            </div>
            <div class="empty-packages" *ngIf="!packages?.length">
              Nessun pacchetto configurato. Vai al negozio per vedere le opzioni disponibili.
            </div>
          </div>

          <div class="glass-card stats-card">
            <div class="card-header">
              <div>
                <h2>Overview utilizzo</h2>
                <p class="card-subtitle">Sintesi dell’attività recente</p>
              </div>
            </div>
            <div class="stats-grid">
              <div class="stat-chip">
                <span class="stat-label">Transazioni totali</span>
                <span class="stat-value">{{ transactions.length }}</span>
              </div>
              <div class="stat-chip">
                <span class="stat-label">Token consumati</span>
                <span class="stat-value negative">{{ totalConsumed }}</span>
              </div>
              <div class="stat-chip">
                <span class="stat-label">Token acquistati</span>
                <span class="stat-value positive">{{ totalPurchased }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom row: transactions -->
        <section class="bottom-row">
          <div class="glass-card transactions-card">
            <div class="card-header">
              <div>
                <h2>Ultime transazioni</h2>
                <p class="card-subtitle">Movimenti più recenti del tuo wallet</p>
              </div>
              <button
                class="link-button"
                *ngIf="transactions.length"
                (click)="goToTransactions()"
              >
                Vedi tutto
              </button>
            </div>

            <div class="transactions-list" *ngIf="transactions.length; else emptyTx">
              <div
                *ngFor="let tx of transactions.slice(0, 6)"
                class="transaction-row"
              >
                <div
                  class="tx-pill"
                  [class.tx-consume]="tx.transaction_type === 'consume'"
                  [class.tx-purchase]="tx.transaction_type === 'purchase'"
                >
                  {{ tx.transaction_type === 'consume' ? 'Consume' : 'Purchase' }}
                </div>
                <div class="tx-main">
                  <div class="tx-desc">{{ tx.description }}</div>
                  <div class="tx-meta">
                    <span>{{ tx.created_at | date: 'short' }}</span>
                    <span class="tx-id">ID: {{ tx.id || '-' }}</span>
                  </div>
                </div>
                <div
                  class="tx-amount"
                  [class.tx-amount-negative]="tx.amount < 0"
                  [class.tx-amount-positive]="tx.amount > 0"
                >
                  {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }}
                </div>
              </div>
            </div>

            <ng-template #emptyTx>
              <div class="empty-state">
                Nessuna transazione ancora. I movimenti appariranno qui non appena inizierai a usare o acquistare token.
              </div>
            </ng-template>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      color: #f5f5ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .dashboard-shell {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      height: 100vh;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
      color: #f9fafb;
      overflow: hidden;
    }

    .sidebar {
      backdrop-filter: blur(20px);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95));
      border-right: 1px solid rgba(148, 163, 184, 0.2);
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #a855f7, #22d3ee, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .brand-title {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }

    .nav-item {
      border: none;
      background: transparent;
      color: #cbd5f5;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
    }

    .nav-item:hover {
      background: rgba(148, 163, 184, 0.15);
      color: #e5edff;
      transform: translateY(-1px);
    }

    .nav-item-active {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0));
      color: #f9fafb;
      box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.5);
    }

    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
    }

    .nav-icon {
      font-size: 1rem;
    }

    .sidebar-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.6rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.35);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 0, #e5e7eb, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0b1120;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .user-email {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .btn-logout {
      border-radius: 999px;
      border: 1px solid rgba(248, 113, 113, 0.7);
      background: rgba(30, 64, 175, 0.4);
      color: #fecaca;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(220, 38, 38, 0.75);
      box-shadow: 0 10px 25px rgba(248, 113, 113, 0.4);
      transform: translateY(-1px);
    }

    .dashboard-main {
      padding: 1.75rem 2rem;
      overflow-y: auto;
      position: relative;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .page-title {
      margin: 0;
      font-size: 1.6rem;
      letter-spacing: 0.03em;
      font-weight: 600;
    }

    .page-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: #cbd5f5;
      max-width: 420px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pill {
      padding: 0.5rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(129, 140, 248, 0.4);
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.35), transparent 55%),
                  rgba(15, 23, 42, 0.45);
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 130px;
    }

    .pill-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.11em;
      color: #a5b4fc;
    }

    .pill-value {
      font-size: 1.05rem;
      font-weight: 600;
    }

    .hero-row {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 1.1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .middle-row {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .bottom-row {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr);
      gap: 1.5rem;
      padding-bottom: 2rem;
    }

    .glass-card {
      position: relative;
      border-radius: 1.25rem;
      padding: 1.2rem 1.3rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.75));
      border: 1px solid rgba(148, 163, 184, 0.3);
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

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.9rem;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .card-subtitle {
      margin: 0.25rem 0 0;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .balance-body {
      display: grid;
      grid-template-columns: 1.3fr 1.5fr;
      gap: 1.25rem;
      align-items: center;
    }

    .balance-circle {
      width: 180px;
      height: 180px;
      border-radius: 999px;
      background:
        conic-gradient(
          from 200deg,
          rgba(52, 211, 153, 0.8),
          rgba(59, 130, 246, 0.9),
          rgba(147, 51, 234, 0.9),
          rgba(52, 211, 153, 0.8)
        );
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 20px 40px rgba(15, 23, 42, 1),
        0 0 40px rgba(59, 130, 246, 0.7);
    }

    .balance-inner {
      width: 82%;
      height: 82%;
      border-radius: 999px;
      background: radial-gradient(circle at top, #020617, #020617 50%, #020617);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.4);
    }

    .balance-value {
      font-size: 2.1rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .balance-label {
      margin-top: 0.1rem;
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9ca3af;
    }

    .balance-side {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .balance-stat {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0.4rem 0.55rem;
      border-radius: 0.9rem;
      background: radial-gradient(circle at left, rgba(37, 99, 235, 0.28), transparent 65%);
      border: 1px solid rgba(55, 65, 81, 0.8);
    }

    .balance-stat-label {
      font-size: 0.78rem;
      color: #e5e7eb;
    }

    .balance-stat-value {
      font-size: 0.98rem;
      font-weight: 600;
    }

    .balance-stat-value.negative {
      color: #fca5a5;
    }

    .balance-stat-value.positive {
      color: #bbf7d0;
    }

    .balance-warning {
      margin-top: 0.35rem;
      font-size: 0.78rem;
      color: #fecaca;
    }

    .btn-primary {
      margin-top: 0.5rem;
      align-self: flex-start;
      padding: 0.55rem 1.1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      font-size: 0.85rem;
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

    .profile-body {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      margin-top: 0.3rem;
    }

    .profile-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 0.82rem;
    }

    .profile-label {
      color: #9ca3af;
    }

    .profile-value {
      font-weight: 500;
    }

    .packages-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.4rem;
      padding-bottom: 0.2rem;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .package-pill {
      min-width: 150px;
      border-radius: 0.9rem;
      padding: 0.6rem 0.8rem;
      border: 1px solid rgba(148, 163, 184, 0.5);
      background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), transparent 60%);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
      cursor: pointer;
      color: #e5e7eb;
      font-size: 0.8rem;
      transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .package-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 36px rgba(37, 99, 235, 0.65);
      border-color: rgba(129, 140, 248, 0.9);
    }

    .package-name {
      font-weight: 600;
      font-size: 0.82rem;
    }

    .package-tokens {
      font-size: 0.78rem;
      color: #bfdbfe;
    }

    .package-price {
      font-size: 0.76rem;
      color: #facc15;
      font-weight: 500;
    }

    .empty-packages {
      margin-top: 0.4rem;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.6rem;
      margin-top: 0.4rem;
    }

    .stat-chip {
      border-radius: 0.85rem;
      padding: 0.55rem 0.7rem;
      background: radial-gradient(circle at top, rgba(129, 140, 248, 0.34), transparent 60%);
      border: 1px solid rgba(148, 163, 184, 0.6);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
    }

    .stat-label {
      color: #cbd5f5;
    }

    .stat-value {
      font-size: 0.97rem;
      font-weight: 600;
    }

    .stat-value.negative {
      color: #fecaca;
    }

    .stat-value.positive {
      color: #bbf7d0;
    }

    .transactions-card {
      min-height: 220px;
    }

    .transactions-list {
      margin-top: 0.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .transaction-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.65rem;
      align-items: center;
      padding: 0.5rem 0.55rem;
      border-radius: 0.85rem;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(31, 41, 55, 0.9);
    }

    .tx-pill {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      padding: 0.22rem 0.55rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      color: #e5e7eb;
    }

    .tx-consume {
      border-color: rgba(248, 113, 113, 0.8);
      background: rgba(127, 29, 29, 0.5);
    }

    .tx-purchase {
      border-color: rgba(74, 222, 128, 0.8);
      background: rgba(22, 101, 52, 0.5);
    }

    .tx-main {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      font-size: 0.8rem;
    }

    .tx-desc {
      font-weight: 500;
    }

    .tx-meta {
      display: flex;
      gap: 0.5rem;
      color: #9ca3af;
      font-size: 0.72rem;
      flex-wrap: wrap;
    }

    .tx-id {
      opacity: 0.8;
    }

    .tx-amount {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .tx-amount-positive {
      color: #bbf7d0;
    }

    .tx-amount-negative {
      color: #fecaca;
    }

    .empty-state {
      margin-top: 0.6rem;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .link-button {
      border: none;
      background: transparent;
      color: #a5b4fc;
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 0.18rem;
    }

    /* Scrollbar tweaks */
    .dashboard-main::-webkit-scrollbar,
    .packages-row::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }

    .dashboard-main::-webkit-scrollbar-thumb,
    .packages-row::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.6);
      border-radius: 999px;
    }

    .dashboard-main::-webkit-scrollbar-track,
    .packages-row::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Responsive */
    @media (max-width: 960px) {
      .dashboard-shell {
        grid-template-columns: 220px minmax(0, 1fr);
      }

      .hero-row,
      .middle-row {
        grid-template-columns: minmax(0, 1fr);
      }

      .balance-body {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-shell {
        grid-template-columns: minmax(0, 1fr);
      }

      .sidebar {
        display: none;
      }

      .dashboard-main {
        padding: 1.25rem 1.1rem 1.5rem;
      }

      .topbar {
        flex-direction: column;
      }
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
