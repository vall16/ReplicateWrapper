import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';




export interface User {
  id: number;
  email: string;
  username: string;
  tokens: number;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:8000/api';
  private apiUrl = environment.apiUrl; // ← usa apiUrl dall'environment

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // Load user from sessionStorage (not localStorage for security)
  private loadUserFromStorage() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Registrazione
  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      email,
      username,
      password
    });
  }

  // Login (token stored in httpOnly cookie automatically)
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }, { withCredentials: true }).pipe(
      tap(response => {
        if (response.user) {
          // Store user data in sessionStorage (not sensitive)
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Login with Google (token stored in httpOnly cookie automatically)
  loginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/google-login`, {
      id_token: idToken
    }, { withCredentials: true }).pipe(
      tap(response => {
        if (response.user) {
          // Store user data in sessionStorage (not sensitive)
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        sessionStorage.removeItem('user');
        this.currentUserSubject.next(null);
      })
    );
  }

  // Get token (for backward compatibility - reads from sessionStorage)
  getToken(): string | null {
    // Token is now in httpOnly cookie, not available to JS
    // This returns null, but httpOnly cookie is sent automatically with withCredentials
    return null;
  }

  // Ottieni l'utente corrente
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    // Since token is in httpOnly cookie, check if we have user data
    return !!this.getCurrentUser();
  }


  // Token balance
  getBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/balance`, { withCredentials: true });
  }

  // Transaction history
  getTransactions(limit: number = 50): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/transactions?limit=${limit}`, { withCredentials: true });
  }

  // Pacchetti token
  getTokenPackages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/packages`, { withCredentials: true });
  }

  // Confirm Stripe checkout
  confirmCheckout(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/checkout/confirm?session_id=${sessionId}`, { withCredentials: true });
  }

  // Purchase tokens
  purchaseTokens(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tokens/purchase`,
      { amount },
      { withCredentials: true }
    ).pipe(
      tap(() => {
        // Aggiorna il saldo dopo l'acquisto
        this.getBalance().subscribe(balance => {
          const user = this.currentUserSubject.value;
          if (user) {
            user.tokens = balance.tokens;
            this.currentUserSubject.next(user);
            sessionStorage.setItem('user', JSON.stringify(user));
          }
        });
      })
    );
  }

  // Verifica token
  checkTokens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/check`, { withCredentials: true });
  }

  // Carica i modelli disponibili
  getAvailableModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/models`);
  }

  // Lista immagini generate dall'utente, con filtri
  getGeneratedImages(filters: { style?: string; model?: string; prompt?: string; limit?: number } = {}): Observable<any> {
    const params: string[] = [];
    if (filters.style) {
      params.push(`style=${encodeURIComponent(filters.style)}`);
    }
    if (filters.model) {
      params.push(`model=${encodeURIComponent(filters.model)}`);
    }
    if (filters.prompt) {
      params.push(`prompt=${encodeURIComponent(filters.prompt)}`);
    }
    if (filters.limit) {
      params.push(`limit=${filters.limit}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';
    return this.http.get(`${this.apiUrl}/generated-images${queryString}`, { withCredentials: true });
  }

  // Lista video generati dall'utente, con filtri
  getGeneratedVideos(filters: { model?: string; prompt?: string; limit?: number } = {}): Observable<any> {
    const params: string[] = [];
    if (filters.model) {
      params.push(`model=${encodeURIComponent(filters.model)}`);
    }
    if (filters.prompt) {
      params.push(`prompt=${encodeURIComponent(filters.prompt)}`);
    }
    if (filters.limit) {
      params.push(`limit=${filters.limit}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';
    return this.http.get(`${this.apiUrl}/generated-videos${queryString}`, { withCredentials: true });
  }

  // Lista combinata immagini e video generati dall'utente, con filtri
  getGeneratedMedia(filters: { style?: string; model?: string; prompt?: string; limit?: number } = {}): Observable<any> {
    const params: string[] = [];
    if (filters.style) {
      params.push(`style=${encodeURIComponent(filters.style)}`);
    }
    if (filters.model) {
      params.push(`model=${encodeURIComponent(filters.model)}`);
    }
    if (filters.prompt) {
      params.push(`prompt=${encodeURIComponent(filters.prompt)}`);
    }
    if (filters.limit) {
      params.push(`limit=${filters.limit}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';
    return this.http.get(`${this.apiUrl}/generated-media${queryString}`, { withCredentials: true });
  }

  // CLICK DI GENERAZIONE
  generateImage(
    description: string,
    style: string = 'moderno',
    model: string = 'stability-ai/sdxl:latest',
    ratio: string = '16:9'
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/generate-paid`,
      {
        description,
        style,
        model,
        ratio
      },
      { withCredentials: true }
    );
  }

  // GENERAZIONE VIDEO
  generateVideo(
    prompt: string,
    duration: number,
    resolution: string,
    model: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/generate-video`,
      {
        prompt,
        duration,
        resolution,
        model
      },
      { withCredentials: true }
    );
  }

}
