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
      color: #1f2937;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }
      :host-context(.dark-mode) {
  color: #e5e7eb;
}

:host-context(.dark-mode) .glass-card {
  background: #0f172a;
  border: 1px solid #334155;
  color: #e5e7eb;
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
      font-size: 1.7rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #cbd5e1;
    }

    .store-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.86rem;
      color: #cbd5e1;;
      max-width: 420px;
    }

    .btn-ghost {
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #4b5563;
      padding: 0.42rem 0.9rem;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .btn-ghost:hover {
      background: #f3f4f6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    .btn-link {
      background: transparent;
      border: 1px solid #2563eb;
      color: #2563eb;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
    }

    .store-main {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .glass-card {
      position: relative;
      border-radius: 1.2rem;
      padding: 1.25rem 1.3rem;
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
      font-weight: 600;
      color: #dfe3e7ff;
    }

    .hero-copy p {
      margin: 0.45rem 0 0.6rem;
      font-size: 0.85rem;
      color: #3179d6;
    }

    .hero-list {
      list-style: none;
      padding: 0;
      margin: 0.35rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #cbd5e1;;
    }

    .hero-list li::before {
      content: "•";
      display: inline-block;
      margin-right: 0.4rem;
      color: #6366f1;
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
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1px solid #d1d5db;
      font-size: 0.72rem;
      color: #374151;
      background: #ffffff;
    }

    .security-lock {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #4b5563;
    }

    .lock-ring {
      width: 50px;
      height: 50px;
      border-radius: 999px;
      background: conic-gradient(from 220deg, #10b981, #6366f1, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
    }

    .lock-inner {
      width: 76%;
      height: 76%;
      border-radius: 999px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      color: #10b981;
    }

    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin: 0;
    }

    /* ===== PACKAGE CARD STYLES ===== */
    .package-card {
      position: relative;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.6rem 1.4rem;
      animation: slideInUp 0.6s ease-out forwards;
      opacity: 0;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .package-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
      border-radius: 1.2rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .package-shine {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      border-radius: 1.2rem;
    }

    .package-card:hover::before {
      opacity: 1;
    }

    .package-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
      border-color: #6366f1;
    }

    .package-featured {
      border: 2px solid #f59e0b !important;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
      transform: scale(1.05);
    }

    .package-featured:hover {
      transform: translateY(-8px) scale(1.07);
      box-shadow: 0 25px 50px rgba(245, 158, 11, 0.3);
    }

    /* Badge Container */
    .badge-container {
      position: relative;
      margin-bottom: 0.25rem;
    }

    .package-badge {
      display: inline-block;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      position: relative;
      z-index: 2;
    }

    .badge-glow {
      position: absolute;
      inset: -4px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 100%);
      border-radius: 999px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Header Section */
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
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 10px;
      color: white;
      flex-shrink: 0;
    }

    .tier-icon svg {
      width: 18px;
      height: 18px;
      stroke: white;
      fill: none;
    }

    .package-featured .tier-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    /* .package-name {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    } */

    .package-name {
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  color: #eceff5; /* chiaro e leggibile */
  font-weight: 700;
}

    .package-featured .package-name {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .package-description {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1.4;
      color: #6b7280;
      font-weight: 500;
    }

    .package-featured .package-description {
      color: #92400e;
    }

    /* Value Section */
    .package-value-section {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 0.8rem;
      border: 1px solid #e5e7eb;
    }

    .package-featured .package-value-section {
      background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
      border-color: #fcd34d;
    }

    .tokens-showcase {
      text-align: center;
      padding: 0.5rem 0;
    }

    .tokens-number {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tokens-value {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .package-featured .tokens-value {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tokens-unit {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #9ca3af;
      font-weight: 600;
    }

    .package-featured .tokens-unit {
      color: #b45309;
    }

    /* Price Section */
    .price-section {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
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
      color: #6366f1;
    }

    .package-featured .price-currency {
      color: #f59e0b;
    }

    .price-amount {
      font-size: 1.8rem;
      font-weight: 800;
      color: #1f2937;
    }

    .package-featured .price-amount {
      color: #d97706;
    }

    .unit-price {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
    }

    .unit-label {
      font-size: 0.72rem;
      color: #9ca3af;
      font-weight: 500;
    }

    .package-featured .unit-label {
      color: #b45309;
    }

    .value-tag {
      font-size: 0.7rem;
      color: #10b981;
      font-weight: 700;
      display: inline-block;
    }

    /* Value Indicator */
    .value-indicator {
      height: 4px;
      background: #e5e7eb;
      border-radius: 999px;
      overflow: hidden;
      margin-top: 0.25rem;
    }

    .indicator-bar {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 999px;
      transition: width 0.6s ease-out;
    }

    .package-featured .indicator-bar {
      background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
    }

    /* CTA Button */
    .btn-purchase {
      margin-top: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .btn-purchase::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .btn-purchase:hover:not(:disabled)::before {
      opacity: 1;
    }

    .btn-purchase:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }

    .btn-purchase:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-featured {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
    }

    .btn-featured:hover:not(:disabled) {
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    }

    .btn-purchase:disabled {
      opacity: 0.6;
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
      transform: translateX(4px);
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
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      font-size: 0.85rem;
      color: #4b5563;
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
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #ef4444;
    }

    .feedback-success {
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #10b981;
    }

/* --- FAQ Section Base (Light Mode) --- */
.faq-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}

.faq-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.faq-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff; /* Grigio quasi nero per massima leggibilità */
}

.faq-card p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #1248dd; /* Grigio scuro leggibile */
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

      .tokens-display {
        font-size: 0.9rem;
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
  
    :host-context(.dark-mode) {
  color: #e5e7eb;
}

/* 🔥 FORZA TUTTI I TESTI LEGGIBILI */
:host-context(.dark-mode) h1,
:host-context(.dark-mode) h2,
:host-context(.dark-mode) h3,
:host-context(.dark-mode) p,
:host-context(.dark-mode) span,
:host-context(.dark-mode) small,
:host-context(.dark-mode) li {
  color: #e5e7eb !important;
}

/* testi secondari più soft */
:host-context(.dark-mode) .store-subtitle,
:host-context(.dark-mode) .hero-copy p,
:host-context(.dark-mode) .package-description,
:host-context(.dark-mode) .price-unit,
:host-context(.dark-mode) .tokens-label,
:host-context(.dark-mode) .faq-card p {
  color: #94a3b8 !important;
}

/* card scure corrette */
:host-context(.dark-mode) .glass-card {
  background: #0f172a;
  border: 1px solid #334155;
}

/* chip leggibili */
:host-context(.dark-mode) .security-chip {
  background: #111827;
  border: 1px solid #334155;
  color: #e5e7eb;
}

/* bottoni ghost leggibili */
:host-context(.dark-mode) .btn-ghost {
  background: transparent;
  border: 1px solid #334155;
  color: #e5e7eb;
}

:host-context(.dark-mode) .btn-ghost:hover {
  background: #1e293b;
}
/* --- Dark Mode Overrides --- */
:host-context(.dark-mode) .faq-card {
  background: #1e293b !important; /* Blu scuro profondo invece di nero totale */
  border: 1px solid #334155 !important;
}

:host-context(.dark-mode) .faq-card h3 {
  color: #f8fafc !important; /* Bianco sporco brillante */
}

:host-context(.dark-mode) .faq-card p {
  color: #cbd5e1 !important; /* Grigio chiaro con alto contrasto */
}

/* Fix per il contenitore generale in Dark Mode */
:host-context(.dark-mode) .store-shell {
  color: #f1f5f9;
}

/* Dark mode package cards */
:host-context(.dark-mode) .package-card {
  background: #1e293b;
  border: 1px solid #334155;
}

:host-context(.dark-mode) .package-card:hover {
  border-color: #6366f1;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

:host-context(.dark-mode) .package-featured {
  background: linear-gradient(135deg, #4b3409 0%, #5a3a1a 100%);
  border-color: #f59e0b;
}

:host-context(.dark-mode) .package-name {
  background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:host-context(.dark-mode) .package-featured .package-name {
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:host-context(.dark-mode) .package-description {
  color: #94a3b8;
}

:host-context(.dark-mode) .package-featured .package-description {
  color: #d4a574;
}

:host-context(.dark-mode) .package-value-section {
  background: linear-gradient(135deg, #0f172a 0%, #1a202c 100%);
  border-color: #334155;
}

:host-context(.dark-mode) .package-featured .package-value-section {
  background: linear-gradient(135deg, #6b3a0a 0%, #7c4a12 100%);
  border-color: #f59e0b;
}

:host-context(.dark-mode) .tokens-unit,
:host-context(.dark-mode) .unit-label {
  color: #64748b;
}

:host-context(.dark-mode) .package-featured .tokens-unit,
:host-context(.dark-mode) .package-featured .unit-label {
  color: #d4a574;
}

:host-context(.dark-mode) .price-amount {
  color: #f1f5f9;
}

:host-context(.dark-mode) .value-indicator {
  background: #334155;
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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

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
        this.packages = data.packages || [];
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
    // Zap: pro / medium / growth
    else if (lowerName.includes('pro') || lowerName.includes('medium') || lowerName.includes('growth'))
      svg = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    // Crown: enterprise / large / unlimited
    else if (lowerName.includes('enterprise') || lowerName.includes('large') || lowerName.includes('unlimited'))
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
  