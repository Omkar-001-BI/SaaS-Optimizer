#!/bin/bash

# SaaS Cost Optimization Deployment Script

echo "🚀 Starting deployment process..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "Please login to Railway:"
railway login

# Create new project
echo "Creating Railway project..."
railway init saas-cost-optimizer

# Deploy services
echo "Deploying ML Service..."
railway up --service ml-service

echo "Deploying Backend..."
railway up --service backend

echo "Deploying Frontend..."
railway up --service frontend

# Set environment variables
echo "Setting environment variables..."
railway variables set MONGODB_URI="your-mongodb-connection-string"
railway variables set NODE_ENV="production"

echo "🎉 Deployment complete!"
echo "Your app will be available at the URLs shown above."