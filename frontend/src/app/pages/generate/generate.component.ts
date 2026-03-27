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
        <h3>Impostazioni generali</h3>

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

        <div class="upload-box">
          <p>Immagini di riferimento (0/4)</p>
          <div class="upload-placeholder">+</div>
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
    .generate-shell {
      display: grid;
      grid-template-columns: 280px 1fr;
      height: 100%;
      gap: 1rem;
    }

    /* SIDEBAR */
    .sidebar {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .sidebar h3 {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .sidebar label {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .sidebar select {
      padding: 0.4rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .upload-box {
      margin-top: 1rem;
      font-size: 0.75rem;
    }

    .upload-placeholder {
      margin-top: 0.5rem;
      border: 2px dashed #d1d5db;
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #9ca3af;
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
      border: 1px solid #e5e7eb;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
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

    /* PROMPT */
    .prompt-box {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 0.6rem;
      background: #ffffff;
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

  generate() {
    if (!this.prompt.trim()) return;

    this.loading = true;

    // MOCK (poi colleghi API)
    setTimeout(() => {
      this.image = 'https://picsum.photos/600';
      this.loading = false;
    }, 1500);
  }
}