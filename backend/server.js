require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ ENV VARIABLES
const isProduction = process.env.NODE_ENV === "production";
const ML_SERVICE_URL = process.env.ML_API_URL || process.env.ML_SERVICE_URL || (isProduction ? "" : "http://127.0.0.1:5000");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection with explicit diagnostics for cloud deploys.
if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Database features will be unavailable.");
} else {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  })
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err.message));
}

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function ensureDbConnection(res) {
  if (isDbConnected()) return true;

  return res.status(503).json({
    success: false,
    message: "Database not connected. Verify MONGODB_URI and MongoDB Atlas network access."
  });
}

function ensureMlConfig(res) {
  if (ML_SERVICE_URL) return true;

  return res.status(503).json({
    success: false,
    message: "ML service URL is not configured. Set ML_API_URL (or ML_SERVICE_URL) in backend environment variables."
  });
}

// Schema
const userAnalysisSchema = new mongoose.Schema({
  input: {
    user_id: Number,
    tool_name: String,
    last_login_days: Number,
    weekly_usage_hours: Number,
    login_count_week: Number,
    actions_performed: Number,
    plan_type: String,
    cost_per_user: Number
  },
  output: {
    usage_category: String,
    recommendation: String,
    estimated_savings: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserAnalysis = mongoose.model("UserAnalysis", userAnalysisSchema);

// Basic liveness check
app.get("/", (req, res) => {
  res.send("Node Backend Running");
});

// Readiness check for backend dependencies
app.get("/health", async (req, res) => {
  const dbConnected = isDbConnected();
  let mlConnected = false;

  if (ML_SERVICE_URL) {
    try {
      const mlHealth = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
      mlConnected = mlHealth.status >= 200 && mlHealth.status < 300;
    } catch (error) {
      mlConnected = false;
    }
  }

  const healthy = dbConnected && mlConnected;
  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    service: "backend",
    dbConnected,
    mlConnected
  });
});

// Single analysis
app.post("/analyze", async (req, res) => {
  try {
    if (!ensureMlConfig(res)) return;

    const dbReady = isDbConnected();
    const userData = req.body;

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, userData);

    const result = {
      input: userData,
      output: response.data
    };

    if (dbReady) {
      await UserAnalysis.create(result);
    }

    res.json({
      success: true,
      persisted: dbReady,
      message: dbReady ? "Analysis saved successfully" : "Analysis completed but database is not connected",
      data: result
    });
  } catch (error) {
    console.error("Analyze Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
});

// Batch analysis
app.post("/analyze-batch", async (req, res) => {
  try {
    if (!ensureMlConfig(res)) return;
    if (!ensureDbConnection(res)) return;

    const users = req.body.users;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message: "users should be an array"
      });
    }

    const results = [];

    for (const user of users) {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, user);

      const result = {
        input: user,
        output: response.data
      };

      await UserAnalysis.create(result);
      results.push(result);
    }

    res.json({
      success: true,
      total_users: results.length,
      results: results
    });
  } catch (error) {
    console.error("Batch Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
});

// Analytics APIs
app.get("/analytics/summary", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const totalAnalyses = await UserAnalysis.countDocuments();

    const savingsResult = await UserAnalysis.aggregate([
      {
        $group: {
          _id: null,
          totalSavings: { $sum: "$output.estimated_savings" }
        }
      }
    ]);

    const totalSavings = savingsResult.length > 0 ? savingsResult[0].totalSavings : 0;

    res.json({
      success: true,
      totalAnalyses,
      totalSavings
    });
  } catch (error) {
    console.error("Summary Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch summary analytics"
    });
  }
});

app.get("/analytics/categories", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const categoryStats = await UserAnalysis.aggregate([
      {
        $group: {
          _id: "$output.usage_category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error("Category Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category analytics"
    });
  }
});

app.get("/analytics/recommendations", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const recommendationStats = await UserAnalysis.aggregate([
      {
        $group: {
          _id: "$output.recommendation",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: recommendationStats
    });
  } catch (error) {
    console.error("Recommendation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation analytics"
    });
  }
});

app.get("/analytics/recent", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const recentData = await UserAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: recentData
    });
  } catch (error) {
    console.error("Recent Data Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent analyses"
    });
  }
});

app.get("/analytics/top-waste", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const topWaste = await UserAnalysis.find({
      "output.estimated_savings": { $gt: 0 }
    })
      .sort({ "output.estimated_savings": -1 })
      .limit(5);

    res.json({
      success: true,
      data: topWaste
    });
  } catch (error) {
    console.error("Top Waste Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top wasteful users"
    });
  }
});

app.get("/analytics/tool-wise", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const data = await UserAnalysis.aggregate([
      {
        $group: {
          _id: "$input.tool_name",
          totalSavings: { $sum: "$output.estimated_savings" },
          users: { $sum: 1 }
        }
      },
      {
        $sort: { totalSavings: -1 }
      }
    ]);

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Tool-wise Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tool-wise analytics"
    });
  }
});

app.get("/analytics/alerts", async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const inactiveUsers = await UserAnalysis.countDocuments({
      "output.usage_category": "Inactive"
    });

    const savingsResult = await UserAnalysis.aggregate([
      { $match: { "output.usage_category": "Inactive" } },
      {
        $group: {
          _id: null,
          totalLoss: { $sum: "$output.estimated_savings" }
        }
      }
    ]);

    const totalLoss = savingsResult.length > 0 ? savingsResult[0].totalLoss : 0;

    res.json({
      success: true,
      inactiveUsers,
      totalLoss
    });
  } catch (error) {
    console.error("Alert Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts"
    });
  }
});

// ✅ FIXED PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});