# 🚀 Deployment Guide - QA Project Application

This guide provides step-by-step instructions for deploying the QA Project Application in various environments.

## 📋 Table of Contents
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Windows Deployment](#windows-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## 🏠 Local Development

### Quick Start (Recommended)
```bash
# 1. Clone and setup
git clone https://github.com/msr-theksquaregroup/QA-project-app.git
cd QA-project-app

# 2. Backend setup
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# 3. Frontend setup
cd frontend
npm install
echo "VITE_API_BASE=http://localhost:8000" > .env
echo "VITE_AGENT_API_BASE=http://localhost:8001" >> .env
cd ..

# 4. Run all services (3 terminals needed)
# Terminal 1 - Backend API
source .venv/bin/activate && cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Agent Service  
source .venv/bin/activate && python agent_service.py

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### Verification
- Backend API: http://localhost:8000/docs
- Agent Service: http://localhost:8001/docs
- Frontend: http://localhost:5173

## 🌐 Production Deployment

### Prerequisites
- **Server**: Ubuntu 20.04+ or CentOS 8+
- **Python**: 3.12+
- **Node.js**: 18+
- **Nginx**: For reverse proxy
- **PM2**: For process management

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.12
sudo apt install python3.12 python3.12-venv python3.12-dev -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/msr-theksquaregroup/QA-project-app.git
sudo chown -R $USER:$USER QA-project-app
cd QA-project-app

# Backend setup
python3.12 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# Frontend build
cd frontend
npm install
npm run build
cd ..
```

### 3. Environment Configuration
```bash
# Create production environment file
cat > .env << EOF
# Production Environment
NODE_ENV=production
GROQ_API_KEY=your_production_groq_key_here
EOF

# Frontend environment
cat > frontend/.env << EOF
VITE_API_BASE=https://your-domain.com/api
VITE_AGENT_API_BASE=https://your-domain.com/agent-api
EOF
```

### 4. PM2 Process Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'qa-backend-api',
      script: '.venv/bin/python',
      args: '-m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000',
      cwd: '/var/www/QA-project-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'qa-agent-service',
      script: '.venv/bin/python',
      args: 'agent_service.py',
      cwd: '/var/www/QA-project-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start services with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nginx Configuration
```bash
# Create Nginx config
sudo cat > /etc/nginx/sites-available/qa-project << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/QA-project-app/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Agent Service
    location /agent-api/ {
        proxy_pass http://localhost:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws/ {
        proxy_pass http://localhost:8001/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/qa-project /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🪟 Windows Deployment

### Prerequisites
- **Windows 10/11** or **Windows Server 2019+**
- **Python 3.12+** from python.org
- **Node.js 18+** from nodejs.org
- **Git** for Windows

### Installation Steps
```powershell
# 1. Clone repository
git clone https://github.com/msr-theksquaregroup/QA-project-app.git
cd QA-project-app

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# 3. Install Python dependencies
python -m pip install --upgrade pip
pip install -r backend\requirements.txt

# 4. Frontend setup
cd frontend
npm install
echo VITE_API_BASE=http://localhost:8000 > .env
echo VITE_AGENT_API_BASE=http://localhost:8001 >> .env
cd ..

# 5. Create batch files for easy startup
```

**Create `start-backend.bat`:**
```batch
@echo off
call .venv\Scripts\activate
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
```

**Create `start-agent.bat`:**
```batch
@echo off
call .venv\Scripts\activate
python agent_service.py
pause
```

**Create `start-frontend.bat`:**
```batch
@echo off
cd frontend
npm run dev
pause
```

**Create `start-all.bat`:**
```batch
@echo off
start "Backend API" cmd /k start-backend.bat
timeout /t 3
start "Agent Service" cmd /k start-agent.bat
timeout /t 3
start "Frontend" cmd /k start-frontend.bat
echo All services started!
pause
```

## 🐳 Docker Deployment

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/runs:/app/runs
    restart: unless-stopped

  agent-service:
    build:
      context: .
      dockerfile: Dockerfile.agent
    ports:
      - "8001:8001"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ./agent_output:/app/agent_output
      - ./input_files:/app/input_files
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_BASE=http://localhost:8000
      - VITE_AGENT_API_BASE=http://localhost:8001
    depends_on:
      - backend-api
      - agent-service
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend-api
      - agent-service
    restart: unless-stopped
```

### Dockerfile Examples

**Backend Dockerfile (`backend/Dockerfile`):**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile (`frontend/Dockerfile`):**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Environment Variables

### Required Variables
```bash
# Frontend (.env)
VITE_API_BASE=http://localhost:8000
VITE_AGENT_API_BASE=http://localhost:8001

# Backend (optional)
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production  # for production
```

### Production Variables
```bash
# Additional production variables
DATABASE_URL=postgresql://user:pass@localhost/qadb
REDIS_URL=redis://localhost:6379
LOG_LEVEL=INFO
MAX_UPLOAD_SIZE=100MB
CORS_ORIGINS=https://your-domain.com
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
```bash
# Check what's using ports
netstat -tulpn | grep -E ':(8000|8001|5173)'
# Kill processes if needed
sudo kill -9 $(lsof -t -i:8000)
```

2. **Permission Issues**
```bash
# Fix file permissions
chmod +x start-backend.sh start-agent.sh
chown -R www-data:www-data /var/www/QA-project-app
```

3. **Python Path Issues**
```bash
# Ensure Python path is correct
which python3.12
/usr/bin/python3.12 --version
```

4. **Node.js Issues**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

1. **Backend Optimization**
```bash
# Use Gunicorn for production
pip install gunicorn
gunicorn backend.app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

2. **Frontend Optimization**
```bash
# Build with optimizations
npm run build
# Serve with compression
npm install -g serve
serve -s dist -l 5173
```

3. **System Optimization**
```bash
# Increase file limits
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf
```

## 📊 Monitoring

### Health Checks
```bash
# Create health check script
cat > health-check.sh << EOF
#!/bin/bash
curl -f http://localhost:8000/health || exit 1
curl -f http://localhost:8001/health || exit 1
curl -f http://localhost:5173 || exit 1
echo "All services healthy"
EOF

chmod +x health-check.sh
```

### Log Management
```bash
# Setup log rotation
sudo cat > /etc/logrotate.d/qa-project << EOF
/var/www/QA-project-app/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    postrotate
        pm2 reload all
    endscript
}
EOF
```

---

**🚀 Your QA Project Application is now ready for deployment!**

For additional support, check the main README.md or create an issue in the repository.
