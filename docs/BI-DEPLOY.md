# Geniusmile BI - Deployment Guide

## Deployment su bi.geniusmile.com

### 1. Setup Server (93.186.255.213)

```bash
# SSH nel server
ssh geniusfast@93.186.255.213

# Crea directory applicazione
sudo mkdir -p /var/www/bi.geniusmile.com
sudo chown geniusfast:geniusfast /var/www/bi.geniusmile.com

# Clone repository
cd /var/www
git clone [REPOSITORY_URL] bi.geniusmile.com
cd bi.geniusmile.com

# Install dependencies
npm install

# Build production
npm run build
```

### 2. Configurazione Nginx

```nginx
server {
    listen 80;
    server_name bi.geniusmile.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "geniusmile-bi" -- run preview -- --port 3002

# Save PM2 configuration
pm2 save

# Setup auto-restart on boot
pm2 startup
```

### 4. SSL con Certbot

```bash
sudo certbot --nginx -d bi.geniusmile.com
```

### 5. Auto-deploy con Git Hook

```bash
# Nel server
cd /var/www/bi.geniusmile.com
cat > deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/bi.geniusmile.com
git pull origin main
npm install
npm run build
pm2 restart geniusmile-bi
EOF

chmod +x deploy.sh

# Setup cron per pull automatico
crontab -e
# Aggiungi: */1 * * * * /var/www/bi.geniusmile.com/deploy.sh > /var/log/bi-deploy.log 2>&1
```

### 6. Environment Variables

Create `.env` file:

```bash
NUXT_PUBLIC_API_BASE=https://api.geniusmile.com/api/v1
NUXT_PUBLIC_API_KEY=sk_smiledoc_2025_xK9mP3nQ7rT2wY5v
```

### 7. DNS Configuration

Punta `bi.geniusmile.com` a `93.186.255.213` (A record)

### 8. Verifica

```bash
# Check status
pm2 status
pm2 logs geniusmile-bi

# Test endpoint
curl https://bi.geniusmile.com
```

## Development

```bash
# Local development
npm run dev

# Access at http://localhost:3000
```

## Maintenance

```bash
# Update application
cd /var/www/bi.geniusmile.com
git pull
npm install
npm run build
pm2 restart geniusmile-bi

# View logs
pm2 logs geniusmile-bi

# Monitor
pm2 monit
```
