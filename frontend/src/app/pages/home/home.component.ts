import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="card">
        <h2>Benvenuto in Repli</h2>
        <p>Questa è la struttura base per il tuo wrapper Replicate.ai</p>
        <div class="info">
          <h3>Prossimi passi:</h3>
          <ul>
            <li>Configurare il backendd Python</li>
            <li>Implementare le chiamate API a Replicate.ai</li>
            <li>Creare i componenti UI per l'interazione</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .info {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .info h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .info ul {
      list-style: none;
      padding: 0;
    }

    .info li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .info li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }
  `]
})
export class HomeComponent {}
