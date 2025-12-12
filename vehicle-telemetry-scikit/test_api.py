import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing /health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
        print(f"FAIL: {e}")

def test_predict_maintenance():
    print("\nTesting /predict-maintenance...")
    # Sample data based on what the model expects
    payload = {
        "mileage": 50000,
        "vehicle_age": 5,
        "fuel_efficiency": 25.0,
        "battery_health": 80.0,
        "engine_health": 85.0,
        "avg_speed": 45.0,
        "avg_accel": 2.0,
        "odometer_reading": 50000
    }
    
    try:
        response = requests.post(f"{BASE_URL}/predict-maintenance", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
        print(f"FAIL: {e}")

def test_optimize_routes():
    print("\nTesting /optimize-routes...")
    # Sample locations
    payload = {
        "locations": [
            {"lat": 34.0522, "long": -118.2437}, # LA
            {"lat": 34.0522, "long": -118.2537},
            {"lat": 34.0622, "long": -118.2437},
            {"lat": 34.0622, "long": -118.2537},
            {"lat": 34.0722, "long": -118.2437},
            {"lat": 34.0722, "long": -118.2537}
        ],
        "n_vehicles": 2
    }
    
    try:
        response = requests.post(f"{BASE_URL}/optimize-routes", json=payload)
        print(f"Status: {response.status_code}")
        # Print only keys to avoid massive output if routes are long
        data = response.json()
        print(f"Response Keys: {data.keys()}")
        if "routes" in data:
            print(f"Routes found: {len(data['routes'])}")
        
        if response.status_code == 200:
            print("PASS")
        else:
            print("FAIL")
    except Exception as e:
        print(f"FAIL: {e}")

if __name__ == "__main__":
    # Wait for server to start
    print("Waiting for server to be ready...")
    for i in range(10):
        try:
            requests.get(f"{BASE_URL}/health")
            print("Server is ready.")
            break
        except:
            time.sleep(1)
            print(".", end="", flush=True)
    else:
        print("\nServer not reachable.")
        sys.exit(1)
        
    test_health()
    test_predict_maintenance()
    test_optimize_routes()
