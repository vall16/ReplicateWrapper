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
  `
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

    // Chiamo il backend per creare PaymentIntent (chiave segreta nel backend)
    this.stripeService.createPaymentIntent(pkg.price * 100, 'eur').subscribe(
      async (res) => {
        if (res.clientSecret) {
          this.clientSecret = res.clientSecret;
          this.paymentDialogOpen = true;

          // Carico la chiave pubblica dal backend
          const stripePublishableKey = await this.stripeService.getPublishableKey().toPromise();
          if (stripePublishableKey) {
            this.stripe = await loadStripeJs(stripePublishableKey);
          } else {
            this.error = 'Errore nel caricamento della chiave Stripe';
          }

          const elements = this.stripe.elements();
          const card = elements.create('card');
          setTimeout(() => card.mount('#stripe-card-element'), 0);
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
      // Chiamata backend per accreditare token
    }
  }
}