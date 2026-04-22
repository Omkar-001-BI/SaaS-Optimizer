# Multi-stage Dockerfile for SaaS Cost Optimization

# Stage 1: Python ML Service
FROM python:3.11-slim as ml-service

WORKDIR /app
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ml-service/app.py ml-service/train_model.py ml-service/saas_model.pkl ml-service/label_encoder.pkl ./

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "60", "app:app"]

# Stage 2: Node.js Backend
FROM node:18-alpine as backend

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/server.js ./

EXPOSE 3000
CMD ["node", "server.js"]

# Stage 3: React Frontend Build
FROM node:18-alpine as frontend-build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build

# Stage 4: React Frontend Serve
FROM node:18-alpine as frontend

WORKDIR /app
RUN npm install -g serve
COPY --from=frontend-build /app/build ./build

EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]