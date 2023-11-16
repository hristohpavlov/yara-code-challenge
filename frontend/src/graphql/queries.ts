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