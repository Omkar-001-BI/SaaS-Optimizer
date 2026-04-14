# Multi-stage Dockerfile for SaaS Cost Optimization

# Stage 1: Python ML Service
FROM python:3.11-slim as ml-service

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py train_model.py saas_model.pkl label_encoder.pkl ./

EXPOSE 5000
CMD ["python", "app.py"]

# Stage 2: Node.js Backend
FROM node:18-alpine as backend

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

EXPOSE 3000
CMD ["npm", "start"]

# Stage 3: React Frontend
FROM node:18-alpine as frontend

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --omit=dev
COPY frontend/ ./
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]