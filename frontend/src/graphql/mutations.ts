import { gql } from '@apollo/client';

export const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $size: Float!, $hazardous: Boolean!) {
    addProduct(name: $name, size: $size, hazardous: $hazardous) {
      id
      name
      size
      hazardous
    }
  }
`;

export const ADD_MOVEMENT = gql`
  mutation AddMovement(
    $date: String!
    $type: String!
    $productId: ID!
    $warehouseId: ID!
    $amount: Float!
  ) {
    addMovement(
      date: $date
      type: $type
      productId: $productId
      warehouseId: $warehouseId
      amount: $amount
    ) {
      id
      date
      type
      amount
    }
  }
`;