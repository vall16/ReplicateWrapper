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
        <input
          type="text"
          placeholder="Cerca nel prompt..."
          [(ngModel)]="promptFilter"
          (keyup.enter)="loadImages()"
        />
        <select [(ngModel)]="styleFilter">
          <option value="">All Styles</option>
          <option value="moderno">modern</option>
          <option value="lusso">luxury</option>
          <option value="scandinavo">scandinavian</option>
        </select>
        <select [(ngModel)]="modelFilter">
          <option value="">All Models</option>
          <option *ngFor="let m of availableModels" [value]="m.id">{{ m.name }}</option>
        </select>
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

    .filter-row input,
    .filter-row select {
      padding: 0.5rem 0.6rem;
      border: 1px solid var(--color-border-light);
      border-radius: 0.5rem;
      min-width: 180px;
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .filter-row input:focus,
    .filter-row select:focus {
      outline: none;
      border-color: var(--color-gradient-start);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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

  resetFilters() {
    this.promptFilter = '';
    this.styleFilter = '';
    this.modelFilter = '';
    this.loadImages();
  }
}
