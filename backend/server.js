const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://odhakne542_db_user:admin@cluster0.j8kynso.mongodb.net/?appName=Cluster0";
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

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

// Health check
app.get("/", (req, res) => {
  res.send("Node Backend Running");
});

// Single analysis
app.post("/analyze", async (req, res) => {
  try {
    const userData = req.body;
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

    const response = await axios.post(`${mlServiceUrl}/predict`, userData);

    const result = {
      input: userData,
      output: response.data
    };

    await UserAnalysis.create(result);

    res.json({
      success: true,
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
    const users = req.body.users;
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message: "users should be an array"
      });
    }

    const results = [];

    for (const user of users) {
      const response = await axios.post(`${mlServiceUrl}/predict`, user);

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

app.get("/analytics/summary", async (req, res) => {
  try {
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
    const inactiveUsers = await UserAnalysis.countDocuments({
      "output.usage_category": "Inactive"
    });

    const savingsResult = await UserAnalysis.aggregate([
      {
        $match: { "output.usage_category": "Inactive" }
      },
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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});