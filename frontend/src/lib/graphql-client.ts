import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql'
);
