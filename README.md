# Repli - Replicate.ai Wrapper

Un progetto fullstack per creare un wrapper di Replicate.ai con frontend Angular e backend Python.

## Struttura del Progetto

```
repli/
├── frontend/          # Applicazione Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/           # API Python FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── replicate_wrapper.py
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
└── README.md
```

## Tecnologie Utilizzate

### Frontend
- **Angular 17** - Framework frontend con standalone components
- **TypeScript** - Type safety
- **SCSS** - Styling

### Backend
- **FastAPI** - Framework Python moderno e veloce
- **Replicate** - SDK per Replicate.ai
- **Uvicorn** - Server ASGI
- **Pydantic** - Validazione dati

### Database
- **Supabase** - Database PostgreSQL e autenticazione

## Setup e Installazione

### Prerequisiti
- Node.js 18+
- Python 3.9+
- npm o yarn
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

L'applicazione Angular sarà disponibile su `http://localhost:4200`

### Backend Setup

```bash
cd backend

# Creare ambiente virtuale
python -m venv venv

# Attivare ambiente virtuale
# Su Windows:
venv\Scripts\activate
# Su macOS/Linux:
source venv/bin/activate

# Installare dipendenze
pip install -r requirements.txt

# Copiare e configurare .env
cp .env.example .env
# Modificare .env con le tue chiavi API

# Avviare il server
python run.py
```

L'API sarà disponibile su `http://localhost:8000`

## Configurazione

### Variabili d'Ambiente

Crea un file `.env` nella cartella `backend/` con le seguenti variabili:

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=8000
HOST=0.0.0.0
```

### Ottenere le API Keys

1. **Replicate.ai**: Registrati su [replicate.com](https://replicate.com) e ottieni il token API
2. **Supabase**: Le credenziali sono già configurate nel file `.env` principale

## Sviluppo

### Frontend
```bash
cd frontend
npm start          # Avvia dev server
npm run build      # Build di produzione
npm test           # Esegui test
```

### Backend
```bash
cd backend
python run.py      # Avvia server con hot-reload
```

## API Endpoints

### Base
- `GET /` - Info API
- `GET /health` - Health check

### Replicate (da implementare)
- `POST /api/models/run` - Esegui un modello
- `GET /api/models/list` - Elenca modelli disponibili

## Prossimi Passi

1. Implementare endpoint API per Replicate.ai
2. Creare componenti Angular per l'UI
3. Integrare Supabase per la persistenza dei dati
4. Aggiungere autenticazione utenti
5. Implementare gestione file e upload
6. Aggiungere logging e error handling

## Licenza

MIT
