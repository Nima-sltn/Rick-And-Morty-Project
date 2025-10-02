# Deployment Guide

## 🚀 Deployment Options

### 1. Netlify (Recommended)

#### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/rick-and-morty-explorer)

#### Manual Deploy

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**

   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Configure build settings**

   ```toml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 2. Vercel

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/rick-and-morty-explorer)

#### Manual Deploy

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Configure vercel.json**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### 3. GitHub Pages

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script**

   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configure base URL**

   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: "/rick-and-morty-explorer/",
     // ... other config
   });
   ```

4. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### 4. Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and run

```bash
docker build -t rick-morty-app .
docker run -p 3000:80 rick-morty-app
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env.production` for production settings:

```env
# API Configuration
VITE_API_BASE_URL=https://rickandmortyapi.com/api
VITE_APP_TITLE=Rick and Morty Explorer
VITE_APP_VERSION=1.0.0

# Analytics (optional)
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=YOUR_SENTRY_DSN

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### Build Optimization

#### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize bundle
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
          ui: ["framer-motion", "@heroicons/react"],
        },
      },
    },
    // Compress assets
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

## 📊 Performance Optimization

### 1. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
});
```

### 2. Compression

#### Gzip Compression

```bash
# Install compression plugin
npm install --save-dev vite-plugin-compression

# Add to vite.config.ts
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
});
```

#### Brotli Compression

```typescript
compression({
  algorithm: "brotliCompress",
  ext: ".br",
});
```

### 3. PWA Configuration

```bash
# Install PWA plugin
npm install --save-dev vite-plugin-pwa

# Add to vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Rick and Morty Explorer',
        short_name: 'R&M Explorer',
        description: 'Explore the Rick and Morty universe',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

## 🔒 Security Configuration

### 1. Content Security Policy

```html
<!-- Add to index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https://rickandmortyapi.com; 
               connect-src 'self' https://rickandmortyapi.com;" />
```

### 2. Security Headers

#### Netlify (\_headers file)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

#### Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📈 Monitoring and Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
```

### 2. Analytics (Google Analytics)

```bash
npm install gtag
```

```typescript
// src/utils/analytics.ts
export const trackEvent = (
  action: string,
  category: string,
  label?: string
) => {
  if (import.meta.env.PROD && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### 3. Performance Monitoring

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();

  console.log(`${name} took ${end - start} milliseconds`);

  // Send to analytics
  if (window.gtag) {
    window.gtag("event", "timing_complete", {
      name: name,
      value: Math.round(end - start),
    });
  }
};
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: "./dist"
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔍 Health Checks

### 1. Uptime Monitoring

```typescript
// src/utils/health.ts
export const healthCheck = async () => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character/1");
    return response.ok;
  } catch {
    return false;
  }
};
```

### 2. Performance Budgets

```json
// budget.json
[
  {
    "path": "/**",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-contentful-paint",
        "budget": 1500
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 400
      },
      {
        "resourceType": "total",
        "budget": 800
      }
    ]
  }
]
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build optimization enabled
- [ ] Security headers configured
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] CI/CD pipeline working
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Domain and SSL configured
- [ ] CDN setup (if needed)
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Routing Issues**

   - Ensure SPA redirects are configured
   - Check base URL configuration
   - Verify .htaccess or server config

3. **Performance Issues**

   - Enable compression
   - Optimize images
   - Check bundle size
   - Enable caching headers

4. **API Issues**
   - Verify CORS configuration
   - Check API endpoints
   - Monitor rate limits
   - Implement retry logic
