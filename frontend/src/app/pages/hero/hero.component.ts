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
            <!-- <span class="logo-icon">🚀</span>
            <span class="logo-text">Repli</span> -->
          </div>
          <ul class="nav-menu">
            <li><a href="#features">Prodotti</a></li>
            <li><a href="#how-it-works">Come Funziona</a></li>
            <li><a href="#pricing">Prezzi</a></li>
            <li><a href="#contact">Contatti</a></li>
          </ul>
          <!-- <div class="nav-buttons">
            <button class="btn btn-login" (click)="navigateTo('login')">Accedi


            </button>
            <button class="btn btn-signup" (click)="navigateTo('register')">Registrati</button>
          </div> -->
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
          <div class="step step-1">
            <div class="step-number">1</div>
            <h3>Registrati</h3>
            <p>Crea il tuo account Repli gratuitamente in pochi secondi</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step step-2">
            <div class="step-number">2</div>
            <h3>Acquista Token</h3>
            <p>Compra token per accedere ai modelli Replicate.ai</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step step-3">
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
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Seleziona</button>
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
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price">5000 ⚡ </div>
            <p class="price-sub">€35.00 - Risparmia 30%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Seleziona</button>
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
      <footer class="app-footer">
        <div class="footer-container">
          <div class="footer-top">
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="logo-mark footer-logo-mark">RW</span>
                <span class="footer-logo-title">Replicate Wrapper</span>
              </div>
              <p class="footer-description">
                La piattaforma AI più avanzata per utilizzare facilmente le Api di Replicate
              </p>
              <div class="social-links-footer">
                
                <a href="#" class="social-btn" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2H21l-6.56 7.49L22.5 22h-6.63l-5.19-6.77L4.9 22H2l7.02-8.02L1.5 2h6.63l4.7 6.2L18.244 2zm-2.32 18h1.85L7.08 4H5.1l10.824 16z"/>
                  </svg>
                </a>
                <a href="#" class="social-btn" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S1.2 3.226 1.2 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div class="footer-links-group">
              <h3 class="footer-links-title">Link Rapidi</h3>
              <ul class="footer-links-list">
                <li><a href="#features">Funzionalità</a></li>
                <li><a href="#pricing">Prezzi</a></li>
                <li><a href="#how-it-works">Come Funziona</a></li>
                <li><a href="javascript:void(0)" (click)="navigateTo('register')">Registrati</a></li>
              </ul>
            </div>

            <div class="footer-links-group">
              <h3 class="footer-links-title">Note Legali</h3>
              <ul class="footer-links-list">
                <li><a routerLink="/privacy">Privacy Policy</a></li>
                <li><a routerLink="/terms">Termini di Servizio</a></li>
                <li><a routerLink="/security">Sicurezza</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2026 Vibe srl. Tutti i diritti riservati.</p>
          </div>
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
      background-color: #ffffff;
      background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px);
      background-size: 32px 32px;
      color: #1f2937;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    /* Navbar */
    .navbar {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(16px);
      padding: 0.9rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
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
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
      color: transparent;
      text-shadow: 0 0 0 #fff;
    }

    .logo-text {
      letter-spacing: 0.04em;
      font-size: 1rem;
      color: #6366f1;
      font-weight: 700;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-menu a {
      color: #4b5563;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .nav-menu a:hover {
      color: #111827;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-login {
      background: transparent;
      color: #4b5563;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      padding: 0.45rem 1rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .btn-login:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      transform: translateY(-1px);
    }

    .btn-signup {
      border-radius: 6px;
      background: #6366f1;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1.3rem;
      font-size: 0.8rem;
      font-weight: 500;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
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
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      color: #4b5563;
    }
    
    .hero-title {
      font-size: clamp(2.3rem, 3vw, 2.8rem);
      font-weight: 650;
      margin: 0;
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: #1f2937;
    }
    
    .gradient-text {
      background: linear-gradient(120deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .hero-subtitle {
      font-size: 0.98rem;
      color: #4b5563;
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
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      font-weight: 500;
    }

    .btn-primary-large {
      background: #6366f1;
      color: #ffffff;
      padding: 0.9rem 2.3rem;
      font-size: 0.95rem;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
    }

    .btn-primary-large:hover {
      transform: translateY(-1px);
      background-color: #4f46e5;
    }

    .btn-secondary-large {
      background-color: transparent;
      color: #4b5563;
      border: 1px solid #d1d5db;
      padding: 0.9rem 2.3rem;
      font-size: 0.95rem;
    }

    .btn-secondary-large:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
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
      background: #ffffff;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    
    .stat-label {
      color: #6b7280;
    }
    
    .stat-value {
      font-size: 0.98rem;
      font-weight: 600;
      color: #6366f1;
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
    
    /* .hero-glass {
      position: relative;
      width: 100%;
      max-width: 360px;
      border-radius: 1.3rem;
      padding: 1.2rem 1.1rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    } */

    .hero-glass {
      position: relative;
      width: 100%;
      max-width: 360px;
      border-radius: 1.3rem;
      padding: 1.2rem 1.1rem;

      /* QUI la versione migliorata */
      background: linear-gradient(180deg, #ffffff, #f9fafb);

      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
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
      display: none;
    }
    
    .hero-glass > * {
      position: relative;
      z-index: 1;
    }

    .hero-glass::after {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 1.5rem;
      background: linear-gradient(120deg, #6366f1, #8b5cf6, #10b981);
      opacity: 0.15;
      filter: blur(18px);
      z-index: -1;
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
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background-color: #ffffff;
      color: #374151;
      white-space: nowrap;
    }
    
    .pill-live {
      border-color: #34d399;
      color: #059669;
      background-color: #ecfdf5;
    }
    
    .pill-safe {
      border-color: #93c5fd;
      color: #2563eb;
      background-color: #eff6ff;
    }
    
    .hero-flow {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-bottom: 0.9rem;
    }
    
    .hero-step {
      border-radius: 6px;
      padding: 0.55rem 0.65rem;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      font-size: 0.78rem;
    }

    .hero-step {
  transition: all 0.2s ease;
}

.hero-step:hover {
  transform: translateX(4px) scale(1.02);
  border-color: #6366f1;
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.15);
}
    
    .hero-step-in {
      border-style: dashed;
    }
    
    /* .hero-step-model {
      background: #f0fdf4;
      border-color: #86efac;
    } */

    .hero-step-model {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #34d399;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
}
    
    .hero-step-out {
      opacity: 0.95;
      border-style: dashed;
    }
    
    .hero-step-label {
      font-weight: 500;
      color: #1f2937;
    }
    
    .hero-step-meta {
      color: #6b7280;
    }
    
    /* .hero-connector {
      height: 10px;
      margin-left: 1.1rem;
      border-left: 2px dashed #d1d5db;
    } */

    .hero-connector {
  height: 10px;
  margin-left: 1.1rem;
  border-left: 2px dashed #d1d5db;
  position: relative;
}

.hero-connector::after {
  content: "";
  position: absolute;
  left: -3px;
  top: 0;
  width: 6px;
  height: 6px;
  background: #6366f1;
  border-radius: 50%;
  animation: flow 1.5s linear infinite;
}

@keyframes flow {
  0% { top: 0; opacity: 0; }
  30% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
    
    .hero-footnote {
      font-size: 0.72rem;
      color: #6b7280;
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
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.8rem 1.9rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .product-card:hover {
      border-color: #6366f1;
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .product-card.featured {
      border-color: #3b82f6;
      background: #f0fdfa;
    }

    .badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #f59e0b;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #ffffff;
    }

    .product-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .product-card h3 {
      font-size: 1.5rem;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .product-card p {
      color: #4b5563;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .product-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .product-features li {
      padding: 0.45rem 0;
      color: #374151;
      font-size: 0.85rem;
    }

    .btn-product {
      width: 100%;
      background: #f3f4f6;
      color: #374151;
      padding: 0.7rem 0.9rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      font-weight: 500;
      font-size: 0.85rem;
      box-shadow: none;
      transition: background-color 0.15s ease;
    }

    .btn-product:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    /* How It Works */
    .how-it-works {
      max-width: 1120px;
      margin: 3.5rem auto;
      padding: 3rem 2rem 3.5rem;
      text-align: center;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
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
      background: #6366f1;
      color: #ffffff;
      border-radius: 999px;
      font-size: 1.35rem;
      font-weight: 600;
      margin: 0 auto 1rem;
    }

    .step h3 {
      font-size: 1.3rem;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .step p {
      color: #4b5563;
    }

    .step-arrow {
      font-size: 2rem;
      color: #9ca3af;
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
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 1.2rem;
      padding: 1.9rem 1.8rem;
      text-align: center;
      transition: all 0.2s ease;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .pricing-card:hover {
      border-color: #6366f1;
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .pricing-card.featured {
      border-color: #3b82f6;
      background: #f0fdfa;
    }

    .ribbon {
      position: absolute;
      top: 18px;
      right: -30px;
      background: #f59e0b;
      color: #ffffff;
      padding: 0.45rem 3rem;
      transform: rotate(45deg);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pricing-card h3 {
      font-size: 1.3rem;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.9rem;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 0.5rem;
    }

    .price-sub {
      color: #4b5563;
      font-size: 0.8rem;
      margin-bottom: 1.8rem;
    }

    .btn-outline {
      width: 100%;
      background: transparent;
      color: #4b5563;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      padding: 0.7rem 0.9rem;
      font-weight: 500;
      font-size: 0.85rem;
      transition: background-color 0.15s ease;
    }

    .btn-outline:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .btn-primary-small {
      width: 100%;
      border-radius: 6px;
      background: #6366f1;
      color: white;
      padding: 0.7rem 0.9rem;
      border: none;
      font-weight: 500;
      font-size: 0.85rem;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
    }
    
    .btn-primary-small:hover {
      background: #4f46e5;
    }

    /* CTA Section */
    .cta {
      max-width: 800px;
      margin: 3.5rem auto 4rem;
      padding: 2.6rem 2.1rem;
      text-align: center;
      background: #f0fdfa;
      border: 1px solid #d1d5db;
      border-radius: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .cta h2 {
      font-size: 2.2rem;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .cta p {
      color: #4b5563;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    /* Footer Styles */
    .app-footer {
      background-color: #1e2634;
      color: #e2e8f0;
      padding: 4rem 2.5rem 1.5rem;
      margin-top: auto;
      font-family: inherit;
    }

    .footer-container {
      max-width: 1120px;
      margin: 0 auto;
      width: 100%;
    }

    .footer-top {
      display: flex;
      justify-content: space-between;
      gap: 3rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .footer-brand {
      max-width: 600px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .footer-logo-mark {
      font-size: 0.95rem;
      box-shadow: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      font-weight: 700;
      color: #ffffff;
    }

    .footer-logo-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.02em;
    }

    .footer-description {
      color: #cbd5e1;
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .social-links-footer {
      display: flex;
      gap: 0.75rem;
    }

    .social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.35rem;
      background-color: #334155;
      color: #ffffff;
      text-decoration: none;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .social-btn:hover {
      background-color: #475569;
      transform: translateY(-2px);
    }

    .footer-links-group {
      min-width: 200px;
    }

    .footer-links-title {
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .footer-links-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .footer-links-list a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .footer-links-list a:hover {
      color: #ffffff;
    }

    .footer-bottom {
      border-top: 1px solid #334155;
      padding-top: 1.5rem;
      color: #94a3b8;
      font-size: 0.9rem;
      text-align: left;
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
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
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
      color: #4b5563;
    }

    .info-item span {
      font-size: 1.5rem;
      color: #6366f1;
    }

    .contact-form form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-form input,
    .contact-form textarea {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #1f2937;
    }

    .contact-form input::placeholder,
    .contact-form textarea::placeholder {
      color: #9ca3af;
    }

    .contact-form button {
      align-self: flex-start;
    }
    .btn-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 0.4rem; /* distanza tra testo e icona */
}

    /* STEP COLORS */

/* STEP 1 - Blu */
.step-1 .step-number {
  background: #3b82f6;
}
.step-1 h3 {
  color: #1d4ed8;
}

/* STEP 2 - Viola */
.step-2 .step-number {
  background: #8b5cf6;
}
.step-2 h3 {
  color: #6d28d9;
}

/* STEP 3 - Verde */
.step-3 .step-number {
  background: #10b981;
}
.step-3 h3 {
  color: #047857;
}

.btn-product {
  width: 100%;
  background: #6366f1;
  color: #ffffff;
  padding: 0.7rem 0.9rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  font-size: 0.85rem;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
  transition: all 0.2s ease;
}

.btn-product:hover {
  background: #4f46e5;
  transform: translateY(-1px);
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