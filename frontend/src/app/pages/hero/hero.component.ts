import { Component, OnInit, OnDestroy } from '@angular/core';
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
            <li><a href="#features">Products</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
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
          <!-- <div class="hero-label">AI Credit Console · Replicate</div> -->
          <h1 class="hero-title">
            Create <span class="gradient-text">stunning AI images & videos </span>
            - Instantly.
          </h1>

          <p class="hero-subtitle">
            Got an idea? Turn it instantly into stunning images and videos—no technical skills required.
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary-large" (click)="navigateTo('register')">
              Start Free
            </button>
            <button class="btn btn-secondary-large" (click)="scrollTo('features')">
              See What You Can Do →
            </button>
          </div>
          <div class="hero-meta">
            <span>Real-time latency monitoring</span>
            <span class="dot"></span>
            <span>Control tokens and costs always</span>
          </div>
          <div class="hero-stats">
            <div class="stat-chip">
              <span class="stat-label">Active Teams</span>
              <span class="stat-value">10K+</span>
            </div>
            <div class="stat-chip">
              <span class="stat-label">Plug-and-play Models</span>
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
                <span class="hero-step-label">Prompt</span>
                <span class="hero-step-meta">"A man walking in the park ..."</span>
              </div>
              <div class="hero-connector"></div>
              <div class="hero-step hero-step-model">
                <span class="hero-step-label">AI Engine</span>
                <span class="hero-step-meta">Flux · SDXL · Video Diffusion</span>
              </div>
              <div class="hero-connector"></div>
              <!-- <div class="hero-step hero-step-model">
                <span class="hero-step-label">Replicate Model</span>
                <span class="hero-step-meta">Version Controlled · Logs</span>
              </div> -->
              <!-- <div class="hero-connector"></div> -->
              <div class="hero-step hero-step-out">
                <span class="hero-step-label">Output</span>

                <div class="output-preview">
                  <img src="assets/flux_example.png" />
                  <video src="assets/video_example.mp4" autoplay muted loop></video>
                </div>


                <span class="hero-step-meta">Image · Video · Variations</span>
              </div>
            </div>
            
            <div class="hero-footnote">
              No keys in frontend · server-side orchestration only
            </div>
          </div>
        </div>
      </section>

      <!-- Sezione Prodotti -->
      <section class="products" id="features">
        <div class="section-header">
          <h2>Available Generative Models</h2>
          <p>Access the world’s best text-to-image models, all in one platform</p>
        </div>

        <div class="products-grid">
          <!-- Flux Pro -->
          <div class="product-card featured" [class.visible]="visibleCards[0]" [style.--card-index]="0" style="--card-index: 0">
            <div class="badge-lightning">Instant & Adaptive</div>
            <div class="product-logo" >
              <img src="assets/flux.png" alt="Flux" class="logo-img" />
            </div>
            <h3>Flux AI</h3>
            <p>Ultra-realistic photo quality with lightning speed</p>
            <ul class="product-features">
              <li>🔥 Premium quality</li>
              <li>⚡ Ultra-fast generation</li>
              <li>🎨 Extraordinary details</li>
              <li>✨ Best quality-to-speed ratio</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Start</button>
            <div class="product-preview">
              <img src="assets/flux_example.png" alt="Flux AI Preview" (click)="scrollTo('pricing')"/>

            </div>
            
          </div>

          <!-- SDXL Stability -->
          <div class="product-card" [class.visible]="visibleCards[1]" [style.--card-index]="1" style="--card-index: 1">
            <div class="badge-lightning">Very Reliable</div>
            <div class="product-logo">
              <img src="assets/stability.svg" 
 alt="Stability" class="logo-img" />
            </div>
            <h3>Stable Diffusion XL</h3>
            <p>The reliable classic for consistent and creative outputs</p>
            <ul class="product-features">
              <li>🎯 Highly reliable</li>
              <li>🖼️ Customizable style</li>
              <li>💰 Cost-effective</li>
              <li>📚 Best community prompts</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Explore</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/mgxm/bb35c491-8794-43d6-81e1-41211831535d/out-0.png" alt="Stable Diffusion XL Preview" (click)="scrollTo('pricing')"/>
            </div>
          </div>

          <!-- Midjourney -->
          <div class="product-card" [class.visible]="visibleCards[2]" [style.--card-index]="2" style="--card-index: 2">
            <div class="product-logo">
              <img src="assets/midjourney.png" alt="Midjourney" class="logo-img" 
              (click)="scrollTo('pricing')"
/>
            </div>
            <h3>Midjourney</h3>
            <p>Unique and refined artistic style, perfect for creative concepts</p>
            <ul class="product-features">
              <li>🎭 Distinctive aesthetic style</li>
              <li>🌈 Vibrant and lively</li>
              <li>✏️ Great for concepts</li>
              <li>🏆 Award-winning</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Discover</button>
          </div>

          <!-- OpenAI DALL-E -->
          <div class="product-card" [class.visible]="visibleCards[3]" [style.--card-index]="3" style="--card-index: 3">
            <div class="badge-lightning">Creative & Expressive</div>
            <div class="product-logo">
              <img src="assets/openai.svg" alt="OpenAI" class="logo-img" />
            </div>
            <h3>OpenAI GPT-image-1.5</h3>
            <p>Precise text interpretation with natural and realistic results</p>
            <ul class="product-features">
              <li>📖 Text understanding</li>
              <li>🎯 Precise execution</li>
              <li>🌍 Broad knowledge</li>
              <li>✅ Premium reliability</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Access</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/xezq/blJQLMYDsk6oMBTU4vO4D2Jmjoa0OY9iu72baLq8yzoZMf5KA/tmpsjqw2di6.jpeg" alt="OpenAI GPT-image-1.5 Preview" (click)="scrollTo('pricing')"/>

            </div>
          </div>

          <!-- Kling -->
          <div class="product-card" [class.visible]="visibleCards[4]" [style.--card-index]="4" style="--card-index: 4">
            <div class="product-logo">
              <img src="assets/kling.jpg" alt="Kling" class="logo-img" />
            </div>
            <h3>Kling Video</h3>
            <p>Transform images and text into extraordinary smooth videos</p>
            <ul class="product-features">
              <li>🎬 High-quality video</li>
              <li>🎞️ Natural movement</li>
              <li>🚀 Emerging technology</li>
              <li>✨ Cinematic effects</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Generate Video</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/pbxt/MNRKHnYUu5HjNqEerj2kxWRmUD3xWGaZ0gJmhqVbkra2jCbD/underwater.jpeg" alt="Kling Video Preview" (click)="scrollTo('pricing')" />

            </div>
          </div>

          <!-- Google Gemini -->
          <div class="product-card" [class.visible]="visibleCards[5]" [style.--card-index]="5" style="--card-index: 5">
            <div class="badge-lightning">Instant & Lightweight</div>
            <div class="product-logo">
              <img src="assets/google.png" alt="Google" class="logo-img" />
            </div>
            <h3>Google Nano-banana</h3>
            <p>Google's multimodal power with advanced context understanding</p>
            <ul class="product-features">
              <li>🧠 Advanced intelligence</li>
              <li>🌐 Multimodal understanding</li>
              <li>🔍 Integrated search</li>
              <li>⚡ Fast and accurate answers</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Explore</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/xezq/PNicQdZsGyLWNpXvNX4pqiaaotTP5j23J9cSyTuReLpLVxFLA/tmpx6zdponu.jpeg" alt="Flux AI Preview" (click)="scrollTo('pricing')"/>

            </div>
          </div>

          <!-- Seedream -->
          <div class="product-card" [class.visible]="visibleCards[6]" [style.--card-index]="6" style="--card-index: 6">
            <div class="product-logo">
              <img src="assets/seedream.png" alt="Seedream" class="logo-img" />
            </div>
            <h3>Seedream</h3>
            <p>Artistic generation with unique styles and unlimited creativity</p>
            <ul class="product-features">
              <li>🎨 Unique artistic styles</li>
              <li>🌈 Unlimited creativity</li>
              <li>✨ Amazing results</li>
              <li>🎭 Artistic expression</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Create Art</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/xezq/eG2pfAezTFZtzow6LeIxb6wiyJYlcsNW6Y092mDvLFjrfWWxC/tmpud9jmfu_.png" alt="Seedream Preview" (click)="scrollTo('pricing')"/>
            </div>
          </div>

          <!-- Qwen -->
          <div class="product-card" [class.visible]="visibleCards[7]" [style.--card-index]="7" style="--card-index: 7">
            <div class="badge-lightning">Versatile, Omniscient</div>
            <div class="product-logo">
              <img src="assets/qwen.jpg" alt="Qwen" class="logo-img" />
            </div>
            <h3>Qwen</h3>
            <p>Advanced language model with excellent language understanding</p>
            <ul class="product-features">
              <li>📝 Excellent understanding</li>
              <li>🌍 Multilingual support</li>
              <li>🧠 Advanced reasoning</li>
              <li>📚 In-depth knowledge</li>
            </ul>
            <button class="btn btn-product" (click)="scrollTo('pricing')">Discover</button>
            <div class="product-preview">
              <img src="https://replicate.delivery/xezq/tJpz92U8JrJdAtnQm5N5rIuYHZaOMiftBhiK0vKYHsKcU1jKA/out-0.webp" alt="Qwen AI Preview" (click)="scrollTo('pricing')"/>

            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works" id="how-it-works">
        <div class="section-header">
          <h2>From Zero to Hero in 3 Moves ⚡</h2>
          <p>Your AI journey starts here—no boring setup, just pure creativity</p>
        </div>

        <div class="steps">
          <div class="step step-1">
            <!-- <div class="step-icon">🚀</div> -->
            <div class="step-icon">◆</div>
            <div class="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>Free signup in literally 2 minutes—just grab your email and you're in the game</p>
            <span class="time-badge">⏱️ 2 min</span>
          </div>
          <div class="step-arrow">→</div>
          <div class="step step-2">
            <!-- <div class="step-icon">💰</div> -->
            <div class="step-icon">◉</div>
            <div class="step-number">2</div>
            <h3>Get Your Tokens</h3>
            <p>Pick a pack that fits your vibe, no strings attached. Pay once, create forever</p>
            <span class="time-badge">💳 Instant</span>
          </div>
          <div class="step-arrow">→</div>
          <div class="step step-3">
            <!-- <div class="step-icon">✨</div> -->
            <div class="step-icon">✧</div>
            <div class="step-number">3</div>
            <h3>Level Up Your Game</h3>
            <p>Turn your wildest ideas into reality—images, videos, all that AI magic</p>
            <span class="time-badge">🎬 Ready!</span>
          </div>
        </div>

        <div class="steps-bonus">
          <p class="bonus-text">💡 Pro Tip: Most creators earn back their investment in their first week</p>
        </div>
      </section>

      <!-- Pricing Preview -->
      <section class="pricing-preview" id="pricing">
        <div class="section-header">
          <h2>Token Packages</h2>
          <p>Choose the plan that's right for you</p>
        </div>

        <div class="pricing-cards">
          <div class="pricing-card">
            <h3>Starter</h3>
            <div class="price">100 ⚡ </div>
            <p class="price-sub">€1.00</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Select</button>
          </div>
          <div class="pricing-card featured">
            <div class="ribbon">Recommended</div>
            <h3>Growth</h3>
            <div class="price">500 ⚡ </div>
            <p class="price-sub">€4.50 - Save 10%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Select</button>
          </div>
          <div class="pricing-card">
            <h3>Pro</h3>
            <div class="price">1000 ⚡ </div>
            <p class="price-sub">€8.00 - Save 20%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Select</button>
          </div>
          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price">5000 ⚡ </div>
            <p class="price-sub">€35.00 - Save 30%</p>
            <button class="btn btn-primary-small" (click)="navigateTo('login')">Select</button>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of developers using Repli</p>
        <button class="btn btn-primary-large" (click)="navigateTo('register')">
          Sign Up Free Today
        </button>
      </section>

      <!-- Privacy Section -->
<!-- <section class="legal-section" id="privacy">
  <div class="legal-container">
    <h2>Privacy Policy</h2>
    <p>
      Your privacy is important to us. We collect only the necessary data
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
      <li>It is forbidden to use the service for illegal activities.</li>
      <li>Ci riserviamo il diritto di sospendere account in caso di abuso.</li>
    </ul>
  </div>
</section>

<! Security Section -->
<!-- <section class="legal-section" id="security">
  <div class="legal-container">
    <h2>Security</h2>
    <p>
      We implement advanced security measures to protect your data.
    </p>

    <ul>
      <li>🔒 Encrypted HTTPS connections</li>
      <li>🔐 Secure password hashing</li>
      <li>🛡️ Continuous abuse monitoring</li>
      <li>📊 Logging and audit trail</li>
    </ul>
  </div>
</section>  -->
      <!-- Sezione Contatti -->
    <section class="contact-section" id="contact">
      <div class="contact-background">
        <div class="contact-overlay"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <div class="contact-wrapper">
        <div class="contact-header">
          <div class="contact-badge">
            <span class="badge-icon">💬</span>
            <span class="badge-text">Contact Us</span>
          </div>
          <h2 class="contact-title">
            Have a Question?<br>
            <span class="gradient-highlight">We're Here to Help</span>
          </h2>
          <p class="contact-subtitle">
            Our team is ready to answer all your questions about our AI services
          </p>
        </div>

        <div class="contact-grid">
          <!-- Contact Cards -->
          <div class="contact-cards">
            <div class="contact-card" data-aos="fade-up" data-aos-delay="100">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.5 13.5L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <h3>Email Support</h3>
              <p>Response within 24 hours</p>
              <a href="mailto:support@repli.ai" class="contact-link">
                support&#64;repli.ai
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10L10 6M10 6H7M10 6V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

            <div class="contact-card" data-aos="fade-up" data-aos-delay="200">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21C16.13 21 12.46 19.5 9.5 16.92M22 16.92C22 16.3896 21.7893 15.8809 21.4142 15.5058C21.0391 15.1307 20.5304 15 20 15C16.13 15 12.46 16.5 9.5 19.08M22 16.92C19.5 16.92 17.32 15.5 15.5 13.92M9.5 19.08C9.5 19.08 9.5 19.08 9.5 19.08C7.68 17.5 5.5 16.08 3 16.08C2.46957 16.08 1.96086 15.8693 1.58579 15.4942C1.21071 15.1191 1 14.6104 1 14.08V11C1 10.4696 1.21071 9.96086 1.58579 9.58579C1.96086 9.21071 2.46957 9 3 9C6.87 9 10.54 10.5 13.5 13.08" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Phone</h3>
              <p>Mon-Fri 9:00-18:00 CET</p>
              <a href="tel:+390123456789" class="contact-link">
                +39 012 345 6789
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10L10 6M10 6H7M10 6V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

            <div class="contact-card" data-aos="fade-up" data-aos-delay="300">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.657 16.657L13.414 20.9C13.2284 21.0857 13.0081 21.233 12.7657 21.3335C12.5233 21.434 12.2641 21.4857 12.0015 21.4857C11.7389 21.4857 11.4797 21.434 11.2373 21.3335C10.9949 21.233 10.7746 21.0857 10.589 20.9L6.343 16.657C5.22422 15.5382 4.46234 14.1127 4.15369 12.5608C3.84504 11.0089 4.00349 9.40047 4.60901 7.93863C5.21452 6.47679 6.2399 5.2275 7.55548 4.3484C8.87106 3.4693 10.4178 3 12 3C13.5822 3 15.1289 3.4693 16.4445 4.3484C17.7601 5.2275 18.7855 6.47679 19.391 7.93863C19.9965 9.40047 20.155 11.0089 19.8463 12.5608C19.5377 14.1127 18.7758 15.5382 17.657 16.657V16.657Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3>Office</h3>
              <p>Milan, Italy</p>
              <div class="contact-address">
                Via AI 42<br>
                20100 Milan
              </div>
            </div>
          </div>

          <!-- Modulo Contatti -->
          <div class="contact-form-container" data-aos="fade-up" data-aos-delay="400">
            <div class="form-header">
              <h3>Send a Message</h3>
              <p>Fill out the form and we'll get back to you soon</p>
            </div>

            <form class="contact-form" (submit)="submitContact($event)">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" name="subject" class="form-select" required>
                  <option value="">Select a topic</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="partnership">Partnership</option>
                  <option value="general">General Information</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Describe your request..."
                  required
                  class="form-textarea"
                ></textarea>
              </div>

              <button type="submit" class="btn-submit">
                <span>Send Message</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Social Links -->
        <div class="social-section">
          <h3>Follow Us on Social</h3>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2H21l-6.56 7.49L22.5 22h-6.63l-5.19-6.77L4.9 22H2l7.02-8.02L1.5 2h6.63l4.7 6.2L18.244 2zm-2.32 18h1.85L7.08 4H5.1l10.824 16z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-container">
          <div class="footer-top">
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="logo-mark footer-logo-mark">RX</span>
                <span class="footer-logo-title">ReplicateXpress</span>
              </div>
              <p class="footer-description">
                The most advanced AI platform to easily use Replicate APIs
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
              <h3 class="footer-links-title">Quick Links</h3>
              <ul class="footer-links-list">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="javascript:void(0)" (click)="navigateTo('register')">Sign Up</a></li>
              </ul>
            </div>

            <div class="footer-links-group">
              <h3 class="footer-links-title">Legal</h3>
              <ul class="footer-links-list">
                <li><a routerLink="/privacy">Privacy Policy</a></li>
                <li><a routerLink="/terms">Terms of Service</a></li>
                <li><a routerLink="/security">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2026 Vibe srl. All rights reserved.</p>
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
      background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 45%),
                  radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.14), transparent 32%),
                  #050816;
      color: #e2e8f0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    /* Navbar */
    .navbar {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(16px);
      padding: 0.9rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
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
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .nav-menu a:hover {
      color: #ffffff;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-login {
      background: rgba(255,255,255,0.06);
      color: #e2e8f0;
      border-radius: 6px;
      border: 1px solid rgba(148, 163, 184, 0.3);
      padding: 0.45rem 1rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .btn-login:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(148, 163, 184, 0.55);
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
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.22);
      color: #cbd5e1;
    }
    
    /* .hero-title {
      font-size: clamp(2.3rem, 3vw, 2.8rem);
      font-weight: 650;
      margin: 0;
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: #f8fafc;
    } */

    .hero-title {
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.05;
  letter-spacing: -0.05em;
  color: #f8fafc;
}
    
    .gradient-text {
      background: linear-gradient(120deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .hero-subtitle {
      font-size: 0.98rem;
      color: #cbd5e1;
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
      background-color: rgba(255,255,255,0.08);
      color: #e2e8f0;
      border: 1px solid rgba(148, 163, 184, 0.3);
      padding: 0.9rem 2.3rem;
      font-size: 0.95rem;
    }

    .btn-secondary-large:hover {
      background-color: rgba(255,255,255,0.16);
      border-color: rgba(148, 163, 184, 0.55);
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.78rem;
      color: #94a3b8;
    }
    
    .hero-meta .dot {
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background-color: #94a3b8;
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
      background: rgba(15, 23, 42, 0.86);
      border: 1px solid rgba(148, 163, 184, 0.18);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.78rem;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
    }
    
    .stat-label {
      color: #94a3b8;
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
    
    /* hero glass wrapper */

    .hero-glass {
      position: relative;
      width: 100%;
      max-width: 360px;
      border-radius: 1.3rem;
      padding: 1.2rem 1.1rem;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.24);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
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
      border: 1px solid rgba(148, 163, 184, 0.25);
      background-color: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      white-space: nowrap;
    }
    
    .pill-live {
      border-color: rgba(52, 211, 153, 0.55);
      color: #a7f3d0;
      background-color: rgba(52, 211, 153, 0.14);
    }
    
    .pill-safe {
      border-color: rgba(147, 197, 253, 0.55);
      color: #bfdbfe;
      background-color: rgba(147, 197, 253, 0.12);
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
      background-color: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(148, 163, 184, 0.22);
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

    /* .hero-step-model {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #34d399;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
} */

.hero-step-model {
  position: relative;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #34d399;
  overflow: hidden;
}

.hero-step-model::after {
  content: "";
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle, rgba(16,185,129,0.4), transparent 60%);
  animation: pulse-ai 2.5s infinite;
  z-index: 0;
}

@keyframes pulse-ai {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}
    
    .hero-step-out {
      opacity: 0.95;
      border-style: dashed;
    }
    
    .hero-step-label {
      font-weight: 500;
      color: #116ceb;
    }
    
    .hero-step-meta {
      color: #6b7280;
    }
    
    /* .hero-connector {
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
} */

.hero-connector {
  height: 14px;
  margin-left: 1.1rem;
  position: relative;
}

.hero-connector::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  opacity: 0.4;
}

.hero-connector::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 12px #6366f1;
  animation: flow-pulse 1.2s linear infinite;
}

@keyframes flow-pulse {
  0% { left: 0%; opacity: 0; }
  20% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
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
      color: #d8dce2;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-auto-rows: minmax(220px, auto);
      grid-auto-flow: dense;
      gap: 1.35rem;
      align-items: start;
    }

    .products-grid > .product-card {
      min-height: 220px;
    }

    .products-grid > .product-card:nth-child(1) {
      grid-column: span 4;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(2) {
      grid-column: span 4;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(3) {
      grid-column: span 4;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(4) {
      grid-column: span 4;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(5) {
      grid-column: span 3;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(6) {
      grid-column: span 5;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(7) {
      grid-column: span 6;
      grid-row: span 1;
    }

    .products-grid > .product-card:nth-child(8) {
      grid-column: span 6;
      grid-row: span 1;
    }

    .product-card {
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 1.25rem;
      padding: 1.85rem 1.9rem;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.22);
      backdrop-filter: blur(14px);
      color: #e2e8f0;
      opacity: 0;
      transform: translateY(40px) scale(0.95);
      animation: revealCard 0.6s ease-out forwards;
      animation-delay: calc(var(--card-index, 0) * 0.08s);
    }

    @keyframes revealCard {
      0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        filter: blur(8px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    .product-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
      animation: shimmer 3s infinite;
      pointer-events: none;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .product-card:hover {
      border-color: rgba(99, 102, 241, 0.72);
      transform: translateY(-6px);
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.32);
    }

    .product-card.featured {
      grid-column: span 5;
      grid-row: span 2;
      border: 1px solid rgba(99, 102, 241, 0.35);
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(79, 70, 229, 0.08));
    }

    .product-card.featured::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 1.25rem;
      padding: 1px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.7));
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: intersect;
      -webkit-mask-composite: source-out;
      pointer-events: none;
      opacity: 0;
      animation: borderGlow 3s ease-in-out infinite;
    }

    @keyframes borderGlow {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .product-preview {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 1.25rem;
      overflow: hidden;
      z-index: 10;
    }

    .product-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1.25rem;
    }

    .product-card:hover .product-preview {
      opacity: 1;
    }

    @media (max-width: 1100px) {
      .products-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .products-grid > .product-card:nth-child(1),
      .products-grid > .product-card:nth-child(6) {
        grid-column: span 2;
      }
      .products-grid > .product-card:nth-child(8) {
        grid-column: span 2;
      }
    }

    @media (max-width: 720px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
      .products-grid > .product-card,
      .products-grid > .product-card:nth-child(1),
      .products-grid > .product-card:nth-child(6),
      .products-grid > .product-card:nth-child(8) {
        grid-column: auto;
        grid-row: auto;
      }
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

    .badge-lightning {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      padding: 0.5rem 1.2rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.2);
      animation: pulse-badge 2s ease-in-out infinite, float-badge 3s ease-in-out infinite;
      z-index: 10;
    }

    @keyframes pulse-badge {
      0%, 100% {
        transform: translateY(0) scale(1);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.2);
      }
      50% {
        transform: translateY(-2px) scale(1.08);
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.4);
      }
    }

    @keyframes float-badge {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    .product-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: none;
    }

    .product-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(148, 163, 184, 0.12));
      border-radius: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.24);
      padding: 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .product-logo::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.12), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-logo {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(148, 163, 184, 0.14));
      border-color: rgba(99, 102, 241, 0.65);
      transform: scale(1.06) rotateZ(1deg);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.12);
    }

    .product-card:hover .product-logo::before {
      opacity: 1;
    }

    .logo-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.18));
      transition: transform 0.3s ease;
      z-index: 1;
      cursor: pointer;
  pointer-events: auto;
  display: block;

    }

    .product-card:hover .logo-img {
      transform: scale(1.08) rotateZ(-2deg);
    }

    .product-card h3 {
      font-size: 1.5rem;
      color: #e2e8f0;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .product-card.featured h3 {
      background: linear-gradient(120deg, #818cf8, #a78bfa);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .product-card p {
      color: #cbd5e1;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .product-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .product-features li {
      padding: 0.45rem 0;
      color: #cbd5e1;
      font-size: 0.85rem;
      transition: transform 0.2s ease;
    }

    .product-card:hover .product-features li {
      transform: translateX(4px);
    }

    .btn-product {
      width: 100%;
      background: rgba(99, 102, 241, 0.15);
      color: #eff6ff;
      padding: 0.75rem 0.95rem;
      border-radius: 0.85rem;
      border: 1px solid rgba(99, 102, 241, 0.35);
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: none;
      transition: background-color 0.15s ease, transform 0.15s ease;
    }

    .btn-product:hover {
      background: rgba(99, 102, 241, 0.27);
      transform: translateY(-1px);
    }

    /* How It Works */
    .how-it-works {
      max-width: 1120px;
      margin: 4.5rem auto;
      padding: 4rem 2rem;
      text-align: center;
      position: relative;
    }

    .how-it-works::before {
      content: '';
      position: absolute;
      top: -40%;
      right: -20%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent);
      border-radius: 999px;
      filter: blur(40px);
      z-index: 0;
      pointer-events: none;
    }

    .how-it-works .section-header {
      position: relative;
      z-index: 1;
    }

    .steps {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 3.5rem;
      position: relative;
      z-index: 1;
    }

    .step {
      flex: 0 1 calc(33.333% - 0.7rem);
      min-width: 240px;
      padding: 2rem 1.8rem;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 1.2rem;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform: translateY(0);
    }

    .step::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
    }

    .step::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
      border-radius: 1.2rem;
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: -1;
    }

    .step:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(15, 23, 42, 0.95);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
    }

    .step:hover::after {
      opacity: 1;
    }

    .step-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: inline-block;
      animation: float 3s ease-in-out infinite;
    }

    .step-1 .step-icon { animation-delay: 0s; }
    .step-2 .step-icon { animation-delay: 0.5s; }
    .step-3 .step-icon { animation-delay: 1s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #ffffff;
      border-radius: 999px;
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0.5rem auto 1.2rem;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      position: relative;
      z-index: 1;
    }

    .step h3 {
      font-size: 1.35rem;
      color: #f8fafc;
      margin-bottom: 0.7rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      position: relative;
      z-index: 1;
    }

    .step p {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
    }

    .time-badge {
      display: inline-block;
      padding: 0.45rem 1rem;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 999px;
      font-size: 0.85rem;
      color: #a5b4fc;
      margin-top: 0.8rem;
      position: relative;
      z-index: 1;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .steps-bonus {
      margin-top: 3rem;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08));
      border: 1px dashed rgba(99, 102, 241, 0.3);
      border-radius: 1rem;
      position: relative;
      z-index: 1;
    }

    .bonus-text {
      color: #cbd5e1;
      font-size: 0.98rem;
      margin: 0;
      font-weight: 500;
    }

    .step-arrow {
      font-size: 2.2rem;
      color: #6366f1;
      display: none;
      align-self: center;
      animation: slideArrow 1.5s ease-in-out infinite;
      position: relative;
      z-index: 1;
    }

    @keyframes slideArrow {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(6px); }
    }

    @media (min-width: 768px) {
      .step-arrow {
        display: flex;
      }
    }

    @media (max-width: 768px) {
      .step {
        flex: 0 1 100%;
      }

      .step-arrow {
        display: none;
      }

      .steps {
        flex-direction: column;
        gap: 1.5rem;
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
      background: rgba(15, 23, 42, 0.88);
      border: 2px solid rgba(148, 163, 184, 0.18);
      border-radius: 1.2rem;
      padding: 1.9rem 1.8rem;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
      overflow: hidden;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .pricing-card:nth-child(1) {
      animation-delay: 0.1s;
    }

    .pricing-card:nth-child(2) {
      animation-delay: 0.2s;
    }

    .pricing-card:nth-child(3) {
      animation-delay: 0.3s;
    }

    .pricing-card:nth-child(4) {
      animation-delay: 0.4s;
    }

    .pricing-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .pricing-card:hover {
      border-color: #6366f1;
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 30px 60px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.2);
      animation: none;
    }

    .pricing-card:hover::before {
      opacity: 1;
    }

    .pricing-card.featured {
      border-color: rgba(59, 130, 246, 0.8);
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(79, 70, 229, 0.12));
      position: relative;
      z-index: 1;
    }

    .pricing-card.featured::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .pricing-card.featured:hover {
      border-color: #6366f1;
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 40px 80px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.3);
    }

    .ribbon {
      position: absolute;
      top: 18px;
      right: -30px;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: #ffffff;
      padding: 0.45rem 3rem;
      transform: rotate(45deg);
      font-size: 0.75rem;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      animation: slideIn 0.6s ease-out 0.3s forwards;
      animation-fill-mode: both;
    }

    .pricing-card h3 {
      font-size: 1.3rem;
      color: #e2e8f0;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    .pricing-card:hover h3 {
      color: #6366f1;
      transform: scale(1.05);
    }

    .price {
      font-size: 1.9rem;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .pricing-card:hover .price {
      font-size: 2.1rem;
      transform: scale(1.1);
    }

    .price-sub {
      color: #4b5563;
      font-size: 0.8rem;
      margin-bottom: 1.8rem;
      transition: all 0.3s ease;
    }

    .pricing-card:hover .price-sub {
      color: #818cf8;
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
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(148, 163, 184, 0.55);
    }

    .btn-primary-small {
      width: 100%;
      border-radius: 6px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 0.7rem 0.9rem;
      border: none;
      font-weight: 500;
      font-size: 0.85rem;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .btn-primary-small::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .btn-primary-small:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4), 0 0 20px rgba(99, 102, 241, 0.2);
    }

    .btn-primary-small:hover::before {
      left: 100%;
    }

    .btn-primary-small:active {
      transform: translateY(0px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    /* CTA Section */
    .cta {
      max-width: 800px;
      margin: 3.5rem auto 4rem;
      padding: 2.6rem 2.1rem;
      text-align: center;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 1.25rem;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
    }

    .cta h2 {
      font-size: 2.2rem;
      color: #f8fafc;
      margin-bottom: 1rem;
    }

    .cta p {
      color: #cbd5e1;
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
      position: relative;
      padding: 6rem 2rem;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .contact-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .contact-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(1px);
    }

    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .contact-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .contact-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .badge-icon {
      font-size: 1rem;
    }

    .contact-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .gradient-highlight {
      background: linear-gradient(135deg, #ffd700, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .contact-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
      margin-bottom: 4rem;
    }

    .contact-cards {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .contact-card {
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
    }

    .contact-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 24px 72px rgba(0, 0, 0, 0.25);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 1rem;
    }

    .contact-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #eff6ff;
      margin-bottom: 0.5rem;
    }

    .contact-card p {
      color: #cbd5e1;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .contact-link:hover {
      color: #5a67d8;
      transform: translateX(3px);
    }

    .contact-address {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .contact-form-container {
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #eff6ff;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #cbd5e1;
      font-size: 0.875rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 0.875rem 1rem;
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.94);
      color: #e2e8f0;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.875rem 2rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;
    }

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .social-section {
      text-align: center;
    }

    .social-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .contact-title {
        font-size: 2rem;
      }

      .contact-section {
        padding: 4rem 1rem;
      }

      .contact-card,
      .contact-form-container {
        padding: 1.5rem;
      }
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
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
  cursor: pointer;
}

.product-card.featured .btn-product {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
  font-weight: 600;
}

.product-card.featured .btn-product:hover {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.4);
}
/* --- Stili per i Circoli Floating nella sezione Contatti --- */

.contact-section {
  position: relative; /* Necessario per i cerchi absolute */
  padding: 80px 0;
  overflow: hidden; /* Evita che i cerchi creino scrollbar */
  background: #050816;
}

.contact-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Sopra lo sfondo nero, sotto il testo */
}

.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px); /* Crea l'effetto "aura" */
  opacity: 0.5;
  animation: float-animation 20s infinite alternate ease-in-out;
}

/* Cerchio 1: In alto a destra (vicino a Have a Question) */
.shape-1 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  top: -50px;
  right: -50px;
}

/* Cerchio 2: In basso a sinistra */
.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  bottom: 20px;
  left: -80px;
  animation-delay: -5s !important;
}

/* Cerchio 3: Centrale/Destra basso */
.shape-3 {
  width: 200px;
  height: 200px;
  background: rgba(59, 130, 246, 0.4);
  bottom: 10%;
  right: 15%;
  animation-duration: 15s !important;
}

/* Assicurati che il contenuto sia sopra i cerchi */
.contact-wrapper {
  position: relative;
  z-index: 2; 
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.output-preview {
  position: relative;
  margin-top: 0.4rem;
  border-radius: 8px;
  overflow: hidden;
  height: 80px;
}

.output-preview img,
.output-preview video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: swapPreview 6s infinite;
}

.output-preview video {
  opacity: 0;
}

@keyframes swapPreview {
  0%, 45% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Animazione del movimento */
@keyframes float-animation {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -50px) scale(1.1);
  }
  100% {
    transform: translate(-20px, 20px) scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes glowPulse {
  0% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.5);
  }
  100% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  visibleCards: boolean[] = [false, false, false, false, false, false, false, false];
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const cardIndex = parseInt(element.style.getPropertyValue('--card-index'), 10);
          
          setTimeout(() => {
            this.visibleCards[cardIndex] = true;
          }, cardIndex * 100); // Stagger effect
        }
      });
    }, options);

    // Osserva tutte le product-card
    document.querySelectorAll('.product-card').forEach(card => {
      this.intersectionObserver?.observe(card);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  scrollTo(id: string) {
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  submitContact(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Here you would typically send the data to your backend
    console.log('Contact form submitted:', contactData);

    // For now, just show a success message
    alert('Grazie per il tuo messaggio! Ti risponderemo presto.');

    // Reset the form
    form.reset();
  }
}