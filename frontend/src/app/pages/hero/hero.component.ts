import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
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
          <h1 class="hero-title">Accedi al Potere di <span class="highlight">Replicate.ai</span></h1>
          <p class="hero-subtitle">
            Semplifica l'utilizzo dei modelli AI più avanzati con il nostro wrapper intelligente
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary-large" (click)="navigateTo('register')">
              Inizia Gratuitamente
            </button>
            <button class="btn btn-secondary-large">
              Scopri di più →
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Utenti Attivi</span>
            </div>
            <div class="stat">
              <span class="stat-number">50+</span>
              <span class="stat-label">Modelli Disponibili</span>
            </div>
            <div class="stat">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Uptime Garantito</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-card card-1">
            <div class="card-icon">🤖</div>
            <div class="card-text">Modelli AI</div>
          </div>
          <div class="floating-card card-2">
            <div class="card-icon">⚡</div>
            <div class="card-text">Veloce</div>
          </div>
          <div class="floating-card card-3">
            <div class="card-icon">🔒</div>
            <div class="card-text">Sicuro</div>
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
            <div class="price">100 🪙</div>
            <p class="price-sub">€1.00</p>
            <button class="btn btn-outline" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card featured">
            <div class="ribbon">Consigliato</div>
            <h3>Growth</h3>
            <div class="price">500 🪙</div>
            <p class="price-sub">€4.50 - Risparmia 10%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card">
            <h3>Pro</h3>
            <div class="price">1000 🪙</div>
            <p class="price-sub">€8.00 - Risparmia 20%</p>
            <button class="btn btn-outline" (click)="navigateTo('login')">Seleziona</button>
          </div>
          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price">5000 🪙</div>
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
              <li><a href="#contact">Privacy</a></li>
              <li><a href="#contact">Terms</a></li>
              <li><a href="#contact">Security</a></li>
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
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
    }

    /* Navbar */
    .navbar {
      background: rgba(26, 26, 46, 0.95);
      backdrop-filter: blur(10px);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(102, 126, 234, 0.2);
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
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-menu a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.3s;
      font-weight: 500;
    }

    .nav-menu a:hover {
      color: #667eea;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-login {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 0.5rem 1rem;
    }

    .btn-login:hover {
      background: #667eea;
      color: white;
    }

    .btn-signup {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
    }

    /* Hero Section */
    .hero {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-content {
      z-index: 1;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: #aaa;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .btn {
      transition: all 0.3s;
      cursor: pointer;
      border: none;
      border-radius: 8px;
      font-weight: 600;
    }

    .btn-primary-large {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2.5rem;
      font-size: 1rem;
    }

    .btn-primary-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary-large {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 1rem 2.5rem;
      font-size: 1rem;
    }

    .btn-secondary-large:hover {
      background: #667eea;
      color: white;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      color: #aaa;
      font-size: 0.9rem;
    }

    .hero-image {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-card {
      position: absolute;
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
      animation: float 3s ease-in-out infinite;
    }

    .card-1 {
      top: 50px;
      left: 20px;
      animation-delay: 0s;
    }

    .card-2 {
      top: 150px;
      right: 40px;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 40px;
      left: 100px;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .card-icon {
      font-size: 2rem;
    }

    .card-text {
      font-size: 0.9rem;
      color: #aaa;
    }

    /* Products Section */
    .products {
      max-width: 1200px;
      margin: 4rem auto;
      padding: 4rem 2rem;
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
      font-size: 1.1rem;
      color: #aaa;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      padding: 2rem;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .product-card:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    }

    .product-card.featured {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      transform: scale(1.05);
    }

    .badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
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
      color: #aaa;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .product-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .product-features li {
      padding: 0.5rem 0;
      color: #ccc;
      font-size: 0.95rem;
    }

    .btn-product {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
      font-weight: 600;
    }

    .btn-product:hover {
      opacity: 0.9;
    }

    /* How It Works */
    .how-it-works {
      max-width: 1200px;
      margin: 4rem auto;
      padding: 4rem 2rem;
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
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    .step h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }

    .step p {
      color: #aaa;
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
      max-width: 1200px;
      margin: 4rem auto;
      padding: 4rem 2rem;
    }

    .pricing-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .pricing-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s;
      position: relative;
    }

    .pricing-card:hover {
      border-color: #667eea;
      transform: translateY(-5px);
    }

    .pricing-card.featured {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      transform: scale(1.05);
    }

    .ribbon {
      position: absolute;
      top: 20px;
      right: -35px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 3rem;
      transform: rotate(45deg);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .pricing-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .price-sub {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .btn-outline {
      width: 100%;
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-primary-small {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
      font-weight: 600;
    }

    /* CTA Section */
    .cta {
      max-width: 800px;
      margin: 4rem auto;
      padding: 3rem 2rem;
      text-align: center;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
    }

    .cta h2 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }

    .cta p {
      color: #aaa;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    /* Footer */
    .footer {
      margin-top: 4rem;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(102, 126, 234, 0.2);
      padding: 3rem 0 1rem;
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
      color: #667eea;
    }

    .footer-section p {
      color: #aaa;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section a {
      color: #aaa;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
      display: block;
      padding: 0.5rem 0;
    }

    .footer-section a:hover {
      color: #667eea;
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