const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const pool = require('./scripts/pgcredentials.js');

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
    product: Product
    warehouse: Warehouse
    amount: Float!
  }

  type Query {
    products: [Product]
    warehouses: [Warehouse]
    movements(warehouseId: ID!): [Movement]
  }

  type Mutation {
    addProduct(name: String!, size: Float!, hazardous: Boolean!): Product
    addMovement(
      date: String!
      type: String!
      productId: ID!
      warehouseId: ID!
      amount: Float!
    ): Movement
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
  Mutation: {
    addProduct: async (_, { name, size, hazardous }) => {
      const { rows } = await pool.query(
        'INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3) RETURNING *',
        [name, size, hazardous]
      );
      return rows[0];
    },
    addMovement: async (_, { date, type, productId, warehouseId, amount }) => {
      const { rows } = await pool.query(
        'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [date, type, productId, warehouseId, amount]
      );
      return rows[0];
    },
  },
  Movement: {
    product: async (parent, args, context, info) => {
      try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [parent.product_id]);
        return rows[0];
      } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Unable to fetch product');
      }
    },
    warehouse: async (parent, args, context, info) => {
      try {
        const { rows } = await pool.query('SELECT * FROM warehouses WHERE id = $1', [parent.warehouse_id]);
        return rows[0];
      } catch (error) {
        console.error('Error fetching warehouse:', error);
        throw new Error('Unable to fetch warehouse');
      }
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