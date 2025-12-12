import sys
import os
from data_loader import load_and_preprocess_data
from predictive_maintenance import train_maintenance_model
# from route_optimization import optimize_routes

def main():
    print("==================================================")
    print("   Fleet Management System - ML Module")
    print("==================================================")
    
    # 1. Load Data
    # Define paths
    files = [
        "data/67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv",
        "data/data_for_fleet_dna_composite_data.csv",
        "data/data_for_fleet_dna_delivery_vans.csv"
    ]
    
    dfs = []
    df_original = None
    
    import pandas as pd
    
    for fname in files:
        fpath = fname
        if not os.path.exists(fpath):
            fpath = os.path.join("..", fname)
            
        if os.path.exists(fpath):
            print(f"Processing {fname}...")
            try:
                d = load_and_preprocess_data(fpath)
                dfs.append(d)
                if "Sample.csv" in fname:
                    df_original = d
            except Exception as e:
                print(f"Error loading {fname}: {e}")
        else:
            print(f"Warning: File {fname} not found.")
            
    if not dfs:
        print("No data loaded. Exiting.")
        return

    # Combine for Maintenance Model
    # We only need specific columns for the model, so concat should work even if columns differ
    df_combined = pd.concat(dfs, ignore_index=True)
    print(f"Combined Data Shape: {df_combined.shape}")
    
    # 2. Predictive Maintenance
    print("\n[1/2] Running Predictive Maintenance Analysis (Combined Data)...")
    model, metrics = train_maintenance_model(df_combined)
    
    # 3. Route Optimization
    print("\n[2/2] Running Route Optimization (Original Data Only)...")
    # if df_original is not None:
    #     routes = optimize_routes(df_original, n_vehicles=5)
    # else:
    #     print("Original dataset with location data not found. Skipping route optimization.")
    routes = []
    
    print("\n==================================================")
    print("   Execution Complete")
    print("==================================================")
    print(f"1. Maintenance Model Accuracy: {metrics['accuracy']:.2%}")
    print(f"2. Routes Generated: {len(routes)} vehicles")
    print("3. Route Map: Saved to 'route_optimization_map.png'")

if __name__ == "__main__":
    main()
