import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private apiUrl = 'http://localhost:8000'; // backend FastAPI

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, { amount, currency });
  }

  // Chiave pubblica caricata dinamicamente dal backend
  getPublishableKey(): Observable<string> {
  return this.http.get<{ key: string }>(`${this.apiUrl}/stripe-publishable-key`).pipe(
    map(res => res.key) // prende solo il valore della chiave
  );
}
}