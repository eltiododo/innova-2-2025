import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphql-client';
import type { MaintenanceTicket, MaintenanceTicketInput, ScheduledMaintenanceInput } from '@/types';

// Queries
const GET_MAINTENANCE_TICKETS = gql`
  query GetMaintenanceTickets {
    maintenanceTickets {
      id
      vehicleID
      workshopId
      fechaMantencion
      status
      millaje
      notasExtra
      createdAt
    }
  }
`;

const GET_MAINTENANCE_TICKET_BY_ID = gql`
  query GetMaintenanceTicketById($id: ID!) {
    maintenanceTicketById(id: $id) {
      id
      vehicleID
      workshopId
      fechaMantencion
      status
      millaje
      notasExtra
      createdAt
    }
  }
`;

// Mutations
const ADD_MAINTENANCE_TICKET = gql`
  mutation AddMaintenanceTicket($maintenanceTicket: MaintenanceTicketInput!) {
    addMaintenanceTicket(maintenanceTicket: $maintenanceTicket) {
      id
      vehicleID
      workshopId
      fechaMantencion
      status
      millaje
      notasExtra
      createdAt
    }
  }
`;

const SCHEDULE_MAINTENANCE = gql`
  mutation ScheduleMaintenance($scheduledMaintenance: ScheduledMaintenanceInput!) {
    scheduleMaintenance(scheduledMaintenance: $scheduledMaintenance) {
      id
      vehicleID
      workshopId
      fechaMantencion
      status
      createdAt
    }
  }
`;

// Service functions
export async function getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    const data = await graphqlClient.request<{ maintenanceTickets: MaintenanceTicket[] }>(
        GET_MAINTENANCE_TICKETS
    );
    return data.maintenanceTickets;
}

export async function getMaintenanceTicketById(id: string): Promise<MaintenanceTicket | null> {
    const data = await graphqlClient.request<{ maintenanceTicketById: MaintenanceTicket | null }>(
        GET_MAINTENANCE_TICKET_BY_ID,
        { id }
    );
    return data.maintenanceTicketById;
}

export async function addMaintenanceTicket(
    maintenanceTicket: MaintenanceTicketInput
): Promise<MaintenanceTicket> {
    const data = await graphqlClient.request<{ addMaintenanceTicket: MaintenanceTicket }>(
        ADD_MAINTENANCE_TICKET,
        { maintenanceTicket }
    );
    return data.addMaintenanceTicket;
}

export async function scheduleMaintenance(
    scheduledMaintenance: ScheduledMaintenanceInput
): Promise<MaintenanceTicket> {
    const data = await graphqlClient.request<{ scheduleMaintenance: MaintenanceTicket }>(
        SCHEDULE_MAINTENANCE,
        { scheduledMaintenance }
    );
    return data.scheduleMaintenance;
}
