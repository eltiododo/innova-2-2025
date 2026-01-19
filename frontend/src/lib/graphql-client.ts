import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
        // Add authorization headers here when implementing auth
        // 'Authorization': `Bearer ${token}`,
    },
});

// Helper to set auth token dynamically
export function setAuthToken(token: string) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
}

// Helper to clear auth token
export function clearAuthToken() {
    graphqlClient.setHeader('Authorization', '');
}
