import pandas as pd
import numpy as np

def analyze_csv(filepath, name):
    print(f"\n--- Analyzing {name} ---")
    try:
        # Read without header
        df = pd.read_csv(filepath, header=None)
        print(f"Shape: {df.shape}")
        
        # Print stats for first 20 columns
        print("Statistics for first 20 columns:")
        for i in range(min(20, df.shape[1])):
            col = df.iloc[:, i]
            # Check if numeric
            if pd.api.types.is_numeric_dtype(col):
                print(f"Column {i}: Min={col.min()}, Max={col.max()}, Mean={col.mean():.2f}, Median={col.median()}")
            else:
                print(f"Column {i}: Type={col.dtype}, Example={col.iloc[0]}")
                
    except Exception as e:
        print(f"Error analyzing {name}: {e}")

if __name__ == "__main__":
    analyze_csv("data_for_fleet_dna_composite_data.csv", "Composite Data")
    analyze_csv("data_for_fleet_dna_delivery_vans.csv", "Delivery Vans")
