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
        <p class=\"last-update\">Last updated: {{ today }}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how we collect, use and protect
            the personal data of users who use our platform, which acts
            as a technical wrapper for access to AI models provided by third parties.
          </p>
        </section>

        <section>
          <h2>2. Data Collected</h2>
          <p>We may collect the following categories of data:</p>
          <ul>
            <li>Registration data (email, encrypted password)</li>
            <li>Usage data (API requests, token consumption, technical logs)</li>
            <li>Payment data (managed through third-party providers)</li>
            <li>Technical information (IP, browser, operating system)</li>
          </ul>
        </section>

        <section>
          <h2>3. Purpose of Processing</h2>
          <ul>
            <li>Service provision and account management</li>
            <li>Usage monitoring and abuse prevention</li>
            <li>Payment management and billing</li>
            <li>Service improvement and security</li>
          </ul>
        </section>

        <section>
          <h2>4. Content Sent to AI Models</h2>
          <p>
            Requests sent to AI models are processed through
            third-party providers. We do not guarantee permanent storage
            of the sent content. Data may be temporarily
            recorded for security, debugging, or audit purposes.
          </p>
        </section>

        <section>
          <h2>5. Legal Basis</h2>
            <p>
            Data processing takes place on the basis of:
            </p>
            <ul>
            <li>Execution of a contract (service provision)</li>
            <li>Legal obligations</li>
            <li>Legitimate interest (security and fraud prevention)</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain personal data only for the time necessary for
            the purposes for which they were collected, unless different
            legal obligations apply.
          </p>
        </section>

        <section>
          <h2>7. Security</h2>
          <ul>
            <li>Encrypted HTTPS connections (TLS)</li>
            <li>Passwords protected through secure hashing</li>
            <li>Limited access controls</li>
            <li>Monitoring of suspicious activities</li>
          </ul>
        </section>

        <section>
          <h2>8. User Rights</h2>
          <p>
            The user has the right to:
          </p>
          <ul>
            <li>Access their own data</li>
            <li>Request rectification or deletion</li>
            <li>Limit or object to processing</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section>
          <h2>9. Transfer to Third Parties</h2>
          <p>
            Some data may be shared with third-party providers
            necessary for the operation of the service
            (e.g., cloud infrastructure, payment systems,
            AI model providers).
          </p>
        </section>

        <section>
          <h2>10. Changes to the Privacy Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy.
            Changes will be published on this page.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Back to Home</button>
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
  today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}