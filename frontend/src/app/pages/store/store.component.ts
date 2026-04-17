import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
        <button class="btn-ghost" (click)="goBack()">
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
            *ngFor="let pkg of packages"
            class="glass-card package-card"
            [class.package-featured]="pkg.badge"
          >
            <div class="package-header">
              <div>
                <h3 class="package-name">{{ pkg.name }}</h3>
                <p class="package-description">{{ pkg.description }}</p>
              </div>
              <span *ngIf="pkg.badge" class="package-badge">{{ pkg.badge }}</span>
            </div>

            <div class="package-body">
              <div class="package-tokens">
                <span class="tokens-value">{{ pkg.tokens }}</span>
                <span class="tokens-label">token</span>
              </div>
              <div class="package-price">
                <div class="price-main">
                  <span class="price-currency">€</span>
                  <span class="price-amount">{{ pkg.price }}</span>
                </div>
                <span class="price-unit">
                  ≈ €{{ (pkg.price / pkg.tokens).toFixed(4) }} / token
                </span>
              </div>
            </div>

            <button
              class="btn-primary"
              (click)="purchasePackage(pkg)"
              [disabled]="isPurchasing"
            >
              <span *ngIf="isPurchasing && selectedPackage?.id === pkg.id">Elaborazione…</span>
              <span *ngIf="!(isPurchasing && selectedPackage?.id === pkg.id)">Procedi al checkout</span>
            </button>
          </div>
        </div>

        <ng-template #emptyPackages>
          <div class="glass-card empty-state">
            Nessun pacchetto è attualmente configurato. Riprova più tardi o contatta
            l’amministratore.
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
            <h3>Cosa sono i token?</h3>
            <p>
              Ogni chiamata all’API del tuo wrapper consuma un numero di token predefinito. I token
              non scadono e puoi usarli quando vuoi.
            </p>
          </div>
          <div class="glass-card faq-card">
            <h3>How does billing work?</h3>
            <p>
              Paghi solo i pacchetti acquistati. Tutti i pagamenti passano tramite un provider
              certificato che non espone i tuoi dati al backend.
            </p>
          </div>
          <div class="glass-card faq-card">
            <h3>Posso vedere lo storico degli acquisti?</h3>
            <p>
              Sì, nella sezione dashboard trovi tutte le transazioni con dettagli di data, importo e
              tipo di operazione.
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
      color: #4b5563;
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.1rem;
    }

    .package-card {
      transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .package-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-color: #6366f1;
    }

    .package-featured {
      border-color: #f59e0b;
      box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.1);
      background: #fffbeb;
    }

    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .package-name {
      margin: 0;
      font-size: 0.98rem;
      font-weight: 600;
    }

    .package-description {
      margin: 0.25rem 0 0;
      font-size: 0.78rem;
      color: #cbd5e1;;
    }

    .package-badge {
      padding: 0.16rem 0.6rem;
      border-radius: 999px;
      background: #f59e0b;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .package-body {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .package-tokens {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .tokens-value {
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .tokens-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #cbd5e1;;
    }

    .package-price {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .price-main {
      display: flex;
      align-items: baseline;
      justify-content: flex-end;
    }

    .price-currency {
      font-size: 0.95rem;
      color: #6366f1;
      margin-right: 0.15rem;
    }

    .price-amount {
      font-size: 1.4rem;
      font-weight: 600;
    }

    .price-unit {
      font-size: 0.72rem;
      color: #cbd5e1;;
    }

    .btn-primary {
      margin-top: 0.2rem;
      align-self: stretch;
      padding: 0.6rem 0.9rem;
      border-radius: 6px;
      border: none;
      background: #6366f1;
      color: white;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
      transition: transform 0.1s ease, box-shadow 0.15s ease, opacity 0.15s ease, background 0.15s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      background: #4f46e5;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: default;
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

    .faq-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1.1rem;
    }

    .faq-card h3 {
      margin: 0 0 0.4rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1f2937;
    }

    .faq-card p {
      margin: 0;
      font-size: 0.78rem;
      color: #4b5563;
    }

    @media (max-width: 900px) {
      .hero-card {
        grid-template-columns: minmax(0, 1fr);
      }

      .hero-security {
        align-items: flex-start;
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
    private stripeService: StripeService
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
            this.success = `✅ Pagamento confermato, ${res.tokens_added} token accreditati!`;
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
            this.error = 'Impossibile confermare il pagamento';
          }
        );
      } else if (params['payment'] === 'cancel') {
        this.error = 'Pagamento annullato';
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
        this.error = 'Errore nel caricamento dei pacchetti';
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
          this.error = 'Impossibile iniziare il pagamento';
          this.isPurchasing = false;
        }
      },
      (err) => {
        console.error(err);
        this.error = err.error?.error || 'Errore durante l\'inizializzazione del checkout';
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


}