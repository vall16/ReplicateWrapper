import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="security-wrapper">
      <div class="container">

        <h1>Security & Data Protection</h1>
        <p class="intro">
          La sicurezza dei dati e delle API è una priorità assoluta per Repli.
          Operiamo come wrapper sicuro per l'accesso ai modelli AI di Replicate.ai,
          garantendo protezione, isolamento e controllo completo delle richieste.
        </p>

        <section>
          <h2>🔒 Connessioni Sicure</h2>
          <ul>
            <li>Tutte le comunicazioni avvengono tramite HTTPS cifrato (TLS 1.2+)</li>
            <li>Nessuna trasmissione di dati in chiaro</li>
            <li>Protezione contro attacchi Man-in-the-Middle</li>
          </ul>
        </section>

        <section>
          <h2>🔐 Protezione delle Credenziali</h2>
          <ul>
            <li>Password salvate con hashing sicuro (bcrypt/argon2)</li>
            <li>Nessuna memorizzazione di API key Replicate in chiaro</li>
            <li>Accesso limitato e segregato a livello infrastrutturale</li>
          </ul>
        </section>

        <section>
          <h2>🛡️ Isolamento delle Richieste AI</h2>
          <p>
            Ogni richiesta ai modelli AI viene instradata attraverso un layer
            di validazione che applica:
          </p>
          <ul>
            <li>Rate limiting per prevenire abusi</li>
            <li>Controlli automatici contro utilizzi non conformi</li>
            <li>Logging sicuro per audit e monitoraggio</li>
          </ul>
        </section>

        <section>
          <h2>📊 Monitoraggio & Audit</h2>
          <ul>
            <li>Tracciamento utilizzo token</li>
            <li>Monitoraggio attività sospette</li>
            <li>Logging strutturato per debugging e sicurezza</li>
          </ul>
        </section>

        <section>
          <h2>☁️ Infrastruttura</h2>
          <ul>
            <li>Deploy su infrastrutture cloud sicure</li>
            <li>Backup periodici</li>
            <li>Separazione ambiente produzione / sviluppo</li>
          </ul>
        </section>

        <section>
          <h2>🔎 Responsabilità</h2>
          <p>
            Repli funge da intermediario tecnico per l’accesso ai modelli AI.
            I contenuti generati sono responsabilità dell’utente finale.
            Collaboriamo con Replicate.ai per garantire conformità e sicurezza.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Torna alla Home</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .security-wrapper {
      min-height: 100vh;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h2 {
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: #667eea;
    }

    .intro {
      color: #aaa;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    p {
      color: #bbb;
      line-height: 1.6;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    li {
      padding: 0.5rem 0;
      color: #ccc;
    }

    li::before {
      content: "• ";
      color: #667eea;
    }

    .back {
      margin-top: 3rem;
    }

    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `]
})
export class SecurityComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}