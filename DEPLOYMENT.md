# SaaS Cost Optimization - Railway Deployment

## 🚀 Deployment Strategy: Railway (All-in-One)

Railway is a modern cloud platform that handles multiple services (frontend, backend, ML service) in a single unified project with built-in CI/CD, environment management, and monitoring.

### **Prerequisites**
1. Railway account: https://railway.app
2. GitHub repository connected
3. Dockerfile and docker-compose.yml configured
4. MongoDB Atlas cluster created with connection string

### **Step 1: Create Railway Project**
1. Go to https://railway.app/dashboard
2. Click "Create" → "New Project"
3. Select "Deploy from GitHub repo"
4. Connect and select your repository
5. Railway auto-detects the Dockerfile

### **Step 2: Deploy ML Service** (Python/Flask)
1. In Railway dashboard, click "Add Service"
2. Select "GitHub Repo" and choose this repository
3. Railway Plugin Settings:
   - **Root Directory**: `/`
   - **Dockerfile Path**: `Dockerfile`
   - **Target**: `ml-service`
   - **Service Name**: `ml-service`
4. Environment Variables (set via Railway dashboard):
   ```
   FLASK_ENV=production
   PORT=5000
   ```
5. Deploy

### **Step 3: Deploy Backend** (Node.js/Express)
1. Click "Add Service" → "GitHub Repo"
2. Configuration:
   - **Root Directory**: `/`
   - **Dockerfile Target**: `backend`
   - **Service Name**: `backend`
3. Environment Variables (set via Railway dashboard - DO NOT hardcode):
   ```
   NODE_ENV=production
   ML_SERVICE_URL=http://ml-service:5000
   MONGODB_URI=<Your MongoDB connection string>
   PORT=3000
   ```
   ⚠️ **IMPORTANT**: Never commit MONGODB_URI to code. Use Railway environment variables only.
4. Deploy

### **Step 4: Deploy Frontend** (React)
1. Click "Add Service" → "GitHub Repo"
2. Configuration:
   - **Root Directory**: `/`
   - **Dockerfile Target**: `frontend`
   - **Service Name**: `frontend`
3. Environment Variables:
   ```
   REACT_APP_API_URL=http://backend:3000
   PORT=3001
   NODE_ENV=production
   ```
4. Deploy

## 🎯 Final Architecture

```
Frontend (Railway) → Backend (Railway) → ML Service (Railway) → MongoDB Atlas
```

All services communicate on Railway's internal network with automatic service discovery.

## 🔧 Railway Service Communication

**Internal URLs (between services):**
- `http://ml-service:5000` (from backend to ML service)
- `http://backend:3000` (from frontend to backend)

**Public URLs:**
- Frontend: `https://<railway-project>-frontend.up.railway.app`
- Backend: `https://<railway-project>-backend.up.railway.app`
- ML Service: `https://<railway-project>-ml-service.up.railway.app`

## ✅ Post-Deployment Checklist

- [ ] All three services deployed on Railway
- [ ] Frontend loads and displays correctly
- [ ] ML service responds to `/health` endpoint
- [ ] Backend connects to ML service via internal network
- [ ] Frontend environment variable points to backend internal URL
- [ ] User analysis works end-to-end
- [ ] Monitor service logs in Railway dashboard
- [ ] Verify MongoDB connection is working
- [ ] Check all services are healthy

## 🔍 Monitoring & Logs

Railway provides built-in monitoring:
- Real-time logs for each service
- CPU/Memory usage metrics
- Deployment history
- Auto-rollback on failure

View logs: Click on service → "Logs" tab

## 🚀 Quick Deploy Order:

1. ML Service (no dependencies)
2. Backend (depends on ML Service)
3. Frontend (depends on Backend)

## ⚠️ Security Notes

- **Never commit** `.env` files or credentials
- **Never hardcode** MONGODB_URI
- Use Railway's environment variable management
- Keep secrets in a `.env` file locally (add to .gitignore)
- For local development, copy secrets to `.env` from Railway dashboard
1. **ML Service** (foundation)
2. **Backend** (depends on ML)
3. **Frontend** (depends on backend)

## 📝 Notes for Railway

- Railway automatically detects changes in your GitHub repo and redeploys
- Private networking between services is automatic
- Each service gets its own public URL
- Environment variables are managed in Railway dashboard
- Use `${{ services.SERVICE_NAME.public_url }}` for cross-service references