# SaaS Cost Optimization - Render Deployment

## Option 1: Deploy to Render (Recommended)

### 1. Create Render Account
Go to https://render.com and sign up.

### 2. Create Services

#### ML Service (Python)
- **Service Type**: Web Service
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Environment Variables**:
  - `FLASK_ENV=production`

#### Backend Service (Node.js)
- **Service Type**: Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `ML_SERVICE_URL=https://your-ml-service.onrender.com`
  - `MONGODB_URI=your-mongodb-connection-string`

#### Frontend (React)
- **Service Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variables**:
  - `REACT_APP_API_URL=https://your-backend-service.onrender.com`

### 3. Database
- Use MongoDB Atlas (already configured)
- Add your Render service IPs to MongoDB whitelist

## Option 2: Deploy to Railway

### 1. Create Railway Account
Go to https://railway.app and sign up.

### 2. Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy
railway init
railway up
```

## Option 3: Local Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Environment Variables Required

Create a `.env` file with:
```
MONGODB_URI=your-mongodb-connection-string
ML_SERVICE_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:3000
```

## Post-Deployment Checklist

- [ ] Update MongoDB whitelist with deployment IPs
- [ ] Test all API endpoints
- [ ] Verify ML model predictions
- [ ] Check frontend data loading
- [ ] Test user analysis functionality