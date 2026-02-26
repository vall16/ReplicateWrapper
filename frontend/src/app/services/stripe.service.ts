import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private apiUrl = 'http://localhost:8000'; // backend FastAPI

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<any> {
    // mantenuto per retrocompatibilità, ma ora usiamo Checkout
    return this.http.post(`${this.apiUrl}/create-payment-intent`, { amount, currency });
  }

  createCheckoutSession(pkg: any): Observable<any> {
    // invia informazioni sul pacchetto al backend per generare una sessione Stripe Checkout
    return this.http.post(`${this.apiUrl}/create-checkout-session`, {
      package: pkg
    });
  }

  // Chiave pubblica caricata dinamicamente dal backend (utile per redirectToCheckout se necessario)
  getPublishableKey(): Observable<string> {
    return this.http.get<{ key: string }>(`${this.apiUrl}/stripe-publishable-key`).pipe(
      map(res => res.key) // prende solo il valore della chiave
    );
  }
}