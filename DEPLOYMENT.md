# SaaS Cost Optimization - Vercel + Render Deployment

## 🚀 Deployment Strategy: Vercel + Render

### **Step 1: Deploy Frontend on Vercel** (React App)
1. Go to https://vercel.com
2. Connect your GitHub account
3. Click "Import Project" → Select `Omkar-001-BI/SaaS-Optimizer`
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
6. Click "Deploy" → Get your frontend URL

### **Step 2: Deploy ML Service on Render** (Python/Flask)
1. Go to https://render.com
2. Connect GitHub → Select `Omkar-001-BI/SaaS-Optimizer`
3. Click "New +" → "Web Service"
4. Configure:
   - **Name**: `saas-ml-service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: `FLASK_ENV=production`
5. Deploy → Get ML service URL (e.g., `https://saas-ml-service.onrender.com`)

### **Step 3: Deploy Backend on Render** (Node.js/Express)
1. In Render dashboard, click "New +" → "Web Service"
2. Select the same repository
3. Configure:
   - **Name**: `saas-backend`
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set environment variables:
   ```
   NODE_ENV=production
   ML_SERVICE_URL=https://saas-ml-service.onrender.com
   MONGODB_URI=mongodb+srv://odhakne542_db_user:admin@cluster0.j8kynso.mongodb.net/?appName=Cluster0
   ```
5. Deploy → Get backend URL

### **Step 4: Update Frontend Environment**
1. Go back to Vercel dashboard
2. Update the `REACT_APP_API_URL` environment variable with your Render backend URL
3. Redeploy the frontend

## 🎯 Final Architecture

```
Frontend (Vercel) → Backend (Render) → ML Service (Render) → MongoDB Atlas
```

## ✅ Post-Deployment Checklist

- [ ] Frontend loads on Vercel
- [ ] ML service responds to `/predict` on Render
- [ ] Backend connects to ML service and MongoDB
- [ ] Frontend can communicate with backend
- [ ] User analysis works end-to-end

## 🔧 Environment Variables Summary

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

**Backend (Render):**
```
NODE_ENV=production
ML_SERVICE_URL=https://your-ml-service.onrender.com
MONGODB_URI=mongodb+srv://odhakne542_db_user:admin@cluster0.j8kynso.mongodb.net/?appName=Cluster0
```

**ML Service (Render):**
```
FLASK_ENV=production
```

## 🚀 Quick Deploy Order:
1. **ML Service** (foundation)
2. **Backend** (depends on ML)
3. **Frontend** (depends on backend)