# 🚀 SaaS Cost Optimization System (ML + Full Stack)

## 📌 Problem
Organizations overspend on SaaS tools due to inactive or underutilized users. Identifying such inefficiencies manually is difficult and leads to unnecessary subscription costs.

---

## 💡 Solution
Built a full-stack SaaS cost optimization system that uses Machine Learning to analyze user activity and generate actionable recommendations such as removing unused licenses or downgrading plans.

---

## ⚙️ Key Features
- 🔍 Classifies users into **Active, Low Usage, and Inactive**
- 💰 Suggests **cost-saving actions**:
  - Remove License
  - Downgrade Plan
  - Keep Active Users
- ⚡ Supports **batch analysis of multiple users**
- 📊 Interactive **analytics dashboard**
- 🔥 Identifies **Top Wasteful Users**
- 📈 Provides **Tool-wise cost analysis (Slack, Zoom, Notion)**
- ⚠️ Includes **Alert system for potential financial loss**

---

## 🧰 Tech Stack

### Frontend
- React.js
- Axios
- Recharts

### Backend
- Node.js
- Express.js

### Machine Learning
- Python
- Scikit-learn
- Pandas / NumPy
- Joblib

### API Layer
- Flask

### Database
- MongoDB Atlas

---

### Core APIs
- `POST /analyze` → Analyze single user  
- `POST /analyze-batch` → Analyze multiple users  

### Analytics APIs
- `GET /analytics/summary`
- `GET /analytics/categories`
- `GET /analytics/recommendations`
- `GET /analytics/recent`
- `GET /analytics/top-waste`
- `GET /analytics/tool-wise`
- `GET /analytics/alerts`

---

## 📸 Screenshots

> Add your screenshots here after uploading images to a `screenshots/` folder

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Charts
![Charts](./screenshots/charts.png)

### Top Wasteful Users
![Top Users](./screenshots/top-users.png)

---

## 🚀 How to Run Locally

### 1. Clone Repository
```bash
git clone https://github.com/your-username/saas-cost-optimizer.git
cd saas-cost-optimizer
