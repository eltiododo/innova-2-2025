import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphql-client';
import type { Vehicle, VehicleInput } from '@/types';

// Queries
const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      patente
      marca
      modelo
      kmRecorrido
      year
      fuelEfficiency
      batteryHealth
      engineHealth
      odometerReading
      driver {
        id
        username
        email
        phone
        role
      }
    }
  }
`;

const GET_VEHICLE_BY_ID = gql`
  query GetVehicleById($id: ID!) {
    vehicleById(id: $id) {
      id
      patente
      marca
      modelo
      kmRecorrido
      year
      fuelEfficiency
      batteryHealth
      engineHealth
      odometerReading
      driver {
        id
        username
        email
        phone
        role
      }
    }
  }
`;

// Mutations
const ADD_VEHICLE = gql`
  mutation AddVehicle($vehicle: VehicleInput!) {
    addVehicle(vehicle: $vehicle) {
      id
      patente
      marca
      modelo
      kmRecorrido
      year
      fuelEfficiency
      batteryHealth
      engineHealth
      odometerReading
      driver {
        id
        username
        email
        phone
        role
      }
    }
  }
`;

// Service functions
export async function getVehicles(): Promise<Vehicle[]> {
    const data = await graphqlClient.request<{ vehicles: Vehicle[] }>(GET_VEHICLES);
    return data.vehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
    const data = await graphqlClient.request<{ vehicleById: Vehicle | null }>(
        GET_VEHICLE_BY_ID,
        { id }
    );
    return data.vehicleById;
}

export async function addVehicle(vehicle: VehicleInput): Promise<Vehicle> {
    const data = await graphqlClient.request<{ addVehicle: Vehicle }>(
        ADD_VEHICLE,
        { vehicle }
    );
    return data.addVehicle;
}
