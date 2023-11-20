import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '../../graphql/mutations';
import { GET_PRODUCTS } from '../../graphql/queries';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
function ProductEntry(){
  const [name, setName] = useState('');
  const [size, setSize] = useState(0.0);
  const [hazardous, setHazardous] = useState(false);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }], // Refetch the product list query after adding a new product
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: { name, size, hazardous },
      });
      setName('');
      setSize(0.0);
      setHazardous(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Container>
      <h2>Product Entry</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formSize">
              <Form.Label>Size:</Form.Label>
              <Form.Control
                type="number"
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value))}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formHazardous" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Hazardous"
            checked={hazardous}
            onChange={() => setHazardous(!hazardous)}
          />
        </Form.Group>
        <Button type="submit">Add Product</Button>
      </Form>
    </Container>
  );
};

export default ProductEntry;