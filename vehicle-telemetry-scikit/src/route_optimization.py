import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates the Haversine distance between two points on the earth.
    """
    R = 6371  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def solve_tsp_greedy(points):
    """
    Solves TSP using a greedy nearest-neighbor approach.
    Points is a list of (lat, long) tuples.
    Returns ordered list of points and total distance.
    """
    if not points:
        return [], 0
    
    # Start at the first point (arbitrary depot or current location)
    current_pos = points[0]
    path = [current_pos]
    unvisited = set(points[1:])
    total_dist = 0
    
    while unvisited:
        nearest_point = None
        min_dist = float('inf')
        
        for point in unvisited:
            dist = haversine_distance(current_pos[0], current_pos[1], point[0], point[1])
            if dist < min_dist:
                min_dist = dist
                nearest_point = point
        
        current_pos = nearest_point
        path.append(current_pos)
        unvisited.remove(current_pos)
        total_dist += min_dist
        
    # Return to start? The PDF implies "optimizar rutas", usually round trip or just efficient delivery.
    # Let's assume open path for now or return to start if needed. Let's do open path for simplicity unless "Depot" is specified.
    # Actually, usually fleets return to depot. Let's add return to start distance.
    
    return_dist = haversine_distance(current_pos[0], current_pos[1], path[0][0], path[0][1])
    total_dist += return_dist
    path.append(path[0]) # Close the loop
    
    return path, total_dist

from datetime import datetime, timedelta

def optimize_single_route(start_lat, start_lon, end_lat, end_lon, avg_speed_kmh, arrival_time_str, vehicle_id="vehicle_1"):
    """
    Calculates trip details for a single vehicle.
    
    Args:
        start_lat, start_lon: Coordinates of start point.
        end_lat, end_lon: Coordinates of end point.
        avg_speed_kmh: Average speed in km/h.
        arrival_time_str: Target arrival time (ISO format string).
        vehicle_id: ID of the vehicle.
        
    Returns:
        dict: Route details including path, distance, duration, and departure time.
    """
    print(f"\n--- Optimizing Route for {vehicle_id} ---")
    print(f"Start: ({start_lat}, {start_lon})")
    print(f"End: ({end_lat}, {end_lon})")
    print(f"Speed: {avg_speed_kmh} km/h")
    print(f"Target Arrival: {arrival_time_str}")

    # 1. Calculate Distance (Haversine)
    air_dist_km = haversine_distance(start_lat, start_lon, end_lat, end_lon)
    
    # Apply Tortuosity Factor (approx 1.4 for urban/intercity roads)
    # This makes the distance estimation more realistic for fleet management
    # as vehicles cannot travel in straight lines.
    TORTUOSITY_FACTOR = 1.4
    road_dist_km = air_dist_km * TORTUOSITY_FACTOR
    
    # 2. Calculate Duration
    if avg_speed_kmh <= 0:
        raise ValueError("Average speed must be greater than 0")
        
    duration_hours = road_dist_km / avg_speed_kmh
    
    # 3. Calculate Timings
    try:
        arrival_dt = datetime.fromisoformat(arrival_time_str.replace('Z', '+00:00'))
        departure_dt = arrival_dt - timedelta(hours=duration_hours)
    except ValueError as e:
        print(f"Error parsing date: {e}")
        # Fallback or re-raise
        raise ValueError(f"Invalid date format: {arrival_time_str}")

    print(f"Air Distance: {air_dist_km:.2f} km")
    print(f"Est. Road Distance: {road_dist_km:.2f} km")
    print(f"Duration: {duration_hours:.2f} hours")
    print(f"Departure: {departure_dt}")
    
    # 4. Generate Path (Straight line for now, but could be interpolated)
    # We return a list of points. 
    path = [(start_lat, start_lon), (end_lat, end_lon)]
    
    # Plotting (Optional, for debugging/visualization)
    plt.figure(figsize=(10, 6))
    lats = [p[0] for p in path]
    longs = [p[1] for p in path]
    plt.plot(longs, lats, marker='o', linestyle='-', color='blue', label='Route')
    plt.scatter([start_lon], [start_lat], color='green', label='Start', zorder=5)
    plt.scatter([end_lon], [end_lat], color='red', label='End', zorder=5)
    
    plt.title(f'Optimized Route for {vehicle_id} (Est. Road Dist: {road_dist_km:.2f}km)')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.legend()
    plt.grid(True)
    plt.savefig('route_optimization_map.png')
    
    return {
        "vehicle_id": vehicle_id,
        "route": path,
        "total_distance_km": road_dist_km,
        "estimated_duration_hours": duration_hours,
        "departure_time": departure_dt.isoformat(),
        "arrival_time": arrival_dt.isoformat()
    }

if __name__ == "__main__":
    # Test run
    import sys
    import os
    from data_loader import load_and_preprocess_data
    
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
        optimize_routes(df)
    else:
        print("CSV file not found for testing.")
