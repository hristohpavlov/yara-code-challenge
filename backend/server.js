const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    size: Float!
    hazardous: Boolean!
  }

  type Warehouse {
    id: ID!
    name: String!
    size: Float!
  }

  type Movement {
    id: ID!
    date: String!
    type: String!
    product: Product!
    warehouse: Warehouse!
    amount: Float!
  }

  type Query {
    products: [Product]
    warehouses: [Warehouse]
    movements(warehouseId: ID!): [Movement]
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      const { rows } = await pool.query('SELECT * FROM products');
      return rows;
    },
    warehouses: async () => {
      const { rows } = await pool.query('SELECT * FROM warehouses');
      return rows;
    },
    movements: async (_, { warehouseId }) => {
      const { rows } = await pool.query(
        'SELECT * FROM movements WHERE warehouse_id = $1',
        [warehouseId]
      );
      return rows;
    },
  },
};

const app = express();

let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});