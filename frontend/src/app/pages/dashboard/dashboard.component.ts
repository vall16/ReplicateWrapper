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
            <span class="brand-title">ReplicateXpress</span>
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

          <div class="glass-card chart-card">
            <div class="card-header">
              <div>
                <h2>Consumption (7 days)</h2>
                <p class="card-subtitle">Daily token usage</p>
              </div>
            </div>
            <div class="chart-grid">
              <div class="chart-col" *ngFor="let day of dailyConsumption">
                <div class="chart-bar-track">
                  <div class="chart-bar-fill" [style.height.%]="day.pct"></div>
                </div>
                <span class="chart-label">{{ day.label }}</span>
                <span class="chart-value">{{ day.value }}</span>
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
      color: #f8fafc;
      font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      background:
        radial-gradient(ellipse at 10% 0%, rgba(124, 58, 237, 0.25), transparent 40%),
        radial-gradient(ellipse at 90% 100%, rgba(6, 182, 212, 0.2), transparent 40%),
        radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.08), transparent 50%),
        linear-gradient(180deg, #080c1a 0%, #03050c 100%);
      transition: background 0.4s ease;
    }

    @keyframes dash-glowPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes dash-borderFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @keyframes dash-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @keyframes dash-shimmer {
      0% { left: -50%; opacity: 0; }
      50% { opacity: 1; }
      100% { left: 150%; opacity: 0; }
    }

    .dashboard-shell {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      min-height: 100vh;
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      background: rgba(10, 12, 28, 0.85);
      border-right: 1px solid rgba(148, 163, 184, 0.1);
      backdrop-filter: blur(24px);
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      position: relative;
    }

    .sidebar::after {
      content: '';
      position: absolute;
      top: 0;
      right: -1px;
      width: 1px;
      height: 100%;
      background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.5), rgba(6, 182, 212, 0.5), transparent);
      opacity: 0.6;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: relative;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
      color: white;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
      position: relative;
      overflow: hidden;
    }

    .brand-logo::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 14px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      filter: blur(12px);
      opacity: 0.6;
      z-index: -1;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      background: linear-gradient(90deg, #c084fc, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    .nav-item {
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 500;
      letter-spacing: 0.03em;
    }

    .nav-item:hover {
      background: rgba(124, 58, 237, 0.12);
      color: #f8fafc;
      transform: translateX(4px);
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);
    }

    .nav-item-active {
      background: rgba(124, 58, 237, 0.18) !important;
      color: #c084fc !important;
      box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.1);
    }

    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22d3ee;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.8);
      animation: dash-glowPulse 2s ease-in-out infinite;
    }

    .nav-icon-svg {
      width: 1.1rem;
      height: 1.1rem;
      flex-shrink: 0;
      opacity: 0.7;
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
      padding: 0.5rem 0.7rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(148, 163, 184, 0.12);
      position: relative;
      overflow: hidden;
    }

    .user-pill::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(180deg, #7c3aed, #06b6d4);
      opacity: 0.6;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.3);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .user-email {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .btn-logout {
      border-radius: 10px;
      border: 1px solid rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.08);
      color: #fca5a5;
      padding: 0.45rem 0.8rem;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 0 24px rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.6);
    }

    .dashboard-main {
      padding: 1.75rem 2rem;
      overflow-y: auto;
      position: relative;
      background: rgba(8, 12, 26, 0.5);
      border-left: 1px solid rgba(148, 163, 184, 0.06);
    }

    .dashboard-main::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), rgba(6, 182, 212, 0.4), transparent);
      opacity: 0.5;
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
      font-size: 1.8rem;
      letter-spacing: 0.04em;
      font-weight: 700;
      background: linear-gradient(120deg, #f8fafc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Space Grotesk', sans-serif;
    }

    .page-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.4);
      max-width: 420px;
      font-family: 'Inter', sans-serif;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pill {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      border: 1px solid rgba(124, 58, 237, 0.25);
      background: rgba(124, 58, 237, 0.08);
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 130px;
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }

    .pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), transparent);
      pointer-events: none;
    }

    .pill::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(124, 58, 237, 0.05), transparent 60%);
      animation: dash-borderFlow 6s linear infinite;
      pointer-events: none;
    }

    .pill-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(255, 255, 255, 0.4);
      position: relative;
      z-index: 1;
    }

    .pill-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #c084fc;
      position: relative;
      z-index: 1;
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
      padding: 1.3rem 1.4rem;
      background: rgba(12, 16, 32, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.08);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      backdrop-filter: blur(20px);
    }

    .glass-card:hover {
      border-color: rgba(124, 58, 237, 0.25);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 40px rgba(124, 58, 237, 0.08);
    }

    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.1), transparent 40%),
        radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.08), transparent 40%);
      pointer-events: none;
      opacity: 0.8;
    }

    .glass-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), rgba(6, 182, 212, 0.4), transparent);
      opacity: 0.4;
      transition: opacity 0.3s ease;
    }

    .glass-card:hover::after {
      opacity: 0.8;
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
      margin-bottom: 1rem;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
    }

    .card-subtitle {
      margin: 0.25rem 0 0;
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.35);
      font-family: 'Inter', sans-serif;
    }

    .balance-body {
      display: grid;
      grid-template-columns: 1.3fr 1.5fr;
      gap: 1.25rem;
      align-items: center;
    }

    @keyframes tokenPulse {
      0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5); }
      50% { box-shadow: 0 0 50px 12px rgba(124, 58, 237, 0.2); }
      100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5); }
    }

    @keyframes dangerShake {
      0%, 100% { transform: translateX(0) scale(1); }
      25% { transform: translateX(-3px) scale(1.03); }
      50% { transform: translateX(3px) scale(1.03); }
      75% { transform: translateX(-2px) scale(1.02); }
    }

    @keyframes conicRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .balance-circle {
      width: 180px;
      height: 180px;
      border-radius: 999px;
      background:
        conic-gradient(
          from 200deg,
          rgba(52, 211, 153, 0.8),
          rgba(6, 182, 212, 0.9),
          rgba(124, 58, 237, 0.9),
          rgba(236, 72, 153, 0.8),
          rgba(52, 211, 153, 0.8)
        );
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.1);
      transition: all 0.3s ease;
      position: relative;
      animation: dash-float 6s ease-in-out infinite;
    }

    .balance-circle::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 999px;
      background: inherit;
      filter: blur(20px);
      opacity: 0.3;
      z-index: -1;
    }

    .balance-inner {
      width: 82%;
      height: 82%;
      border-radius: 999px;
      background: rgba(8, 12, 26, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.15), inset 0 0 30px rgba(124, 58, 237, 0.1);
      transition: all 0.25s ease;
    }

    .balance-circle.active {
      transform: scale(1.08);
      animation: tokenPulse 0.8s ease-in-out infinite, dash-float 6s ease-in-out infinite;
      filter: brightness(1.3);
    }

    .balance-circle.active .balance-inner {
      transform: scale(0.97);
    }

    .balance-circle.low {
      animation: dangerShake 0.6s ease-in-out infinite !important;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
    }

    .balance-value {
      font-size: 2.1rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
    }

    .balance-label {
      margin-top: 0.1rem;
      font-size: 0.65rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.3);
    }

    .balance-side {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .balance-stat {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0.45rem 0.6rem;
      border-radius: 0.9rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.08);
      transition: border-color 0.2s ease;
    }

    .balance-stat:hover {
      border-color: rgba(124, 58, 237, 0.2);
    }

    .balance-stat-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .balance-stat-value {
      font-size: 0.95rem;
      font-weight: 700;
    }

    .balance-stat-value.negative {
      color: #fca5a5;
    }

    .balance-stat-value.positive {
      color: #6ee7b7;
    }

    .balance-warning {
      margin-top: 0.35rem;
      font-size: 0.78rem;
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.08);
      padding: 0.4rem 0.6rem;
      border-radius: 8px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .btn-primary {
      margin-top: 0.5rem;
      align-self: flex-start;
      padding: 0.65rem 1.4rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(45deg, #7c3aed, #06b6d4);
      background-size: 200% 200%;
      animation: gradientBG 4s ease infinite;
      color: white;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: 'Space Grotesk', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .btn-primary:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
    }

    .btn-primary::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 40%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: rotate(20deg);
      transition: left 0.5s ease;
    }

    .btn-primary:hover::after {
      left: 120%;
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .profile-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.3rem;
    }

    .profile-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0.4rem 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.06);
      font-size: 0.82rem;
    }

    .profile-row:last-child {
      border-bottom: none;
    }

    .profile-label {
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 0.72rem;
    }

    .profile-value {
      font-weight: 600;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
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
      flex: 1;
      border-radius: 1rem;
      padding: 0.7rem 0.9rem;
      border: 1px solid rgba(148, 163, 184, 0.08);
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.25s ease;
      white-space: nowrap;
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
      color: #f8fafc;
    }

    .package-pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), transparent);
      pointer-events: none;
    }

    .package-pill:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.15);
      border-color: rgba(124, 58, 237, 0.3);
      background: rgba(124, 58, 237, 0.06);
    }

    .package-name {
      font-weight: 700;
      font-size: 0.82rem;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.03em;
    }

    .package-tokens {
      font-size: 0.75rem;
      color: #c084fc;
    }

    .package-price {
      font-size: 0.78rem;
      color: #22d3ee;
      font-weight: 600;
    }

    .empty-packages {
      margin-top: 0.4rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.65rem;
      margin-top: 0.4rem;
    }

    .stat-chip {
      border-radius: 0.9rem;
      padding: 0.6rem 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.08);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.07);
      backdrop-filter: blur(12px);
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .stat-chip:hover {
      border-color: rgba(124, 58, 237, 0.2);
      transform: translateY(-2px);
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 0.7rem;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 700;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
    }

    .stat-value.negative {
      color: #fca5a5;
    }

    .stat-value.positive {
      color: #6ee7b7;
    }

    .chart-card {
      min-height: 200px;
    }

    .chart-grid {
      display: flex;
      align-items: flex-end;
      gap: 0.4rem;
      height: 130px;
      padding: 0.5rem 0.2rem 0;
      justify-content: space-between;
    }

    .chart-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      height: 100%;
      justify-content: flex-end;
      min-width: 0;
    }

    .chart-bar-track {
      width: 100%;
      max-width: 32px;
      flex: 1;
      border-radius: 999px 999px 4px 4px;
      background: rgba(148, 163, 184, 0.06);
      position: relative;
      overflow: hidden;
      min-height: 4px;
      display: flex;
      align-items: flex-end;
    }

    .chart-bar-fill {
      width: 100%;
      border-radius: 999px 999px 4px 4px;
      background: linear-gradient(180deg, #7c3aed, #06b6d4);
      transition: height 0.8s ease;
      min-height: 4px;
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.3);
    }

    .chart-label {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .chart-value {
      font-size: 0.68rem;
      font-weight: 700;
      color: #c084fc;
      font-family: 'Space Grotesk', sans-serif;
    }

    .transactions-card {
      min-height: 220px;
    }

    .transactions-list {
      margin-top: 0.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .transaction-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.7rem;
      align-items: center;
      padding: 0.55rem 0.6rem;
      border-radius: 0.9rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(148, 163, 184, 0.06);
      backdrop-filter: blur(12px);
      transition: all 0.2s ease;
    }

    .transaction-row:hover {
      background: rgba(124, 58, 237, 0.04);
      border-color: rgba(124, 58, 237, 0.15);
      transform: translateX(4px);
    }

    .tx-pill {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.15);
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.03);
      font-weight: 600;
    }

    .tx-consume {
      border-color: rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.08);
      color: #fca5a5;
    }

    .tx-purchase {
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.08);
      color: #6ee7b7;
    }

    .tx-main {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      font-size: 0.8rem;
    }

    .tx-desc {
      font-weight: 600;
      color: #f8fafc;
    }

    .tx-meta {
      display: flex;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.3);
      font-size: 0.7rem;
      flex-wrap: wrap;
    }

    .tx-id {
      opacity: 0.6;
    }

    .tx-amount {
      font-size: 0.9rem;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
    }

    .tx-amount-positive {
      color: #6ee7b7;
    }

    .tx-amount-negative {
      color: #fca5a5;
    }

    .empty-state {
      margin-top: 0.6rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .link-button {
      border: none;
      background: transparent;
      color: #c084fc;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .link-button:hover {
      color: #22d3ee;
      transform: translateX(2px);
    }

    .dashboard-main::-webkit-scrollbar,
    .packages-row::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }

    .dashboard-main::-webkit-scrollbar-thumb,
    .packages-row::-webkit-scrollbar-thumb {
      background: rgba(124, 58, 237, 0.3);
      border-radius: 999px;
    }

    .dashboard-main::-webkit-scrollbar-track,
    .packages-row::-webkit-scrollbar-track {
      background: transparent;
    }

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
        justify-items: center;
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
        justify-items: center;
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
        padding: 12px;
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
  balanceLoading: boolean = true;
  dailyConsumption: { label: string; value: number; pct: number }[] = [];

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.fetchBalance();
    this.loadTransactions();
    this.loadPackages();
  }

  fetchBalance() {
    this.balanceLoading = true;
    this.authService.getBalance().subscribe(
      (balance) => {
        this.balance = balance;
        this.balanceLoading = false;
      },
      (error) => {
        console.error('Error fetching balance:', error);
        this.balanceLoading = false;
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

    this.calculateDailyConsumption();
  }

  calculateDailyConsumption() {
    const days: { label: string; date: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        date: dateStr,
        value: 0
      });
    }

    this.transactions.forEach(tx => {
      if (tx.transaction_type === 'consume') {
        const txDate = tx.created_at?.split('T')[0];
        const day = days.find(d => d.date === txDate);
        if (day) {
          day.value += Math.abs(tx.amount);
        }
      }
    });

    const max = Math.max(...days.map(d => d.value), 1);
    this.dailyConsumption = days.map(d => ({
      label: d.label,
      value: d.value,
      pct: (d.value / max) * 100
    }));
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
