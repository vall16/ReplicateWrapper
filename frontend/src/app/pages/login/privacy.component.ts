import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-wrapper">
      <div class="container">

        <h1>Privacy Policy</h1>
        <p class="last-update">Ultimo aggiornamento: {{ today }}</p>

        <section>
          <h2>1. Introduzione</h2>
          <p>
            La presente Privacy Policy descrive come raccogliamo, utilizziamo
            e proteggiamo i dati personali degli utenti che utilizzano
            la nostra piattaforma, che funge da wrapper tecnico per l’accesso
            ai modelli AI forniti da terze parti.
          </p>
        </section>

        <section>
          <h2>2. Dati Raccolti</h2>
          <p>Possiamo raccogliere le seguenti categorie di dati:</p>
          <ul>
            <li>Dati di registrazione (email, password criptata)</li>
            <li>Dati di utilizzo (richieste API, consumo token, log tecnici)</li>
            <li>Dati di pagamento (gestiti tramite provider terzi)</li>
            <li>Informazioni tecniche (IP, browser, sistema operativo)</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalità del Trattamento</h2>
          <ul>
            <li>Fornitura del servizio e gestione account</li>
            <li>Monitoraggio utilizzo e prevenzione abusi</li>
            <li>Gestione pagamenti e fatturazione</li>
            <li>Miglioramento del servizio e sicurezza</li>
          </ul>
        </section>

        <section>
          <h2>4. Contenuti Inviati ai Modelli AI</h2>
          <p>
            Le richieste inviate ai modelli AI vengono elaborate tramite
            provider terzi. Non garantiamo la conservazione permanente
            dei contenuti inviati. I dati possono essere temporaneamente
            registrati per finalità di sicurezza, debugging o audit.
          </p>
        </section>

        <section>
          <h2>5. Base Giuridica</h2>
          <p>
            Il trattamento dei dati avviene sulla base di:
          </p>
          <ul>
            <li>Esecuzione di un contratto (fornitura del servizio)</li>
            <li>Obblighi legali</li>
            <li>Legittimo interesse (sicurezza e prevenzione frodi)</li>
          </ul>
        </section>

        <section>
          <h2>6. Conservazione dei Dati</h2>
          <p>
            Conserviamo i dati personali solo per il tempo necessario
            alle finalità per cui sono stati raccolti, salvo obblighi
            legali diversi.
          </p>
        </section>

        <section>
          <h2>7. Sicurezza</h2>
          <ul>
            <li>Connessioni cifrate HTTPS (TLS)</li>
            <li>Password protette tramite hashing sicuro</li>
            <li>Controlli di accesso limitati</li>
            <li>Monitoraggio attività sospette</li>
          </ul>
        </section>

        <section>
          <h2>8. Diritti dell’Utente</h2>
          <p>
            L’utente ha diritto di:
          </p>
          <ul>
            <li>Accedere ai propri dati</li>
            <li>Richiederne la rettifica o cancellazione</li>
            <li>Limitare o opporsi al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
          </ul>
        </section>

        <section>
          <h2>9. Trasferimento a Terze Parti</h2>
          <p>
            Alcuni dati possono essere condivisi con provider terzi
            necessari per il funzionamento del servizio
            (es. infrastruttura cloud, sistemi di pagamento,
            fornitori di modelli AI).
          </p>
        </section>

        <section>
          <h2>10. Modifiche alla Privacy Policy</h2>
          <p>
            Ci riserviamo il diritto di aggiornare questa Privacy Policy.
            Le modifiche saranno pubblicate su questa pagina.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Torna alla Home</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .privacy-wrapper {
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
export class PrivacyComponent {
  today = new Date().toLocaleDateString();

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}