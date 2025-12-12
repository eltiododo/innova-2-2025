import pandas as pd
import json
import numpy as np
from datetime import datetime

def parse_json_col(x):
    """Safely parses a JSON string or returns the original if not a string."""
    if isinstance(x, str):
        try:
            # Fix common JSON formatting issues if necessary (e.g., single quotes)
            return json.loads(x.replace("'", '"'))
        except json.JSONDecodeError:
            return {}
    return {}

def load_and_preprocess_data(filepath):
    """
    Loads the vehicle telemetry dataset and performs preprocessing.
    
    Args:
        filepath (str): Path to the CSV file.
        
    Returns:
        pd.DataFrame: Preprocessed DataFrame.
    """
    print(f"Loading data from {filepath}...")
    df = pd.read_csv(filepath)
    
    # Check if this is Fleet DNA data
    if 'vid' in df.columns and 'driving_average_speed' in df.columns:
        print("Detected Fleet DNA data format. Processing with synthetic feature generation...")
        return process_fleet_dna_data(df)
    
    # 1. Parse JSON columns
    json_cols = ['location', 'sensor_data', 'trip_summary', 'emission_data', 'fuel_level']
    # Note: emission_data and fuel_level seem to be floats in some rows but might be mixed or intended as JSON in others based on inspection.
    # Let's re-inspect the CSV sample. 
    # Looking at lines 2-5:
    # emission_data: empty, 60.5, 101.67... -> These look like floats.
    # fuel_level: empty, 49.06, 60.08... -> These look like floats.
    # location: "{'lat': ...}" -> JSON
    # sensor_data: "{'speed': ...}" -> JSON
    # trip_summary: "{'start': ...}" -> JSON
    
    real_json_cols = ['location', 'sensor_data', 'trip_summary']
    for col in real_json_cols:
        df[col] = df[col].apply(parse_json_col)
        
    # 2. Extract features from JSON
    # Location
    df['lat'] = df['location'].apply(lambda x: x.get('lat'))
    df['long'] = df['location'].apply(lambda x: x.get('long'))
    
    # Sensor Data
    df['avg_speed'] = df['sensor_data'].apply(lambda x: x.get('speed'))
    df['avg_accel'] = df['sensor_data'].apply(lambda x: x.get('accel'))
    
    # 3. Handle Missing Values
    # Fill numeric missing values with median
    numeric_cols = ['mileage', 'fuel_efficiency', 'battery_health', 'engine_health', 'odometer_reading', 'avg_speed', 'avg_accel']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
            
    # 4. Feature Engineering
    current_year = datetime.now().year
    df['vehicle_age'] = current_year - df['year']
    
    # Target Variable: Needs Maintenance
    # If 'maintenance_events' is not null OR 'diagnostic_codes' is not null -> 1, else 0
    # Also consider 'vehicle_status' != 'Running' ? No, 'Parked' is fine.
    # Let's stick to explicit maintenance indicators.
    
    df['has_maintenance_event'] = df['maintenance_events'].notna().astype(int)
    df['has_diagnostic_code'] = df['diagnostic_codes'].notna().astype(int)
    
    df['needs_maintenance'] = (df['has_maintenance_event'] | df['has_diagnostic_code']).astype(int)
    
    print(f"Data loaded. Shape: {df.shape}")
    print(f"Maintenance Rate: {df['needs_maintenance'].mean():.2%}")
    
    return df

def process_fleet_dna_data(df):
    """
    Processes Fleet DNA data and generates synthetic features/labels.
    """
    # Map existing columns
    # driving_average_speed is in mph usually, let's assume it maps to avg_speed
    df['avg_speed'] = df['driving_average_speed']
    
    # average_acceleration_ft_per_second_squared -> convert to m/s^2 (approx / 3.28) or keep as is.
    # The original data 'accel' unit isn't specified but 3.56 seems like m/s^2 or similar. 
    # ft/s^2 to m/s^2: * 0.3048. 
    # Let's just map it directly for now, the model will learn the scale.
    df['avg_accel'] = df['average_acceleration_ft_per_second_squared'] * 0.3048
    
    # Synthetic Feature Generation
    np.random.seed(42) # For reproducibility
    n = len(df)
    
    # Vehicle Age: Random between 2 and 15 years
    df['vehicle_age'] = np.random.randint(2, 16, size=n)
    
    # Mileage: Base on distance_total (which is likely short trip) + random base
    # distance_total seems to be in miles.
    # Let's simulate total odometer reading.
    df['odometer_reading'] = np.random.normal(50000, 20000, size=n) + (df['vehicle_age'] * 10000)
    df['mileage'] = df['odometer_reading'] # Using odometer as mileage
    
    # Battery Health: Correlated with age. 100 - (age * 3) +/- noise
    df['battery_health'] = 100 - (df['vehicle_age'] * 3) + np.random.normal(0, 5, size=n)
    df['battery_health'] = df['battery_health'].clip(0, 100)
    
    # Engine Health: Correlated with age and aggressive driving (accel)
    # Higher accel -> lower health
    accel_penalty = df['avg_accel'] * 5
    df['engine_health'] = 100 - (df['vehicle_age'] * 4) - accel_penalty + np.random.normal(0, 5, size=n)
    df['engine_health'] = df['engine_health'].clip(0, 100)
    
    # Fuel Efficiency: Random normal distribution
    df['fuel_efficiency'] = np.random.normal(25, 5, size=n)
    
    # Synthetic Label: Needs Maintenance
    # Logic: If engine_health < 60 OR battery_health < 60 OR mileage > 150000
    df['needs_maintenance'] = (
        (df['engine_health'] < 60) | 
        (df['battery_health'] < 60) | 
        (df['mileage'] > 150000)
    ).astype(int)
    
    # Select only necessary columns
    cols_to_keep = ['mileage', 'vehicle_age', 'fuel_efficiency', 'battery_health', 'engine_health', 'avg_speed', 'avg_accel', 'odometer_reading', 'needs_maintenance']
    df_processed = df[cols_to_keep].copy()
    
    print(f"Fleet DNA Data processed. Shape: {df_processed.shape}")
    print(f"Synthetic Maintenance Rate: {df_processed['needs_maintenance'].mean():.2%}")
    
    return df_processed

if __name__ == "__main__":
    # Test run
    import sys
    import os
    
    # Assuming script is run from src/ or root
    # Try to find the file
    possible_paths = [
        "../data/67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv",
        "data/67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv"
    ]
    
    file_path = None
    for p in possible_paths:
        if os.path.exists(p):
            file_path = p
            break
            
    if file_path:
        df = load_and_preprocess_data(file_path)
        print(df.head())
        print(df.columns)
    else:
        print("CSV file not found for testing.")
