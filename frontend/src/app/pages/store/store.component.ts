import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe.service';
import { loadStripeJs } from '../../services/stripe-js.loader';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-container">
      <div class="store-header">
        <h1>🛒 Negozio Token</h1>
        <p>Acquista token per usare il tuo wrapper Replicate.ai</p>
        <button class="btn btn-back" (click)="goBack()">← Torna al Dashboard</button>
      </div>

      <div class="packages-grid">
        <div *ngFor="let pkg of packages" class="package-card" [class.featured]="pkg.badge">
          <div class="package-header">
            <h2>{{ pkg.name }}</h2>
            <div *ngIf="pkg.badge" class="badge">{{ pkg.badge }}</div>
          </div>

          <p class="package-description">{{ pkg.description }}</p>

          <div class="package-content">
            <div class="token-amount">
              <span class="number">{{ pkg.tokens }}</span>
              <span class="label">🪙 Token</span>
            </div>

            <div class="price-display">
              <span class="currency">€</span>
              <span class="amount">{{ pkg.price }}</span>
              <span class="unit">/token: €{{ (pkg.price / pkg.tokens).toFixed(4) }}</span>
            </div>
          </div>

          <button
            class="btn btn-purchase"
            (click)="purchasePackage(pkg)"
            [disabled]="isPurchasing"
          >
            {{ isPurchasing && selectedPackage?.id === pkg.id ? '⏳ Elaborando...' : '💳 Acquista' }}
          </button>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        ❌ {{ error }}
      </div>

      <div *ngIf="success" class="success-message">
        ✅ {{ success }}
        <button class="btn btn-small" (click)="goToDashboard()">Torna al Dashboard</button>
      </div>

      <!-- Sezione FAQ -->
      <div class="faq-section">
        <h2>❓ Domande Frequenti</h2>
        <div class="faq-grid">
          <div class="faq-card">
            <h3>💡 Come funziona il sistema token?</h3>
            <p>Ogni chiamata all'API Replicate consuma 1 token. Acquista token per estendere il tuo account.</p>
          </div>
          <div class="faq-card">
            <h3>🔄 Posso rimborso i token?</h3>
            <p>I token non utilizzati rimangono nel tuo conto. Contatta il supporto per chiarimenti su rimborsi.</p>
          </div>
          <div class="faq-card">
            <h3>⏰ Scadono i token?</h3>
            <p>No, i token non hanno scadenza. Puoi utilizzarli quando vuoi.</p>
          </div>
          <div class="faq-card">
            <h3>📊 Dove vedo le mie transazioni?</h3>
            <p>Nel Dashboard puoi visualizzare lo storico di tutte le transazioni.</p>
          </div>
        </div>
      </div>

      <!-- Sezione Sicurezza -->
      <div class="security-section">
        <h2>🔒 Pagamenti Sicuri</h2>
        <p>Tutti i pagamenti sono elaborati in modo sicuro tramite gateway crittografato.</p>
        <div class="security-badges">
          <div class="badge-item">🛡️ SSL Crittografato</div>
          <div class="badge-item">✓ PCI Compliant</div>
          <div class="badge-item">🔐 Dati Sicuri</div>
        </div>
      </div>

      <!-- Dialogo Stripe -->
      <div *ngIf="paymentDialogOpen" class="stripe-dialog">
        <h2>Pagamento Stripe</h2>
        <div id="stripe-card-element" style="margin-bottom: 1rem;"></div>
        <button class="btn btn-purchase" (click)="submitStripePayment()">Conferma Pagamento</button>
        <button class="btn btn-small" (click)="paymentDialogOpen = false">Annulla</button>
        <div *ngIf="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .store-container {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .store-header {
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      position: relative;
    }

    .store-header h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
    }

    .store-header p {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0 0 1.5rem 0;
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

    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .package-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 3px solid transparent;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }

    .package-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    .package-card.featured {
      border-color: #667eea;
      background: linear-gradient(to bottom, #fafbff 0%, white 100%);
      transform: scaleY(1.05);
    }

    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .package-header h2 {
      color: #667eea;
      margin: 0;
      font-size: 1.5rem;
    }

    .badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .package-description {
      color: #999;
      margin: 0 0 1.5rem 0;
      font-size: 0.95rem;
    }

    .package-content {
      flex: 1;
      margin-bottom: 1.5rem;
    }

    .token-amount {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .token-amount .number {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .token-amount .label {
      color: #999;
      font-weight: 600;
    }

    .price-display {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .price-display .currency {
      font-size: 1.5rem;
      color: #667eea;
      font-weight: bold;
    }

    .price-display .amount {
      font-size: 2rem;
      color: #667eea;
      font-weight: bold;
      margin: 0 0.5rem;
    }

    .price-display .unit {
      display: block;
      color: #999;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .btn-purchase {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-purchase:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-purchase:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #c33;
    }

    .success-message {
      background-color: #efe;
      color: #3c3;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #3c3;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-small {
      background: #3c3;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-small:hover {
      opacity: 0.9;
    }

    .faq-section {
      margin-bottom: 3rem;
    }

    .faq-section h2 {
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .faq-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-left: 4px solid #667eea;
    }

    .faq-card h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .faq-card p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .security-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
    }

    .security-section h2 {
      color: white;
      margin: 0 0 1rem 0;
    }

    .security-section p {
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }

    .security-badges {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .badge-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }
  `]
})
export class StoreComponent implements OnInit {
  packages: any[] = [];
  isPurchasing = false;
  selectedPackage: any = null;
  error = '';
  success = '';
  stripeLoaded = false;
  stripe: any = null;
  paymentDialogOpen = false;
  clientSecret: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPackages();
    // Carica Stripe.js
    const publishableKey = 'your_stripe_publishable_key_here'; // Sostituisci con la tua chiave
    loadStripeJs(publishableKey).then((stripe: any) => {
      this.stripe = stripe;
      this.stripeLoaded = true;
    });
  }

  loadPackages() {
    this.authService.getTokenPackages().subscribe(
      (data) => {
        this.packages = data.packages || [];
      },
      (error) => {
        this.error = 'Errore nel caricamento dei pacchetti';
        console.error(error);
      }
    );
  }

  purchasePackage(pkg: any) {
    this.isPurchasing = true;
    this.error = '';
    this.success = '';
    this.selectedPackage = pkg;
    this.stripeService.createPaymentIntent(pkg.price * 100, 'eur').subscribe(
      async (res) => {
        if (res.clientSecret) {
          this.clientSecret = res.clientSecret;
          this.paymentDialogOpen = true;
          this.success = '';
          // Mostra dialog Stripe
          if (this.stripeLoaded && this.stripe) {
            const elements = this.stripe.elements();
            const card = elements.create('card');
            setTimeout(() => {
              card.mount('#stripe-card-element');
            }, 0);
          }
        } else {
          this.error = 'Errore nella creazione del pagamento';
        }
        this.isPurchasing = false;
      },
      (error) => {
        this.isPurchasing = false;
        this.error = error.error?.error || 'Errore Stripe';
      }
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async submitStripePayment() {
    if (!this.stripe || !this.clientSecret) return;
    const elements = this.stripe.elements();
    const card = elements.getElement('card');
    const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: card,
      }
    });
    if (error) {
      this.error = error.message || 'Errore pagamento Stripe';
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.success = '✅ Pagamento completato!';
      this.paymentDialogOpen = false;
      // Qui puoi chiamare backend per accreditare i token
    }
  }
}
