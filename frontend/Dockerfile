# -----------------------------
# Dockerfile frontend ottimizzato (Node 20 + Alpine)
# -----------------------------

# Stage 1: Build
FROM node:20-alpine AS build

# Installa dipendenze minime per build (bash, make, g++, python)
RUN apk add --no-cache bash make g++ python3

WORKDIR /app

# Copia solo package.json e package-lock.json per sfruttare cache
COPY package*.json ./

# Forza registry pubblico e rimuove proxy aziendali
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config delete proxy || true \
    && npm config delete https-proxy || true

# Installa le dipendenze usando il lockfile
RUN npm ci

# Copia il resto del codice
COPY . .

# Compila Angular in produzione
RUN npm run build --prod

# Stage 2: Server statico leggero
FROM node:20-alpine AS production

WORKDIR /app

# Installa serve globale leggero
RUN npm install -g serve

# Copia la build dal stage precedente
COPY --from=build /app/dist/replicate-frontend ./dist

# Espone la porta del server
EXPOSE 4200

# Avvia il server
CMD ["serve", "-s", "dist", "-l", "4200"]