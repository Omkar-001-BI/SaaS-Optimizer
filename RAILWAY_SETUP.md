# Railway Deployment Guide

## Quick Start

This project is configured for deployment on Railway with three services: Frontend, Backend, and ML Service.

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Repository**: This project must be pushed to GitHub
3. **MongoDB Atlas**: Already configured (reference in backend env vars)

## Deployment Steps

### 1. Create a Railway Project

```bash
# If you have Railway CLI installed:
railway init

# Or via web:
# - Go to https://railway.app/dashboard
# - Click "Create" → "Deploy from GitHub repo"
# - Select this repository
```

### 2. Deploy Services in Order

#### **Step 1: Deploy ML Service**

```bash
railway service add
# Select: "GitHub"
# Configure:
# - Service Name: ml-service
# - Root Directory: ml-service
# - Environment: FLASK_ENV=production, PORT=5000
```

Or via Railway Dashboard:
- Click "Add Service" → Select your repo
- Set root directory to `ml-service`
- Add environment variables

#### **Step 2: Deploy Backend**

```bash
railway service add
# Select: "GitHub"
# Configure:
# - Service Name: backend
# - Root Directory: backend
# - Environment Variables:
```

Backend Environment Variables:
```
NODE_ENV=production
PORT=3000
ML_SERVICE_URL=http://ml-service:5000
MONGODB_URI=mongodb+srv://odhakne542_db_user:admin@cluster0.j8kynso.mongodb.net/?appName=Cluster0
```

#### **Step 3: Deploy Frontend**

```bash
railway service add
# Select: "GitHub"
# Configure:
# - Service Name: frontend
# - Root Directory: frontend
# - Build Command: npm run build
```

Frontend Environment Variables:
```
NODE_ENV=production
PORT=3000
REACT_APP_API_URL=${{ services.backend.public_url }}
```

### 3. Access Your Services

After deployment, Railway provides public URLs:

- **Frontend**: `https://<your-domain>-frontend-prod.up.railway.app`
- **Backend**: `https://<your-domain>-backend-prod.up.railway.app`
- **ML Service**: `https://<your-domain>-ml-service-prod.up.railway.app`

Internal service URLs (for inter-service communication):
- ML Service: `http://ml-service:5000`
- Backend: `http://backend:3000`

## Environment Variables Reference

### ML Service (`ml-service/`)
```
FLASK_ENV=production
PORT=5000
```

### Backend (`backend/`)
```
NODE_ENV=production
PORT=3000
ML_SERVICE_URL=http://ml-service:5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend (`frontend/`)
```
NODE_ENV=production
PORT=3000
REACT_APP_API_URL=https://backend-service-url.up.railway.app
```

## Monitoring & Debugging

### View Logs
```bash
railway logs ml-service
railway logs backend
railway logs frontend
```

### View Service Status
```bash
railway status
```

### Restart Services
```bash
railway restart ml-service
railway restart backend
railway restart frontend
```

## Using Railway CLI

Install Railway CLI:
```bash
npm install -g @railway/cli
# or
brew install railwayapp/railway/railway
```

### Common Commands

```bash
# Login
railway login

# Link to existing project
railway link

# Deploy
railway deploy

# View logs
railway logs

# Open dashboard
railway open

# List environments
railway environment list
```

## Troubleshooting

### Service won't start
- Check logs: `railway logs <service-name>`
- Verify environment variables are set correctly
- Check if port is specified (should be 5000 for ML, 3000 for backend/frontend)

### Frontend can't reach backend
- Verify `REACT_APP_API_URL` points to the correct backend public URL
- Check CORS settings in backend
- Ensure backend is fully deployed and running

### Backend can't reach ML service
- Use internal URL: `http://ml-service:5000`
- Check ML service logs for errors
- Verify ML service is deployed first

###502 Bad Gateway
- Service might still be starting, wait a moment
- Check deployment logs
- Verify build completed successfully

## Manual Deployment via GitHub

Railway automatically deploys when you push to your repository (if connected to GitHub).

To manually trigger:
```bash
git push
# Railway detects changes and redeploys automatically
```

## Scaling & Advanced

### Multiple Replicas
To scale a service to multiple replicas:
1. Go to Service Settings in Railway dashboard
2. Set "Number of Replicas"
3. Service automatically load-balances

### Custom Domain
1. In Railway dashboard, go to Service settings
2. Add custom domain
3. Update DNS records as instructed

### Database Integration
Railway provides PostgreSQL & MySQL integrations:
1. Click "Add Service" → "Database"
2. Auto-generates connection strings in environment variables

## Cost Considerations

Railway pricing:
- **Free tier**: $5/month credit
- Services billed per hour of usage
- Pay-as-you-go after free tier

Monitor usage: Dashboard → Organization → Usage

---

**Need help?** Visit https://docs.railway.app or https://railway.app/support
