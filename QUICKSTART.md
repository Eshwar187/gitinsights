# GitInsights - Quick Deployment (No Docker)

## 1. Install Dependencies

```bash
# Install PM2 globally
npm install -g pm2

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm ci --only=production
cd ..
```

## 2. Configure Environment

**Create `backend/.env.production`:**
```bash
cp backend/.env.example backend/.env.production
# Edit with production values
```

**Create `.env.production`:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

## 3. Build Frontend

```bash
npm run build
```

Outputs to: `dist/`

## 4. Start Backend

```bash
cd backend
pm2 start server.js --name gitinsights -i max
pm2 save
pm2 startup
```

## 5. Serve Frontend

### Option A: Nginx
```bash
sudo cp dist/* /var/www/html/
```

### Option B: PM2 with serve
```bash
npm install -g serve
pm2 serve dist 3000 --name gitinsights-frontend --spa
pm2 save
```

## 6. Setup SSL (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Done! ✅

- Frontend: `http://yourdomain.com`
- Backend: `http://yourdomain.com:5000`

### Common Commands

```bash
# View logs
pm2 logs

# Restart
pm2 restart all

# Status
pm2 status

# Monitor
pm2 monit
```
