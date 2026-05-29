# Cos'è Repli?

**Repli è una piattaforma web che permette agli utenti di generare immagini e video con AI usando token (crediti).**

## Come funziona per l'utente

1. **Registrazione e acquisto**: L'utente si registra e acquista un pacchetto di token (es. 600 token per €7)
2. **Generazione**: Entra in "Genera" e digita una descrizione (es. "un gatto che suona la chitarra")
3. **Scelta modello**: Seleziona un modello AI (Flux Pro, SDXL, Kling Video, ecc.)
4. **Creazione**: Clicca "Genera" → il sistema sottrae token e crea l'immagine/video
5. **Visualizzazione**: Vede il risultato in "Galleria" e può scaricare o rigenerare

## Sistema di token

- **Ogni modello costa un numero fisso di token:**
  - Immagini: 2-8 token a seconda della qualità
  - Video: 20-35 token a seconda di durata/risoluzione
  
- **L'utente vede sempre il costo prima di generare**
- **Può acquistare altri token quando finisce**
- **Se la generazione fallisce, riceve automaticamente un rimborso**

## Backend tecnico

1. La SaaS chiama l'API di **Replicate.ai** (che ospita i modelli AI veri)
2. Sconta i token dal conto utente
3. Se la generazione fallisce, rimborsa i token automaticamente
4. Salva immagini/video su disco locale
5. Traccia tutto in database (user, transazioni, generazioni)
6. Integra pagamenti via **Stripe** (carta di credito)

## Stack tecnologico

- **Frontend**: Angular + TypeScript
- **Backend**: FastAPI (Python)
- **Database**: MySQL
- **AI Provider**: Replicate.ai
- **Pagamenti**: Stripe
- **Hosting**: Cloud con Docker

## Monetizzazione

- Vende token agli utenti a un prezzo (es. €7 per 600 token)
- Il costo effettivo per la piattaforma è minore (Replicate addebita meno)
- **Margine = Prezzo vendita - Costo Replicate - Commissione Stripe**
- Commissione Stripe ~3%

## Flusso di denaro

```
Utente paga €7 via Stripe
        ↓
€7 - €0.21 (Stripe 3%) = €6.79 netti
        ↓
Piattaforma riceve €6.79
        ↓
Quando utente genera: sottrae token dal suo conto
        ↓
Piattaforma addebita token a Replicate (costo più basso)
        ↓
Profitto = €6.79 - costo effettivo Replicate
```

## In una frase

**Un marketplace minimalista dove utenti acquistano crediti e li spendono per generare contenuti AI visivi, il sistema traccia tutto e la piattaforma guadagna dalla differenza di prezzo.**
