import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  username: string;
  tokens: number;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
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
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
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
}
