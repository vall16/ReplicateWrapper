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
        <!-- Impostazioni generali -->
        <div class="section">
          <!-- <div class="section-header" (click)="toggleSection('general')">
            <!- <span>Impostazioni generali</span> -->
            <!-- <span class="arrow">{{ openSections.general ? '▲' : '▼' }}</span> -->
          <!-- </div> --> 
          <div class="section-body" *ngIf="openSections.general">
            <label>Modello Text-to-Image</label>
            <!-- <small class="field-caption">Scegli il modello da usare per generare l'immagine.</small> -->
            <div class="custom-select" (click)="toggleDropdown()" [class.disabled]="loadingModels">

              <!-- SELECTED -->
              <div class="selected">
                <img *ngIf="isSvgPath(selectedModel?.icon)" [src]="selectedModel?.icon" class="icon icon-svg" />
                <span *ngIf="!isSvgPath(selectedModel?.icon)" class="icon">{{ selectedModel?.icon }}</span>
                <span>{{ selectedModel?.name || 'Seleziona modello' }}</span>
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
                  </div>

                </div>

              </div>
            </div> <!-- ✅ chiude custom-select -->



            <label>Proporzioni</label>
            
            <div class="ratio-grid">
              <button type="button" class="ratio-button" [class.active]="ratio === '1:1'" (click)="ratio='1:1'">1:1</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '16:9'" (click)="ratio='16:9'">16:9</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '3:2'" (click)="ratio='3:2'">3:2</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '2:3'" (click)="ratio='2:3'">2:3</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '3:4'" (click)="ratio='3:4'">3:4</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '4:3'" (click)="ratio='4:3'">4:3</button>
              <button type="button" class="ratio-button" [class.active]="ratio === '21:9'" (click)="ratio='21:9'">21:9</button>
            </div>
            <!-- <select [(ngModel)]="ratio" class="ratio-select" aria-label="Seleziona proporzione">
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="3:2">3:2</option>
              <option value="2:3">2:3</option>
              <option value="3:4">3:4</option>
              <option value="4:3">4:3</option>
              <option value="21:9">21:9</option>
            </select> -->

            <label>Stile immagine</label>
            <!-- <small class="field-caption">Seleziona il mood, il tipo di rendering e l'atmosfera visiva.</small> -->
            <div class="style-grid">
              <button type="button" class="style-button"
                *ngFor="let s of styles"
                [class.active]="style === s.value"
                (click)="style = s.value">
                {{ s.label }}
              </button>
            </div>

            <!-- <label>Modello Text-to-Image</label>
            <!- <small class="field-caption">Scegli il modello da usare per generare l'immagine.</small> -->
            <!-- <div class="custom-select" (click)="toggleDropdown()" [class.disabled]="loadingModels">

              <!- SELECTED -->
              <!-- <div class="selected">
                <img *ngIf="isSvgPath(selectedModel?.icon)" [src]="selectedModel?.icon" class="icon icon-svg" />
                <span *ngIf="!isSvgPath(selectedModel?.icon)" class="icon">{{ selectedModel?.icon }}</span>
                <span>{{ selectedModel?.name || 'Seleziona modello' }}</span>
                <span class="arrow">▼</span>
              </div> --> 

              <!-- DROPDOWN -->
              <!-- <div class="dropdown" *ngIf="openDropdown">

                <div class="group" *ngFor="let group of availableModelGroups">

                  <!- GROUP TITLE (CLICKABLE TO TOGGLE) -->
                  <!-- <div class="group-title" (click)="toggleGroup(group, $event)">
                    <img *ngIf="isSvgPath(group.icon)" [src]="group.icon" class="icon icon-svg" />
                    <span *ngIf="!isSvgPath(group.icon)" class="icon">{{ group.icon }}</span>
                    <span>{{ group.provider }}</span>
                    <span class="arrow" [class.expanded]="group.expanded">▶</span>
                  </div>

                  < OPTIONS (SHOWN ONLY IF GROUP EXPANDED) -->
                  <!-- <div
                    class="option"
                    *ngFor="let item of group.models"
                    [class.hidden]="!group.expanded"
                    (click)="selectModel(item, $event)"
                  >
                    <img *ngIf="isSvgPath(item.icon)" [src]="item.icon" class="icon icon-svg" />
                    <span *ngIf="!isSvgPath(item.icon)" class="icon">{{ item.icon }}</span>
                    <span>{{ item.name }}</span>
                  </div>

                </div> -->

              <!-- </div>
            </div> ✅ chiude custom-select  -->
  
            <small *ngIf="loadingModels" style="color: #9ca3af;">Caricamento modelli...</small>
          </div>
        </div>

        <!-- Immagini di riferimento -->
        <div class="section">
          <div class="section-header" (click)="toggleSection('refs')">
            <span>Immagini di riferimento ({{ referenceImages.length }}/4)</span>
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
            Nessuna immagine generata
          </div>
        </div>

        <!-- PROMPT -->
        <div class="prompt-box">
          <textarea
            [(ngModel)]="prompt"
            placeholder="Descrivi l'immagine..."
          ></textarea>

          <div class="prompt-actions">
            <!-- <span class="free-label">Gratis</span> -->
            <!-- <button (click)="generate()" [disabled]="loading">
              {{ loading ? 'Generazione...' : 'Genera' }}
            </button> -->
            <button (click)="generate()" [disabled]="loading" class="generate-btn">
              <span *ngIf="!loading">Genera</span>
              <span *ngIf="loading" class="loading-indicator">
                Generazione
                <span class="dots">
                  <span></span><span></span><span></span>
                </span>
              </span>
            </button>
            <button class="btn-link" (click)="goToGallery()" [disabled]="loading" style="margin-left:0.7rem;">
              Vai alla galleria
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
      background: #fff;
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

      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      width: 80%;         /* Riduce la larghezza al 80% */
      margin-right: auto;  


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
      background: #ffffff;
      width: 80%;         /* Riduce la larghezza al 80% */
      margin-right: auto;  
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

    .ratio-button {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      padding: 0.35rem 0.55rem;
      border-radius: 0.45rem;
      font-size: 0.78rem;
      cursor: pointer;
      min-width: 56px;
      text-align: center;
      transition: all 0.18s ease;
    }

    .ratio-button:hover {
      border-color: #94a3b8;
      background: #e2e8f0;
    }

    .ratio-button.active {
      border-color: #2563eb;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 600;
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
      background: #fff;
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

    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .group {
      display: flex;
      flex-direction: column;
    }

    .group-title {
      padding: 0.6rem;
      font-weight: 600;
      background: #f9fafb;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      user-select: none;
      border-bottom: 1px solid #e5e7eb;
      transition: background-color 0.15s ease;
    }

    .group-title:hover {
      background: #f3f4f6;
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

    .option {
      padding: 0.5rem 0.6rem;
      padding-left: 1.8rem;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #374151;
      transition: background-color 0.15s ease;
    }

    .option:hover {
      background: #f3f4f6;
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

.style-button {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  padding: 0.35rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.18s ease;
}

.style-button:hover {
  border-color: #94a3b8;
  background: #e2e8f0;
}

.style-button.active {
  border-color: #7c3aed;
  background: #f5f3ff;
  color: #5b21b6;
  font-weight: 600;
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

  referenceImages: string[] = [];
  availableModels: any[] = [];
  availableModelGroups: any[] = [];
  openSections = {
    general: true,
    refs: true
  };

  style = 'realistic';

  styles = [
  { label: 'Realistico', value: 'photorealistic, ultra detailed, 8k' },
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
    ) {}

    ngOnInit() {
    // Controllo login all'inizio
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Lista T2I con provider + sotto-modelli (tipo PollO.ai)
    this.availableModelGroups = [
    {
      provider: 'Flux AI',
      icon: 'assets/flux.png',
      expanded: false,
      models: [
        { id: 'flux-pro', name: 'Flux Pro', icon: 'assets/flux.png' },
        { id: 'flux-dev', name: 'Flux Dev', icon: 'assets/flux.png' },
        { id: 'flux-schnell', name: 'Flux Schnell', icon: 'assets/flux.png' }
      ]
    },
    {
      provider: 'Google',
      icon: 'assets/google.png',
      expanded: false,
      models: [
        // 🔵 IMAGEN (qualità alta)
        { id: 'imagen-4', name: 'Imagen 4 (HQ)', icon: 'assets/google.png' },
        { id: 'imagen-4-fast', name: 'Imagen Fast', icon: 'assets/google.png' },

        // 🟣 GEMINI IMAGE (multimodale)
        // { id: 'gemini-image-pro', name: 'Gemini Image Pro', icon: 'assets/google.png' },

        // 🍌 MARKETING (stile Pollo AI)
        { id: 'nano-banana', name: 'Nano Banana', icon: 'assets/google.png' },
        { id: 'nano-banana-pro', name: 'Nano Banana Pro 🔥', icon: 'assets/google.png' }

      ]
    },
    // {
    //   provider: 'Kling AI',
    //   icon: 'assets/kling.jpg',
    //   expanded: false,
    //   models: [
    //     { id: 'kling-alpha', name: 'Kling Alpha', icon: 'assets/kling.jpg' }
    //   ]
    // },
    {
      provider: 'Midjourney',
      icon: 'assets/midjourney.png',
      expanded: false,
      models: [
        { id: 'midjourney-v5', name: 'Midjourney v5', icon: 'assets/midjourney.png' },
        { id: 'midjourney-v6', name: 'Midjourney v6', icon: 'assets/midjourney.png' }
      ]
    },
    {
      provider: 'OpenAI',
      icon: 'assets/openai.svg',
      expanded: false,
      models: [
        { id: 'gpt-image-1.5', name: 'Gpt-image-1.5', icon: 'assets/openai.svg' }
      ]
    },
    {
      provider: 'Qwen',
      icon: 'assets/qwen.jpg',
      expanded: false,
      models: [
        { id: 'qwen-image', name: 'qwen-image', icon: 'assets/qwen.jpg' }
      ]
    },
    {
      provider: 'Seedream',
      icon: 'assets/seedream.png',
      expanded: false,
      models: [
        { id: 'seedream-5-lite', name: 'Seedream 5.0 Lite', icon: 'assets/seedream.png' },
        // { id: 'seedream-4-5', name: 'Seedream 4.5', icon: 'assets/seedream.png' },
        // { id: 'seedream-4-0', name: 'Seedream 4.0', icon: 'assets/seedream.png' }
      ]
    },
    {
      provider: 'Stability AI',
      icon: 'assets/stability.svg',
      expanded: false,
      models: [
        { id: 'sdxl', name: 'SDXL 1.0', icon: 'assets/stability.svg' },
        { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', icon: 'assets/stability.svg' }
      ]
    },

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
          { id: 'flux-pro', name: 'FLUX.1 Pro', description: 'Modello ad alta qualità' },
          { id: 'flux-dev', name: 'FLUX.1 Dev', description: 'Modello veloce e versatile' },
          { id: 'sdxl', name: 'SDXL', description: 'Modello stabile e affidabile' }
        ];
      }
    );
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

    const styleMap: any = {
      "flux-pro": "ultra realistic",
      "flux-dev": "realistic",
      "sdxl": "digital art",
      "flux-schnell": "clean, modern, slightly stylized",
      "stable-diffusion-3": "photorealistic",
      "dalle-3": "creative illustration",
      "midjourney": "epic cinematic"
    };

    const style = styleMap[this.model] || "moderno";
    const finalPrompt = this.buildPrompt();
    console.log("FINALPROMPT",finalPrompt)

    // this.authService.generateImage2(finalPrompt, style, this.model).subscribe(  // <-- qui passiamo model
    this.authService.generateImage(finalPrompt, style, this.model, this.ratio).subscribe(  // <-- passiamo model + ratio

      (res: any) => {
        this.loading = false;

        console.log('RISPOSTA BACKEND:', res);            // 👈 TUTTO
        console.log('IMAGE URL:', res?.image_url);
        console.log('MODEL:', this.model);          

        if (res.error) {
          this.error = res.error;  
        } else if (res.image_url) {
          this.image = environment.apiBaseUrl + res.image_url;;
        } else {
          this.error = "Errore sconosciuto dal server.";
        }
      },
      (err: any) => {
        console.error('Errore generazione immagine', err);
        this.loading = false;
        this.error = "Errore di rete o server non raggiungibile.";
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