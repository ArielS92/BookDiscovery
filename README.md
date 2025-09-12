# BookDiscovery - Plataforma de Descubrimiento y Reseñas de Libros

Una aplicación web para descubrir libros, leer reseñas y compartir tus propias opiniones.

## 🚀 Características

- Búsqueda de libros usando Google Books API
- Sistema de reseñas con calificación por estrellas
- Votación comunitaria de reseñas
- Interfaz responsive con Tailwind CSS
- TypeScript para type safety
- Tests unitarios con Vitest

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd BookDiscovery
npm install
```

2. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

3. Ejecuta los tests:
```bash
npm test
```

## 🐳 Docker Deployment

### Construir la imagen localmente

```bash
npm run docker:build
```

### Ejecutar el contenedor

```bash
npm run docker:run
```

### Usar docker-compose

```bash
npm run docker:compose
```

## ⚙️ Variables de Entorno

- NODE_ENV: Define el entorno de ejecución (development, production, test)
- PORT: Puerto donde corre la aplicación (por defecto 3000)
- HOSTNAME: Host para la aplicación (por defecto 0.0.0.0)

## 📦 GitHub Actions Workflows

### 1. Build en Pull Requests

- Se ejecuta automáticamente en cada Pull Request a las ramas `main` o `master`.
- Instala dependencias con cache para acelerar builds.
- Ejecuta type-check, lint y build de la aplicación.
- Falla el PR si el build no es exitoso.
- Proporciona feedback claro con logs y reportes.

### 2. Tests en Pull Requests

- Se ejecuta automáticamente en cada Pull Request a las ramas `main` o `master`.
- Instala dependencias con cache.
- Ejecuta type-check y todos los tests unitarios con cobertura.
- Falla el PR si algún test no pasa.
- Reporta resultados detallados y genera resumen.

### 3. Docker Container Build y Publish

- Se ejecuta cuando se hace push a la rama principal (`main` o `master`) o tags de versión.
- Construye una imagen Docker optimizada con multi-stage build.
- Publica la imagen en GitHub Container Registry (ghcr.io) con tags apropiados (latest, versión, commit hash).
- Realiza pruebas de la imagen antes de publicar.
- Escanea vulnerabilidades y genera reportes.

## 🔗 Recursos Útiles

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

Esta documentación cubre cómo desplegar localmente, cómo funcionan los workflows de CI/CD y cómo usar Docker para producción.
