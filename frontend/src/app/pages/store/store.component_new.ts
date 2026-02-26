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
      <h1>🛒 Negozio Token</h1>

      <div class="packages-grid">
        <div *ngFor="let pkg of packages" class="package-card">
          <h2>{{ pkg.name }}</h2>
          <p>{{ pkg.description }}</p>
          <p>Prezzo: €{{ pkg.price }} / Token: {{ pkg.tokens }}</p>
          <button (click)="purchasePackage(pkg)" [disabled]="isPurchasing">
            {{ isPurchasing && selectedPackage?.id === pkg.id ? '⏳ Elaborando...' : '💳 Acquista' }}
          </button>
        </div>
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
      <div *ngIf="success" class="success-message">{{ success }}</div>

      <!-- Dialog Stripe -->
      <div *ngIf="paymentDialogOpen" class="stripe-dialog">
        <h2>Pagamento Stripe</h2>
        <div id="stripe-card-element" style="margin-bottom: 1rem;"></div>
        <button (click)="submitStripePayment()">Conferma Pagamento</button>
        <button (click)="paymentDialogOpen = false">Annulla</button>
      </div>
    </div>
  `,
  styles: [`
    .store-container { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; } 
    .store-header { text-align: center; margin-bottom: 3rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; position: relative; }
    .store-header h1 { font-size: 2rem; margin: 0 0 0.5rem 0; }
    .store-header p { font-size: 1.1rem; opacity: 0.9; margin: 0 0 1.5rem 0; }
    .btn-back { background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.5); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; } 
    .btn-back:hover { background: rgba(255, 255, 255, 0.3); border-color: white; } 
    .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem; } 
    .package-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 3px solid transparent; transition: all 0.3s; display: flex; flex-direction: column; } 
    .package-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); }
    .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
    .package-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
    .package-card.featured { border-color: #667eea; background: linear-gradient(to bottom, #fafbff 0%, white 100%); transform: scaleY(1.05); } 
    .package-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; }
    .package-header h2 { color: #667eea; margin: 0; font-size: 1.5rem; } 
    .badge { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; } 
    .package-description { color: #999; margin: 0 0 1.5rem 0; font-size: 0.95rem; } 
    .package-content { flex: 1; margin-bottom: 1.5rem; }
    .token-amount { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 1rem; } 
    .token-amount .number { font-size: 2rem; font-weight: bold; color: #667eea; } 
    .token-amount .label { color: #999; font-weight: 600; } 
    .price-display { background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center; } .price-display .currency { font-size: 1.5rem; color: #667eea; font-weight: bold; } 
    .price-display .amount { font-size: 2rem; color: #667eea; font-weight: bold; margin: 0 0.5rem; } .price-display .unit { display: block; color: #999; font-size: 0.85rem; margin-top: 0.5rem; } .btn-purchase { width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
    .btn-purchase { width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-purchase:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-message { background-color: #fee; color: #c33; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .success-message { background-color: #efe; color: #3c3; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  `]
})
export class StoreComponent implements OnInit {
  packages: any[] = [];
  isPurchasing = false;
  selectedPackage: any = null;
  error = '';
  success = '';
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
  }

  loadPackages() {
    this.authService.getTokenPackages().subscribe(
      (data) => { this.packages = data.packages || []; },
      (err) => { this.error = 'Errore nel caricamento pacchetti'; }
    );
  }

  purchasePackage(pkg: any) {
    this.isPurchasing = true;
    this.selectedPackage = pkg;
    this.error = '';
    this.success = '';

    this.stripeService.createPaymentIntent(pkg.price * 100, 'eur').subscribe(
      async (res) => {
        if (res.clientSecret) {
          this.clientSecret = res.clientSecret;
          this.paymentDialogOpen = true;

          const stripePublishableKey = await this.stripeService.getPublishableKey().toPromise();
          if (stripePublishableKey) {
            this.stripe = await loadStripeJs(stripePublishableKey);
            const elements = this.stripe.elements();
            const card = elements.create('card');
            setTimeout(() => card.mount('#stripe-card-element'), 0);
          } else {
            this.error = 'Errore nel caricamento della chiave Stripe';
          }
        } else {
          this.error = 'Errore nella creazione del pagamento';
        }
        this.isPurchasing = false;
      },
      (err) => { this.error = err.error?.error || 'Errore Stripe'; this.isPurchasing = false; }
    );
  }

  async submitStripePayment() {
    if (!this.stripe || !this.clientSecret) return;

    const elements = this.stripe.elements();
    const card = elements.getElement('card');

    const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card }
    });

    if (error) {
      this.error = error.message || 'Errore pagamento Stripe';
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.success = '✅ Pagamento completato!';
      this.paymentDialogOpen = false;
    }
  }
}