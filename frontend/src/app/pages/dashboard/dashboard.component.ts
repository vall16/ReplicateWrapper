import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div class="dashboard-shell">
      <!-- Left rail -->
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo">RX</div>
          <div class="brand-text">
            <span class="brand-title">AI Credit Console</span>
          </div>
        </div>

        <nav class="nav">
          <button class="nav-item nav-item-active">
            <span class="nav-dot"></span>
            <span>Dashboard</span>
          </button>
          <button class="nav-item" (click)="goToStore()">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/><line x1="13" y1="12" x2="11" y2="12"/></svg>
            <span>Token Store</span>
          </button>
          <button class="nav-item" (click)="goToTransactions()">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>History</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/gallery'])">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span>Gallery</span>
          </button>
        </nav>

        <div class="sidebar-footer" *ngIf="user">
          <div class="user-pill">
            <div class="avatar">{{ user.username.charAt(0) | uppercase }}</div>
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
              Monitor your AI credit balance, consumption and purchases in real-time.
            </p>
          </div>
          <div class="topbar-right">
            <div class="pill">
              <span class="pill-label">Available Tokens</span>
              <span class="pill-value">{{ balance?.tokens || 0 }}</span>
            </div>
          </div>
        </header>

        <!-- Hero row: balance + quick actions -->
        <section class="hero-row">
          <div class="glass-card balance-card">
            <div class="card-header">
              <div>
                <h2>Current Balance</h2>
                <p class="card-subtitle">Tokens available for your API calls</p>
              </div>
            </div>

            <div class="balance-body">
              <div class="balance-circle"
              (mouseenter)="isBalanceHovered = true"
              (mouseleave)="isBalanceHovered = false"
              [class.active]="isBalanceHovered"
              [class.low]="(balance?.tokens || 0) < 50"

              >
                <div class="balance-inner">
                  <span class="balance-value">{{ balance?.tokens || 0 }}</span>
                  <span class="balance-label">TOKEN</span>
                </div>
              </div>
              <div class="balance-side">
                <div class="balance-stat">
                  <span class="balance-stat-label">Tokens Consumed</span>
                  <span class="balance-stat-value negative">{{ totalConsumed }}</span>
                </div>
                <div class="balance-stat">
                  <span class="balance-stat-label">Tokens Purchased</span>
                  <span class="balance-stat-value positive">{{ totalPurchased }}</span>
                </div>
                <div
                  class="balance-warning"
                  *ngIf="(balance?.tokens || 0) === 0"
                >
                  No tokens available. Purchase a package to start using the APIs.
                </div>
                <button class="btn-primary" (click)="goToStore()">Buy Tokens</button>
              </div>
            </div>
          </div>

          <div class="glass-card profile-card">
            <div class="card-header">
              <div>
                <h2>Profile</h2>
                <p class="card-subtitle">Your account details</p>
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
                <span class="profile-label">User ID</span>
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
                <h2>Token Packages</h2>
                <p class="card-subtitle">Choose the best package</p>
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
              No packages configured. Go to the store to see available options.
            </div>
          </div>

          <div class="glass-card stats-card">
            <div class="card-header">
              <div>
                <h2>Usage Overview</h2>
                <p class="card-subtitle">Summary of recent activity</p>
              </div>
            </div>
            <div class="stats-grid">
              <div class="stat-chip">
                <span class="stat-label">Total Transactions</span>
                <span class="stat-value">{{ transactions.length }}</span>
              </div>
              <div class="stat-chip">
                <span class="stat-label">Tokens Consumed</span>
                <span class="stat-value negative">{{ totalConsumed }}</span>
              </div>
              <div class="stat-chip">
                <span class="stat-label">Tokens Purchased</span>
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
                <h2>Recent Transactions</h2>
                <p class="card-subtitle">Your most recent wallet movements</p>
              </div>
              <button
                class="link-button"
                *ngIf="transactions.length"
                (click)="goToTransactions()"
              >
                View All
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
                  {{ tx.transaction_type === 'consume' ? 'Consumed' : 'Purchased' }}
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
                No transactions yet. Movements will appear here as soon as you start using or purchasing tokens.
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
      min-height: 100vh;
      color: white;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 24%),
                  radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.16), transparent 20%),
                  linear-gradient(180deg, #0b1220 0%, #070b14 100%);
      transition: background 0.4s ease, color 0.3s ease;
    }

    .dashboard-shell {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      min-height: 100vh;
      background: transparent;
      color: var(--color-text-primary);
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      background: rgba(15, 23, 42, 0.76);
      border-right: 1px solid rgba(148, 163, 184, 0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--color-gradient-start), #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
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
      color: var(--color-text-primary);
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
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
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
    }

    .nav-item:hover {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      transform: translateY(-1px);
    }

    .nav-item-active {
      background: rgba(99, 102, 241, 0.15);
      color: var(--color-gradient-end);
      font-weight: 500;
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

    .nav-icon-svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
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
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: var(--color-bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-gradient-start);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .user-email {
      font-size: 0.72rem;
      color: var(--color-text-secondary);
    }

    .btn-logout {
      border-radius: 6px;
      border: 1px solid #fca5a5;
      background: var(--color-bg-secondary);
      color: #ef4444;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.1);
      transform: translateY(-1px);
    }

    .dashboard-main {
      padding: 1.75rem 2rem;
      overflow-y: auto;
      position: relative;
      background: rgba(15, 23, 42, 0.55);
      border-left: 1px solid rgba(148, 163, 184, 0.12);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
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
      color: var(--color-text-primary);
    }

    .page-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: var(--color-text-secondary);
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
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 130px;
      color: var(--color-text-primary);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .pill-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.11em;
      color: var(--color-text-tertiary);
    }

    .pill-value {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--color-gradient-start);
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
      background: rgba(15, 23, 42, 0.42);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
      overflow: hidden;
      transition: transform 0.25s ease, background 0.3s ease, border-color 0.3s ease;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 32%),
                  radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.1), transparent 24%);
      pointer-events: none;
      opacity: 0.85;
      mix-blend-mode: screen;
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
      color: var(--color-text-primary);
    }

    .card-subtitle {
      margin: 0.25rem 0 0;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .balance-body {
      display: grid;
      grid-template-columns: 1.3fr 1.5fr;
      gap: 1.25rem;
      align-items: center;
    }

    /* .balance-circle {
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
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
    }

    .balance-inner {
      width: 82%;
      height: 82%;
      border-radius: 999px;
      background: var(--color-bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 1px var(--color-border);
      color: var(--color-text-primary);
    } */

      @keyframes tokenPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  50% {
    box-shadow: 0 0 40px 10px rgba(99, 102, 241, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
}

@keyframes dangerShake {
  0%, 100% { transform: translateX(0) scale(1); }
  25% { transform: translateX(-2px) scale(1.03); }
  50% { transform: translateX(2px) scale(1.03); }
  75% { transform: translateX(-1px) scale(1.02); }
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
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
  transition: all 0.25s ease;
  position: relative;
}

/* INNER */
.balance-inner {
  width: 82%;
  height: 82%;
  border-radius: 999px;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px var(--color-border);
  transition: all 0.25s ease;
}

.balance-circle.active {
  transform: scale(1.08);
  animation: tokenPulse 0.6s ease-in-out infinite;
  filter: brightness(1.2);
}

.balance-circle.active .balance-inner {
  transform: scale(0.97);
}

.balance-circle.low {
  animation: dangerShake 0.6s ease-in-out infinite;
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.4);
}

    .balance-value {
      font-size: 2.1rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--color-text-primary);
    }

    .balance-label {
      margin-top: 0.1rem;
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
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
      background: var(--color-bg-tertiary);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
    }

    .balance-stat-label {
      font-size: 0.78rem;
      color: var(--color-text-secondary);
    }

    .balance-stat-value {
      font-size: 0.98rem;
      font-weight: 600;
    }

    .balance-stat-value.negative {
      color: #ef4444;
    }

    .balance-stat-value.positive {
      color: #10b981;
    }

    .balance-warning {
      margin-top: 0.35rem;
      font-size: 0.78rem;
      color: #ef4444;
    }

    .btn-primary {
      margin-top: 0.5rem;
      align-self: flex-start;
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      border: none;
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: white;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
      transition: transform 0.1s ease, background 0.15s ease;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      background: linear-gradient(135deg, #4f46e5, #3b82f6);
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
      color: var(--color-text-primary);
    }

    .profile-label {
      color: var(--color-text-secondary);
    }

    .profile-value {
      font-weight: 500;
      color: var(--color-text-primary);
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
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
      cursor: pointer;
      color: var(--color-text-primary);
      font-size: 0.8rem;
      transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .package-pill:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-gradient-start);
    }

    .package-name {
      font-weight: 600;
      font-size: 0.82rem;
      color: var(--color-text-primary);
    }

    .package-tokens {
      font-size: 0.78rem;
      color: var(--color-gradient-start);
    }

    .package-price {
      font-size: 0.76rem;
      color: #f59e0b;
      font-weight: 500;
    }

    .empty-packages {
      margin-top: 0.4rem;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.07);
      color: var(--color-text-primary);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .stat-label {
      color: var(--color-text-secondary);
    }

    .stat-value {
      font-size: 0.97rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .stat-value.negative {
      color: #ef4444;
    }

    .stat-value.positive {
      color: #10b981;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--color-text-primary);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .tx-pill {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      padding: 0.22rem 0.55rem;
      border-radius: 999px;
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      background: var(--color-bg-primary);
    }

    .tx-consume {
      border-color: #fca5a5;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .tx-purchase {
      border-color: #86efac;
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .tx-main {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      font-size: 0.8rem;
      color: var(--color-text-primary);
    }

    .tx-desc {
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .tx-meta {
      display: flex;
      gap: 0.5rem;
      color: var(--color-text-secondary);
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
      color: #10b981;
    }

    .tx-amount-negative {
      color: #ef4444;
    }

    .empty-state {
      margin-top: 0.6rem;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .link-button {
      border: none;
      background: transparent;
      color: var(--color-gradient-start);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 0.18rem;
    }

    .link-button:hover {
      color: var(--color-gradient-end);
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
        min-height: auto;
      }

      .sidebar {
        display: none;
      }

      .dashboard-main {
        padding: 1rem 16px 1.5rem;
        overflow-y: auto;
        max-height: auto;
      }

      .topbar {
        flex-direction: column;
        gap: 12px;
      }

      .hero-row,
      .middle-row,
      .bottom-row {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 12px;
      }

      .glass-card {
        padding: 16px;
      }

      .card-header {
        gap: 12px;
      }

      .card-header h2 {
        font-size: 1.05rem;
      }

      .balance-body {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .balance-stat {
        padding: 12px;
        gap: 6px;
      }

      .balance-stat-label {
        font-size: 0.75rem;
      }

      .balance-stat-value {
        font-size: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .stat-chip {
        padding: 12px;
        font-size: 0.75rem;
      }

      .packages-row {
        flex-wrap: wrap;
      }

      .package-pill {
        min-width: calc(50% - 8px);
      }

      .profile-body {
        gap: 12px;
      }

      .profile-row {
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .dashboard-main {
        padding: 12px;
      }

      .glass-card {
        padding: 12px;
      }

      .card-header {
        gap: 8px;
      }

      .card-header h2 {
        font-size: 1rem;
      }

      .card-subtitle {
        font-size: 0.75rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .stat-chip {
        padding: 10px;
        font-size: 0.7rem;
      }

      .package-pill {
        min-width: 100%;
        padding: 12px;
        font-size: 0.85rem;
      }

      .balance-stat-label {
        font-size: 0.7rem;
      }

      .transactions-list {
        gap: 8px;
      }

      .transaction-row {
        gap: 8px;
        padding: 8px;
        font-size: 0.75rem;
      }

      .btn-primary {
        width: 100%;
        padding: 10px;
        font-size: 0.85rem;
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
  t2iPrompt: string = '';
  t2iResult: string | null = null;
  t2iError: string | null = null;
  t2iLoading: boolean = false;
  t2iStyle = 'photorealistic';      // default
  t2iResolution = '1MP';            // default
  isBalanceHovered = false;



  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
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
        console.error('Error loading balance', error);
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
        console.error('Error loading transactions', error);
      }
    );
  }

  loadPackages() {
    this.authService.getTokenPackages().subscribe(
      (data) => {
        this.packages = data.packages || [];
      },
      (error) => {
        console.error('Error loading packages', error);
      }
    );
  }

  
  // ciao...
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
