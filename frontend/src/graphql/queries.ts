import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      size
      hazardous
      }
  }
`;

export const GET_WAREHOUSES = gql`
  query {
    warehouses {
      id
      name
      hazardous
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

export const GET_IMPORT_MOVEMENTS = gql`
query GetImportMovements($warehouseId: ID!) {
  movements(type: "import", warehouseId: $warehouseId) {
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
    }
  }
}
`;