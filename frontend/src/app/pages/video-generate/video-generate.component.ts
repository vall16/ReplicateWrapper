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
        <div class="section">
          <div class="section-header">
            <span>Token Balance</span>
          </div>
          <div class="section-body">
            <div class="token-display">
              <div class="token-current">{{ displayTokens | number:'1.0-0' }}</div>
              <div class="token-label">Available Tokens</div>
              <div *ngIf="selectedModel" class="token-info">
                This model will cost <span class="cost-highlight">{{ selectedModel.cost }} tokens</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section" *ngIf="tokensUsed > 0">
          <div class="section-header success-header">
            <span>Last Generation</span>
          </div>
          <div class="section-body">
            <div class="token-transaction">
              <div>Tokens used: <span class="token-minus">-{{ tokensUsed }}</span></div>
              <div>Remaining: <span class="token-remaining">{{ tokensRemaining }}</span></div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span>Video Settings</span>
          </div>
          <div class="section-body">
            <label>Text-to-Video Model</label>
            <div class="custom-select" (click)="toggleDropdown()" [class.disabled]="loadingModels">
              <div class="selected">
                <span>{{ selectedModel?.name || 'Select model' }}</span>
                <span class="arrow">▼</span>
              </div>
              <div class="dropdown" *ngIf="openDropdown">
                <div
                  class="option"
                  *ngFor="let item of availableVideoModels"
                  (click)="selectModel(item, $event)"
                >
                  <span>{{ item.name }}</span>
                  <span class="model-cost">{{ item.cost }} tokens</span>
                </div>
              </div>
            </div>

            <label>Resolution</label>
            <div class="option-grid">
              <button 
                *ngFor="let res of resolutionOptions"
                type="button" 
                class="choice-button" 
                [class.active]="resolution === res" 
                (click)="resolution = res">
                {{ res }}
              </button>
            </div>

            <label>Video Duration (seconds)</label>
            <div class="option-grid">
              <button 
                *ngFor="let d of availableDurations"
                type="button" 
                class="choice-button" 
                [class.active]="duration === d" 
                (click)="duration = d">
                {{ d }}s
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
            No video generated
          </div>
        </div>

        <!-- PROMPT -->
        <div class="prompt-box">
          <textarea
            [(ngModel)]="prompt"
            placeholder="Describe the video you want to generate..."
          ></textarea>

          <div class="prompt-actions">
            <button (click)="generate()" [disabled]="loading" class="generate-btn">
              <span *ngIf="!loading">Generate Video</span>
              <span *ngIf="loading" class="loading-indicator">
                Generating
                <span class="dots">
                  <span></span><span></span><span></span>
                </span>
              </span>
            </button>
            <button class="btn-link" (click)="goToGallery()" [disabled]="loading" style="margin-left:0.7rem;">
              Go to Gallery
            </button>
            <div *ngIf="error" class="error-message">
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
      background: var(--color-bg-secondary);
      border-radius: 12px;
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
      color: var(--color-text-primary);
    }

    .success-header {
      color: #059669;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 6px;
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

    /* TOKEN DISPLAY */
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
      color: #38bdf8;
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
      color: #f87171;
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

    /* OPTION GRID (Resolution/Duration) */
    .option-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.4rem;
    }

    .choice-button {
      border: 1px solid #334155;
      background: #020617;
      color: #cbd5e1;
      padding: 0.35rem 0.55rem;
      border-radius: 0.45rem;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.18s ease;
      flex: 1;
      min-width: 60px;
    }

    .choice-button:hover {
      border-color: #475569;
      background: #0f172a;
    }

    .choice-button.active {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      font-weight: 600;
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
    }

    /* CUSTOM SELECT */
    .custom-select {
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: var(--color-bg-primary);
      cursor: pointer;
      min-width: 200px;
    }

    .selected {
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--color-text-primary);
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
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      max-height: 250px;
      overflow-y: auto;
      z-index: 50;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }

    .option {
      padding: 0.7rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #e5e7eb;
      border-bottom: 1px solid #1e293b;
    }

    .option:hover {
      background: #1e293b;
    }

    .model-cost {
      margin-left: auto;
      font-size: 0.75rem;
      color: #0d54e4;
      background: #0c0c0c;
      padding: 0.15rem 0.4rem;
      border-radius: 0.4rem;
    }

    /* MAIN AREA */
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
      background: var(--color-bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 85%;
      max-height: 70vh;
    }

    .video-player {
      max-width: 100%;
      max-height: 100%;
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
      width: 85%;
    }

    textarea {
      width: 100%;
      border: none;
      resize: none;
      outline: none;
      font-size: 0.9rem;
      padding: 0.5rem;
      background: transparent;
      color: var(--color-text-primary);
    }

    .prompt-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.4rem;
    }

    /* BUTTONS */
    .generate-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 1rem;
      cursor: pointer;
      font-weight: 500;
    }

    .generate-btn:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-link {
      background: transparent;
      border: 1px solid #2563eb;
      color: #2563eb;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
    }

    /* ANIMATIONS */
    .generate-btn:disabled {
      animation: video-pulse 1.2s infinite;
    }

    @keyframes video-pulse {
      0% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.7); }
      100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0.5); }
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
      animation: video-blink 1s infinite;
    }

    .dots span:nth-child(2) { animation-delay: 0.2s; }
    .dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes video-blink {
      0%, 80%, 100% { opacity: 0; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-2px); }
    }

    @media (max-width: 900px) {
      .video-generate-shell {
        grid-template-columns: 1fr;
      }
      .sidebar {
        order: 2;
      }
      .preview-box, .prompt-box {
        width: 100%;
      }
    }
  `]
})
export class VideoGenerateComponent {
  prompt = '';
  duration: 5 | 10 | 30 | 60 = 5;
  resolution: '480p' | '720p' | '1080p' = '480p';

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

  displayTokens: number = 0;

  readonly availableDurations: (5 | 10 | 30 | 60)[] = [5, 10, 30, 60];
  readonly resolutionOptions: ('480p' | '720p' | '1080p')[] = ['480p', '720p', '1080p'];


  availableVideoModels = [
    { id: 'kling-video', name: 'Kwaivgi', cost: 20 },
    { id: 'seedance-2', name: 'Bytedance', cost: 25 },
    { id: 'pika-1', name: 'Pika 1.0', cost: 30 }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Carica il saldo token corrente
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

    // Select the first model as default
    this.selectedModel = this.availableVideoModels[0];
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

          // Show scaled tokens
          this.tokensUsed = res.tokens_used || 0;
          this.tokensRemaining = res.tokens_remaining || this.currentTokens - this.tokensUsed;
          this.currentTokens = this.tokensRemaining;
        } else {
          this.error = "Unknown error from server.";
        }
      },
      (err: any) => {
        this.loading = false;
        this.error = err.error?.error || "Network error or server unreachable.";
        console.error('Error generating video:', err);
      }
    );
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }
}
