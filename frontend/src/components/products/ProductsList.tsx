import React from 'react';
import { GET_PRODUCTS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { Product } from '../../graphql/types';
import { Table, Container } from 'react-bootstrap';
function ProductsList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const products = data.products;
  return (
    <Container>
    <h2>Products List</h2>
    <Table striped bordered responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Size</th>
          <th>Hazardous</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product: Product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.size}</td>
            <td>{product.hazardous ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
  );
};

export default ProductsList;