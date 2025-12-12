import pandas as pd
import json
import random

def parse_json_col(x):
    if isinstance(x, str):
        try:
            return json.loads(x.replace("'", '"'))
        except json.JSONDecodeError:
            return {}
    return {}

def generate_sql(csv_path, output_path):
    df = pd.read_csv(csv_path)
    
    # Parse JSON columns
    df['location'] = df['location'].apply(parse_json_col)
    df['sensor_data'] = df['sensor_data'].apply(parse_json_col)
    
    with open(output_path, 'w') as f:
        # Create Users
        f.write("-- Users\n")
        user_ids = df['contributor_id'].unique()
        for i, user_id in enumerate(user_ids):
            # Assuming user_id format 'user_XXXX'
            # We'll create simple users
            f.write(f"INSERT INTO users (id, username, password, role) VALUES ({i+1}, '{user_id}', 'password', 'DRIVER');\n")
        
        user_map = {uid: i+1 for i, uid in enumerate(user_ids)}
        
        # Create Vehicles
        f.write("\n-- Vehicles\n")
        for index, row in df.iterrows():
            vehicle_id = index + 1
            patente = row['vehicle_id'] # Using vehicle_id as patente for now
            make = row['make']
            model = row['model']
            year = row['year']
            mileage = row['mileage'] # Using mileage as kmRecorrido
            fuel_eff = row['fuel_efficiency'] if pd.notna(row['fuel_efficiency']) else 25.0
            batt_health = row['battery_health'] if pd.notna(row['battery_health']) else 100.0
            eng_health = row['engine_health'] if pd.notna(row['engine_health']) else 100.0
            odo = row['odometer_reading'] if pd.notna(row['odometer_reading']) else mileage
            driver_id = user_map.get(row['contributor_id'])
            
            f.write(f"INSERT INTO vehicle (id, patente, marca, modelo, km_recorrido, year, fuel_efficiency, battery_health, engine_health, odometer_reading, driver_id) VALUES ({vehicle_id}, '{patente}', '{make}', '{model}', {int(mileage)}, {year}, {fuel_eff}, {batt_health}, {eng_health}, {odo}, {driver_id});\n")
            
            # Create TravelLogs (Dummy data based on CSV row)
            # We'll create one log per vehicle for demonstration
            lat = row['location'].get('lat', 0.0)
            lng = row['location'].get('long', 0.0)
            avg_speed = row['sensor_data'].get('speed', 0.0)
            avg_accel = row['sensor_data'].get('accel', 0.0)
            
            # Random state
            state = random.choice(['ARRIVED', 'CANCELED', 'IN_PROGRESS'])
            
            f.write(f"INSERT INTO travel_log (vehicle_id, start_position, end_position, avg_speed, avg_acceleration, state, created_at, arrival_time) VALUES ({vehicle_id}, POINT({lat}, {lng}), POINT({lat+0.1}, {lng+0.1}), {avg_speed}, {avg_accel}, '{state}', NOW(), NOW());\n")

if __name__ == "__main__":
    generate_sql('/mnt/acer/Universidad/Ingeniería Civil Informática/Octavo Semestre/Innovación y Emprendimiento/innova-2-2025/vehicle-telemetry-scikit/data/67a6fef440f8a5868a2e023e_DLP Labs_Sample.csv', 'src/main/resources/data.sql')
