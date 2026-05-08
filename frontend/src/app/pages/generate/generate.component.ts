import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="generate-shell">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <!-- Token Balance -->
        <div class="section">
          <div class="section-header">
            <span>Token Balance</span>
          </div>
          <div class="section-body">
            <div class="token-display">
              <div class="token-current">{{ displayTokens | number:'1.0-0' }}</div>
              <div class="token-label">Available Tokens</div>
              <div *ngIf="selectedModel" class="token-info">
                This model will cost <span class="cost-highlight">{{ selectedModel.cost }} token</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Show transaction if there was one -->
        <div class="section" *ngIf="tokensUsed > 0">
          <div class="section-header" style="color: #059669;">
            <span>✅ Last Generation</span>
          </div>
          <div class="section-body">
            <div class="token-transaction">
              <div>Tokens used: <span class="token-minus">-{{ tokensUsed }}</span></div>
              <div>Remaining: <span class="token-remaining">{{ tokensRemaining }}</span></div>
            </div>
          </div>
        </div>

        <!-- General Settings -->
        <div class="section">
          <!-- <div class="section-header" (click)="toggleSection('general')">
            <!- <span>Impostazioni generali</span> -->
            <!-- <span class="arrow">{{ openSections.general ? '▲' : '▼' }}</span> -->
          <!-- </div> --> 
          <div class="section-body" *ngIf="openSections.general">
            <label>Text-to-Image Model</label>
            <!-- <small class="field-caption">Choose the model to use for image generation.</small> -->
            <div class="custom-select" (click)="toggleDropdown()" [class.disabled]="loadingModels">

              <!-- SELECTED -->
              <div class="selected">
                <img *ngIf="isSvgPath(selectedModel?.icon)" [src]="selectedModel?.icon" class="icon icon-svg" />
                <span *ngIf="!isSvgPath(selectedModel?.icon)" class="icon">{{ selectedModel?.icon }}</span>
                <span>{{ selectedModel?.name || 'Select model' }}</span>
                <span class="arrow">▼</span>
              </div>

              <!-- DROPDOWN -->
              <div class="dropdown" *ngIf="openDropdown">

                <div class="group" *ngFor="let group of availableModelGroups">

                  <!-- GROUP TITLE (CLICKABLE TO TOGGLE) -->
                  <div class="group-title" (click)="toggleGroup(group, $event)">
                    <img *ngIf="isSvgPath(group.icon)" [src]="group.icon" class="icon icon-svg" />
                    <span *ngIf="!isSvgPath(group.icon)" class="icon">{{ group.icon }}</span>
                    <span>{{ group.provider }}</span>
                    <span class="arrow" [class.expanded]="group.expanded">▶</span>
                  </div>

                  <!-- OPTIONS (SHOWN ONLY IF GROUP EXPANDED) -->
                  <div
                    class="option"
                    *ngFor="let item of group.models"
                    [class.hidden]="!group.expanded"
                    (click)="selectModel(item, $event)"
                  >
                    <img *ngIf="isSvgPath(item.icon)" [src]="item.icon" class="icon icon-svg" />
                    <span *ngIf="!isSvgPath(item.icon)" class="icon">{{ item.icon }}</span>
                    <span>{{ item.name }}</span>
                    <!-- Adds cost -->
                    <span class="model-cost">
                      {{ item.cost }} tokens
                    </span>


                  </div>

                </div>

              </div>
            </div> <!-- ✅ chiude custom-select -->



            <label>Ratio</label>
            
            <div class="ratio-grid">
              <button type="button" class="ratio-button" [class.active]="ratio === '1:1'" (click)="ratio='1:1'">1:1</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '16:9'" (click)="ratio='16:9'">16:9</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '3:2'" (click)="ratio='3:2'">3:2</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '2:3'" (click)="ratio='2:3'">2:3</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '3:4'" (click)="ratio='3:4'">3:4</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '4:3'" (click)="ratio='4:3'">4:3</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '21:9'" (click)="ratio='21:9'">21:9</button>
            </div>

            <label>Image Style</label>
            <!-- <small class="field-caption">Select the mood, rendering type, and visual atmosphere.</small> -->
            <div class="style-grid">
              <button type="button" class="style-button"
                *ngFor="let s of styles"
                [class.active]="style === s.value"
                (click)="style = s.value">
                {{ s.label }}
              </button>
            </div>

            
            <small *ngIf="loadingModels" style="color: #9ca3af;">Caricamento modelli...</small>
          </div>
        </div>

        <!-- Reference Images -->
        <div class="section">
          <div class="section-header" (click)="toggleSection('refs')">
            <span>Reference Images ({{ referenceImages.length }}/4)</span>
            <span class="arrow">{{ openSections.refs ? '▲' : '▼' }}</span>
          </div>
          <div class="section-body" *ngIf="openSections.refs">
            <div class="upload-box" (click)="addReferenceImage()">
              <div class="upload-placeholder">+</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main-area">

        <!-- IMAGE PREVIEW -->
        <div class="preview-box">
          <img *ngIf="image" [src]="image" />
          <div *ngIf="!image" class="placeholder">
            No image generated
          </div>
        </div>

        <!-- PROMPT -->
        <div class="prompt-box">
          <textarea
            [(ngModel)]="prompt"
            placeholder="Describe the image you want to generate"
          ></textarea>

          <div class="prompt-actions">
            
            <button (click)="generate()" [disabled]="loading" class="generate-btn">
              <span *ngIf="!loading">Generate</span>
              <span *ngIf="loading" class="loading-indicator">
                Generation
                <span class="dots">
                  <span></span><span></span><span></span>
                </span>
              </span>
            </button>
            <button class="btn-link" (click)="goToGallery()" [disabled]="loading" style="margin-left:0.7rem;">
              Go to gallery
            </button>
            <div *ngIf="error" style="color: #ef4444; font-size: 0.8rem; margin-top: 6px;">
              {{ error }}
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`

    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    

    .generate-shell {
      display: grid;
      grid-template-columns: 280px 1fr; /* puoi anche ridurre la sidebar, es. 240px */
      height: 100%;
      width: 100%;
      gap: 1rem;
      padding: 0.5rem; /* meno spazio a sinistra/destra */
      max-width: 100vw;   /* non oltre la larghezza finestra */

    }

    /* SIDEBAR */
    .sidebar {
      background: var(--color-bg-secondary);
      border-radius: 12px;
      /* bordo più marcato e ombra più profonda */
  border: 1px solid #cbd5e1;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section {
      display: flex;
      flex-direction: column;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .section-body {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 0.5rem;
    }

    .section-body label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 600;
    }

.token-display {
  background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #334155;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
}

.token-current {
  font-size: 2rem;
  font-weight: 700;
  color: #38bdf8; /* azzurro brillante leggibile */
  margin-bottom: 0.25rem;
}

.token-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
}

.token-info {
  font-size: 0.8rem;
  color: #cbd5f5;
  margin-top: 0.5rem;
}

.cost-highlight {
  font-weight: 700;
  color: #f87171; /* rosso soft */
  font-size: 0.9rem;
}
    .token-transaction {
      background: #f0fdf4;
      border-left: 3px solid #16a34a;
      border-radius: 4px;
      padding: 0.6rem;
      font-size: 0.8rem;
      color: #166534;
    }

    .token-minus {
      color: #dc2626;
      font-weight: 700;
    }

    .token-remaining {
      color: #059669;
      font-weight: 700;
    }

    .field-caption {
      font-size: 0.78rem;
      color: #9ca3af;
      line-height: 1.4;
      margin-top: -0.2rem;
      margin-bottom: 0.5rem;
    }

    .section-body select {
      padding: 0.4rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .upload-box {
      margin-top: 0.5rem;
    }

    .upload-placeholder {
      border: 2px dashed #d1d5db;
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #9ca3af;
      cursor: pointer;
    }

    /* MAIN */
    .main-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-box {
      flex: 1;
      border-radius: 12px;
      /* bordo più marcato e ombra più profonda */
    border: 1px solid #cbd5e1;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

      background: var(--color-bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      width: 80%;         /* Riduce la larghezza al 80% */
      margin: 0 auto;  


      height: 100%;
      max-height: 70vh;

    }

    .preview-box img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 10px;
    }

    .placeholder {
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .prompt-box {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 0.6rem;
      background: var(--color-bg-primary);
      width: 80%;         /* Riduce la larghezza al 80% */
      margin: 0 auto;  
    }

    textarea {
      width: 100%;
      border: none;
      resize: none;
      outline: none;
      font-size: 0.9rem;
      padding: 0.5rem;
    }

    .prompt-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.4rem;
    }

    .free-label {
      font-size: 0.75rem;
      color: #6b7280;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 1rem;
      cursor: pointer;
    }

    .btn-link {
      background: transparent;
      border: 1px solid #2563eb;
      color: #2563eb;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
    }

    .ratio-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.4rem;
    }

/* =========================
   RATIO BUTTONS (dark)
========================= */
.ratio-button {
  border: 1px solid #334155;
  background: #020617;
  color: #cbd5e1;

  padding: 0.35rem 0.55rem;
  border-radius: 0.45rem;
  font-size: 0.78rem;
  cursor: pointer;

  transition: all 0.18s ease;
}

.ratio-button:hover {
  border-color: #475569;
  background: #0f172a;
}

.ratio-button.active {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}


/* =========================
   STYLE BUTTONS (dark)
========================= */
.style-button {
  border: 1px solid #334155;
  background: #020617;
  color: #cbd5e1;

  padding: 0.35rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.78rem;
  cursor: pointer;

  transition: all 0.18s ease;
}

.style-button:hover {
  border-color: #475569;
  background: #0f172a;
}

.style-button.active {
  border-color: #a78bfa;
  background: rgba(167, 139, 250, 0.12);
  color: #c4b5fd;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
}

    .ratio-select {
      display: block;
      margin-top: 0.25rem;
      padding: 0.35rem 0.5rem;
      border-radius: 0.45rem;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-size: 0.85rem;
      width: fit-content;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* CUSTOM SELECT & DROPDOWN */
    .custom-select {
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: var(--color-bg-primary);
      cursor: pointer;
      min-width: 200px;
    }

    .custom-select.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .selected {
      padding: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9rem;
    }

    .selected .icon {
      font-size: 1.2rem;
    }

    .selected .arrow {
      margin-left: auto;
      transition: transform 0.2s ease;
    }

    /* This is the correct way to comment in CSS 
    // .dropdown {
    //   position: absolute;
    //   top: calc(100% + 4px);
    //   left: 0;
    //   right: 0;
    //   background: #fff;
    //   border: 1px solid #e5e7eb;
    //   border-radius: 6px;
    //   max-height: 400px;
    //   overflow-y: auto;
    //   z-index: 10;
    //   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
     }*/

    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;

      background: #0f172a; /* dark */
      border: 1px solid #334155;
      border-radius: 8px;

      max-height: 400px;
      overflow-y: auto;
      z-index: 50;

      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }

    .group {
      display: flex;
      flex-direction: column;
    }

    .group-title {
  padding: 0.6rem;
  font-weight: 600;
  background: #1e293b; /* dark section */
  color: #e2e8f0;

  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  border-bottom: 1px solid #334155;
}

.group-title:hover {
  background: #334155;
}

    .group-title .icon {
      font-size: 1.1rem;
    }

    .group-title .arrow {
      margin-left: auto;
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }

    .group-title .arrow.expanded {
      transform: rotate(90deg);
    }

    .model-cost {
  margin-left: auto;
  font-size: 0.75rem;
  color: #0d54e4;
  background: #0c0c0c;
  padding: 0.15rem 0.4rem;
  border-radius: 0.4rem;
}

    .option {
  padding: 0.5rem 0.6rem;
  padding-left: 1.8rem;

  cursor: pointer;
  font-size: 0.9rem;

  display: flex;
  align-items: center;
  gap: 0.4rem;

  color: #e5e7eb; /* testo chiaro */
}

.option:hover {
  background: #1e293b;
}

    .option .icon {
      font-size: 1rem;
    }

    .icon-svg {
      width: 1.2rem;
      height: 1.2rem;
      object-fit: contain;
    }

    .option.hidden {
      display: none;
    }

    .style-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}


.generate-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.generate-btn:hover:not(:disabled) {
  background: #1d4ed8; /* scurisce leggermente al passaggio */
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Indicator dei tre puntini animati */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}

.dots span {
  display: inline-block;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: blink 1s infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-2px); }
}

/* Pulsazione sfumata del pulsante durante caricamento */
.generate-btn:disabled {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.7); }
  100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
}

    /* MOBILE */
    @media (max-width: 900px) {
      .generate-shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: 2;
      }
    }

  `]
})
export class GenerateComponent {
  prompt = '';
  model = 'flux-pro';
  ratio = '1:1';
  image: string | null = null;
  error: string | null = null;

  loading = false;
  loadingModels = true;

  openDropdown = false;
  selectedModel: any = null;

  isPromptFocused = false;


  referenceImages: string[] = [];
  availableModels: any[] = [];
  availableModelGroups: any[] = [];
  openSections = {
    general: true,
    refs: true
  };

  style = '';

  // Token
  currentTokens: number = 0;
  tokensUsed: number = 0;
  tokensRemaining: number = 0;

  displayTokens: number = 0;

  styles = [
    { label: 'Realistic', value: 'photorealistic, ultra detailed, 8k' },
    { label: 'Ultra-realistic', value: 'hyper realistic, ultra detailed, cinematic lighting, 8k' },

    { label: 'Ghibli', value: 'soft anime illustration, pastel colors, hand drawn animation style, whimsical, detailed background, japanese animation style' },

    { label: 'Anime', value: 'anime illustration, sharp lines, vibrant colors, japanese anime style, high detail' },

    { label: 'Cartoon', value: 'cartoon style, clean lines, colorful, stylized' },
    { label: 'Cinematic', value: 'cinematic lighting, dramatic shadows, movie still' },
    { label: 'Fantasy', value: 'fantasy art, epic scene, highly detailed' },
    { label: '3D Render', value: '3d render, octane render, realistic lighting' },
    { label: 'Minimal', value: 'minimalist, simple shapes, clean design' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    // Controllo login all'inizio
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.style = this.styles[0].value; //

    // Load current token balance
    this.authService.getBalance().subscribe(
      (res: any) => {
        this.currentTokens = res.tokens || 0;
        this.animateTokens(this.currentTokens);

      },
      (err) => {
        console.error('Error loading token balance', err);
        this.currentTokens = 0;
      }
    );


    // Lista T2I con provider + sotto-modelli (tipo PollO.ai)
    this.availableModelGroups = [
      {
        provider: 'Flux AI',
        icon: 'assets/flux.png',
        expanded: false,
        models: [
          { id: 'flux-pro', name: 'Flux Pro', icon: 'assets/flux.png', cost: 8 },
          { id: 'flux-dev', name: 'Flux Dev', icon: 'assets/flux.png', cost: 5 },
          { id: 'flux-schnell', name: 'Flux Schnell', icon: 'assets/flux.png', cost: 2 }
        ]
      },
      {
        provider: 'Google',
        icon: 'assets/google.png',
        expanded: false,
        models: [
          { id: 'imagen-4', name: 'Imagen 4 (HQ)', icon: 'assets/google.png', cost: 7 },
          { id: 'imagen-4-fast', name: 'Imagen Fast', icon: 'assets/google.png', cost: 3 },
          { id: 'nano-banana', name: 'Nano Banana', icon: 'assets/google.png', cost: 2 },
          { id: 'nano-banana-pro', name: 'Nano Banana Pro 🔥', icon: 'assets/google.png', cost: 5 }
        ]
      },
      {
        provider: 'OpenAI',
        icon: 'assets/openai.svg',
        expanded: false,
        models: [
          { id: 'gpt-image-1.5', name: 'GPT Image 1.5', icon: 'assets/openai.svg', cost: 7 }
        ]
      },
      {
        provider: 'Qwen',
        icon: 'assets/qwen.jpg',
        expanded: false,
        models: [
          { id: 'qwen-image', name: 'Qwen Image', icon: 'assets/qwen.jpg', cost: 3 }
        ]
      },
      {
        provider: 'Seedream',
        icon: 'assets/seedream.png',
        expanded: false,
        models: [
          { id: 'seedream-5-lite', name: 'Seedream 5.0 Lite', icon: 'assets/seedream.png', cost: 4 }
        ]
      },
      {
        provider: 'Stability AI',
        icon: 'assets/stability.svg',
        expanded: false,
        models: [
          { id: 'sdxl', name: 'SDXL 1.0', icon: 'assets/stability.svg', cost: 3 },
          { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', icon: 'assets/stability.svg', cost: 5 }
        ]
      }
    ];

    this.model = this.availableModelGroups[0].models[0].id;
    this.selectedModel = this.availableModelGroups[0].models[0];
    this.loadingModels = false;

    // Avvia comunque fallback per modelli dal backend (popola un gruppo generico)
    this.authService.getAvailableModels().subscribe(
      (response: any) => {
        const remote = (response.models || []).map((m: any) => ({
          id: m.id,
          name: m.name
        }));
        // if (remote.length) {
        //   this.availableModelGroups = [
        //     {
        //       provider: 'Provider remoto',
        //       models: remote
        //     }
        //   ];
        //   this.model = this.availableModelGroups[0].models[0].id;
        // }
      },
      (error: any) => {
        console.error('Errore nel caricamento dei modelli', error);
        this.loadingModels = false;
        // Fallback ai modelli di default
        this.availableModels = [
          { id: 'flux-pro', name: 'FLUX.1 Pro', description: 'High quality model' },
          { id: 'flux-dev', name: 'FLUX.1 Dev', description: 'Fast and versatile model' },
          { id: 'sdxl', name: 'SDXL', description: 'Stable and reliable model' }
        ];
      }
    );
  }

  animateTokens(target: number) {
  const duration = 1800; // ms (velocità animazione)
  const start = 0;
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    this.displayTokens = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      this.displayTokens = target;
    }
  };

  requestAnimationFrame(step);
}

onBlurPrompt() {
  setTimeout(() => {
    this.isPromptFocused = false;
  }, 150);
}

  toggleSection(section: 'general' | 'refs') {
    this.openSections[section] = !this.openSections[section];
  }

  toggleDropdown() {
    if (this.loadingModels) return;
    this.openDropdown = !this.openDropdown;
  }

  toggleGroup(group: any, event: Event) {
    event.stopPropagation();
    group.expanded = !group.expanded;
  }

  selectModel(item: any, event: Event) {
    event.stopPropagation();
    this.model = item.id;
    this.selectedModel = item;
    this.openDropdown = false;
  }

  isSvgPath(icon: string): boolean {
    return typeof icon === 'string' && (icon.endsWith('.svg') || icon.includes('assets/'));
  }

  addReferenceImage() {
    if (this.referenceImages.length < 4) {
      this.referenceImages.push('dummy.png');
    }
  }


  generate() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.image = null;
    this.error = null;
    this.tokensUsed = 0;
    this.tokensRemaining = 0;

    const styleMap: any = {
      "flux-pro": "ultra realistic",
      "flux-dev": "realistic",
      "sdxl": "digital art",
      "flux-schnell": "clean, modern, slightly stylized",
      "stable-diffusion-3": "photorealistic",
      "dalle-3": "creative illustration"
    };

    const style = styleMap[this.model] || "moderno";
    const finalPrompt = this.buildPrompt();
    console.log("FINALPROMPT", finalPrompt)

    // this.authService.generateImage2(finalPrompt, style, this.model).subscribe(  // <-- qui passiamo model
    this.authService.generateImage(finalPrompt, style, this.model, this.ratio).subscribe(  // <-- passiamo model + ratio

      (res: any) => {
        this.loading = false;

        console.log('RISPOSTA BACKEND:', res);            // 👈 TUTTO
        console.log('IMAGE URL:', res?.image_url);
        console.log('MODEL:', this.model);
        console.log('TOKENS USED:', res?.tokens_used);
        console.log('TOKENS REMAINING:', res?.tokens_remaining);

        if (res.error) {
          this.error = res.error;
        } else if (res.image_url) {
          this.image = environment.apiBaseUrl + res.image_url;

          // Mostra i token scalati
          this.tokensUsed = res.tokens_used || 0;
          this.tokensRemaining = res.tokens_remaining || this.currentTokens - this.tokensUsed;
          this.currentTokens = this.tokensRemaining;
        } else {
          this.error = "Errore sconosciuto dal server.";
        }
      },
      (err: any) => {
        console.error('Errore generazione immagine', err);
        this.loading = false;
        this.error = err.error?.error || "Errore di rete o server non raggiungibile.";
      }
    );
  }


  goToGallery() {
    this.router.navigate(['/gallery']);
  }

  buildPrompt(): string {
    let finalPrompt = this.prompt;

    // mapping ratio → descrizione utile per AI
    const ratioMap: any = {
      "1:1": "square composition",
      "16:9": "wide cinematic composition",
      "3:2": "landscape composition",
      "2:3": "portrait composition",
      "3:4": "portrait composition",
      "4:3": "landscape composition",
      "21:9": "ultra wide cinematic"
    };


    finalPrompt += `, ${ratioMap[this.ratio] || ''}`;

    // 👉 AGGIUNTA STILE
    if (this.style) {
      finalPrompt += `, ${this.style}`;
    }

    // qualità base
    finalPrompt += ", high quality, detailed";

    return finalPrompt;
  }
}