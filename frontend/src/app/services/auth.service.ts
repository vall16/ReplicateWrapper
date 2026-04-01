import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Carica l'utente dal localStorage
  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
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

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Login con Google (ID token da Google Identity Services)
  loginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/google-login`, {
      id_token: idToken
    }).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Ottieni il token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Ottieni l'utente corrente
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verifica se è autenticato
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Profilo utente
  getProfile(): Observable<any> {
    return this.getAuthHeaders().pipe(
      tap(headers => {
        return this.http.get(`${this.apiUrl}/auth/profile`, { headers });
      })
    );
  }

  // Saldo token
  getBalance(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/auth/balance`, { headers });
  }

  // Storico transazioni
  getTransactions(limit: number = 50): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/auth/transactions?limit=${limit}`, { headers });
  }

  // Pacchetti token
  getTokenPackages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/packages`);
  }

  // Conferma checkout Stripe e accredita token (backend usa session_id per validare)
  confirmCheckout(sessionId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/tokens/checkout/confirm?session_id=${sessionId}`, { headers });
  }

  // Acquista token
  purchaseTokens(amount: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/tokens/purchase`, 
      { amount },
      { headers }
    ).pipe(
      tap(() => {
        // Aggiorna il saldo dopo l'acquisto
        this.getBalance().subscribe(balance => {
          const user = this.currentUserSubject.value;
          if (user) {
            user.tokens = balance.tokens;
            this.currentUserSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        });
      })
    );
  }

  // Verifica token
  checkTokens(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/tokens/check`, { headers });
  }

  // Helper per ottenere headers
  private getAuthHeaders(): Observable<HttpHeaders> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return new Observable(observer => {
      observer.next(headers);
      observer.complete();
    });
  }


  // Carica i modelli disponibili
  getAvailableModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/models`);
  }

  // Lista immagini generate dall'utente, con filtri
  getGeneratedImages(filters: { style?: string; model?: string; prompt?: string; limit?: number } = {}): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

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
    return this.http.get(`${this.apiUrl}/generated-images${queryString}`, { headers });
  }

// CLICK DI GENERAZIONE
  generateImage(
    description: string,
    style: string = 'moderno',
    model: string = 'stability-ai/sdxl:latest'
  ): Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `${this.apiUrl}/generate-paid`,
      {
        description,
        style,
        model   // <-- nuovo parametro inviato al backend
      },
      { headers }
    );
  }

  generateImage2(
    description: string,
    style: string = 'moderno',
    model: string = 'stability-ai/sdxl:latest'
  ): Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `${this.apiUrl}/generate-paid2`,
      {
        description,
        style,
        model   // <-- nuovo parametro inviato al backend
      },
      { headers }
    );
  }

  generateImage_old(prompt: string,  style: string = 'moderno',
    model: string = 'stability-ai/sdxl:latest'
  ) {
    return new Observable((observer) => {

      console.log('FAKE CALL →', { prompt});

      // Simula delay tipo API reale
      setTimeout(() => {

        // puoi usare immagini random
        const fakeImages = [
          'https://picsum.photos/800/800'
          // 'https://source.unsplash.com/800x800/?ai,art',
          // 'https://source.unsplash.com/800x800/?cyberpunk',
          // 'https://source.unsplash.com/800x800/?fantasy'
        ];

        const randomImage = fakeImages[Math.floor(Math.random() * fakeImages.length)];

        observer.next({
          image_url: randomImage
        });

        observer.complete();

      }, 1500); // 1.5 sec

    });
  }
}
