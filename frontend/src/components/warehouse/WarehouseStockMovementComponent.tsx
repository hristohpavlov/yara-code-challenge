import { useQuery } from "@apollo/client";
import { GET_WAREHOUSES } from "../../graphql/queries";
import WarehouseStockMovement from "./WarehouseStockMovement";
import { useState } from "react";
import WarehouseStockList from "./WarehouseStockList";
import { Warehouse } from "../../graphql/types";
import { Container, Row, Col, Form } from 'react-bootstrap';

function WarehouseStockMovementComponent(){
    const { loading, error, data } = useQuery(GET_WAREHOUSES);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('1');
    const warehouses = data?.warehouses;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  return (
    <Container>
    <Row>
      <Col xs={12} md={6}>
        <Form.Group controlId="selectware">
          <Form.Label>Select Warehouse</Form.Label>
          <Form.Control
            as="select"
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
          >
            {warehouses.map((warehouse: Warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>

    <Row>
      <Col xs={12} md={6}>
        <WarehouseStockMovement selectedWarehouseId={selectedWarehouseId} />
      </Col>
      <Col xs={12} md={6}>
        <WarehouseStockList selectedWarehouseId={selectedWarehouseId} />
      </Col>
    </Row>
  </Container>
  );
};

export default WarehouseStockMovementComponent;