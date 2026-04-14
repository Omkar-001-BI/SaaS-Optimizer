# SaaS Cost Optimization - Deployment Guide

## 🚀 Recommended Deployment Strategy

### Option 1: Railway + Render (Hybrid - Recommended)

**Why this approach?**
- Railway: Excellent for Node.js backend
- Render: Better for Python ML services (free tier)
- Vercel: Perfect for React frontend

#### Step 1: Deploy ML Service on Render
1. Go to https://render.com
2. Create account → Connect GitHub
3. Click "New +" → "Web Service"
4. Connect `Omkar-001-BI/SaaS-Optimizer` repo
5. Configure:
   - **Name**: `saas-ml-service`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
6. Add environment variable: `FLASK_ENV=production`
7. Deploy → Get the service URL (e.g., `https://saas-ml-service.onrender.com`)

#### Step 2: Deploy Backend on Railway
1. Go to https://railway.app
2. Create account → Connect GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select `Omkar-001-BI/SaaS-Optimizer`
5. Railway auto-detects `railway.json`
6. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://odhakne542_db_user:admin@cluster0.j8kynso.mongodb.net/?appName=Cluster0
   ML_SERVICE_URL=https://saas-ml-service.onrender.com
   NODE_ENV=production
   ```
7. Deploy → Get backend URL

#### Step 3: Deploy Frontend on Vercel
1. Go to https://vercel.com
2. Connect GitHub → Import `Omkar-001-BI/SaaS-Optimizer`
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```
5. Deploy

### Option 2: All on Railway (Alternative)

If you prefer single platform:

1. Deploy backend first (Railway detects `railway.json`)
2. Create separate Railway project for ML service
3. Create separate Railway project for frontend
4. Update environment variables accordingly

### Option 3: Docker Deployment

```bash
# Build and run locally
docker-compose up --build

# Or deploy to any container platform
docker build -f Dockerfile.backend -t backend .
docker build -f Dockerfile.ml -t ml-service .
docker build -f Dockerfile.frontend -t frontend .
```

## 🔧 Environment Variables Required

```
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
ML_SERVICE_URL=https://your-ml-service-url.com
NODE_ENV=production

# Frontend
REACT_APP_API_URL=https://your-backend-url.com

# ML Service
FLASK_ENV=production
```

## ✅ Post-Deployment Checklist

- [ ] ML service responds to `/predict` endpoint
- [ ] Backend connects to MongoDB
- [ ] Frontend loads and shows data
- [ ] User analysis works end-to-end
- [ ] Analytics dashboard displays properly

## 🔍 Troubleshooting

**Build fails?**
- Check logs in deployment platform
- Ensure all dependencies are in requirements.txt/package.json
- Verify environment variables are set

**Services can't communicate?**
- Check CORS settings
- Verify service URLs in environment variables
- Ensure services are running and accessible

**Database connection issues?**
- Add deployment IP to MongoDB whitelist
- Verify connection string format