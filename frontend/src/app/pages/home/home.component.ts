import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-grid">
      <section class="hero">
        <div class="hero-label">AI Pipelines · Replicate</div>
        <h1>
          Trasforma i tuoi modelli
          <span class="gradient-text">in esperienze pronte all'uso</span>
        </h1>
        <p class="hero-subtitle">
          Repli ti permette di collegare rapidamente i modelli Replicate ai tuoi prodotti:
          prompt puliti, parametri salvati e preview consistenti in un'unica interfaccia.
        </p>
        <div class="hero-actions">
          <button type="button" class="hero-primary">
            Crea una nuova sessione
          </button>
          <button type="button" class="hero-secondary">
            Esplora i tuoi modelli
          </button>
        </div>
        <div class="hero-meta">
          <span>Latency monitorata in tempo reale</span>
          <span class="dot"></span>
          <span>Storico delle generazioni incluso</span>
        </div>
      </section>

      <section class="panel-grid" aria-label="Funzionalità principali">
        <article class="panel primary">
          <header>
            <h2>Flow visivo di generazione</h2>
            <span class="badge">Live</span>
          </header>
          <p>
            Disegna un flusso di inferenza chiaro: input, modello, output e
            post-processing in un solo pannello, pronto per essere condiviso.
          </p>
          <div class="panel-preview">
            <div class="step -in">Prompt · Input</div>
            <div class="step -model">Replicate Model</div>
            <div class="step -out">Output · Preview</div>
          </div>
        </article>

        <article class="panel">
          <header>
            <h3>Preset di prompt</h3>
          </header>
          <p>
            Salva preset riutilizzabili per i tuoi use-case: marketing, prodotto,
            immagini, audio e molto altro.
          </p>
          <ul class="chips">
            <li>Product shot</li>
            <li>Portrait clean-up</li>
            <li>UI concept</li>
          </ul>
        </article>

        <article class="panel">
          <header>
            <h3>Ambiente sicuro</h3>
          </header>
          <p>
            Tutte le chiavi restano sul backend, il frontend si limita a orchestrare
            le chiamate verso Replicate in modo sicuro.
          </p>
          <div class="status-pill">
            <span class="status-dot"></span>
            Backend collegato
          </div>
        </article>
      </section>
    </div>
  `,
  styles: [`
    .home-grid {
      display: grid;
      grid-template-columns: minmax(0, 3fr) minmax(0, 2.4fr);
      gap: 2.25rem;
      padding: 1.25rem;
      color: #e5e7eb;
    }

    .hero {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      background: radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.14), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(148, 163, 184, 0.4);
      color: #9ca3af;
    }

    h1 {
      font-size: clamp(2.3rem, 3vw, 2.8rem);
      line-height: 1.1;
      font-weight: 600;
      letter-spacing: -0.04em;
      color: #f9fafb;
    }

    .gradient-text {
      display: block;
      background: linear-gradient(120deg, #22c55e, #22d3ee, #6366f1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-subtitle {
      font-size: 0.98rem;
      color: #9ca3af;
      max-width: 32rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 0.25rem;
    }

    .hero-primary,
    .hero-secondary {
      border-radius: 999px;
      padding: 0.7rem 1.4rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .hero-primary {
      background: linear-gradient(120deg, #22c55e, #22d3ee, #4f46e5);
      color: #020617;
      box-shadow: 0 16px 35px rgba(56, 189, 248, 0.6);
    }

    .hero-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 50px rgba(56, 189, 248, 0.7);
    }

    .hero-secondary {
      background-color: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      border: 1px solid rgba(148, 163, 184, 0.8);
    }

    .hero-secondary:hover {
      background-color: rgba(15, 23, 42, 0.95);
      border-color: rgba(248, 250, 252, 0.8);
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.78rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .hero-meta .dot {
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background-color: #4b5563;
    }

    .panel-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr);
      gap: 1rem;
    }

    .panel {
      border-radius: 18px;
      padding: 1.25rem 1.35rem;
      background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.35), rgba(15, 23, 42, 0.96));
      border: 1px solid rgba(148, 163, 184, 0.4);
      box-shadow:
        0 18px 40px rgba(15, 23, 42, 0.85),
        0 0 0 1px rgba(15, 23, 42, 0.9);
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .panel.primary {
      grid-column: 1 / -1;
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.24), rgba(30, 64, 175, 0.9));
    }

    .panel header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .panel h2,
    .panel h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #f9fafb;
    }

    .badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.13em;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(191, 219, 254, 0.85);
      color: #bfdbfe;
    }

    .panel p {
      font-size: 0.85rem;
      color: #cbd5f5;
    }

    .panel.primary p {
      color: #e5e7eb;
    }

    .panel-preview {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.6rem;
      font-size: 0.75rem;
    }

    .step {
      flex: 1;
      padding: 0.55rem 0.6rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(191, 219, 254, 0.5);
      color: #e5e7eb;
      white-space: nowrap;
    }

    .step.-in {
      border-style: dashed;
    }

    .step.-model {
      background: linear-gradient(120deg, rgba(22, 163, 74, 0.1), rgba(96, 165, 250, 0.5));
    }

    .step.-out {
      border-style: dashed;
      opacity: 0.9;
    }

    .chips {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.3rem;
      padding: 0;
    }

    .chips li {
      font-size: 0.75rem;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.7);
      color: #e5e7eb;
    }

    .status-pill {
      margin-top: 0.4rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(52, 211, 153, 0.8);
      color: #bbf7d0;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: radial-gradient(circle, #22c55e, #16a34a);
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.95);
    }

    @media (max-width: 900px) {
      .home-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .panel-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 640px) {
      .home-grid {
        padding: 0.5rem;
      }

      h1 {
        font-size: 2rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .hero-primary,
      .hero-secondary {
        width: 100%;
        justify-content: center;
        display: inline-flex;
        align-items: center;
      }
    }
  `]
})
export class HomeComponent {}
