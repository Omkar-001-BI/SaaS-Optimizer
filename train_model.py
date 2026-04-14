import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Dummy data
np.random.seed(42)
n_samples = 1000

features = np.random.rand(n_samples, 4) * [365, 168, 100, 1000]  # Scale to realistic ranges
labels = np.random.choice(['Active', 'Low Usage', 'Inactive'], n_samples)

# Ensure all classes are present
unique_labels = np.unique(labels)
print("Unique labels in training:", unique_labels)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(features, labels)

# Label encoder
le = LabelEncoder()
le.fit(['Active', 'Low Usage', 'Inactive'])  # Explicitly fit all possible classes

# Save models
joblib.dump(model, 'saas_model.pkl')
joblib.dump(le, 'label_encoder.pkl')

print("Models saved successfully")