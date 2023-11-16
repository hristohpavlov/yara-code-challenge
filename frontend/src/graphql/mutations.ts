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