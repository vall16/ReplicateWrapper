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
      min-height: 100vh;
      font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      background:
        radial-gradient(ellipse at 10% 0%, rgba(124, 58, 237, 0.25), transparent 40%),
        radial-gradient(ellipse at 90% 100%, rgba(6, 182, 212, 0.2), transparent 40%),
        radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.08), transparent 50%),
        linear-gradient(180deg, #080c1a 0%, #03050c 100%);
      transition: background 0.4s ease;
    }

    .gallery-shell {
      padding: 1.5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .gallery-header h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      background: linear-gradient(120deg, #f8fafc, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .gallery-header p {
      margin: 0.35rem 0 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.85rem;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      border: 1px solid rgba(148, 163, 184, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.55rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.82rem;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: #c084fc;
      transform: translateY(-2px);
    }

    .btn-primary {
      background: linear-gradient(45deg, #7c3aed, #06b6d4);
      background-size: 200% 200%;
      animation: galleryGradient 4s ease infinite;
      color: #fff;
      border: none !important;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
      position: relative;
      overflow: hidden;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 40%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: rotate(20deg);
      transition: left 0.5s ease;
    }

    .btn-primary:hover::before {
      left: 120%;
    }

    .btn-primary:hover {
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
      transform: translateY(-3px);
      color: #fff;
    }

    @keyframes galleryGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.12) !important;
      color: rgba(255, 255, 255, 0.5);
    }

    .btn-secondary:hover {
      background: rgba(124, 58, 237, 0.08);
      border-color: rgba(124, 58, 237, 0.2) !important;
      color: #c084fc;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .search-box input {
      padding: 0.6rem 1rem;
      border: 1px solid rgba(148, 163, 184, 0.12);
      border-radius: 10px;
      min-width: 200px;
      background: rgba(12, 16, 32, 0.7);
      color: #f8fafc;
      font-size: 0.85rem;
      transition: all 0.2s ease;
      backdrop-filter: blur(12px);
      font-family: 'Inter', sans-serif;
    }
    .search-box input:focus {
      outline: none;
      border-color: rgba(124, 58, 237, 0.4);
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.15);
    }
    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }

    .custom-select {
      position: relative;
      border: 1px solid rgba(148, 163, 184, 0.12);
      border-radius: 10px;
      background: rgba(12, 16, 32, 0.7);
      cursor: pointer;
      min-width: 200px;
      transition: all 0.2s ease;
      backdrop-filter: blur(12px);
    }
    .custom-select:hover {
      border-color: rgba(124, 58, 237, 0.3);
      background: rgba(12, 16, 32, 0.85);
    }
    .selected {
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #f8fafc;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .selected .arrow {
      font-size: 0.7rem;
      transition: transform 0.2s ease;
      color: rgba(255, 255, 255, 0.3);
    }
    .selected .arrow.expanded {
      transform: rotate(180deg);
      color: #c084fc;
    }
    .dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: rgba(8, 12, 26, 0.98);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 10px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 50;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      animation: dropdownSlide 0.2s ease-out;
      backdrop-filter: blur(20px);
    }
    @keyframes dropdownSlide {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .option {
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.15s ease;
      border-bottom: 1px solid rgba(148, 163, 184, 0.06);
    }
    .option:last-child {
      border-bottom: none;
    }
    .option:hover {
      background: rgba(124, 58, 237, 0.1);
      color: #c084fc;
      padding-left: 1.3rem;
    }

    .filter-row .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .filter-row .btn-primary {
      background: linear-gradient(45deg, #7c3aed, #06b6d4);
      border: none !important;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
    }
    .filter-row .btn-primary:hover {
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
    }
    .filter-row .btn-secondary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.12) !important;
      color: rgba(255, 255, 255, 0.5);
    }
    .filter-row .btn-secondary:hover {
      background: rgba(124, 58, 237, 0.08);
      border-color: rgba(124, 58, 237, 0.2) !important;
      color: #c084fc;
    }

    .gallery-content .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }

    .card {
      background: rgba(12, 16, 32, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.08);
      border-radius: 1rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      backdrop-filter: blur(16px);
      position: relative;
    }

    .card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.3), transparent);
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 30px rgba(124, 58, 237, 0.08);
      border-color: rgba(124, 58, 237, 0.25);
    }

    .card:hover::after {
      opacity: 0.8;
    }

    .card img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      background: rgba(8, 12, 26, 0.8);
    }

    .card video.video-preview {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      background: rgba(8, 12, 26, 0.8);
    }

    .card-meta {
      padding: 0.65rem 0.75rem;
      font-size: 0.8rem;
      line-height: 1.3;
      color: rgba(255, 255, 255, 0.5);
    }

    .card-meta strong {
      color: #f8fafc;
      font-weight: 600;
    }

    .media-type {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.3);
      margin-top: 0.3rem;
    }

    .empty-state {
      padding: 3rem 2rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.3);
      font-size: 1rem;
      background: rgba(12, 16, 32, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.08);
      border-radius: 1.25rem;
      backdrop-filter: blur(16px);
    }

    .loading-overlay {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(8, 12, 26, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #c084fc;
      backdrop-filter: blur(8px);
      z-index: 100;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .error-message {
      margin-top: 0.8rem;
      color: #fca5a5;
      font-weight: 600;
      background: rgba(239, 68, 68, 0.08);
      padding: 0.6rem 0.8rem;
      border-radius: 10px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    @media (max-width: 768px) {
      .gallery-shell {
        padding: 1rem 16px 1.5rem;
      }

      .gallery-header {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }

      .gallery-header h1 {
        font-size: 1.4rem;
      }

      .header-actions {
        width: 100%;
        flex-wrap: wrap;
        gap: 8px;
      }

      .header-actions .btn {
        flex: 1;
        min-width: 80px;
        padding: 10px 12px;
        font-size: 0.78rem;
      }

      .filter-row {
        flex-direction: column;
        gap: 10px;
      }

      .filter-row .search-box input,
      .filter-row .custom-select {
        width: 100%;
        min-width: unset;
        font-size: 14px;
      }

      .gallery-content .grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
      }

      .card {
        border-radius: 0.8rem;
      }

      .card img {
        height: 180px;
      }
    }

    @media (max-width: 480px) {
      .gallery-shell {
        padding: 10px;
      }

      .gallery-header {
        gap: 10px;
      }

      .gallery-header h1 {
        font-size: 1.2rem;
      }

      .header-actions {
        gap: 6px;
      }

      .header-actions .btn {
        min-width: 70px;
        padding: 8px 10px;
        font-size: 0.75rem;
      }

      .filter-row {
        gap: 8px;
      }

      .filter-row .search-box input,
      .filter-row .custom-select {
        font-size: 14px;
      }

      .gallery-content .grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
      }

      .card img {
        height: 140px;
      }

      .card-meta {
        padding: 8px;
        font-size: 0.75rem;
      }
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
          { id: 'pika-1', name: 'Pika 1.0' },
          { id: 'minimax-video', name: 'Minimax Video' }
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
