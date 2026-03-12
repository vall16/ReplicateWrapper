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
            Scegli il pacchetto di crediti AI perfetto per il tuo flusso su Replicate.
          </p>
        </div>
        <button class="btn-ghost" (click)="goBack()">
          Torna al dashboard
        </button>
      </header>

      <section class="store-main">
        <div class="glass-card hero-card">
          <div class="hero-copy">
            <h2>Seleziona il tuo piano token</h2>
            <p>
              I crediti vengono scalati automaticamente a ogni chiamata API. Nessuna scadenza, massima
              trasparenza.
            </p>
            <ul class="hero-list">
              <li>Prezzo per token sempre visibile prima dell’acquisto</li>
              <li>Checkout sicuro tramite provider di pagamento</li>
              <li>Saldo aggiornato in tempo reale nel dashboard</li>
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
              <span>Pagamenti protetti end‑to‑end</span>
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
            <h3>Come funziona la fatturazione?</h3>
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
      color: #f3f4ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
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
    }

    .store-subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.86rem;
      color: #cbd5f5;
      max-width: 420px;
    }

    .btn-ghost {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      background: rgba(15, 23, 42, 0.6);
      color: #e5e7eb;
      padding: 0.42rem 0.9rem;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .btn-ghost:hover {
      background: rgba(30, 64, 175, 0.95);
      box-shadow: 0 14px 32px rgba(37, 99, 235, 0.45);
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
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.76));
      border: 1px solid rgba(148, 163, 184, 0.32);
      box-shadow:
        0 18px 45px rgba(15, 23, 42, 0.9),
        0 0 0 1px rgba(15, 23, 42, 0.9);
      overflow: hidden;
    }

    .glass-card::before {
      content: "";
      position: absolute;
      inset: -35%;
      background:
        radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.08), transparent 60%),
        radial-gradient(circle at 100% 0, rgba(129, 140, 248, 0.14), transparent 60%);
      opacity: 0.9;
      pointer-events: none;
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
    }

    .hero-copy p {
      margin: 0.45rem 0 0.6rem;
      font-size: 0.85rem;
      color: #e5e7eb;
    }

    .hero-list {
      list-style: none;
      padding: 0;
      margin: 0.35rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #cbd5f5;
    }

    .hero-list li::before {
      content: "•";
      display: inline-block;
      margin-right: 0.4rem;
      color: #38bdf8;
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
      border: 1px solid rgba(148, 163, 184, 0.65);
      font-size: 0.72rem;
      color: #e5e7eb;
      background: rgba(15, 23, 42, 0.9);
    }

    .security-lock {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #cbd5f5;
    }

    .lock-ring {
      width: 50px;
      height: 50px;
      border-radius: 999px;
      background: conic-gradient(from 220deg, #22c55e, #22d3ee, #4f46e5, #22c55e);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px rgba(34, 197, 94, 0.7);
    }

    .lock-inner {
      width: 76%;
      height: 76%;
      border-radius: 999px;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      color: #bbf7d0;
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
      box-shadow: 0 22px 50px rgba(37, 99, 235, 0.7);
      border-color: rgba(129, 140, 248, 0.85);
    }

    .package-featured {
      border-color: rgba(251, 191, 36, 0.8);
      box-shadow: 0 22px 55px rgba(245, 158, 11, 0.5);
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
      color: #9ca3af;
    }

    .package-badge {
      padding: 0.16rem 0.6rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: #111827;
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
      color: #9ca3af;
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
      color: #a5b4fc;
      margin-right: 0.15rem;
    }

    .price-amount {
      font-size: 1.4rem;
      font-weight: 600;
    }

    .price-unit {
      font-size: 0.72rem;
      color: #9ca3af;
    }

    .btn-primary {
      margin-top: 0.2rem;
      align-self: stretch;
      padding: 0.6rem 0.9rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 16px 40px rgba(56, 189, 248, 0.45);
      transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 22px 50px rgba(56, 189, 248, 0.6);
      filter: brightness(1.06);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .empty-state {
      text-align: center;
      font-size: 0.85rem;
      color: #e5e7eb;
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
      background: rgba(127, 29, 29, 0.8);
      border: 1px solid rgba(248, 113, 113, 0.8);
      color: #fee2e2;
    }

    .feedback-success {
      background: rgba(22, 101, 52, 0.85);
      border: 1px solid rgba(74, 222, 128, 0.8);
      color: #dcfce7;
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
    }

    .faq-card p {
      margin: 0;
      font-size: 0.78rem;
      color: #d1d5db;
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
  ) {}

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