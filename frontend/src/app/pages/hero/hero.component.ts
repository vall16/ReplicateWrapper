import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-hero',
  standalone: true,
  // imports: [CommonModule],
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-wrapper">
      <!-- Navigation Menu -->
      <nav class="navbar">
        <div class="nav-container">
          <div class="logo">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">Repli</span>
          </div>
          <ul class="nav-menu">
            <li><a href="#features">Prodotti</a></li>
            <li><a href="#how-it-works">Come Funziona</a></li>
            <li><a href="#pricing">Prezzi</a></li>
            <li><a href="#contact">Contatti</a></li>
          </ul>
          <div class="nav-buttons">
            <button class="btn btn-login" (click)="navigateTo('login')">Accedi</button>
            <button class="btn btn-signup" (click)="navigateTo('register')">Registrati</button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-label">AI Credit Console · Replicate</div>
          <h1 class="hero-title">
            Collega <span class="gradient-text">Replicate.ai</span>
            alle tue app in pochi minuti
          </h1>
          <p class="hero-subtitle">
            Un unico wrapper moderno per orchestrare modelli, token e chiamate API in modo sicuro,
            con una UX pensata per il 2026.
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary-large" (click)="navigateTo('register')">
              Inizia gratuitamente
            </button>
            <button class="btn btn-secondary-large" (click)="scrollTo('features')">
              Guarda cosa puoi fare →
            </button>
          </div>
          <div class="hero-meta">
            <span>Latency monitorata in tempo reale</span>
            <span class="dot"></span>
            <span>Token e costi sempre sotto controllo</span>
          </div>
          <div class="hero-stats">
            <div class="stat-chip">
              <span class="stat-label">Team attivi</span>
              <span class="stat-value">10K+</span>
            </div>
            <div class="stat-chip">
              <span class="stat-label">Modelli plug‑and‑play</span>
              <span class="stat-value">50+</span>
            </div>
            <div class="stat-chip">
              <span class="stat-label">Uptime</span>
              <span class="stat-value">99.9%</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-glass">
            <div class="hero-glass-header">
              <span class="pill pill-live">Live pipeline</span>
              <span class="pill pill-safe">Secure backend</span>
            </div>
            <div class="hero-flow">
              <div class="hero-step hero-step-in">
                <span class="hero-step-label">Prompt · Input</span>
                <span class="hero-step-meta">Text · Image · Audio</span>
              </div>
              <div class="hero-connector"></div>
              <div class="hero-step hero-step-model">
                <span class="hero-step-label">Replicate Model</span>
                <span class="hero-step-meta">Version controllata · Logs</span>
              </div>
              <div class="hero-connector"></div>
              <div class="hero-step hero-step-out">
                <span class="hero-step-label">Output · Preview</span>
                <span class="hero-step-meta">Share · Iterate · Ship</span>
              </div>
            </div>
            <div class="hero-footnote">
              Nessuna chiave nel frontend · orchestrazione solo lato server
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section class="products" id="features">
        <div class="section-header">
          <h2>Prodotti Replicate.ai Disponibili</h2>
          <p>Accedi a una vasta gamma di modelli AI per ogni esigenza</p>
        </div>

        <div class="products-grid">
          <!-- Generative Models -->
          <div class="product-card">
            <div class="product-icon">🎨</div>
            <h3>Generative Models</h3>
            <p>Crea immagini, testi e contenuti con i modelli generativi più avanzati</p>
            <ul class="product-features">
              <li>✨ Stable Diffusion XL</li>
              <li>🎬 DALL-E 3</li>
              <li>📝 GPT-4</li>
              <li>🎵 MusicGen</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Esplora</button>
          </div>

          <!-- Vision Models -->
          <div class="product-card featured">
            <div class="badge">⭐ Più Popolare</div>
            <div class="product-icon">👁️</div>
            <h3>Vision Models</h3>
            <p>Analizza immagini e video con i migliori modelli di computer vision</p>
            <ul class="product-features">
              <li>🔍 CLIP</li>
              <li>📸 ResNet</li>
              <li>🎯 YOLOv8</li>
              <li>🧠 Vision Transformers</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Esplora</button>
          </div>

          <!-- Language Models -->
          <div class="product-card">
            <div class="product-icon">💬</div>
            <h3>Language Models</h3>
            <p>Elabora testo, traduzioni e comprensione del linguaggio naturale</p>
            <ul class="product-features">
              <li>📚 LLaMA 2</li>
              <li>🌐 Mistral</li>
              <li>💡 Llama-2-Chat</li>
              <li>🔤 Code Llama</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Esplora</button>
          </div>

          <!-- Audio Models -->
          <div class="product-card">
            <div class="product-icon">🎧</div>
            <h3>Audio Models</h3>
            <p>Elabora audio, testo-a-voce e riconoscimento vocale</p>
            <ul class="product-features">
              <li>🎙️ Whisper</li>
              <li>🔊 Text-to-Speech</li>
              <li>🎵 Voice Cloning</li>
              <li>🔉 Audio Enhancement</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Esplora</button>
          </div>

          <!-- API & Integration -->
          <div class="product-card">
            <div class="product-icon">⚙️</div>
            <h3>API & Integration</h3>
            <p>Integra facilmente nel tuo progetto con le nostre API robuste</p>
            <ul class="product-features">
              <li>🔌 REST API</li>
              <li>📦 SDK Python</li>
              <li>🌐 Webhooks</li>
              <li>📊 Analytics</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Esplora</button>
          </div>

          <!-- Enterprise Solutions -->
          <div class="product-card">
            <div class="product-icon">🏢</div>
            <h3>Enterprise Solutions</h3>
            <p>Soluzioni personalizzate per applicazioni mission-critical</p>
            <ul class="product-features">
              <li>🔐 SLA Garantito</li>
              <li>👥 Supporto 24/7</li>
              <li>⚡ Infrastruttura Dedicata</li>
              <li>📈 Custom Models</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Contattaci</button>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works" id="how-it-works">
        <div class="section-header">
          <h2>Come Funziona</h2>
          <p>Tre semplici passi per iniziare</p>
        </div>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Registrati</h3>
            <p>Crea il tuo account Repli gratuitamente in pochi secondi</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Acquista Token</h3>
            <p>Compra token per accedere ai modelli Replicate.ai</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Inizia a Creare</h3>
            <p>Usa la nostra API per integrare i modelli AI nel tuo progetto</p>
          </div>
        </div>
      </section>

      <!-- Pricing Preview -->
      <section class="pricing-preview" id="pricing">
        <div class="section-header">
          <h2>Pacchetti Token</h2>
          <p>Scegli il piano che fa per te</p>
        </div>

        <div class="pricing-cards">
          <div class="pricing-card">
            <h3>Starter</h3>
            <div class="price">100 ⚡ </div>
            <p class="price-sub">€1.00</p>
            <button class="btn btn-outline" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card featured">
            <div class="ribbon">Consigliato</div>
            <h3>Growth</h3>
            <div class="price">500 ⚡ </div>
            <p class="price-sub">€4.50 - Risparmia 10%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card">
            <h3>Pro</h3>
            <div class="price">1000 ⚡ </div>
            <p class="price-sub">€8.00 - Risparmia 20%</p>
            <button class="btn btn-outline" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price">5000 ⚡ </div>
            <p class="price-sub">€35.00 - Risparmia 30%</p>
            <button class="btn btn-outline" (click)="navigateTo('login')">Contattaci</button>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <h2>Pronto a Iniziare?</h2>
        <p>Unisciti a migliaia di sviluppatori che usano Repli</p>
        <button class="btn btn-primary-large" (click)="navigateTo('register')">
          Registrati Gratuitamente Oggi
        </button>
      </section>

      <!-- Privacy Section -->
<!-- <section class="legal-section" id="privacy">
  <div class="legal-container">
    <h2>Privacy Policy</h2>
    <p>
      La tua privacy è importante per noi. Raccogliamo solo i dati necessari
      per fornire il servizio e migliorare l’esperienza utente.
    </p>

    <h3>Dati Raccolti</h3>
    <ul>
      <li>Email e informazioni di registrazione</li>
      <li>Dati di utilizzo API e consumo token</li>
      <li>Log tecnici per sicurezza e debugging</li>
    </ul>

    <h3>Utilizzo dei Dati</h3>
    <p>
      I dati vengono utilizzati esclusivamente per fornire il servizio,
      prevenire abusi e migliorare la piattaforma.
    </p>
  </div>
</section>


<section class="legal-section" id="terms">
  <div class="legal-container">
    <h2>Terms of Service</h2>
    <p>
      Utilizzando Repli accetti i seguenti termini.
    </p>

    <ul>
      <li>L'utente è responsabile dell’uso dei modelli AI.</li>
      <li>I token acquistati non sono rimborsabili.</li>
      <li>È vietato utilizzare il servizio per attività illegali.</li>
      <li>Ci riserviamo il diritto di sospendere account in caso di abuso.</li>
    </ul>
  </div>
</section>

<! Security Section -->
<!-- <section class="legal-section" id="security">
  <div class="legal-container">
    <h2>Security</h2>
    <p>
      Implementiamo misure di sicurezza avanzate per proteggere i tuoi dati.
    </p>

    <ul>
      <li>🔒 Connessioni HTTPS cifrate</li>
      <li>🔐 Hashing sicuro delle password</li>
      <li>🛡️ Monitoraggio continuo contro abusi</li>
      <li>📊 Logging e audit trail</li>
    </ul>
  </div>
</section>  -->
      <!-- Contact Section -->
    <section class="contact-section" id="contact">
      <div class="section-header">
        <h2>Contattaci</h2>
        <p>Hai domande o vuoi maggiori informazioni? Scrivici!</p>
      </div>

      <div class="contact-container">
        <!-- Contact Info -->
        <div class="contact-info">
          <div class="info-item">
            <span>📧</span>
            <p>Email: <a href="mailto:support@repli.ai">support&#64;repli.ai</a></p>
          </div>
          <div class="info-item">
            <span>📞</span>
            <p>Telefono: <a href="tel:+390123456789">+39 012 345 6789</a></p>
          </div>
          <div class="info-item">
            <span>🏢</span>
            <p>Indirizzo: Via AI 42, Milano, Italia</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form">
          <!-- <form (submit)="submitContact($event)">
            <input type="text" name="name" placeholder="Nome" required />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" rows="5" placeholder="Messaggio" required></textarea>
            <button type="submit" class="btn btn-primary-small">Invia Messaggio</button>
          </form> -->
        </div>
      </div>
    </section>
      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Repli</h4>
            <p>Il tuo wrapper intelligente per Replicate.ai</p>
          </div>
          <div class="footer-section">
            <h4>Prodotti</h4>
            <ul>
              <li><a href="#features">Generative</a></li>
              <li><a href="#features">Vision</a></li>
              <li><a href="#features">Language</a></li>
              <li><a href="#features">Audio</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Supporto</h4>
            <ul>
              <li><a href="#contact">Documentazione</a></li>
              <li><a href="#contact">API Reference</a></li>
              <li><a href="#contact">FAQ</a></li>
              <li><a href="#contact">Support</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <!-- <li><a href="#contact">Privacy</a></li>
              <li><a href="#contact">Terms</a></li>
              <li><a href="#contact">Security</a></li> -->

              <!-- <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li> -->

              <!-- <li><a routerLink="/privacy">Privacy</a></li> -->
              
              <li><a routerLink="/privacy">Privacy</a></li>
              <li><a routerLink="/terms">Terms</a></li>
              <li><a routerLink="/security">Security</a></li>

              <!-- <button class="btn btn-login" (click)="navigateTo('login')">Accedi</button>
              <button class="btn btn-signup" (click)="navigateTo('register')">Registrati</button> -->

            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Repli. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .hero-wrapper {
      min-height: 100vh;
      background: radial-gradient(circle at top left, #2b60ff 0, transparent 55%),
                  radial-gradient(circle at bottom right, #8f3fff 0, #050816 55%);
      color: #f5f5ff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    /* Navbar */
    .navbar {
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.9));
      backdrop-filter: blur(18px);
      padding: 0.9rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(148, 163, 184, 0.35);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .logo-icon {
      font-size: 1.4rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #a855f7, #22d3ee, #3b82f6);
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .logo-text {
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.78rem;
      color: #e5e7eb;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-menu a {
      color: #cbd5f5;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .nav-menu a:hover {
      color: #e5edff;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-login {
      background: rgba(15, 23, 42, 0.6);
      color: #e5e7eb;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.7);
      padding: 0.45rem 1rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .btn-login:hover {
      background: rgba(30, 64, 175, 0.95);
      box-shadow: 0 12px 30px rgba(37, 99, 235, 0.45);
      transform: translateY(-1px);
    }

    .btn-signup {
      border-radius: 999px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: #f9fafb;
      border: none;
      padding: 0.5rem 1.3rem;
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 14px 32px rgba(56, 189, 248, 0.5);
    }

    /* Hero Section */
    .hero {
      max-width: 1120px;
      margin: 0 auto;
      padding: 4.5rem 2rem 2rem;
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.1fr);
      gap: 3rem;
      align-items: center;
    }

    .hero-content {
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
      opacity: 0;
      transform: translateY(18px);
      animation: hero-fade-up 0.85s ease-out forwards;
    }
    
    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      background: radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.16), rgba(15, 23, 42, 0.96));
      border: 1px solid rgba(148, 163, 184, 0.45);
      color: #9ca3af;
    }
    
    .hero-title {
      font-size: clamp(2.3rem, 3vw, 2.8rem);
      font-weight: 650;
      margin: 0;
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: #f9fafb;
    }
    
    .gradient-text {
      background: linear-gradient(120deg, #22c55e, #22d3ee, #6366f1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .hero-subtitle {
      font-size: 0.98rem;
      color: #cbd5f5;
      line-height: 1.6;
      max-width: 34rem;
    }
    
    .hero-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-top: 0.25rem;
    }

    .btn {
      transition: all 0.3s;
      cursor: pointer;
      border: none;
      border-radius: 8px;
      font-weight: 600;
    }

    .btn-primary-large {
      border-radius: 999px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: #f9fafb;
      padding: 0.9rem 2.3rem;
      font-size: 0.95rem;
      box-shadow: 0 18px 40px rgba(56, 189, 248, 0.55);
    }

    .btn-primary-large:hover {
      transform: translateY(-1px);
      box-shadow: 0 24px 52px rgba(56, 189, 248, 0.7);
    }

    .btn-secondary-large {
      border-radius: 999px;
      background-color: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      border: 1px solid rgba(148, 163, 184, 0.8);
      padding: 0.9rem 2.3rem;
      font-size: 0.95rem;
    }

    .btn-secondary-large:hover {
      background-color: rgba(15, 23, 42, 0.96);
      border-color: rgba(248, 250, 252, 0.9);
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.78rem;
      color: #6b7280;
    }
    
    .hero-meta .dot {
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background-color: #4b5563;
    }
    
    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    
    .stat-chip {
      border-radius: 0.85rem;
      padding: 0.6rem 0.7rem;
      background: radial-gradient(circle at top, rgba(129, 140, 248, 0.3), transparent 60%);
      border: 1px solid rgba(148, 163, 184, 0.6);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
    }
    
    .stat-label {
      color: #cbd5f5;
    }
    
    .stat-value {
      font-size: 0.98rem;
      font-weight: 600;
    }

    .hero-image {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(18px);
      animation: hero-fade-up 0.95s ease-out 0.1s forwards;
    }
    
    .hero-glass {
      position: relative;
      width: 100%;
      max-width: 360px;
      border-radius: 1.3rem;
      padding: 1.2rem 1.1rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.82));
      border: 1px solid rgba(148, 163, 184, 0.45);
      box-shadow:
        0 18px 45px rgba(15, 23, 42, 0.95),
        0 0 0 1px rgba(15, 23, 42, 0.9);
      overflow: hidden;
    }

    @keyframes hero-fade-up {
      0% {
        opacity: 0;
        transform: translateY(18px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .hero-glass::before {
      content: "";
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.16), transparent 55%),
        radial-gradient(circle at 100% 0, rgba(129, 140, 248, 0.22), transparent 60%);
      opacity: 0.9;
      pointer-events: none;
    }
    
    .hero-glass > * {
      position: relative;
      z-index: 1;
    }
    
    .hero-glass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.9rem;
    }
    
    .pill {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.13em;
      padding: 0.18rem 0.6rem;
      border-radius: 999px;
      border: 1px solid rgba(191, 219, 254, 0.9);
      background-color: rgba(15, 23, 42, 0.9);
      color: #bfdbfe;
      white-space: nowrap;
    }
    
    .pill-live {
      border-color: rgba(52, 211, 153, 0.85);
      color: #bbf7d0;
    }
    
    .pill-safe {
      border-color: rgba(59, 130, 246, 0.85);
    }
    
    .hero-flow {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-bottom: 0.9rem;
    }
    
    .hero-step {
      border-radius: 0.9rem;
      padding: 0.55rem 0.65rem;
      background-color: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.7);
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      font-size: 0.78rem;
    }
    
    .hero-step-in {
      border-style: dashed;
    }
    
    .hero-step-model {
      background: linear-gradient(120deg, rgba(22, 163, 74, 0.1), rgba(96, 165, 250, 0.5));
    }
    
    .hero-step-out {
      opacity: 0.95;
      border-style: dashed;
    }
    
    .hero-step-label {
      font-weight: 500;
      color: #f9fafb;
    }
    
    .hero-step-meta {
      color: #9ca3af;
    }
    
    .hero-connector {
      height: 10px;
      margin-left: 1.1rem;
      border-left: 2px dashed rgba(148, 163, 184, 0.7);
    }
    
    .hero-footnote {
      font-size: 0.72rem;
      color: #9ca3af;
    }

    /* Products Section */
    .products {
      max-width: 1120px;
      margin: 3.5rem auto;
      padding: 2.75rem 2rem 3.5rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 0.9rem;
      color: #9ca3af;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.82));
      border: 1px solid rgba(148, 163, 184, 0.38);
      border-radius: 1.2rem;
      padding: 1.8rem 1.9rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 16px 40px rgba(15, 23, 42, 0.95),
        0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .product-card:hover {
      border-color: rgba(129, 140, 248, 0.85);
      transform: translateY(-4px);
      box-shadow: 0 20px 50px rgba(37, 99, 235, 0.68);
    }

    .product-card.featured {
      border-color: rgba(251, 191, 36, 0.9);
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.32), rgba(30, 64, 175, 0.9));
    }

    .badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #111827;
    }

    .product-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .product-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .product-card p {
      color: #cbd5f5;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .product-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .product-features li {
      padding: 0.45rem 0;
      color: #e5e7eb;
      font-size: 0.85rem;
    }

    .btn-product {
      width: 100%;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      padding: 0.7rem 0.9rem;
      border-radius: 999px;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      box-shadow: 0 16px 38px rgba(56, 189, 248, 0.5);
    }

    .btn-product:hover {
      transform: translateY(-1px);
      box-shadow: 0 22px 52px rgba(56, 189, 248, 0.65);
    }

    /* How It Works */
    .how-it-works {
      max-width: 1120px;
      margin: 3.5rem auto;
      padding: 3rem 2rem 3.5rem;
      text-align: center;
    }

    .steps {
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      margin-top: 3rem;
    }

    .step {
      flex: 1;
      min-width: 200px;
    }

    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      border-radius: 999px;
      font-size: 1.35rem;
      font-weight: 600;
      margin: 0 auto 1rem;
    }

    .step h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }

    .step p {
      color: #9ca3af;
    }

    .step-arrow {
      font-size: 2rem;
      color: #667eea;
      display: none;
    }

    @media (min-width: 768px) {
      .step-arrow {
        display: block;
      }
    }

    /* Pricing Preview */
    .pricing-preview {
      max-width: 1120px;
      margin: 3.5rem auto;
      padding: 3rem 2rem 3.5rem;
    }

    .pricing-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .pricing-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.82));
      border: 1px solid rgba(148, 163, 184, 0.38);
      border-radius: 1.2rem;
      padding: 1.9rem 1.8rem;
      text-align: center;
      transition: all 0.2s ease;
      position: relative;
      box-shadow:
        0 16px 40px rgba(15, 23, 42, 0.95),
        0 0 0 1px rgba(15, 23, 42, 0.95);
    }

    .pricing-card:hover {
      border-color: rgba(129, 140, 248, 0.85);
      transform: translateY(-4px);
    }

    .pricing-card.featured {
      border-color: rgba(251, 191, 36, 0.9);
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.32), rgba(30, 64, 175, 0.9));
    }

    .ribbon {
      position: absolute;
      top: 18px;
      right: -30px;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: #111827;
      padding: 0.45rem 3rem;
      transform: rotate(45deg);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pricing-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.9rem;
      font-weight: 600;
      color: #a5b4fc;
      margin-bottom: 0.5rem;
    }

    .price-sub {
      color: #e5e7eb;
      font-size: 0.8rem;
      margin-bottom: 1.8rem;
    }

    .btn-outline {
      width: 100%;
      background: transparent;
      color: #e5e7eb;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.8);
      padding: 0.7rem 0.9rem;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .btn-outline:hover {
      background: rgba(15, 23, 42, 0.95);
      border-color: rgba(248, 250, 252, 0.9);
    }

    .btn-primary-small {
      width: 100%;
      border-radius: 999px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: white;
      padding: 0.7rem 0.9rem;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      box-shadow: 0 16px 38px rgba(56, 189, 248, 0.5);
    }

    /* CTA Section */
    .cta {
      max-width: 800px;
      margin: 3.5rem auto 4rem;
      padding: 2.6rem 2.1rem;
      text-align: center;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.84));
      border: 1px solid rgba(148, 163, 184, 0.4);
      border-radius: 1.25rem;
      box-shadow:
        0 18px 40px rgba(15, 23, 42, 0.9),
        0 0 0 1px rgba(15, 23, 42, 0.9);
    }

    .cta h2 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }

    .cta p {
      color: #cbd5f5;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    /* Footer */
    .footer {
      margin-top: 4rem;
      background: rgba(15, 23, 42, 0.9);
      border-top: 1px solid rgba(148, 163, 184, 0.35);
      padding: 2.5rem 0 1.2rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h4 {
      margin-bottom: 1rem;
      color: #a5b4fc;
    }

    .footer-section p {
      color: #9ca3af;
      font-size: 0.86rem;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 0.86rem;
      transition: color 0.2s ease;
      display: block;
      padding: 0.4rem 0;
    }

    .footer-section a:hover {
      color: #e5edff;
    }

    .footer-bottom {
      text-align: center;
      color: #666;
      padding-top: 2rem;
      border-top: 1px solid rgba(102, 126, 234, 0.2);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .hero {
        grid-template-columns: 1fr;
        padding: 3rem 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .hero-image {
        display: none;
      }

      .pricing-card.featured {
        transform: scale(1);
      }
      /* Legal Sections */
      .legal-section {
        max-width: 1000px;
        margin: 4rem auto;
        padding: 4rem 2rem;
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(102, 126, 234, 0.2);
      }

      .legal-container {
        max-width: 800px;
        margin: 0 auto;
      }

      .legal-section h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #667eea;
      }

      .legal-section h3 {
        margin-top: 2rem;
        margin-bottom: 1rem;
      }

      .legal-section p {
        color: #aaa;
        line-height: 1.7;
        margin-bottom: 1rem;
      }

      .legal-section ul {
        list-style: none;
        padding-left: 0;
      }

      .legal-section li {
        padding: 0.5rem 0;
        color: #ccc;
      }
    }
    /* Contact Section */
.contact-section {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 4rem 2rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.contact-section .section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #ccc;
}

.info-item span {
  font-size: 1.5rem;
  color: #667eea;
}

.contact-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #aaa;
}

.contact-form button {
  align-self: flex-start;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class HeroComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  scrollTo(id: string) {
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}