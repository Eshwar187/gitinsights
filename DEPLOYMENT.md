# GitInsights - Production Deployment Guide (No Docker)

## Prerequisites

- Node.js 20+
- PM2 (Process Manager)
- Nginx or Apache
- Supabase account
- GitHub OAuth App
- Razorpay account
- Hugging Face API key
- Domain with SSL certificate

---

## Quick Start

### 1. Install PM2 Globally
```bash
npm install -g pm2
```

### 2. Setup Environment Variables

**Frontend (.env.production)**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_ENV=production
```

**Backend (.env.production)**
Copy `backend/.env.production.example` and fill in all production values.

### 3. Run Database Migrations
Execute SQL files 001-016 in Supabase SQL Editor (in order).

### 4. Build Frontend
```bash
npm install
npm run build
```
Output: `dist/` directory

### 5. Deploy Backend
```bash
cd backend
npm ci --only=production
pm2 start ecosystem.config.json --env production
pm2 save
pm2 startup
```

### 6. Configure Web Server (Nginx)

**For Frontend** (`/etc/nginx/sites-available/gitinsights`)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gitinsights/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# SSL (use certbot to add HTTPS)
```

**For Backend API** (`/etc/nginx/sites-available/gitinsights-api`)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/gitinsights /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/gitinsights-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## PM2 Commands

### Start Application
```bash
pm2 start ecosystem.config.json --env production
```

### View Status
```bash
pm2 status
pm2 list
```

### View Logs
```bash
pm2 logs gitinsights
pm2 logs --lines 100
```

### Restart
```bash
pm2 restart gitinsights
pm2 reload gitinsights  # Zero-downtime restart
```

### Stop
```bash
pm2 stop gitinsights
pm2 delete gitinsights
```

### Monitor
```bash
pm2 monit
```

---

## Deployment Steps (Production)

### First Time Deployment

1. **Upload Code to Server**
```bash
# From local machine
git clone https://github.com/yourusername/gitinsights.git
ssh user@yourserver "cd /var/www && git clone <repo-url>"
```

2. **Build Frontend on Server**
```bash
cd /var/www/gitinsights
npm install
npm run build
```

3. **Deploy Backend**
```bash
cd /var/www/gitinsights/backend
npm ci --only=production
cp .env.example .env.production
# Edit .env.production with production values
pm2 start ecosystem.config.json --env production
pm2 save
```

4. **Configure Nginx**
- Copy nginx configs above
- Enable sites
- Test: `sudo nginx -t`
- Restart: `sudo systemctl restart nginx`

5. **Setup SSL**
```bash
sudo certbot --nginx
```

### Update Deployment

```bash
cd /var/www/gitinsights

# Pull latest code
git pull origin main

# Update frontend
npm install
npm run build

# Update backend
cd backend
npm ci --only=production
pm2 restart gitinsights
```

---

## Health Check

Backend exposes `/health` endpoint:
```bash
curl https://api.yourdomain.com/health
```

Expected:
```json
{
  "success": true,
  "message": "GitInsights API is running",
  "timestamp": "..."
}
```

---

## Monitoring

### PM2 Plus (Optional)
```bash
pm2 plus
# Follow setup instructions for monitoring dashboard
```

### Logs
```bash
# View logs
pm2 logs

# Log files location
~/.pm2/logs/
```

---

## Backup Strategy

### Database
Supabase provides automated backups. For manual:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Code
- Git repository
- Server snapshots (DigitalOcean, AWS, etc.)

---

## Scaling

### Multiple Backend Instances
```bash
# ecosystem.config.json already configured for clustering
pm2 start ecosystem.config.json --env production
# Will start max instances based on CPU cores
```

### Load Balancer (Nginx)
```nginx
upstream backend {
    least_conn;
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

---

## Troubleshooting

### Backend Won't Start
```bash
pm2 logs gitinsights --err
# Check environment variables
cat ecosystem.config.json
```

### Frontend 404s
- Ensure nginx SPA fallback configured
- Check `dist/` directory exists
- Verify nginx config: `sudo nginx -t`

### Database Connection Issues
- Check `.env.production` values
- Test Supabase connection manually
- Verify firewall allows outbound connections

### SSL Not Working
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---

## Security Checklist

- [x] HTTPS enabled
- [x] Strong JWT secrets (32+ chars)
- [x] Firewall configured (ports 80, 443, 22)
- [x] SSH key-based auth only
- [x] Regular security updates
- [x] Rate limiting enabled
- [x] Database RLS enabled

---

## Performance Tips

1. **Enable Gzip** - Already in nginx config
2. **CDN** - Use Cloudflare (free tier)
3. **Caching** - Redis for API responses
4. **Database** - Supabase handles automatically
5. **PM2 Clustering** - Max instances for CPU cores

---

## Quick Reference

### Frontend Build
```bash
npm run build
```

### Backend Start
```bash
cd backend
pm2 start ecosystem.config.json
pm2 save
```

### Update App
```bash
git pull
npm run build
cd backend && npm ci --only=production
pm2 restart gitinsights
```

### View Logs
```bash
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

---

## Cost-Effective Hosting

### Recommended Providers
- **DigitalOcean** - $6/month droplet
- **Linode** - $5/month shared CPU
- **Hetzner** - €4/month cloud server
- **Vultr** - $6/month compute

### Frontend Only (Static Hosting)
- **Vercel** - Free tier
- **Netlify** - Free tier
- **Cloudflare Pages** - Free tier

---

## Support

For production issues:
1. Check PM2 logs: `pm2 logs`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables
4. Test database connection
5. Check health endpoint

---

**You're ready to deploy without Docker!** 🚀
