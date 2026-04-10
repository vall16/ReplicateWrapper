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
          <h1>I miei contenuti generati</h1>
          <p>Visualizza tutte le tue immagini e video generati. Filtra per stile, modello o testo del prompt.</p>
        </div>
        <div class="header-actions">
          <button class="btn" (click)="goToGenerate()">Genera Immagine</button>
          <button class="btn" (click)="goToVideoGenerate()">Genera Video</button>
          <button class="btn btn-primary" (click)="loadImages()">Aggiorna</button>
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
          <option value="">Tutti gli stili</option>
          <option value="moderno">moderno</option>
          <option value="lusso">lusso</option>
          <option value="scandinavo">scandinavo</option>
        </select>
        <select [(ngModel)]="modelFilter">
          <option value="">Tutti i modelli</option>
          <option *ngFor="let m of availableModels" [value]="m.id">{{ m.name }}</option>
        </select>
        <button class="btn btn-primary" (click)="loadImages()">Applica</button>
        <button class="btn btn-secondary" (click)="resetFilters()">Azzera</button>
      </section>

      <section class="gallery-content">
        <div class="empty-state" *ngIf="!media.length && !loading">Nessun contenuto trovato.</div>
        <div class="grid" *ngIf="media.length">
          <div class="card" *ngFor="let item of media">
            <!-- IMMAGINE -->
            <img *ngIf="item.type === 'image'" [src]="baseImageUrl + item.media_url" [alt]="item.prompt" />
            
            <!-- VIDEO -->
            <video *ngIf="item.type === 'video'" [src]="baseImageUrl + item.media_url" controls preload="metadata" class="video-preview"></video>
            
            <div class="card-meta">
              <div><strong>Prompt:</strong> {{ item.prompt }}</div>
              <div *ngIf="item.type === 'image'"><strong>Stile:</strong> {{ item.style || '-' }}</div>
              <div *ngIf="item.type === 'video'"><strong>Risoluzione:</strong> {{ item.resolution || '-' }}</div>
              <div *ngIf="item.type === 'video'"><strong>Durata:</strong> {{ item.duration }}s</div>
              <div><strong>Modello:</strong> {{ item.model || '-' }}</div>
              <div><strong>Token:</strong> {{ item.tokens_used }}</div>
              <div><small>{{ item.created_at | date:'short' }}</small></div>
              <div class="media-type">{{ item.type === 'image' ? '🖼️ Immagine' : '🎬 Video' }}</div>
            </div>
          </div>
        </div>
      </section>

      <div class="loading-overlay" *ngIf="loading">Caricamento in corso...</div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    :host{display:block;height:100%;background:#f4f6fb;color:#1f2937;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;}
    .gallery-shell{padding:1rem;max-width:1200px;margin:0 auto;}
    .gallery-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1rem;}
    .gallery-header h1{margin:0;font-size:1.55rem;}
    .gallery-header p{margin:0;color:#64748b;}
    .header-actions{display:flex;gap:.5rem;}
    .btn{border:1px solid #cbd5e1;background:#fff;color:#1f2937;padding:.45rem .8rem;border-radius:.5rem;cursor:pointer;}
    .btn-primary{background:#2563eb;color:#fff;border:none;}
    .btn-secondary{background:#e2e8f0;color:#1f2937;border:none;}
    .filter-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:1rem;}
    .filter-row input,.filter-row select{padding:.5rem .6rem;border:1px solid #cbd5e1;border-radius:.5rem;min-width:180px;}
    .gallery-content .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.9rem;}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:.8rem;overflow:hidden;display:flex;flex-direction:column;}
    .card img{width:100%;aspect-ratio:16/9;object-fit:cover;}
    .card video.video-preview{width:100%;aspect-ratio:16/9;object-fit:cover;}
    .card-meta{padding:.55rem;font-size:.82rem;line-height:1.25;}
    .media-type{font-size:.75rem;color:#64748b;margin-top:.25rem;}
    .empty-state{padding:2rem;text-align:center;color:#64748b;}
    .loading-overlay{position:fixed;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#2563eb;}
    .error-message{margin-top:.8rem;color:#ef4444;font-weight:600;}
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
        this.error = 'Impossibile caricare i contenuti. Riprova più tardi.';
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
