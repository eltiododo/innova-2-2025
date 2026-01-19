import { gql } from '@apollo/client';

export const CREATE_MAINTENANCE_TICKET = gql`
  mutation CreateMaintenanceTicket($input: MaintenanceTicketInput!) {
    createMaintenanceTicket(input: $input) {
      id
      vehicleId
      description
      status
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $input: VehicleInput!) {
    updateVehicle(id: $id, input: $input) {
      id
      patente
      status
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;
