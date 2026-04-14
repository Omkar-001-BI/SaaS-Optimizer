# SaaS Cost Optimization ML Dashboard

A full-stack machine learning application for optimizing SaaS subscription costs through intelligent user analysis and recommendations.

## 🚀 Features

- **ML-Powered Analysis**: Predicts user usage categories and provides cost-saving recommendations
- **Real-time Dashboard**: Interactive charts showing usage patterns and savings potential
- **Batch Processing**: Analyze multiple users simultaneously
- **MongoDB Integration**: Persistent storage of analysis results
- **Modern UI**: React-based frontend with data visualization

## 🏗️ Architecture

- **Frontend**: React.js with Recharts for data visualization
- **Backend**: Node.js Express API server
- **ML Engine**: Python Flask server with scikit-learn models
- **Database**: MongoDB Atlas for data persistence

## 📋 Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB Atlas account
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/saas-cost-optimization.git
cd saas-cost-optimization
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Python ML Environment
```bash
# Install Python dependencies
pip install flask joblib numpy scikit-learn

# Train the model (optional - pre-trained models included)
python train_model.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. MongoDB Configuration
- Create a MongoDB Atlas cluster
- Update the connection string in `backend/server.js`
- Add your IP to the MongoDB whitelist

## 🚀 Running the Application

### Start All Services
```bash
# Terminal 1: Python ML Server
python app.py

# Terminal 2: Node.js Backend
cd backend
npm start

# Terminal 3: React Frontend
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **ML Engine**: http://localhost:5000

## 📊 API Endpoints

### Analysis Endpoints
- `POST /analyze` - Single user analysis
- `POST /analyze-batch` - Batch user analysis

### Analytics Endpoints
- `GET /analytics/summary` - Total analyses and savings
- `GET /analytics/categories` - Usage category breakdown
- `GET /analytics/recommendations` - Recommendation statistics
- `GET /analytics/recent` - Recent analyses
- `GET /analytics/top-waste` - Highest cost-saving opportunities

## 🤖 ML Model

The system uses a Random Forest classifier trained on user behavior data to categorize usage patterns:

- **Features**: Login frequency, usage hours, actions performed, plan type, cost
- **Categories**: Active, Low Usage, Inactive
- **Recommendations**: Keep, Downgrade, Remove license

## 📈 Sample Usage

```javascript
// Single analysis
const response = await fetch('http://localhost:3000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    last_login_days: 10,
    weekly_usage_hours: 5,
    login_count_week: 3,
    actions_performed: 20,
    plan_type: "Premium",
    cost_per_user: 50
  })
});
```

## 🔧 Development

### Training New Models
```bash
python train_model.py
```

### Adding New Features
- Update the ML model in `app.py`
- Add new API endpoints in `backend/server.js`
- Update frontend components in `frontend/src/`

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue.