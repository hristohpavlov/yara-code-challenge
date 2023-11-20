import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ProductEntryComponent from '../products/ProductEntryComponent';
import WarehouseStockMovementComponent from '../warehouse/WarehouseStockMovementComponent';
import { Navbar, Nav } from 'react-bootstrap';

const AppLayout: React.FC = () => {
  return (
    <Router>
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/product-entry">
            Product Entry
          </Nav.Link>
          <Nav.Link as={Link} to="/warehouse-movement">
            Warehouse Stock Movement
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <Routes>
      <Route path="/product-entry" element={<ProductEntryComponent />} />
      <Route path="/warehouse-movement" element={<WarehouseStockMovementComponent />} />
    </Routes>
  </Router>
  );
};

export default AppLayout;