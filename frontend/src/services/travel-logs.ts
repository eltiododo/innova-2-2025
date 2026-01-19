import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphql-client';
import type { TravelLog, TravelLogInput } from '@/types';

// Queries
const GET_TRAVEL_LOGS = gql`
  query GetTravelLogs {
    travelLogs {
      id
      vehicle {
        id
        patente
        marca
        modelo
      }
      startPosition {
        x
        y
      }
      endPosition {
        x
        y
      }
      avgSpeed
      avgAcceleration
      state
      arrivalTime
      createdAt
    }
  }
`;

const GET_TRAVEL_LOG_BY_ID = gql`
  query GetTravelLogById($id: ID!) {
    travelLogById(id: $id) {
      id
      vehicle {
        id
        patente
        marca
        modelo
      }
      startPosition {
        x
        y
      }
      endPosition {
        x
        y
      }
      avgSpeed
      avgAcceleration
      state
      arrivalTime
      createdAt
    }
  }
`;

// Mutations
const ADD_TRAVEL_LOG = gql`
  mutation AddTravelLog($travelLog: TravelLogInput!) {
    addTravelLog(travelLog: $travelLog) {
      id
      vehicle {
        id
        patente
      }
      startPosition {
        x
        y
      }
      endPosition {
        x
        y
      }
      avgSpeed
      avgAcceleration
      state
      createdAt
    }
  }
`;

// Service functions
export async function getTravelLogs(): Promise<TravelLog[]> {
    const data = await graphqlClient.request<{ travelLogs: TravelLog[] }>(GET_TRAVEL_LOGS);
    return data.travelLogs;
}

export async function getTravelLogById(id: string): Promise<TravelLog | null> {
    const data = await graphqlClient.request<{ travelLogById: TravelLog | null }>(
        GET_TRAVEL_LOG_BY_ID,
        { id }
    );
    return data.travelLogById;
}

export async function addTravelLog(travelLog: TravelLogInput): Promise<TravelLog> {
    const data = await graphqlClient.request<{ addTravelLog: TravelLog }>(
        ADD_TRAVEL_LOG,
        { travelLog }
    );
    return data.addTravelLog;
}
