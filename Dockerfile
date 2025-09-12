# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY package-lock.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies) para el build
RUN npm ci

# Copiar el código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar dependencias solo de producción
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copiar el build desde la etapa de builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar ownership de los archivos
RUN chown -R nextjs:nodejs /app/.next

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Comando de inicio
CMD ["npm", "start"]