import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
          <div class="section-header" (click)="toggleSection('general')">
            <span>Impostazioni generali</span>
            <span class="arrow">{{ openSections.general ? '▲' : '▼' }}</span>
          </div>
          <div class="section-body" *ngIf="openSections.general">
            <label>Modello</label>
            <select [(ngModel)]="model">
              <option value="flux">FLUX.1 Kontext [max]</option>
              <option value="sdxl">SDXL</option>
            </select>

            <label>Proporzioni</label>
            <select [(ngModel)]="ratio">
              <option value="1:1">Quadrato (1:1)</option>
              <option value="4:3">Orizzontale (4:3)</option>
              <option value="9:16">Verticale (9:16)</option>
            </select>
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
            <span class="free-label">Gratis</span>
            <button (click)="generate()" [disabled]="loading">
              {{ loading ? 'Generazione...' : 'Genera' }}
            </button>
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

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  model = 'flux';
  ratio = '1:1';
  image: string | null = null;
  loading = false;

  referenceImages: string[] = [];
  openSections = {
    general: true,
    refs: true
  };

  toggleSection(section: 'general' | 'refs') {
    this.openSections[section] = !this.openSections[section];
  }

  addReferenceImage() {
    if (this.referenceImages.length < 4) {
      this.referenceImages.push('dummy.png');
    }
  }

  generate() {
    if (!this.prompt.trim()) return;

    this.loading = true;

    // MOCK API call
    setTimeout(() => {
      this.image = 'https://picsum.photos/600';
      this.loading = false;
    }, 1500);
  }
}