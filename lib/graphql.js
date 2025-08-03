// lib/graphql.js

import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://bpheadlessb418.wpenginepowered.com/graphql';

const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
