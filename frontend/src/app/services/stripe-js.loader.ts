// Stripe.js loader utility
export function loadStripeJs(publishableKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).Stripe) {
      resolve((window as any).Stripe(publishableKey));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      resolve((window as any).Stripe(publishableKey));
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
