import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def train_maintenance_model(df):
    """
    Trains a Random Forest Classifier to predict maintenance needs.
    
    Args:
        df (pd.DataFrame): Preprocessed DataFrame.
        
    Returns:
        model: Trained model.
        metrics (dict): Dictionary of evaluation metrics.
    """
    print("\n--- Training Predictive Maintenance Model ---")
    
    # Select Features
    # We want to predict 'needs_maintenance'
    # Features: mileage, vehicle_age, fuel_efficiency, battery_health, engine_health, avg_speed, avg_accel
    # Note: We should exclude columns that are direct indicators of the target if they were used to derive it (like 'maintenance_events' text),
    # but we used those to CREATE the target. Ideally we want to predict based on telemetry.
    
    features = ['mileage', 'vehicle_age', 'fuel_efficiency', 'battery_health', 'engine_health', 'avg_speed', 'avg_accel', 'odometer_reading']
    target = 'needs_maintenance'
    
    X = df[features]
    y = df[target]
    
    # Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Model
    # Using Random Forest as it handles non-linear relationships well and gives feature importance
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    
    print(f"Model Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature Importance
    importances = clf.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    print("\nFeature Ranking:")
    feature_ranking = []
    for f in range(X.shape[1]):
        print(f"{f + 1}. {features[indices[f]]} ({importances[indices[f]]:.4f})")
        feature_ranking.append((features[indices[f]], importances[indices[f]]))
        
    # --- NUEVO: Guardar el modelo ---
    print("\nGuardando modelo en 'maintenance_model.pkl'...")
    import joblib
    joblib.dump(clf, 'maintenance_model.pkl')
    print("Modelo guardado exitosamente.")
    
    return clf, {'accuracy': accuracy, 'report': report, 'feature_ranking': feature_ranking}

if __name__ == "__main__":
    # Test run
    import sys
    import os
    from data_loader import load_and_preprocess_data
    
    # Assuming script is run from src/ or root
    possible_paths = [
        "../67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv",
        "67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv"
    ]
    
    file_path = None
    for p in possible_paths:
        if os.path.exists(p):
            file_path = p
            break
            
    if file_path:
        df = load_and_preprocess_data(file_path)
        train_maintenance_model(df)
    else:
        print("CSV file not found for testing.")
