# Deployment Guide

Complete guide for deploying the Pre-Mortem Analysis Tool to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Development](#development)
6. [Production Build](#production-build)
7. [Deployment Options](#deployment-options)
8. [Environment Variables](#environment-variables)
9. [Security Considerations](#security-considerations)
10. [Performance Optimization](#performance-optimization)
11. [Monitoring](#monitoring)
12. [Troubleshooting](#troubleshooting)
13. [Production Checklist](#production-checklist)

---

## Prerequisites

### Required

- **Node.js 18+** (LTS recommended)
- **npm 9+** or **yarn 1.22+** or **pnpm 8+**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Recommended

- **Git** for version control
- **Modern browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **SSL certificate** for production deployment

### Check Prerequisites

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 9.0.0

# Verify git installation
git --version
```

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/premortem-tool.git
cd premortem-tool
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Production dependencies (React, TypeScript, Anthropic SDK, jsPDF, etc.)
- Development dependencies (Vite, Vitest, Playwright, ESLint, etc.)

### 3. Verify Installation

```bash
# Run tests to verify setup
npm run test

# Should see: ✓ 41 tests passing
```

---

## Configuration

### Environment Variables

Create environment files for different stages:

#### Development: `.env.local`

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Required: Your Anthropic API key
VITE_ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# Optional: App metadata
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
```

#### Production: `.env.production`

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-api03-production-key-here
VITE_APP_VERSION=1.0.0
```

**IMPORTANT**: Never commit `.env.local` or `.env.production` to version control. These files are already in `.gitignore`.

---

## Development

### Start Development Server

```bash
npm run dev
```

- Server runs at: http://localhost:5173
- Hot Module Replacement (HMR) enabled
- TypeScript type checking in real-time

### Development Workflow

```bash
# Run in watch mode with UI
npm run test:ui

# Check types
npx tsc --noEmit

# Lint code
npm run lint

# Format code
npm run format
```

### Browser DevTools

The app includes React DevTools support. Install the browser extension:
- [React DevTools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [React DevTools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

---

## Production Build

### Build Steps

```bash
# Run full production build
npm run build
```

This will:
1. Type check all TypeScript files
2. Lint code with ESLint
3. Bundle and minify assets with Vite
4. Output to `dist/` directory

### Build Output

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Main JS bundle (~150KB gzipped)
│   ├── react-[hash].js     # React vendor chunk (~130KB gzipped)
│   ├── ui-[hash].js        # UI vendor chunk (~50KB gzipped)
│   ├── pdf-[hash].js       # PDF vendor chunk (~560KB gzipped)
│   └── index-[hash].css    # Compiled CSS (~20KB gzipped)
└── vite.svg                # Favicon
```

### Build Verification

```bash
# Preview production build locally
npm run preview
```

Server runs at: http://localhost:4173

**Test the following:**
- ✅ All 8 steps load without errors
- ✅ API calls work with production API key
- ✅ PDF export generates correctly
- ✅ Data persists in localStorage
- ✅ No console errors
- ✅ Performance metrics acceptable

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Best for:** Quick deployment with zero configuration

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Deploy via GitHub Integration

1. Push code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure environment variables:
   - `VITE_ANTHROPIC_API_KEY` = your API key
5. Deploy

**Vercel automatically:**
- Detects Vite configuration
- Runs `npm run build`
- Serves from `dist/` directory
- Provides HTTPS certificate
- Enables CDN caching

---

### Option 2: Netlify

**Best for:** Form handling and serverless functions (future features)

#### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Deploy via GitHub Integration

1. Push code to GitHub
2. Visit [app.netlify.com/start](https://app.netlify.com/start)
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Environment variables:
   - `VITE_ANTHROPIC_API_KEY` = your API key
6. Deploy

**Netlify Configuration** (optional `netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### Option 3: AWS S3 + CloudFront

**Best for:** Enterprise deployments with AWS infrastructure

#### Prerequisites

- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

#### Deploy Script

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

### Option 4: GitHub Pages

**Best for:** Free hosting for open-source projects

#### Configuration

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://your-username.github.io/premortem-tool",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/premortem-tool/',  // Repository name
     // ... rest of config
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

**Note:** Environment variables must be hardcoded in this setup (not recommended for API keys).

---

### Option 5: Docker Container

**Best for:** Self-hosted deployments with container orchestration

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t premortem-tool .

# Run container
docker run -p 80:80 premortem-tool
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for Claude | `sk-ant-api03-xxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_VERSION` | App version for display | `1.0.0` |
| `VITE_ANALYTICS_ID` | Google Analytics ID | - |

### Setting Variables by Platform

**Vercel:**
1. Project Settings → Environment Variables
2. Add each variable
3. Redeploy

**Netlify:**
1. Site Settings → Build & Deploy → Environment
2. Add variables
3. Trigger redeploy

**AWS:**
- Use AWS Systems Manager Parameter Store or Secrets Manager
- Reference in build scripts

**Docker:**
```bash
docker run -p 80:80 \
  -e VITE_ANTHROPIC_API_KEY=sk-ant-xxx \
  premortem-tool
```

---

## Security Considerations

### API Key Protection

**⚠️ CRITICAL: The current implementation exposes the API key in client-side code.**

For production, implement one of these solutions:

#### Option A: Backend Proxy (Recommended)

Create a backend API that proxies requests to Anthropic:

```typescript
// Example: Next.js API route
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,  // Server-side only
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(200).json(data);
}
```

Update `src/services/claudeAPI.ts` to call your backend instead.

#### Option B: Rate Limiting

If keeping client-side implementation:
- Use Anthropic's rate limiting features
- Set usage quotas in Anthropic Console
- Monitor usage regularly

### Content Security Policy

Add CSP headers to prevent XSS attacks:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               connect-src 'self' https://api.anthropic.com;">
```

### HTTPS Enforcement

**Always use HTTPS in production.** Most platforms (Vercel, Netlify) provide this automatically.

For custom deployments, use Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --mode analyze
```

### Optimization Checklist

- ✅ **Code splitting**: Implemented via vite.config.ts manual chunks
- ✅ **Tree shaking**: Enabled by Vite/Rollup
- ✅ **Minification**: Enabled in production build
- ✅ **Compression**: Enable gzip/brotli on server

### Server-Side Optimizations

#### Nginx

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;

# Enable brotli (if available)
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### Vercel/Netlify

Compression is automatically enabled.

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.5s | ~1.2s |
| Largest Contentful Paint (LCP) | < 2.5s | ~2.1s |
| Time to Interactive (TTI) | < 3.5s | ~3.0s |
| Total Bundle Size (gzipped) | < 500KB | ~350KB |

**Measure with:**
- Chrome DevTools Lighthouse
- [WebPageTest](https://www.webpagetest.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

---

## Monitoring

### Error Tracking

Consider integrating error tracking:

**Sentry Example:**

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Google Analytics 4 Example:**

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Health Checks

Create a `/health` endpoint for monitoring:

```typescript
// Simple status check
export function HealthCheck() {
  return (
    <div>
      <h1>Status: OK</h1>
      <p>Version: {import.meta.env.VITE_APP_VERSION}</p>
    </div>
  );
}
```

---

## Troubleshooting

### Build Failures

**Issue:** `npm run build` fails with TypeScript errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run type check separately
npx tsc --noEmit
```

---

**Issue:** Build succeeds but app doesn't load in production

**Solution:**
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure `base` path in vite.config.ts matches deployment path
- Check CSP headers aren't blocking resources

---

### API Issues

**Issue:** Claude API calls fail with 401 Unauthorized

**Solution:**
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Check API key is valid in Anthropic Console
- Ensure no extra whitespace in `.env` file

---

**Issue:** API calls work in dev but fail in production

**Solution:**
- Confirm production environment variable is set
- Check CORS policy if using backend proxy
- Verify API key has sufficient credits

---

### Performance Issues

**Issue:** App loads slowly on initial visit

**Solution:**
- Enable CDN caching for static assets
- Implement service worker for offline support
- Preload critical resources in index.html:
  ```html
  <link rel="preload" href="/assets/index.js" as="script">
  ```

---

**Issue:** PDF generation is slow

**Solution:**
- PDF generation is CPU-intensive (expected 2-3 seconds)
- Consider generating on backend for large reports
- Show loading spinner during generation

---

### Data Loss

**Issue:** User data lost after clearing browser cache

**Solution:**
- This is expected behavior (localStorage only)
- For production, consider:
  - Backend database storage
  - Export/import functionality
  - Cloud sync feature

---

## Production Checklist

Before deploying to production, verify:

### Pre-Deployment

- [ ] All tests passing (`npm run test`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Production preview works (`npm run preview`)
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] API key is production key (not test key)
- [ ] Analytics/monitoring configured
- [ ] Error tracking set up

### Security

- [ ] HTTPS enabled
- [ ] API key not exposed in client code (or rate limited)
- [ ] CSP headers configured
- [ ] Security headers set (X-Frame-Options, etc.)
- [ ] Dependencies audited (`npm audit`)
- [ ] No sensitive data in localStorage
- [ ] CORS configured correctly

### Performance

- [ ] Bundle size acceptable (< 500KB gzipped)
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN configured for static assets
- [ ] Cache headers set correctly

### Functionality

- [ ] All 8 workflow steps tested
- [ ] AI scenario generation works
- [ ] PDF export downloads correctly
- [ ] Data persists across sessions
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### Documentation

- [ ] README.md updated with production URL
- [ ] API documentation complete
- [ ] Known limitations documented
- [ ] Support contact information added
- [ ] License information included

### Post-Deployment

- [ ] Verify production site loads correctly
- [ ] Test complete workflow end-to-end
- [ ] Monitor error logs for 24 hours
- [ ] Check analytics data collection
- [ ] Verify API usage within limits
- [ ] Set up uptime monitoring

---

## Rollback Procedure

If issues arise after deployment:

### Vercel/Netlify
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### AWS S3
```bash
# Restore previous version
aws s3 sync s3://backup-bucket/ s3://production-bucket/ --delete
```

### Docker
```bash
# Roll back to previous image
docker pull premortem-tool:previous-tag
docker stop current-container
docker run -d -p 80:80 premortem-tool:previous-tag
```

---

## Support and Maintenance

### Regular Maintenance

**Weekly:**
- Check error logs
- Monitor API usage
- Review analytics

**Monthly:**
- Update dependencies (`npm update`)
- Run security audit (`npm audit`)
- Review performance metrics
- Check for browser compatibility issues

**Quarterly:**
- Review and update documentation
- Conduct security review
- Performance optimization sprint
- User feedback analysis

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/your-org/premortem-tool/issues)
- **Documentation:** [Project README](README.md)
- **Testing:** [Testing Guide](TESTING.md)

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [React Production Checklist](https://react.dev/learn/react-developer-tools#production)
- [Web.dev Performance Guides](https://web.dev/performance/)

---

**Last Updated:** November 19, 2025
**Version:** 1.0.0
