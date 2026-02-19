# Docker Setup per Replicate Wrapper

## Descrizione
La configurazione Docker contiene:
- **Backend**: FastAPI Python application (porta 8000)
- **Frontend**: Angular application (porta 4200)
- **docker-compose.yml**: Orchestrazione dei servizi

## File Creati
- `backend/Dockerfile` - Image per il backend Python
- `backend/.dockerignore` - File e cartelle da escludere dal build
- `frontend/Dockerfile` - Multi-stage build per l'applicazione Angular
- `frontend/.dockerignore` - File e cartelle da escludere dal build
- `docker-compose.yml` - Configurazione dei servizi

## Comandi Utili

### Avviare l'applicazione completa
```bash
docker-compose up
```

### Avviare con rebuild
```bash
docker-compose up --build
```

### Avviare in background
```bash
docker-compose up -d
```

### Fermare l'applicazione
```bash
docker-compose down
```

### Visualizzare i log
```bash
docker-compose logs -f
```

### Log di un singolo servizio
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Ricostruire un'immagine
```bash
docker-compose build backend
docker-compose build frontend
```

## Accesso all'applicazione
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000

## Note
- Il volume per il backend consente il hot reload durante lo sviluppo
- Il frontend utilizza un multi-stage build per ottimizzare la dimensione dell'immagine
- I servizi sono collegati tramite una network Docker per la comunicazione interna
- Usa `depends_on` per assicurare che il backend sia avviato prima del frontend
