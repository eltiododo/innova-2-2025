import os
import pandas as pd
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .data_loader import load_and_preprocess_data
from .predictive_maintenance import train_maintenance_model
from .route_optimization import optimize_single_route, solve_tsp_greedy

app = FastAPI(
    title="Fleet Management ML API",
    description="API for Vehicle Predictive Maintenance and Route Optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store models and data
model = None
df_combined = None

# Load model on startup
MODEL_PATH = 'maintenance_model.pkl'
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print(f"Warning: Model file {MODEL_PATH} not found. Run main.py to generate it.")

class VehicleData(BaseModel):
    mileage: float
    vehicle_age: int
    fuel_efficiency: float
    battery_health: float
    engine_health: float
    avg_speed: float
    avg_accel: float
    odometer_reading: float

class PredictionResponse(BaseModel):
    needs_maintenance: bool
    maintenance_probability: Optional[float] = None
    input_data: VehicleData

class Location(BaseModel):
    lat: float
    long: float

class RouteRequest(BaseModel):
    vehicle_id: str
    start_location: Location
    end_location: Location
    avg_speed: float
    arrival_time: str # ISO format

class RouteResponse(BaseModel):
    vehicle_id: str
    route: List[tuple]
    total_distance_km: float
    estimated_duration_hours: float
    departure_time: str
    arrival_time: str

class OptimizeRoutesRequest(BaseModel):
    locations: List[Location]
    n_vehicles: int

class OptimizeRoutesResponse(BaseModel):
    routes: Dict[str, List[tuple]]

@app.post("/predict", response_model=PredictionResponse)
def predict_maintenance(data: VehicleData):
    global model
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert input to DataFrame
        # The model expects specific feature names
        input_dict = data.dict()
        df = pd.DataFrame([input_dict])
        
        # Ensure columns are in the same order as training (if necessary, but sklearn usually handles it if names match)
        # features = ['mileage', 'vehicle_age', 'fuel_efficiency', 'battery_health', 'engine_health', 'avg_speed', 'avg_accel', 'odometer_reading']
        # df = df[features] 
        
        prediction = model.predict(df)
        result = int(prediction[0])
        
        # Optional: Get probability if model supports it
        prob = None
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(df)
            prob = float(probs[0][1]) # Probability of class 1 (needs maintenance)
            
        return PredictionResponse(
            needs_maintenance=bool(result),
            maintenance_probability=prob,
            input_data=data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize-routes", response_model=OptimizeRoutesResponse)
def get_optimized_routes(request: OptimizeRoutesRequest):
    try:
        if request.n_vehicles <= 0:
            raise HTTPException(status_code=400, detail="n_vehicles must be greater than 0")
        if not request.locations:
            return OptimizeRoutesResponse(routes={})

        points = [(loc.lat, loc.long) for loc in request.locations]
        locations_per_vehicle = max(1, int(np.ceil(len(points) / request.n_vehicles)))

        routes: Dict[str, List[tuple]] = {}
        for i in range(request.n_vehicles):
            start_idx = i * locations_per_vehicle
            end_idx = min(start_idx + locations_per_vehicle, len(points))
            chunk = points[start_idx:end_idx]
            if not chunk:
                continue
            path, _ = solve_tsp_greedy(chunk)
            routes[str(i)] = path

        return OptimizeRoutesResponse(routes=routes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize-route", response_model=RouteResponse)
def get_optimized_route(request: RouteRequest):
    try:
        result = optimize_single_route(
            request.start_location.lat, request.start_location.long,
            request.end_location.lat, request.end_location.long,
            request.avg_speed,
            request.arrival_time,
            request.vehicle_id
        )
        return RouteResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
