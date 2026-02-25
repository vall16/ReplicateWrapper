import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, {
      amount,
      currency
    });
  }
}
