# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Angular application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to serve the static files
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/dist/repli-frontend /app/dist/repli-frontend

# Expose port
EXPOSE 4200

# Serve the application
CMD ["serve", "-s", "dist/repli-frontend", "-l", "4200"]
