import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gallery-shell">
      <header class="gallery-header">
        <div>
          <h1>My Generated Content</h1>
          <p>View all your generated images and videos. Filter by style, model, or prompt text.</p>
        </div>
        <div class="header-actions">
          <button class="btn" (click)="goToGenerate()">Generate Image</button>
          <button class="btn" (click)="goToVideoGenerate()">Generate Video</button>
          <button class="btn btn-primary" (click)="loadImages()">Refresh</button>
        </div>
      </header>

      <section class="filter-row">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search in prompt..."
            [(ngModel)]="promptFilter"
            (keyup.enter)="loadImages()"
          />
        </div>

        <div class="custom-select" (click)="toggleDropdown('style')">
          <div class="selected">
            <span>{{ getStyleLabel(styleFilter) }}</span>
            <span class="arrow" [class.expanded]="openDropdown === 'style'">▼</span>
          </div>
          <div class="dropdown" *ngIf="openDropdown === 'style'">
            <div class="option" (click)="selectStyle('', $event)">All Styles</div>
            <div class="option" *ngFor="let s of stylesList" (click)="selectStyle(s.value, $event)">
              {{ s.label }}
            </div>
          </div>
        </div>

        <div class="custom-select" (click)="toggleDropdown('model')">
          <div class="selected">
            <span>{{ getModelLabel(modelFilter) }}</span>
            <span class="arrow" [class.expanded]="openDropdown === 'model'">▼</span>
          </div>
          <div class="dropdown" *ngIf="openDropdown === 'model'">
            <div class="option" (click)="selectModel('', $event)">All Models</div>
            <div class="option" *ngFor="let m of availableModels" (click)="selectModel(m.id, $event)">
              {{ m.name }}
            </div>
          </div>
        </div>

        <button class="btn btn-primary" (click)="loadImages()">Apply</button>
        <button class="btn btn-secondary" (click)="resetFilters()">Reset</button>
      </section>

      <section class="gallery-content">
        <div class="empty-state" *ngIf="!media.length && !loading">No content found.</div>
        <div class="grid" *ngIf="media.length">
          <div class="card" *ngFor="let item of media">
            <!-- IMMAGINE -->
            <img *ngIf="item.type === 'image'" [src]="baseImageUrl + item.media_url" [alt]="item.prompt" />
            
            <!-- VIDEO -->
            <video *ngIf="item.type === 'video'" [src]="baseImageUrl + item.media_url" controls preload="metadata" class="video-preview"></video>
            
            <div class="card-meta">
              <div><strong>Prompt:</strong> {{ item.prompt }}</div>
              <div *ngIf="item.type === 'image'"><strong>Style:</strong> {{ item.style || '-' }}</div>
              <div *ngIf="item.type === 'video'"><strong>Resolution:</strong> {{ item.resolution || '-' }}</div>
              <div *ngIf="item.type === 'video'"><strong>Duration:</strong> {{ item.duration }}s</div>
              <div><strong>Model:</strong> {{ item.model || '-' }}</div>
              <div><strong>Tokens:</strong> {{ item.tokens_used }}</div>
              <div><small>{{ item.created_at | date:'short' }}</small></div>
              <div class="media-type">{{ item.type === 'image' ? '🖼️ Image' : '🎬 Video' }}</div>
            </div>
          </div>
        </div>
      </section>

      <div class="loading-overlay" *ngIf="loading">Loading...</div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .gallery-shell {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--color-bg-primary);
      transition: background-color 0.3s ease;
    }

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .gallery-header h1 {
      margin: 0;
      font-size: 1.55rem;
      color: var(--color-text-primary);
    }

    .gallery-header p {
      margin: 0;
      color: var(--color-text-secondary);
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      border: 1px solid var(--color-border-light);
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      padding: 0.45rem 0.8rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background: var(--color-bg-tertiary);
      transform: translateY(-1px);
    }
    

    .btn-primary {
      background: linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end));
      color: #fff;
      border: none !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border-light) !important;
    }

    .btn-secondary:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .search-box input {
      padding: 0.6rem 1rem;
      border: 1px solid #334155;
      border-radius: 8px;
      min-width: 200px;
      background: #0f172a;
      color: #e2e8f0;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    }
    .search-box input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.3), inset 0 2px 4px rgba(0,0,0,0.3);
    }

    .custom-select {
      position: relative;
      border: 1px solid #334155;
      border-radius: 8px;
      background: #0f172a;
      cursor: pointer;
      min-width: 200px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    .custom-select:hover {
      border-color: #475569;
      background: #1e293b;
    }
    .selected {
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #e2e8f0;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .selected .arrow {
      font-size: 0.7rem;
      transition: transform 0.2s ease;
      color: #94a3b8;
    }
    .selected .arrow.expanded {
      transform: rotate(180deg);
      color: #38bdf8;
    }
    .dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 50;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      animation: dropdownSlide 0.2s ease-out;
    }
    @keyframes dropdownSlide {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .option {
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #cbd5e1;
      transition: all 0.15s ease;
      border-bottom: 1px solid #1e293b;
    }
    .option:last-child {
      border-bottom: none;
    }
    .option:hover {
      background: #1e293b;
      color: #38bdf8;
      padding-left: 1.2rem;
    }

    .filter-row .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .filter-row .btn-primary {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      border: 1px solid #6366f1 !important;
      box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
    }
    .filter-row .btn-primary:hover {
      box-shadow: 0 0 15px rgba(79, 70, 229, 0.7);
      background: linear-gradient(135deg, #3b82f6, #6366f1);
    }
    .filter-row .btn-secondary {
      background: #1e293b;
      border: 1px solid #475569 !important;
      color: #94a3b8;
    }
    .filter-row .btn-secondary:hover {
      background: #334155;
      color: #f1f5f9;
      border-color: #64748b !important;
    }

    .gallery-content .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.9rem;
    }

    .card {
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border-light);
      border-radius: 0.8rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-gradient-start);
    }

    .card img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      background: var(--color-bg-tertiary);
    }

    .card video.video-preview {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      background: var(--color-bg-tertiary);
    }

    .card-meta {
      padding: 0.55rem;
      font-size: 0.82rem;
      line-height: 1.25;
      color: var(--color-text-secondary);
    }

    .card-meta strong {
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .media-type {
      font-size: 0.75rem;
      color: var(--color-text-tertiary);
      margin-top: 0.25rem;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 1rem;
    }

    .loading-overlay {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: var(--color-gradient-start);
      backdrop-filter: blur(4px);
      z-index: 100;
    }

    .error-message {
      margin-top: 0.8rem;
      color: #ef4444;
      font-weight: 600;
      background: rgba(239, 68, 68, 0.1);
      padding: 0.6rem 0.8rem;
      border-radius: 0.5rem;
      border-left: 3px solid #ef4444;
    }

    @media (max-width: 640px) {
      .gallery-header {
        flex-direction: column;
      }

      .header-actions {
        width: 100%;
      }

      .header-actions .btn {
        flex: 1;
      }

      .filter-row {
        flex-direction: column;
      }

      .filter-row input,
      .filter-row select {
        width: 100%;
        min-width: unset;
      }

      .gallery-content .grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
  
})
export class GalleryComponent {
  media: any[] = []; // Cambiato da images a media
  loading = false;
  error = '';

  promptFilter = '';
  styleFilter = '';
  modelFilter = '';

  availableModels: any[] = [];
  baseImageUrl = '';

  openDropdown: string | null = null;
  stylesList = [
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

  constructor(private authService: AuthService, private router: Router) {
    this.baseImageUrl = environment.apiBaseUrl;
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getAvailableModels().subscribe(
      (res: any) => {
        this.availableModels = res.models || [];
      },
      () => {
        this.availableModels = [
          { id: 'flux-pro', name: 'FLUX.1 Pro' },
          { id: 'flux-dev', name: 'FLUX.1 Dev' },
          { id: 'sdxl', name: 'SDXL' },
          { id: 'flux-schnell', name: 'FLUX Schnell' },
          { id: 'kling-video', name: 'Kling AI Video' },
          { id: 'runway-ml', name: 'Runway ML' },
          { id: 'pika-1', name: 'Pika 1.0' }
        ];
      }
    );

    this.loadImages();
  }

  goToGenerate() {
    this.router.navigate(['/generate']);
  }

  goToVideoGenerate() {
    this.router.navigate(['/video-generate']);
  }

  loadImages() {
    this.error = '';
    this.loading = true;

    this.authService.getGeneratedMedia({
      style: this.styleFilter,
      model: this.modelFilter,
      prompt: this.promptFilter,
      limit: 100
    }).subscribe(
      (res: any) => {
        this.media = res.items || [];
        this.loading = false;
      },
      (err: any) => {
        console.error('Errore caricamento media generati', err);
        this.error = 'Unable to load content. Please try again later.';
        this.loading = false;
      }
    );
  }

  selectStyle(value: string, event: Event) {
    event.stopPropagation();
    this.styleFilter = value;
    this.openDropdown = null;
    this.loadImages();
  }

  selectModel(value: string, event: Event) {
    event.stopPropagation();
    this.modelFilter = value;
    this.openDropdown = null;
    this.loadImages();
  }

  toggleDropdown(type: string) {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  getStyleLabel(val: string): string {
    const s = this.stylesList.find(x => x.value === val);
    return s ? s.label : 'All Styles';
  }

  getModelLabel(val: string): string {
    const m = this.availableModels.find(x => x.id === val);
    return m ? m.name : 'All Models';
  }

  resetFilters() {
    this.promptFilter = '';
    this.styleFilter = '';
    this.modelFilter = '';
    this.loadImages();
  }
}
