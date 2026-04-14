from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model
model = joblib.load("saas_model.pkl")
le = joblib.load("label_encoder.pkl")

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

if __name__ == "__main__":
    app.run(debug=True)