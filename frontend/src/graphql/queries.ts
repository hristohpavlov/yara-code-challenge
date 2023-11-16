import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products {
        name
        size
        hazardous
        id
      }
  }
`;

export const GET_WAREHOUSES = gql`
  query {
    warehouses {
      id
      name
    }
  }
`;

export const GET_WAREHOUSE_WITH_PRODUCTS = gql`
  query {
    warehouses {
      hazardous
      id
      name
      products {
        size
        name
        id
        hazardous
      }
      size
    }
  }
`;

export const GET_MOVEMENTS = gql`
  query GetMovements($warehouseId: ID!) {
    movements(warehouseId: $warehouseId) {
      id
      date
      type
      amount
      product {
        id
        name
        size
        hazardous
      }
      warehouse {
        id
        name
        size
      }
    }
  }
`;