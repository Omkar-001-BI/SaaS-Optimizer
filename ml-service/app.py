from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load model
model_path = os.path.join(os.path.dirname(__file__), "saas_model.pkl")
encoder_path = os.path.join(os.path.dirname(__file__), "label_encoder.pkl")

try:
    model = joblib.load(model_path)
    le = joblib.load(encoder_path)
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    raise

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Input features
    features = np.array([[
        data["last_login_days"],
        data["weekly_usage_hours"],
        data["login_count_week"],
        data["actions_performed"]
    ]])

    # Prediction
    pred = model.predict(features)
    category = pred[0]

    # Recommendation logic
    if data["cost_per_user"] == 0:
        recommendation = "Ignore (Free Plan)"
        savings = 0
    elif category == "Inactive":
        recommendation = "Remove License"
        savings = data["cost_per_user"]
    elif category == "Low Usage" and data["plan_type"] == "Premium":
        recommendation = "Downgrade Plan"
        savings = data["cost_per_user"] * 0.5
    else:
        recommendation = "Keep"
        savings = 0

    return jsonify({
        "usage_category": category,
        "recommendation": recommendation,
        "estimated_savings": savings
    })

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "service": "ml-service",
        "status": "running",
        "health_endpoint": "/health",
        "predict_endpoint": "/predict"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "ml-service"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)