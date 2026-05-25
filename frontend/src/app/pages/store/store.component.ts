import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-shell">
      <header class="store-topbar">
        <div>
          <h1 class="store-title">Token Store</h1>
          <p class="store-subtitle">
            Choose the perfect AI credit package for your Replicate workflow.
          </p>
        </div>
        <button class="btn-link" (click)="goBack()">
          Back to Dashboard
        </button>
      </header>

      <section class="store-main">
        <div class="glass-card hero-card">
          <div class="hero-copy">
            <h2>Select Your Token Plan</h2>
            <p>
              Credits are auto-scaled with each API call. No expiration, maximum
              transparency.
            </p>
            <ul class="hero-list">
              <li>Token price always visible before purchase</li>
              <li>Secure checkout via payment provider</li>
              <li>Real-time balance updates in dashboard</li>
            </ul>
          </div>
          <div class="hero-security">
            <div class="security-chip-row">
              <div class="security-chip">SSL 256-bit</div>
              <div class="security-chip">PCI-DSS compliant</div>
            </div>
            <div class="security-lock">
              <div class="lock-ring">
                <div class="lock-inner">✓</div>
              </div>
              <span>End-to-end protected payments</span>
            </div>
          </div>
        </div>

        <div class="packages-grid" *ngIf="packages?.length; else emptyPackages">
          <div
            *ngFor="let pkg of packages; let i = index"
            class="glass-card package-card"
            [class.package-featured]="pkg.badge"
            [style.animation-delay]="(i * 0.1) + 's'"
          >
            <!-- Premium Gradient Overlay -->
            <div class="package-shine"></div>
            
            <!-- Badge Container -->
            <div class="badge-container">
              <span *ngIf="pkg.badge" class="package-badge">{{ pkg.badge }}</span>
              <span *ngIf="pkg.badge" class="badge-glow"></span>
            </div>

            <!-- Header Section -->
            <div class="package-header">
              <div class="header-content">
                <div class="package-tier">
                  <span class="tier-icon" [innerHTML]="getTierIcon(pkg.name)"></span>
                  <h3 class="package-name">{{ pkg.name }}</h3>
                </div>
                <p class="package-description">{{ pkg.description }}</p>
              </div>
            </div>

            <!-- Main Value Section -->
            <div class="package-value-section">
              <div class="tokens-showcase">
                <div class="tokens-number">
                  <span class="tokens-value">{{ formatNumber(pkg.tokens) }}</span>
                  <span class="tokens-unit">Tokens</span>
                </div>
              </div>

              <div class="price-section">
                <div class="price-display">
                  <span class="price-currency">€</span><span class="price-amount">{{ pkg.price }}</span>
                </div>
                <div class="unit-price">
                  <span class="unit-label">€{{ (pkg.price / pkg.tokens).toFixed(4) }}/token</span>
                  <span *ngIf="getBestValue(pkg)" class="value-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="vertical-align:middle;margin-right:3px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Best Value
                  </span>
                </div>
              </div>
            </div>

            <!-- Value Indicator Bar -->
            <div class="value-indicator">
              <div class="indicator-bar" [style.width]="getValuePercentage(pkg) + '%'"></div>
            </div>

            <!-- CTA Button -->
            <button
              class="btn-purchase"
              [class.btn-featured]="pkg.badge"
              (click)="purchasePackage(pkg)"
              [disabled]="isPurchasing"
            >
              <span *ngIf="isPurchasing && selectedPackage?.id === pkg.id" class="btn-loading">
                <span class="spinner"></span>Processing...
              </span>
              <span *ngIf="!(isPurchasing && selectedPackage?.id === pkg.id)" class="btn-text">
                Get Tokens
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </div>
        </div>

        <ng-template #emptyPackages>
          <div class="glass-card empty-state">
            No package is currently configured. Please try again later or contact the administrator.
          </div>
        </ng-template>

        <div *ngIf="error" class="feedback feedback-error">
          {{ error }}
        </div>

        <div *ngIf="success" class="feedback feedback-success">
          <span>{{ success }}</span>
          <button class="btn-ghost" (click)="goToDashboard()">Vai al dashboard</button>
        </div>

        <section class="faq-row">
          <div class="glass-card faq-card">
            <h3>What are tokens?</h3>
          <p>
            Each API call to your wrapper consumes a predefined number of tokens. Tokens
            do not expire and can be used anytime.
          </p>

                    </div>
                    <div class="glass-card faq-card">
                      <h3>How does billing work?</h3>
          <p>
            You only pay for the packages you purchase. All payments are processed through
            a certified provider that does not expose your data to the backend.
          </p>

          </div>
          <div class="glass-card faq-card">
            <h3>Can I see my purchase history?</h3>
<p>
  Yes, in the dashboard section you can find all transactions with details such as
  date, amount, and operation type.
</p>
          </div>
        </section>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      background:
        radial-gradient(ellipse at 10% 0%, rgba(124, 58, 237, 0.25), transparent 40%),
        radial-gradient(ellipse at 90% 100%, rgba(6, 182, 212, 0.2), transparent 40%),
        radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.08), transparent 50%),
        linear-gradient(180deg, #080c1a 0%, #03050c 100%);
      transition: background 0.4s ease;
    }

    @keyframes store-borderFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @keyframes store-shimmer {
      0% { left: -50%; opacity: 0; }
      50% { opacity: 1; }
      100% { left: 150%; opacity: 0; }
    }

    .store-shell {
      max-width: 1120px;
      margin: 0 auto;
      padding: 1.75rem 1.5rem 2.5rem;
    }

    .store-topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
    }

    .store-title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      background: linear-gradient(120deg, #f8fafc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .store-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.4);
      max-width: 420px;
    }

    .btn-ghost {
      border-radius: 10px;
      border: 1px solid rgba(148, 163, 184, 0.15);
      background: rgba(255, 255, 255, 0.03);
      color: rgba(255, 255, 255, 0.6);
      padding: 0.5rem 1rem;
      font-size: 0.78rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn-ghost:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: #c084fc;
      transform: translateY(-2px);
    }

    .btn-link {
      background: transparent;
      border: 1px solid rgba(124, 58, 237, 0.3);
      color: #c084fc;
      padding: 0.45rem 0.9rem;
      border-radius: 10px;
      font-size: 0.78rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn-link:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: #7c3aed;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
      transform: translateY(-2px);
    }

    .store-main {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
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

    .hero-card {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
      gap: 1.4rem;
      align-items: center;
    }

    .hero-copy h2 {
      margin: 0;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: #f8fafc;
    }

    .hero-copy p {
      margin: 0.45rem 0 0.6rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .hero-list {
      list-style: none;
      padding: 0;
      margin: 0.35rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .hero-list li::before {
      content: "▸";
      display: inline-block;
      margin-right: 0.4rem;
      color: #c084fc;
    }

    .hero-security {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      align-items: flex-end;
    }

    .security-chip-row {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .security-chip {
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      border: 1px solid rgba(6, 182, 212, 0.2);
      font-size: 0.68rem;
      color: #22d3ee;
      background: rgba(6, 182, 212, 0.06);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }

    .security-lock {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .lock-ring {
      width: 50px;
      height: 50px;
      border-radius: 999px;
      background: conic-gradient(from 220deg, #10b981, #7c3aed, #06b6d4, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
      animation: dash-float 6s ease-in-out infinite;
    }

    @keyframes dash-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .lock-inner {
      width: 76%;
      height: 76%;
      border-radius: 999px;
      background: rgba(8, 12, 26, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      color: #6ee7b7;
    }

    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin: 0;
    }

    .package-card {
      position: relative;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.6rem 1.4rem;
      animation: slideInUp 0.6s ease-out;
      background: rgba(12, 16, 32, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.08);
      border-radius: 1.25rem;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(20px);
      overflow: hidden;
    }

    .package-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.08), transparent 40%),
        radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.06), transparent 40%);
      pointer-events: none;
    }

    .package-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.3), transparent);
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }

    .package-shine {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    }

    .package-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 40px rgba(124, 58, 237, 0.12);
      border-color: rgba(124, 58, 237, 0.3);
    }

    .package-card:hover::after {
      opacity: 0.7;
    }

    .package-featured {
      border: 1px solid rgba(245, 158, 11, 0.3) !important;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 40px rgba(245, 158, 11, 0.08) !important;
    }

    .package-featured::after {
      background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent) !important;
    }

    .package-featured:hover {
      transform: translateY(-8px) scale(1.04);
      border-color: rgba(245, 158, 11, 0.5) !important;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 60px rgba(245, 158, 11, 0.15) !important;
    }

    .badge-container {
      position: relative;
      margin-bottom: 0.25rem;
    }

    .package-badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
      position: relative;
      z-index: 2;
    }

    .badge-glow {
      position: absolute;
      inset: -6px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 100%);
      border-radius: 999px;
      animation: store-pulse 2s ease-in-out infinite;
    }

    @keyframes store-pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    .package-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .package-tier {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .tier-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border-radius: 12px;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
    }

    .tier-icon svg {
      width: 18px;
      height: 18px;
      stroke: white;
      fill: none;
    }

    .package-featured .tier-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
    }

    .package-name {
      font-weight: 700;
      font-size: 1.1rem;
      color: #f8fafc;
      letter-spacing: 0.03em;
    }

    .package-featured .package-name {
      background: linear-gradient(135deg, #fcd34d, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .package-description {
      margin: 0;
      font-size: 0.78rem;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 500;
    }

    .package-value-section {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 0.9rem;
      border: 1px solid rgba(148, 163, 184, 0.08);
    }

    .package-featured .package-value-section {
      background: rgba(245, 158, 11, 0.04);
      border-color: rgba(245, 158, 11, 0.15);
    }

    .tokens-showcase {
      text-align: center;
      padding: 0.3rem 0;
    }

    .tokens-number {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .tokens-value {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #c084fc, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .package-featured .tokens-value {
      background: linear-gradient(135deg, #fcd34d, #f59e0b);
    }

    .tokens-unit {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 600;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .price-display {
      text-align: center;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.2rem;
    }

    .price-currency {
      font-size: 0.95rem;
      font-weight: 600;
      color: #c084fc;
    }

    .package-featured .price-currency {
      color: #fcd34d;
    }

    .price-amount {
      font-size: 1.8rem;
      font-weight: 800;
      color: #f8fafc;
    }

    .package-featured .price-amount {
      color: #f59e0b;
    }

    .unit-price {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }

    .unit-label {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.3);
      font-weight: 500;
    }

    .value-tag {
      font-size: 0.68rem;
      color: #6ee7b7;
      font-weight: 700;
      display: inline-block;
      background: rgba(16, 185, 129, 0.08);
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .value-indicator {
      height: 4px;
      background: rgba(148, 163, 184, 0.1);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 0.25rem;
    }

    .indicator-bar {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed, #06b6d4);
      border-radius: 999px;
      transition: width 0.6s ease-out;
    }

    .package-featured .indicator-bar {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .btn-purchase {
      margin-top: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(45deg, #7c3aed, #06b6d4);
      background-size: 200% 200%;
      animation: gradientBG 4s ease infinite;
      color: white;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn-purchase::before {
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

    .btn-purchase:hover:not(:disabled)::before {
      left: 120%;
    }

    .btn-purchase:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
    }

    .btn-purchase:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
    }

    .btn-featured {
      background: linear-gradient(45deg, #f59e0b, #d97706) !important;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4) !important;
      animation: gradientBG 4s ease infinite !important;
    }

    .btn-featured:hover:not(:disabled) {
      box-shadow: 0 8px 30px rgba(245, 158, 11, 0.6) !important;
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .btn-purchase:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-arrow {
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .btn-purchase:hover:not(:disabled) .btn-arrow {
      transform: translateX(6px);
    }

    .btn-loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 999px;
      animation: store-spin 0.8s linear infinite;
    }

    @keyframes store-spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .feedback {
      border-radius: 0.9rem;
      padding: 0.7rem 0.9rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .feedback-error {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    .feedback-success {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    .faq-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }

    .faq-card {
      padding: 1.5rem;
    }

    .faq-card h3 {
      margin: 0 0 0.6rem;
      font-size: 1rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: 0.03em;
    }

    .faq-card p {
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.45);
    }

    @media (max-width: 900px) {
      .hero-card {
        grid-template-columns: minmax(0, 1fr);
      }

      .hero-security {
        align-items: flex-start;
      }

      .packages-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.25rem;
      }

      .faq-row {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .store-shell {
        padding: 1rem 16px 1.75rem;
      }

      .store-topbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 1.25rem;
      }

      .store-title {
        font-size: 1.4rem;
      }

      .store-subtitle {
        font-size: 0.8rem;
      }

      .hero-card {
        grid-template-columns: 1fr;
      }

      .hero-security {
        align-items: flex-start;
        gap: 12px;
      }

      .security-chip-row {
        gap: 8px;
      }

      .security-chip {
        font-size: 0.65rem;
        padding: 0.2rem 0.5rem;
      }

      .packages-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .package-card {
        padding: 1.2rem 1rem;
        gap: 0.8rem;
      }

      .package-name {
        font-size: 1rem;
      }

      .price-amount {
        font-size: 1.5rem;
      }

      .btn-purchase {
        padding: 10px 14px;
        font-size: 0.85rem;
      }

      .faq-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .faq-card {
        padding: 1.2rem 1rem;
      }

      .faq-card h3 {
        font-size: 0.95rem;
      }

      .faq-card p {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .store-shell {
        padding: 12px 12px 1.5rem;
      }

      .store-topbar {
        gap: 8px;
      }

      .store-title {
        font-size: 1.2rem;
      }

      .store-subtitle {
        font-size: 0.75rem;
      }

      .btn-ghost {
        padding: 8px 12px;
        font-size: 0.75rem;
      }

      .packages-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .package-card {
        padding: 1rem 0.9rem;
      }

      .package-name {
        font-size: 0.95rem;
      }

      .package-description {
        font-size: 0.75rem;
      }

      .price-amount {
        font-size: 1.3rem;
      }

      .tokens-unit {
        font-size: 0.7rem;
      }

      .btn-purchase {
        padding: 8px 12px;
        font-size: 0.8rem;
      }

      .faq-row {
        gap: 12px;
      }

      .faq-card {
        padding: 1rem;
      }

      .faq-card h3 {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .faq-card p {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 640px) {
      .store-shell {
        padding: 1.3rem 1rem 2rem;
      }

      .store-topbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class StoreComponent implements OnInit {
  packages: any[] = [];
  isPurchasing = false;
  selectedPackage: any = null;
  error = '';
  success = '';
  // stripe properties no longer needed; we redirect to Checkout

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private stripeService: StripeService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadPackages();

    // se veniamo dalla pagina di successo/cancellazione di Stripe controlliamo i parametri
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success' && params['session_id']) {
        const sessionId = params['session_id'];
        // chiedi al backend di confermare e accreditare i token
        this.authService.confirmCheckout(sessionId).subscribe(
          (res: any) => {
            this.success = `✅ Payment confirmed, ${res.tokens_added} tokens credited!`;
            // aggiorna il saldo utente nel localStorage (chiama getBalance per aggiornare)
            this.authService.getBalance().subscribe(balance => {
              const user = this.authService.getCurrentUser();
              if (user) {
                user.tokens = balance.tokens;
                localStorage.setItem('user', JSON.stringify(user));
              }
            });

            // pulisci i parametri dalla URL per non ripetere la procedura
            this.router.navigate([], { queryParams: {} });
          },
          (err) => {
            console.error('Errore conferma checkout', err);
            this.error = 'Unable to confirm payment';
          }
        );
      } else if (params['payment'] === 'cancel') {
        this.error = 'Payment cancelled';
      }
    });

    // (non serviamo più la key lato client dato che usiamo redirect to checkout)
    // se fosse necessario per redirectToCheckout possiamo recuperarla con getPublishableKey()
  }

  loadPackages() {
    this.authService.getTokenPackages().subscribe(
      (data) => {
        console.log('PACKAGES RESPONSE:', data);

        this.packages = data.packages || [];

        console.log('PACKAGES ARRAY:', this.packages);

      },
      (err) => {
        console.error(err);
        this.error = 'Error loading packages';
      }
    );
  }


  purchasePackage(pkg: any) {
    this.isPurchasing = true;
    this.selectedPackage = pkg;
    this.error = '';
    this.success = '';

    // chiediamo al backend di creare una sessione Checkout
    this.stripeService.createCheckoutSession(pkg).subscribe(
      (res) => {
        if (res && res.url) {
          // redirect alla pagina ufficiale di Stripe
          window.location.href = res.url;
        } else {
          this.error = 'Unable to start payment';
          this.isPurchasing = false;
        }
      },
      (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error initializing checkout';
        this.isPurchasing = false;
      }
    );
  }

  // non ci serve più gestire l'intento; la logica è rimossa



  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Returns a safe SVG icon based on the package tier name
   */
  getTierIcon(name: string): SafeHtml {
    const lowerName = (name || '').toLowerCase();
    let svg: string;
    // Rocket: starter / small
    if (lowerName.includes('starter') || lowerName.includes('small'))
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`;
    // Zap: pro / medium / creator
    else if (lowerName.includes('pro') || lowerName.includes('medium') || lowerName.includes('creator'))
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    // Crown: max / enterprise / large / unlimited
    else if (lowerName.includes('max') || lowerName.includes('enterprise') || lowerName.includes('large') || lowerName.includes('unlimited'))
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="m4 20 2-10 6 6 6-6 2 10"/><circle cx="12" cy="6" r="2"/></svg>`;
    // Star: premium
    else if (lowerName.includes('premium'))
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    // Diamond: default fallback
    else
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/></svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  /**
   * Formats a number with thousand separators
   */
  formatNumber(num: number): string {
    if (!num) return '0';
    return num.toLocaleString('en-US');
  }

  /**
   * Determines if a package represents the best value (lowest price per token)
   */
  getBestValue(pkg: any): boolean {
    if (!this.packages || this.packages.length === 0) return false;
    
    const costPerToken = pkg.price / pkg.tokens;
    const minCostPerToken = Math.min(...this.packages.map(p => p.price / p.tokens));
    
    return Math.abs(costPerToken - minCostPerToken) < 0.0001;
  }

  /**
   * Calculates the value percentage for the indicator bar (0-100)
   * Higher value = better deal relative to the most expensive package
   */
  getValuePercentage(pkg: any): number {
    if (!this.packages || this.packages.length === 0) return 50;
    
    const costPerToken = pkg.price / pkg.tokens;
    const maxCostPerToken = Math.max(...this.packages.map(p => p.price / p.tokens));
    const minCostPerToken = Math.min(...this.packages.map(p => p.price / p.tokens));
    
    if (maxCostPerToken === minCostPerToken) return 50;
    
    // Inverse: lower cost per token = higher percentage
    const percentage = 100 - ((costPerToken - minCostPerToken) / (maxCostPerToken - minCostPerToken)) * 100;
    return Math.max(20, Math.min(100, percentage));
  }


}
  