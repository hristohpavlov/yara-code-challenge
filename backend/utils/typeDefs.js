const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    size: Float!
    hazardous: Boolean
  }

  type Warehouse {
    id: ID!
    name: String!
    size: Float!
    products: [Product!]!
    hazardous: Boolean
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
    movements(type: String, warehouseId: ID!): [Movement]
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

module.exports = typeDefs;