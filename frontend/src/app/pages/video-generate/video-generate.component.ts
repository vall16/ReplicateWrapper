import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-video-generate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="video-generate-shell">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <!-- Saldo Token -->
        <div class="section">
          <div class="section-header">
            <span>Saldo Token</span>
          </div>
          <div class="section-body">
            <div class="token-display">
              <div class="token-current">{{ currentTokens | number:'1.0-0' }}</div>
              <div class="token-label">Token disponibili</div>
              <div *ngIf="selectedModel" class="token-info">
                Questo modello costerà <span class="cost-highlight">{{ selectedModel.cost }} token</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mostra transazione se c'è stata -->
        <div class="section" *ngIf="tokensUsed > 0">
          <div class="section-header" style="color: #059669;">
            <span>✅ Ultima generazione</span>
          </div>
          <div class="section-body">
            <div class="token-transaction">
              <div>Token usati: <span class="token-minus">-{{ tokensUsed }}</span></div>
              <div>Rimasti: <span class="token-remaining">{{ tokensRemaining }}</span></div>
            </div>
          </div>
        </div>

        <!-- Impostazioni video -->
        <div class="section">
          <div class="section-header">
            <!-- <span>Impostazioni Video</span> -->
          </div>
          <div class="section-body">
            <!-- MODELLO VIDEO -->
            <label>Modello Video</label>
            <!-- <small class="field-caption">Seleziona il modello che vuoi usare per la generazione.</small> -->
            <div class="custom-select" (click)="toggleDropdown()" [class.disabled]="loadingModels">
              <div class="selected">
                <span>{{ selectedModel?.name || 'Seleziona modello' }}</span>
                <span class="arrow">▼</span>
              </div>
              <div class="dropdown" *ngIf="openDropdown">
                <div
                  class="option"
                  *ngFor="let item of availableVideoModels"
                  (click)="selectModel(item, $event)"
                >
                  <span>{{ item.name }}</span>
                  <!-- 👇 AGGIUNTA COSTO -->
                  <span class="model-cost">
                    {{ item.cost }} tokens
                  </span>
                </div>
              </div>
            </div>

            <!-- RISOLUZIONE -->
            <label>Risoluzione</label>
            <!-- <small class="field-caption">Imposta la qualità del video in uscita.</small> -->
            <div class="resolution-options">
              <button 
                type="button" 
                class="resolution-button" 
                [class.active]="resolution === '480p'" 
                (click)="resolution='480p'">
                480p
              </button>
              <button 
                type="button" 
                class="resolution-button" 
                [class.active]="resolution === '720p'" 
                (click)="resolution='720p'">
                720p
              </button>
              <!-- <button 
                type="button" 
                class="resolution-button" 
                [class.active]="resolution === '1080p'" 
                (click)="resolution='1080p'">
                1080p
              </button> -->
              <!-- <button 
                type="button" 
                class="resolution-button" 
                [class.active]="resolution === '4k'" 
                (click)="resolution='4k'">
                🔴 4K
              </button> -->
            </div>

            <!-- DURATA VIDEO -->
            <label>Durata Video (secondi)</label>
            <!-- <small class="field-caption">Scegli quanto deve durare il filmato generato.</small> -->
            <div class="duration-options">
              <button 
                type="button" 
                class="duration-button" 
                [class.active]="duration === 5" 
                (click)="duration=5">
                5s
              </button>
              <button 
                type="button" 
                class="duration-button" 
                [class.active]="duration === 10" 
                (click)="duration=10">
                10s
              </button>
              <button 
                type="button" 
                class="duration-button" 
                [class.active]="duration === 30" 
                (click)="duration=30">
                30s
              </button>
              <button 
                type="button" 
                class="duration-button" 
                [class.active]="duration === 60" 
                (click)="duration=60">
                60s
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main-area">
        <!-- VIDEO PREVIEW -->
        <div class="preview-box">
          <video 
            *ngIf="videoUrl" 
            [src]="videoUrl" 
            controls
            class="video-player">
          </video>
          <div *ngIf="!videoUrl" class="placeholder">
            Nessun video generato
          </div>
        </div>

        <!-- PROMPT -->
        <div class="prompt-box">
          <textarea
            [(ngModel)]="prompt"
            placeholder="Descrivi il video che vuoi generare..."
          ></textarea>

          <div class="prompt-actions">
            <button (click)="generate()" [disabled]="loading" class="generate-btn">
              <span *ngIf="!loading">Genera Video</span>
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

    .video-generate-shell {
      display: grid;
      grid-template-columns: 280px 1fr;
      height: 100%;
      width: 100%;
      gap: 1rem;
      padding: 0.5rem;
      max-width: 100vw;
    }

    /* SIDEBAR */
    .sidebar {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
    }

    .section {
      display: flex;
      flex-direction: column;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .section-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .section-body label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 600;
    }

    .token-display {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      border: 1px solid #93c5fd;
    }

    .token-current {
      font-size: 2rem;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 0.25rem;
    }

    .token-label {
      font-size: 0.75rem;
      color: #1e40af;
      font-weight: 600;
    }

    .token-info {
      font-size: 0.8rem;
      color: #1e40af;
      margin-top: 0.5rem;
    }

    .cost-highlight {
      font-weight: 700;
      color: #dc2626;
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
      margin-bottom: 0.65rem;
    }

    /* DURATION & RESOLUTION BUTTONS */
    .duration-options, .resolution-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .duration-button, .resolution-button {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: center;
    }

    .duration-button:hover, .resolution-button:hover {
      border-color: #94a3b8;
      background: #e2e8f0;
    }

    .duration-button.active, .resolution-button.active {
      border-color: #3b82f6;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 600;
    }

    /* CUSTOM SELECT & DROPDOWN */
    .custom-select {
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
    }

    .custom-select.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .selected {
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
    }

    .selected .arrow {
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
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .option {
      padding: 0.6rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #374151;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #f3f4f6;
    }

    .option:hover {
      background: #f3f4f6;
    }

    .model-cost {
      margin-left: auto;
      font-size: 0.75rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.15rem 0.4rem;
      border-radius: 0.4rem;
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
      border: 1px solid #cbd5e1;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 80%;
      margin-right: auto;
      height: 100%;
      max-height: 70vh;
    }

    .video-player {
      width: 100%;
      height: 100%;
      object-fit: contain;
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
      width: 80%;
      margin-right: auto;
    }

    textarea {
      width: 100%;
      border: none;
      resize: none;
      outline: none;
      font-size: 0.9rem;
      padding: 0.5rem;
      font-family: 'Inter', sans-serif;
      min-height: 80px;
    }

    .prompt-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.4rem;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 1rem;
      cursor: pointer;
      font-weight: 500;
    }

    button:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .btn-link {
      background: transparent;
      border: 1px solid #2563eb;
      color: #2563eb;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .generate-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .generate-btn:disabled {
      animation: pulse 1.2s infinite;
    }

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

    @keyframes pulse {
      0% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.7); }
      100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
    }

    @media (max-width: 900px) {
      .video-generate-shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: 2;
      }

      .preview-box {
        width: 100%;
      }

      .prompt-box {
        width: 100%;
      }
    }
  `]
})
export class VideoGenerateComponent {
  prompt = '';
  duration: 5 | 10 | 30 | 60 = 5;
  resolution: '480p'| '720p' | '1080p'  = '480p';
  videoUrl: string | null = null;
  error: string | null = null;
  loading = false;
  loadingModels = false;

  openDropdown = false;
  selectedModel: any = null;

  // Token
  currentTokens: number = 0;
  tokensUsed: number = 0;
  tokensRemaining: number = 0;

  availableVideoModels = [
    { id: 'kling-video', name: 'Kwaivgi', cost: 20 },
    { id: 'seedance-2', name: 'Bytedance', cost: 25 },
    { id: 'pika-1', name: 'Pika 1.0', cost: 30 }
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

    // Carica il saldo token corrente
    this.authService.getBalance().subscribe(
      (res: any) => {
        this.currentTokens = res.tokens || 0;
      },
      (err) => {
        console.error('Errore caricamento saldo token', err);
        this.currentTokens = 0;
      }
    );

    // Seleziona il primo modello come default
    this.selectedModel = this.availableVideoModels[0];
  }

  toggleDropdown() {
    if (this.loadingModels) return;
    this.openDropdown = !this.openDropdown;
  }

  selectModel(item: any, event: Event) {
    event.stopPropagation();
    this.selectedModel = item;
    this.openDropdown = false;
  }

  generate() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.videoUrl = null;
    this.error = null;
    this.tokensUsed = 0;
    this.tokensRemaining = 0;

    const payload = {
      prompt: this.prompt,
      duration: this.duration,
      resolution: this.resolution,
      model: this.selectedModel.id
    };

    console.log('Generando video con:', payload);

    this.authService.generateVideo(
      this.prompt,
      this.duration,
      this.resolution,
      this.selectedModel.id
    ).subscribe(
      (res: any) => {
        this.loading = false;

        console.log('RISPOSTA BACKEND:', res);
        console.log('VIDEO URL:', res?.video_url);
        console.log('MODEL:', this.selectedModel.id);
        console.log('TOKENS USED:', res?.tokens_used);
        console.log('TOKENS REMAINING:', res?.tokens_remaining);

        if (res.error) {
          this.error = res.error;
        } else if (res.video_url) {
          // Concatena base URL con percorso video
          this.videoUrl = environment.apiBaseUrl + res.video_url;
          
          // Mostra i token scalati
          this.tokensUsed = res.tokens_used || 0;
          this.tokensRemaining = res.tokens_remaining || this.currentTokens - this.tokensUsed;
          this.currentTokens = this.tokensRemaining;
        } else {
          this.error = "Errore sconosciuto dal server.";
        }
      },
      (err: any) => {
        this.loading = false;
        this.error = "Errore di rete o server non raggiungibile.";
        console.error('Errore generazione video:', err);
      }
    );
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }
}
