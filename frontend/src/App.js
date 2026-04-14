import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function App() {
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [topWaste, setTopWaste] = useState([]);
  const [toolData, setToolData] = useState([]);
  const [alerts, setAlerts] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const summaryRes = await axios.get(`${API_URL}/analytics/summary`);
      const categoryRes = await axios.get(`${API_URL}/analytics/categories`);
      const recommendationRes = await axios.get(`${API_URL}/analytics/recommendations`);
      const recentRes = await axios.get(`${API_URL}/analytics/recent`);
      const topWasteRes = await axios.get(`${API_URL}/analytics/top-waste`);
      const toolRes = await axios.get(`${API_URL}/analytics/tool-wise`);
      const alertRes = await axios.get(`${API_URL}/analytics/alerts`);

      setAlerts(alertRes.data || {});
      setToolData(toolRes.data.data || []);
      setSummary(summaryRes.data || {});
      setCategories(categoryRes.data.data || []);
      setRecommendations(recommendationRes.data.data || []);
      setRecent(recentRes.data.data || []);
      setTopWaste(topWasteRes.data.data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    }
  };

  const pieColors = ["#8884d8", "#82ca9d", "#ff7f7f", "#ffc658"];

  return (
    <div className="container">
      <h1>SaaS Cost Optimization Dashboard</h1>

      {alerts.inactiveUsers > 0 && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid red"
          }}
        >
          <h3>⚠️ Alert</h3>
          <p>{alerts.inactiveUsers} inactive users detected</p>
          <p>Potential monthly loss: ₹ {alerts.totalLoss || 0}</p>
        </div>
      )}

      <div className="cards">
        <div className="card">
          <h3>Total Analyses</h3>
          <p>{summary.totalAnalyses || 0}</p>
        </div>
        <div className="card">
          <h3>Total Savings</h3>
          <p>₹ {summary.totalSavings || 0}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h2>Usage Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Recommendation Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recommendations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-section">
        <h2>Recent Analyses</h2>
        <table>
          <thead>
            <tr>
              <th>Usage Category</th>
              <th>Recommendation</th>
              <th>Estimated Savings</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item, index) => (
              <tr key={index}>
                <td>{item.output?.usage_category}</td>
                <td>{item.output?.recommendation}</td>
                <td>₹ {item.output?.estimated_savings}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h2>Top Wasteful Users</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Tool</th>
              <th>Usage Category</th>
              <th>Recommendation</th>
              <th>Estimated Savings</th>
            </tr>
          </thead>
          <tbody>
            {topWaste.map((item, index) => (
              <tr key={index}>
                <td>{item.input?.user_id}</td>
                <td>{item.input?.tool_name}</td>
                <td>{item.output?.usage_category}</td>
                <td>{item.output?.recommendation}</td>
                <td>₹ {item.output?.estimated_savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h2>Tool-wise Waste Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Total Savings</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {toolData.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>₹ {item.totalSavings}</td>
                <td>{item.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;