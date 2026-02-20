# 🚀 SETUP INIZIALE - SISTEMA TOKEN

## ✅ Checklist di Installation

### Backend
- [ ] Installare dipendenze: `pip install -r requirements.txt`
- [ ] Creare file `.env` con configurazioni
- [ ] Assicurarsi abbia REPLICATE_API_TOKEN valido
- [ ] Avviare server: `python run.py`
- [ ] Verificare health: `curl http://localhost:8000/health`

### Frontend
- [ ] Installare dipendenze: `npm install`
- [ ] Verificare URL API in `auth.service.ts`
- [ ] Avviare dev server: `ng serve`
- [ ] Accedere a `http://localhost:4200/login`

### Database
- [ ] Il database SQLite si crea automaticamente al primo avvio
- [ ] Location: `backend/repli.db`
- [ ] Backup del database prima di aggiornamenti

---

## 🔧 Configurazione Rapida

### 1. Backend/.env
```
REPLICATE_API_TOKEN=your_token_here
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./repli.db
```

### 2. Dipendenze Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. Avvio Backend
```bash
python run.py
```

### 4. Dipendenze Frontend
```bash
cd frontend
npm install
```

### 5. Avvio Frontend
```bash
npm start
```

---

## 🧪 Test di Prova

### 1. Registrazione
```
URL: http://localhost:4200/register
Email: test@example.com
Username: testuser
Password: Password123
```

### 2. Login
```
Email: test@example.com
Password: Password123
Risultato: Dovrebbe reindirizzare a /dashboard
```

### 3. Acquista Token
```
Dashboard → Vai al negozio → Seleziona pacchetto
Acquista 100 token per €1.00
```

### 4. Verifica Saldo
```
Dashboard mostra saldo aggiornato: 100 🪙
```

### 5. Storico Transazioni
```
Dashboard → Transazioni
Dovrebbe mostrare: +100 🪙 (Acquisto)
```

---

## 📊 Dati Test Preconfigurati

Account test (dopo registrazione):
```
Email: test@example.com
Username: testuser
Password: PasswordSecure123
Token Iniziali: 0 (acquista dal store)
```

Pacchetti disponibili:
```
1. Starter: 100 token → €1.00
2. Growth: 500 token → €4.50 (consigliato)
3. Pro: 1000 token → €8.00
4. Enterprise: 5000 token → €35.00
```

---

## 🐳 Docker Setup (Opzionale)

Se usi Docker Compose:
```bash
docker-compose up
```

Questo avvierà:
- Backend su localhost:8000
- Frontend su localhost:4200
- Database automaticamente

---

## 📱 Rotte Disponibili

### Autenticazione
- `GET /` - Home
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Profilo
- `GET /api/auth/balance` - Saldo token
- `GET /api/auth/transactions` - Storico

### Token
- `GET /api/tokens/packages` - Pacchetti disponibili
- `POST /api/tokens/purchase` - Acquista token
- `GET /api/tokens/check` - Verifica saldo

---

## 🎯 Flusso Tipico Utente

1. **Visita l'app** → Redirect a `/login`
2. **Registrazione** → `/register` → Crea account
3. **Login** → `/login` → Accedi
4. **Dashboard** → Vedi saldo (0 token)
5. **Negozio** → `/store` → Acquista token
6. **Usa API** → Ogni call = -1 token
7. **Storico** → `/transactions` → Vedi movimenti

---

## ⚠️ Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| "Connection refused" Backend | Verifica che backend sia in esecuzione su 8000 |
| CORS error | Controlla allow_origins in main.py |
| Database locked | Elimina repli.db e riavvia |
| Token scaduto | Fai logout e login di nuovo |
| Password troppo corta | Minimo 8 caratteri |

---

## 🔐 Best Practices

✅ Usa sempre HTTPS in produzione
✅ Cambia SECRET_KEY predefinito
✅ Coppia backup del database regolarmente
✅ Monitora transazioni sospette
✅ Rate limit per prevenire abusi
✅ Usa password forti

---

## 📈 Monitoraggio

### Verifica che il backend sia funzionante:
```bash
curl http://localhost:8000/health
# Dovrebbe restituire: {"status": "healthy"}
```

### Verifica il database:
```bash
sqlite3 backend/repli.db
sqlite> SELECT COUNT(*) FROM users;
```

### Log del backend:
```
Controlla la console dove hai lanciato `python run.py`
```

---

**Complimenti! Il sistema è pronto! 🎉**

Inizia con la registrazione di un utente test e buon lavoro! 🚀
