import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terms-wrapper">
      <div class="container">

        <h1>Termini e Condizioni</h1>
        <p class="last-update">Ultimo aggiornamento: {{ today }}</p>

        <section>
          <h2>1. Accettazione dei Termini</h2>
          <p>
            Utilizzando la piattaforma, accetti integralmente i presenti Termini e Condizioni.
            Se non accetti una qualsiasi parte dei termini, non puoi utilizzare il servizio.
          </p>
        </section>

        <section>
          <h2>2. Descrizione del Servizio</h2>
          <p>
            La piattaforma fornisce un servizio di intermediazione tecnica (wrapper)
            per l’accesso ai modelli di intelligenza artificiale forniti da Replicate.ai.
            Il servizio include gestione richieste API, monitoraggio utilizzo,
            gestione crediti/token e strumenti di integrazione.
          </p>
        </section>

        <section>
          <h2>3. Account Utente</h2>
          <ul>
            <li>L’utente è responsabile della sicurezza delle proprie credenziali.</li>
            <li>È vietata la condivisione dell’account con terzi non autorizzati.</li>
            <li>L’utente è responsabile di tutte le attività effettuate tramite il proprio account.</li>
          </ul>
        </section>

        <section>
          <h2>4. Utilizzo Consentito</h2>
          <p>L’utente si impegna a non utilizzare il servizio per:</p>
          <ul>
            <li>Attività illegali o fraudolente</li>
            <li>Generazione di contenuti che violino diritti di terzi</li>
            <li>Distribuzione di malware o contenuti dannosi</li>
            <li>Abusi del sistema tramite automazioni non autorizzate</li>
          </ul>
        </section>

        <section>
          <h2>5. Contenuti Generati dall’AI</h2>
          <p>
            I contenuti generati tramite i modelli AI sono prodotti automaticamente.
            La piattaforma non garantisce accuratezza, completezza o affidabilità
            dei risultati. L’utente è l’unico responsabile dell’uso dei contenuti generati.
          </p>
        </section>

        <section>
          <h2>6. Pagamenti e Crediti</h2>
          <ul>
            <li>I crediti acquistati non sono rimborsabili salvo diversa disposizione legale.</li>
            <li>Il consumo dei crediti dipende dall’utilizzo dei modelli AI.</li>
            <li>I prezzi possono essere modificati con preavviso.</li>
          </ul>
        </section>

        <section>
          <h2>7. Limitazione di Responsabilità</h2>
          <p>
            La piattaforma non è responsabile per danni diretti, indiretti,
            incidentali o consequenziali derivanti dall’uso del servizio.
            Il servizio è fornito "così com’è" senza garanzie esplicite o implicite.
          </p>
        </section>

        <section>
          <h2>8. Sospensione o Chiusura Account</h2>
          <p>
            Ci riserviamo il diritto di sospendere o terminare l’account
            in caso di violazione dei presenti termini o utilizzo improprio del servizio.
          </p>
        </section>

        <section>
          <h2>9. Modifiche ai Termini</h2>
          <p>
            I presenti Termini possono essere aggiornati periodicamente.
            L’uso continuato della piattaforma implica l’accettazione delle modifiche.
          </p>
        </section>

        <section>
          <h2>10. Legge Applicabile</h2>
          <p>
            I presenti Termini sono regolati dalla legge applicabile nel paese
            in cui opera la società proprietaria del servizio.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Torna alla Home</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .terms-wrapper {
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
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .last-update {
      color: #888;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    h2 {
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: #667eea;
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
export class TermsComponent {
  today = new Date().toLocaleDateString();

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}