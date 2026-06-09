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
          Data and API security is an absolute priority for ReplicateXpress.
          We operate as a secure wrapper for accessing AI models from Replicate.ai,
          ensuring protection, isolation and complete control of requests.
        </p>

        <section>
          <h2>🔐 Secure Connections</h2>
          <ul>
            <li>All communications via encrypted HTTPS (TLS 1.2+)</li>
            <li>No transmission of data in clear text</li>
            <li>Protection against Man-in-the-Middle attacks</li>
          </ul>
        </section>

        <section>
          <h2>🔐 Credential Protection</h2>
          <ul>
            <li>Passwords saved with secure hashing (bcrypt/argon2)</li>
            <li>No storage of Replicate API keys in plain text</li>
            <li>Limited access and segregated at infrastructure level</li>
          </ul>
        </section>

        <section>
          <h2>🛱 AI Request Isolation</h2>
          <p>
            Each request to AI models is routed through a validation layer
            that applies:
          </p>
          <ul>
            <li>Rate limiting to prevent abuse</li>
            <li>Automatic controls against non-compliant usage</li>
            <li>Secure logging for audit and monitoring</li>
          </ul>
        </section>

        <section>
          <h2>📊 Monitoring & Audit</h2>
          <ul>
            <li>Token usage tracking</li>
            <li>Suspicious activity monitoring</li>
            <li>Structured logging for debugging and security</li>
          </ul>
        </section>

        <section>
          <h2>☁️ Infrastructure</h2>
          <ul>
            <li>Deployment on secure cloud infrastructure</li>
            <li>Periodic backups</li>
            <li>Production / development environment separation</li>
          </ul>
        </section>

        <section>
          <h2>🔎 Responsibility</h2>
          <p>
            ReplicateXpress acts as a technical intermediary for accessing AI models.
            Generated content is the responsibility of the end user.
            We collaborate with Replicate.ai to ensure compliance and security.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Back to Home</button>
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