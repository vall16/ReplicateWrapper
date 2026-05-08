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

        <h1>Terms and Conditions</h1>
        <p class="last-update">Last updated: {{ today }}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using the platform, you fully accept these Terms and Conditions.
            If you do not accept any part of the terms, you may not use the service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            The platform provides a technical intermediation service (wrapper)
            for accessing artificial intelligence models provided by Replicate.ai.
            The service includes API request management, usage monitoring,
            credit/token management, and integration tools.
          </p>
        </section>

        <section>
          <h2>3. User Account</h2>
          <ul>
            <li>The user is responsible for the security of their own credentials.</li>
            <li>Sharing the account with unauthorized third parties is prohibited.</li>
            <li>The user is responsible for all activities carried out through their account.</li>
          </ul>
        </section>

        <section>
          <h2>4. Permitted Use</h2>
          <p>The user agrees not to use the service for:</p>
          <ul>
            <li>Illegal or fraudulent activities</li>
            <li>Generating content that violates third-party rights</li>
            <li>Distributing malware or harmful content</li>
            <li>System abuse through unauthorized automation</li>
          </ul>
        </section>

        <section>
          <h2>5. AI-Generated Content</h2>
          <p>
            Content generated through AI models is produced automatically.
            The platform does not guarantee accuracy, completeness, or reliability
            of the results. The user is solely responsible for the use of generated content.
          </p>
        </section>

        <section>
          <h2>6. Payments and Credits</h2>
          <ul>
            <li>Purchased credits are non-refundable unless otherwise required by law.</li>
            <li>Credit consumption depends on the usage of AI models.</li>
            <li>Prices may be changed with prior notice.</li>
          </ul>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            The platform is not liable for direct, indirect,
            incidental, or consequential damages arising from the use of the service.
            The service is provided "as is" without express or implied warranties.
          </p>
        </section>

        <section>
          <h2>8. Account Suspension or Termination</h2>
          <p>
            We reserve the right to suspend or terminate the account
            in case of violation of these terms or improper use of the service.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            These Terms may be updated periodically.
            Continued use of the platform implies acceptance of the changes.
          </p>
        </section>

        <section>
          <h2>10. Applicable Law</h2>
          <p>
            These Terms are governed by the applicable law in the country
            where the company owning the service operates.
          </p>
        </section>

        <div class="back">
          <button (click)="goHome()">← Back to Home</button>
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
  today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}